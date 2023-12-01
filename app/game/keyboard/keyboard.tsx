import React from 'react';
import classNames from 'classnames';
import {
  Letter,
  NEXT_LINE_LETTER,
  useGameState,
} from '@/app/game/useGameState';
import styles from './keyboard.module.scss';

export const Keyboard: React.FC = () => {
  const alphabet = useGameState((state) => state.alphabet);
  const typeLetter = useGameState((state) => state.typeLetter);

  const makeHandleKeyClick = (letter: Letter) => () => {
    typeLetter({ value: letter.value });
  };

  return (
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
  );
};
