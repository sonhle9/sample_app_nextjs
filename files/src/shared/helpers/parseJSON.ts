export const parseJSON = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (_) {
    return null;
  }
};

export const deleteEmptyKeys = (json: Record<string, any>) => {
  Object.entries(json).map(([key, value]) => {
    if (value === '') {
      delete json[key];
    } else {
      // eslint-disable-next-line
      value ?? delete json[key];
    }
  });
};
