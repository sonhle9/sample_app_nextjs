import React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {server} from 'src/react/services/mocks/mock-server';
import {TerminalSwitchTxNBatchSummaryListing} from './components/terminal-switch-tx-n-batch-summary.listing';

jest.setTimeout(100000);

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<TerminalSwitchTxNBatchSummaryListing />', () => {
  it('Render correctly with enough data', async () => {
    renderWithConfig(<TerminalSwitchTxNBatchSummaryListing />);
    // await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    // expect(screen.getAllByTestId('terminal-switch-batch-row').length).toBe(20);
    // await screen.findByText('DOWNLOAD CSV');
  });
});
