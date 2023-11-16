'use client';
import React, { useEffect, useState } from 'react';
import { create } from 'zustand';
import classNames from 'classnames';

import styles from './Game.module.scss';

const key =
  'dict.1.1.20231113T195812Z.60b6e818334d7876.b85aeb41f551a76db17a5ce2018e01403f4caf9b';
const findWord = async (text: string): Promise<{ def: any[] }> => {
  return fetch(
    `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${key}&lang=ru-ru&text=${text}`,
  ).then(async (response) => {
    return await response.json();
  });
};

type Letter = {
  value: string;
  used?: boolean;
  included?: boolean;
  placed?: boolean;
};

type GameStore = {
  field: Letter[][];
  currentLineNumber: number;
  typeLetter(value: Letter): void;
  checkWord(): void;
  alphabet: Letter[];
  error: string;
  setError(value: string): void;
  congrats: boolean;
  looser: boolean;
};

const secretWord = 'малыш';

const NEXT_LINE_LETTER = 'next_line';
const MAX_LETTERS_IN_WORD = 5;
const MAX_WORDS = 6;
const fillArray = (number: number, getValue: () => any) =>
  new Array(number).fill('').map(() => getValue());
const getEmptyLine = (): Letter[] =>
  fillArray(MAX_LETTERS_IN_WORD, () => ({ value: '' }));
const useGameState = create<GameStore>((set, get) => ({
  field: fillArray(MAX_WORDS, getEmptyLine),
  currentLineNumber: 0,
  typeLetter(value) {
    set(({ field, currentLineNumber }) => {
      const currentLine = field[currentLineNumber];
      if (value.value === 'Backspace') {
        let index = currentLine.findIndex((item) => item.value === '');
        index = index === -1 ? MAX_LETTERS_IN_WORD : index;
        currentLine.splice(index > 0 ? index - 1 : 0, 1, { value: '' });
      } else {
        if (currentLine.map((item) => item.value).includes('')) {
          const index = currentLine.findIndex((item) => item.value === '');
          currentLine.splice(index, 1, value);
        }
      }
      field[currentLineNumber] = currentLine;
      return {
        field: [...field],
        error: '',
      };
    });
  },
  checkWord() {
    const { field, currentLineNumber, setError } = get();
    const currentLine = field[currentLineNumber];
    const text = currentLine.map((item) => item.value).join('');

    findWord(text).then((response) => {
      if (response.def.length > 0) {
        set(({ field, currentLineNumber, alphabet }) => {
          const word = field[currentLineNumber];

          if (word.some((item) => item.value === '')) {
            return {};
          }

          const newWord = word.map((letter, index) => {
            let newLetter: Letter = { ...letter, used: true };
            if (secretWord.includes(letter.value)) {
              newLetter = { ...newLetter, included: true };
            }
            if (secretWord[index] === word[index].value) {
              newLetter = { ...newLetter, placed: true };
            }
            return newLetter;
          });
          field[currentLineNumber] = newWord;

          const newAlphabet = alphabet.map((key) => {
            const foundLetter = newWord.find(
              (letter) => letter.value === key.value,
            );
            return foundLetter ? { ...key, ...foundLetter } : key;
          });

          return {
            field: [...field],
            currentLineNumber: currentLineNumber + 1,
            alphabet: newAlphabet,
            error: '',
            congrats: newWord.every((item) => item.placed),
            looser:
              currentLineNumber === MAX_WORDS - 1 &&
              !newWord.every((item) => item.placed),
          };
        });
      } else {
        setError('Такого слова нет!');
      }
    });
  },
  alphabet: [
    { value: 'й' },
    { value: 'ц' },
    { value: 'у' },
    { value: 'к' },
    { value: 'е' },
    { value: 'н' },
    { value: 'г' },
    { value: 'ш' },
    { value: 'щ' },
    { value: 'з' },
    { value: 'х' },
    { value: 'ъ' },
    { value: NEXT_LINE_LETTER },
    { value: 'ф' },
    { value: 'ы' },
    { value: 'в' },
    { value: 'а' },
    { value: 'п' },
    { value: 'р' },
    { value: 'о' },
    { value: 'л' },
    { value: 'д' },
    { value: 'ж' },
    { value: 'э' },
    { value: NEXT_LINE_LETTER },
    { value: 'я' },
    { value: 'ч' },
    { value: 'с' },
    { value: 'м' },
    { value: 'и' },
    { value: 'т' },
    { value: 'ь' },
    { value: 'б' },
    { value: 'ю' },
    { value: 'ё' },
  ],
  error: '',
  setError(value: string) {
    set({ error: value });
  },
  congrats: false,
  looser: false,
}));

export const Game: React.FC = () => {
  const field = useGameState((state) => state.field);
  const typeLetter = useGameState((state) => state.typeLetter);
  const checkWord = useGameState((state) => state.checkWord);
  const alphabet = useGameState((state) => state.alphabet);
  const error = useGameState((state) => state.error);
  const setError = useGameState((state) => state.setError);
  const congrats = useGameState((state) => state.congrats);
  const looser = useGameState((state) => state.looser);

  const makeHandleKeyClick = (letter: Letter) => () => {
    typeLetter({ value: letter.value });
  };

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      if (event.key === 'Enter') {
        checkWord();
      }
      if (/^[а-яА-Я]/.test(event.key) || event.key === 'Backspace') {
        typeLetter({ value: event.key });
      } else {
        if (event.key.length === 1) {
          if (!error) {
            setError('Неправильная раскладка');
          }
        }
      }
    };
    window.addEventListener('keyup', handler);
    return () => window.removeEventListener('keyup', handler);
  }, [typeLetter, error, setError]);

  return (
    <div className={styles.gameWrapper}>
      <div className={classNames(styles.game, error && styles.game_error)}>
        {field.map((line, index) => (
          <div className={styles.word} key={index}>
            {line.map((letter, index) => (
              <div
                className={classNames(
                  styles.letter,
                  letter.used && styles.letter_used,
                  letter.included && styles.letter_included,
                  letter.placed && styles.letter_placed,
                )}
                key={index}
              >
                <span>{letter.value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className={classNames(styles.error, error && styles.error_shown)}>
        {error}
      </div>
      <div className={styles.keyboard}>
        {alphabet
          .reduce(
            (lines, key) => {
              if (key.value === NEXT_LINE_LETTER) {
                return [...lines, []];
              } else {
                lines[lines.length - 1].push(key);
                return lines;
              }
            },
            [[]] as Letter[][],
          )
          .map((line, index) => (
            <div className={styles.keyboard__line} key={index}>
              {line.map((key) => (
                <div
                  className={classNames(
                    styles.keyboard__key,
                    key.used && styles.keyboard__key_used,
                    key.included && styles.keyboard__key_included,
                    key.placed && styles.keyboard__key_placed,
                  )}
                  key={key.value}
                  onClick={makeHandleKeyClick(key)}
                >
                  {key.value}
                </div>
              ))}
            </div>
          ))}
      </div>
      <div className={styles.buttons}>
        <button className={styles.button} onClick={checkWord}>
          Проверить
        </button>
        <button
          className={styles.button}
          onClick={() => typeLetter({ value: 'Backspace' })}
        >
          &#9003;
        </button>
      </div>

      {congrats && (
        <div className={styles.congrats}>
          Congrats!
          <img src="https://media1.giphy.com/media/Vuw9m5wXviFIQ/giphy.gif" />
        </div>
      )}

      {looser && <div className={styles.looser}>Looooser!</div>}
    </div>
  );
};
