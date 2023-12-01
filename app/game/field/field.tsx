import React from 'react';
import classNames from 'classnames';
import { useGameState } from '@/app/game/useGameState';
import styles from './field.module.scss';

export const Field: React.FC = () => {
  const field = useGameState((state) => state.field);
  const error = useGameState((state) => state.error);

  return (
    <>
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
    </>
  );
};
