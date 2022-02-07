export const convertEnumToObject = (enumData, isValue?: boolean) => {
  return Object.keys(enumData).map((key) => ({id: key, name: isValue ? enumData[key] : key}));
};

export function convertToSensitiveNumber(
  num: number,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2,
) {
  if (!num) {
    return '0.00';
  }
  return (
    '' + new Intl.NumberFormat('en-US', {minimumFractionDigits, maximumFractionDigits}).format(num)
  );
}

export function reverseSensitiveNumber(str) {
  const separator = new Intl.NumberFormat().format(1111).replace(/1/g, '');
  return +str.replace(new RegExp('\\' + separator, 'g'), '');
}
