import {dedupeArray} from '@setel/portal-ui';
import * as React from 'react';

export const useQueueState = <Item>(
  initialState: Item[] | (() => Item[]),
  {size = 4, reverse = false, dedupe}: {size?: number; reverse?: boolean; dedupe?: boolean},
) => {
  const [state, setState] = React.useState(initialState);
  const queue = React.useCallback(
    (item: Item, cb?: (items: Item[]) => void) => {
      setState((prevState) => {
        const result = reverse ? [item].concat(prevState) : prevState.concat(item);
        const afterDeduple = dedupe ? dedupeArray(result) : result;
        const finalResult =
          afterDeduple.length > size
            ? reverse
              ? afterDeduple.slice(0, -1)
              : afterDeduple.slice(1)
            : afterDeduple;

        if (cb) {
          cb(finalResult);
        }

        return finalResult;
      });
    },
    [size, reverse],
  );
  const clear = React.useCallback(() => setState([]), []);

  return [state, queue, clear] as const;
};
