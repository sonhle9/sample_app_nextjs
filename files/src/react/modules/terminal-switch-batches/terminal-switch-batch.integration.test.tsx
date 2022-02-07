import {screen, waitForElementToBeRemoved} from '@testing-library/react';
import React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {server} from 'src/react/services/mocks/mock-server';
import {TerminalSwitchBatchesListing} from './components/terminal-switch-batch.listing';

jest.setTimeout(100000);

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<TerminalSwitchBatchesListing />', () => {
  it('Render correctly with enough data', async () => {
    renderWithConfig(<TerminalSwitchBatchesListing />);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    expect(screen.getAllByTestId('terminal-switch-batch-row').length).toBe(20);
    await screen.findByText('DOWNLOAD CSV');
  });
});
