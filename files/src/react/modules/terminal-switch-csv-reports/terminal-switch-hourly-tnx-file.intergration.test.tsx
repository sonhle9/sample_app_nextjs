import {screen, waitForElementToBeRemoved} from '@testing-library/react';
import user from '@testing-library/user-event';
import React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {MOCK_TERMINAL_SWITCH_HOURLY_TNX_FILE} from 'src/react/services/mocks/api-terminal-switch.mock';
import {server} from 'src/react/services/mocks/mock-server';
import {TerminalSwitchHourlyTransactionFileDetail} from './components/terminal-switch-hourly-transaction-file-detail';
import {TerminalSwitchHourlyTransactionFileListing} from './components/terminal-switch-hourly-transaction-file-listing';

jest.setTimeout(100000);

let dateNowSpy: jest.SpyInstance;

beforeAll(() => {
  dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => 1638257435);
  server.listen({
    onUnhandledRequest: 'error',
  });
});

afterEach(() => server.resetHandlers());

afterAll(() => {
  server.close();
  dateNowSpy.mockRestore();
});

describe('<TerminalSwitchHourlyTransactionFile />', () => {
  it('Render correctly with enough data', async () => {
    renderWithConfig(<TerminalSwitchHourlyTransactionFileListing />);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    expect(screen.getAllByTestId('terminal-switch-hourly-transaction-file').length).toEqual(
      MOCK_TERMINAL_SWITCH_HOURLY_TNX_FILE.length,
    );
    await screen.findByText('DOWNLOAD CSV');
  });

  it('Button check all can click', async () => {
    renderWithConfig(<TerminalSwitchHourlyTransactionFileListing />);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    const buttonCheckAll = await screen.findByTestId('check-all-button-id');
    user.click(buttonCheckAll);
    expect(screen.getAllByTestId('terminal-switch-hourly-transaction-file').length).toEqual(
      MOCK_TERMINAL_SWITCH_HOURLY_TNX_FILE.length,
    );
    await screen.findByText('DOWNLOAD CSV');
    user.click(buttonCheckAll);
  });
});

describe('<TerminalSwitchHourlyTransactionFileDetail />', () => {
  it('Render correctly with enough data', async () => {
    renderWithConfig(<TerminalSwitchHourlyTransactionFileDetail id={'61b3290d8bc09800122c4b0d'} />);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    expect(screen.getAllByTestId('hour-file-row').length).toEqual(24);
    await screen.findByText('20211203');
  });
  it('Click button can checked', async () => {
    renderWithConfig(<TerminalSwitchHourlyTransactionFileDetail id={'61b3290d8bc09800122c4b0d'} />);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    const checkButton = screen.getAllByTestId('check-item-button')[0];
    user.click(checkButton);
    user.click(checkButton);
  });
});
