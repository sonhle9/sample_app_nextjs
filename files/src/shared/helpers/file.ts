export function csvToJSON(csv) {
  const lines = csv.split('\n');

  const result = [];

  const headers = lines[0].split(',');

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentLine = lines[i].split(',');
    for (let j = 0; j < headers.length; j++) {
      obj[sanitizeString(headers[j])] = sanitizeString(currentLine[j]);
    }

    result.push(obj);
  }

  return result;
}

function sanitizeString(str) {
  return str.trim().replace('\r', '').replace('\n', '');
}
