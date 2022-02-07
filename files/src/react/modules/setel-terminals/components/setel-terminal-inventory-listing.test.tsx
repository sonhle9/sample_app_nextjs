import * as React from 'react';
import {server} from 'src/react/services/mocks/mock-server';
import {renderWithConfig, suppressConsoleLogs} from 'src/react/lib/test-helper';
import {cleanup, screen, waitForElementToBeRemoved} from '@testing-library/react';
import {rest} from 'msw';
import TerminalInventoryListing from './setel-terminal-inventory-listing';
import {environment} from 'src/environments/environment';

jest.setTimeout(100000);

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

describe('<TerminalInventoryListing />', () => {
  it('should render table with data', async () => {
    renderWithConfig(<TerminalInventoryListing />);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    expect(screen.getByTestId('setel-terminal-inventory-listing-table')).toBeVisible();
  });

  it('should not show edit button if status is DEACTIVATED', async () => {
    server.use(
      rest.get(
        `${environment.setelTerminalApiBaseUrl}/api/terminal/admin/inventory`,
        (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json([
              {
                id: 1,
                serialNum: 'serialNum',
                status: 'DEACTIVATED',
                terminalId: 'terminalId',
                createdAt: new Date().toISOString(),
              },
            ]),
          );
        },
      ),
    );

    renderWithConfig(<TerminalInventoryListing />);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    expect(screen.queryByText(/EDIT/)).toBeNull();
  });

  it(
    'should display server error',
    suppressConsoleLogs(async () => {
      server.use(
        rest.get(
          `${environment.setelTerminalApiBaseUrl}/api/terminal/admin/inventory`,
          (_, res, ctx) => {
            return res(ctx.status(400), ctx.json({}));
          },
        ),
      );
      renderWithConfig(<TerminalInventoryListing />);
      await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
      expect(await screen.findByText(/Server error! Please try again/)).toBeVisible();
    }),
  );
});
