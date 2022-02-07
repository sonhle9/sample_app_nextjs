import '@testing-library/jest-dom';
import {cleanup} from '@testing-library/react';
import failOnConsole from 'jest-fail-on-console';
import {server} from 'src/react/services/mocks/mock-server';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());

function noOp() {}
if (typeof window.URL.createObjectURL === 'undefined') {
  Object.defineProperty(window.URL, 'createObjectURL', {
    value: () => 'https://picsum.photos/100/100',
  });
}
if (typeof window.URL.revokeObjectURL === 'undefined') {
  Object.defineProperty(window.URL, 'revokeObjectURL', {value: noOp});
}

failOnConsole({
  shouldFailOnWarn: false,
});
