import {camelToSentenceCase, removeDashes} from './format-text';

it(`camelToSentenceCase`, () => {
  expect(camelToSentenceCase('remainingCount')).toBe('Remaining Count');
  expect(camelToSentenceCase('remainingCountToday')).toBe('Remaining Count Today');
  expect(camelToSentenceCase('RemainingCount')).toBe('Remaining Count');
  expect(camelToSentenceCase('ILoveNY')).toBe('I Love NY');
});

it(`removeDashes`, () => {
  expect(removeDashes(` -test`)).toBe('test');
  expect(removeDashes(`12340-90-123 123`)).toBe('1234090123123');
});
