import { create } from 'zustand';
import { findWord } from '@/app/game/utils';

export type Letter = {
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

export const NEXT_LINE_LETTER = 'next_line';
const MAX_LETTERS_IN_WORD = 5;
const MAX_WORDS = 6;
const fillArray = (number: number, getValue: () => any) =>
  new Array(number).fill('').map(() => getValue());
const getEmptyLine = (): Letter[] =>
  fillArray(MAX_LETTERS_IN_WORD, () => ({ value: '' }));

const alphabet = [
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
];

export const useGameState = create<GameStore>((set, get) => ({
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
  alphabet,
  error: '',
  setError(value: string) {
    set({ error: value });
  },
  congrats: false,
  looser: false,
}));
