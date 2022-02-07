import * as React from 'react';

export function useToggle(defaultValue?: boolean): [boolean, (val?: boolean) => void] {
  const [value, setValue] = React.useState(defaultValue || false);
  const toggleValue = React.useCallback((newValue?: boolean) => {
    if (typeof newValue === 'boolean') {
      return setValue(newValue);
    }
    return setValue((currentValue) => !currentValue);
  }, []);
  return [value, toggleValue];
}
