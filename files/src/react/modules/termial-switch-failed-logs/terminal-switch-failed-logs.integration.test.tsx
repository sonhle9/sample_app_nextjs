import {screen, waitFor, waitForElementToBeRemoved} from '@testing-library/react';
import user from '@testing-library/user-event';
import React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {server} from 'src/react/services/mocks/mock-server';
import {TerminalSwitchFailedLogDetail} from './components/terminal-switch-failed-logs-detail';
import {TerminalSwitchFailedLogsListing} from './components/terminal-switch-failed-logs-listing';

jest.setTimeout(100000);

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<TerminalSwitchFailedLogsListing />', () => {
  it('render correctly with enough data', async () => {
    renderWithConfig(<TerminalSwitchFailedLogsListing />);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    expect(screen.getAllByTestId('terminal-failed-logs').length).toBe(20);
  });
  it('source filter will work', async () => {
    renderWithConfig(<TerminalSwitchFailedLogsListing />);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    const sourceFilterBox = (await screen.findAllByTestId('source-filter-box'))[1];
    user.click(sourceFilterBox);
    // source = invenco
    user.type(sourceFilterBox, `${'{arrowdown}'.repeat(2)}{enter}`);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    expect((await screen.findAllByText(/000002/, undefined, {timeout: 3000})).length).toEqual(20);
    // source = setel
    user.type(sourceFilterBox, `${'{arrowdown}'.repeat(1)}{enter}`);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    expect((await screen.findAllByText(/000001/, undefined, {timeout: 3000})).length).toEqual(20);
  });
  it('terminal filter will work', async () => {
    renderWithConfig(<TerminalSwitchFailedLogsListing />);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    const terminalSearchBox = (await screen.findAllByPlaceholderText('Search by Terminal ID'))[1];
    // terminalId = terminal1
    user.type(terminalSearchBox, 'terminal1');
    user.click(await screen.findByText(/terminal1/, undefined, {timeout: 3000}));
    expect(document.activeElement).toBe(terminalSearchBox);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    expect((await screen.findAllByText(/000001/, undefined, {timeout: 3000})).length).toEqual(20);
    // terminalId = terminal2
    user.clear(terminalSearchBox);
    await waitFor(() => expect((terminalSearchBox as HTMLInputElement).value).toBe(''));
    user.type(terminalSearchBox, 'terminal2');
    user.click((await screen.findAllByText(/terminal2/))[0]);
    expect(document.activeElement).toBe(terminalSearchBox);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    expect((await screen.findAllByText(/000002/, undefined, {timeout: 3000})).length).toEqual(20);
  });
});

describe('<TerminalSwitchFailedLogs />', () => {
  it('render ok', async () => {
    renderWithConfig(<TerminalSwitchFailedLogDetail failedLogId="611f47d86c4a0c44adf8039d" />);
    await screen.findByText(/JSON/);
    await screen.findByText(/PREVIEW/);
    await screen.findByText(/CODE/);
  });
});
