import * as React from 'react';
import {noop, useInterval} from '@setel/portal-ui';

export const useCountDown = (from: number, interval: number | null, onZero = noop) => {
  const [number, setNumber] = React.useState(from);
  useInterval(() => setNumber((n) => n - 1), interval);

  React.useEffect(() => {
    if (number === 0) {
      onZero();
    }
  }, [number, onZero]);

  return number;
};
