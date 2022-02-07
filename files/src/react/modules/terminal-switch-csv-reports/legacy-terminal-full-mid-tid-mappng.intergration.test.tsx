import {screen, waitForElementToBeRemoved} from '@testing-library/react';
import user from '@testing-library/user-event';
import React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {MOCK_FULL_MID_TID_REPORT} from 'src/react/services/mocks/api-legacy-terminals.service.mock';
import {server} from 'src/react/services/mocks/mock-server';
import {TerminalSwitchFullMidTidMappingReportsListing} from './components/terminal-switch-full-mid-tid-reports-listing';

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

describe('<TerminalSwitchFullMidTidMappingReportsListing />', () => {
  it('Render correctly with enough data', async () => {
    renderWithConfig(<TerminalSwitchFullMidTidMappingReportsListing />);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    expect(screen.getAllByTestId('legacy-terminal-full-mid-tid-report').length).toEqual(
      MOCK_FULL_MID_TID_REPORT.length,
    );
    await screen.findByText('DOWNLOAD CSV');
  });

  it('Click button can checked', async () => {
    renderWithConfig(<TerminalSwitchFullMidTidMappingReportsListing />);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    const checkButton = screen.getAllByTestId('check-item-button')[0];
    user.click(checkButton);
    user.click(checkButton);
  });
});
