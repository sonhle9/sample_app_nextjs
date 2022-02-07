import {screen} from '@testing-library/react';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {server} from 'src/react/services/mocks/mock-server';
import {WaitingAreaList} from './waiting-area-list';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('WaitingAreaList', () => {
  it('works', async () => {
    renderWithConfig(<WaitingAreaList />);

    (await screen.findAllByText(/waiting area 1/i)).forEach((item) => {
      expect(item).toBeVisible();
    });
  });
});
