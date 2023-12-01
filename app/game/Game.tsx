'use client';
import React, { useEffect } from 'react';
import { useGameState } from '@/app/game/useGameState';
import { Field } from '@/app/game/field/field';
import { Keyboard } from '@/app/game/keyboard/keyboard';

import styles from './Game.module.scss';

export const Game: React.FC = () => {
  const typeLetter = useGameState((state) => state.typeLetter);
  const checkWord = useGameState((state) => state.checkWord);
  const error = useGameState((state) => state.error);
  const setError = useGameState((state) => state.setError);
  const congrats = useGameState((state) => state.congrats);
  const looser = useGameState((state) => state.looser);

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
      <Field />
      <Keyboard />
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
