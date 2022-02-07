// strips out all keys with null, empty string, or undefined values from object.
// maintains integer eg. 0
export const sanitizeObject = (obj: {[key: string]: any}) => {
  return Object.entries(obj).reduce(
    (a: any, [k, v]) => (v !== '' && v !== null && v !== undefined ? ((a[k] = v), a) : a),
    {},
  );
};
