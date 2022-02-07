import * as React from 'react';
import {noop} from '@setel/portal-ui';

export const useMountSafe = <T extends (...args: unknown[]) => unknown>(func: T) => {
  const mountFlag = React.useRef<boolean>(true);
  React.useEffect(
    () => () => {
      mountFlag.current = false;
    },
    [],
  );
  return mountFlag.current ? func : noop;
};
