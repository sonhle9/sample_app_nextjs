import * as React from 'react';
import {rest} from 'msw';
import {ParkingSessions} from './sessions';
import {screen, within} from '@testing-library/react';
import {server} from 'src/react/services/mocks/mock-server';
import {renderWithConfig, suppressConsoleLogs} from 'src/react/lib/test-helper';
import {parkingBaseUrl} from '../../mocks/parking.service.mocks';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<ParkingSessions/>', () => {
  it('renders page accordingly', async () => {
    renderWithConfig(<ParkingSessions />);

    const sessions = await screen.findAllByTestId('sessions-row');

    expect(sessions.length).toBe(10);

    const columnNames = await screen.findByTestId('session-column-names');

    expect(within(columnNames).getByText('Plate number')).toBeDefined();
    expect(within(columnNames).getByText('Status')).toBeDefined();
    expect(within(columnNames).getByText('Location Name')).toBeDefined();
    expect(within(columnNames).getByText('Amount (RM)')).toBeDefined();
    expect(within(columnNames).getByText('Created On')).toBeDefined();
  });

  it(
    'handles empty sessions accordingly',
    suppressConsoleLogs(async () => {
      server.use(
        rest.get(`${parkingBaseUrl}/sessions`, (_, res, ctx) => {
          return res.once(ctx.status(404));
        }),
      );

      renderWithConfig(<ParkingSessions />);

      const caption = await screen.findByRole('caption');

      expect(caption).toBeDefined();
      expect(within(caption).getByText('No sessions found'));
    }),
  );
});
