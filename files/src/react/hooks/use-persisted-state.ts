import * as React from 'react';

export const usePersistedState = <T>(initialState: T, storageKey: string) => {
  const [value, setValue] = React.useState<T>(() => {
    const storedValue = getValueFromStorage(storageKey);
    return storedValue || initialState;
  });
  const latestValueRef = React.useRef(value);
  latestValueRef.current = value;

  React.useEffect(() => {
    const syncStorage = () => {
      const latestValue = window.localStorage.getItem(storageKey);
      if (latestValue !== JSON.stringify(latestValueRef.current)) {
        const result = parseSafely(latestValue);
        if (result !== null) {
          setValue(result);
        }
      }
    };
    window.addEventListener('storage', syncStorage);
    return () => {
      window.removeEventListener('storage', syncStorage);
    };
  }, [storageKey]);

  const set = React.useCallback(
    (newValue: T) => {
      setValue(newValue);
      window.localStorage.setItem(storageKey, JSON.stringify(newValue));
    },
    [storageKey],
  );

  return [value, set] as const;
};

const getValueFromStorage = (storageKey: string) => {
  const value = window.localStorage.getItem(storageKey);
  if (!value) {
    return null;
  }
  return parseSafely(value);
};

const parseSafely = (value: string) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
};
