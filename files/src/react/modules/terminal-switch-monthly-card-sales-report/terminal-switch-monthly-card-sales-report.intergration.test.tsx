import {screen, waitForElementToBeRemoved} from '@testing-library/react';
import user from '@testing-library/user-event';
import React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {server} from 'src/react/services/mocks/mock-server';
import {TerminalSwitchMonthlyCardSalesReportListing} from './components/terminal-switch-monthly-card-sales-report.listing';

jest.setTimeout(100000);

beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'error',
  });
});
afterEach(() => server.resetHandlers());
afterAll(() => {
  server.close();
});

describe('<TerminalSwitchMonthlyCardSalesReportListing />', () => {
  it('Render correctly with enough data', async () => {
    renderWithConfig(<TerminalSwitchMonthlyCardSalesReportListing />);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    await screen.findByTestId('monthly-card-sale-report-generate-button');
    await screen.findByText('No item found.');
  });
  it('Will show modal', async () => {
    renderWithConfig(<TerminalSwitchMonthlyCardSalesReportListing />);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    const generateButton = await screen.findByTestId('monthly-card-sale-report-generate-button');
    user.click(generateButton);
    await screen.findByText('Filter monthly card sales report');
    const startMonth = await screen.findByTestId('select-start-month');
    expect(startMonth).toBeDefined();
    user.click(startMonth);
    const janStartMonthButton = await screen.findByText('Jan');
    user.click(janStartMonthButton);

    const endMonth = await screen.findByTestId('select-end-month');
    expect(endMonth).toBeDefined();
    user.click(endMonth);
    const janEndMonthButton = await screen.findByText('Jan');
    user.click(janEndMonthButton);

    const filterButton = await screen.findByTestId('filter-button');
    expect(filterButton).toBeDefined();
    user.click(filterButton);
    const timeFilter = await screen.findAllByText(/January/);
    expect(timeFilter.length).toEqual(1);
  });
});
