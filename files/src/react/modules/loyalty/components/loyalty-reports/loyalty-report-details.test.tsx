import * as React from 'react';
import {screen} from '@testing-library/react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {LoyaltyReportDetails} from './loyalty-report-details';
import user from '@testing-library/user-event';
import {server} from 'src/react/services/mocks/mock-server';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<LoyaltyReports />', () => {
  it('renders accordingly', async () => {
    renderWithConfig(<LoyaltyReportDetails report={'point-redemptions'} />);

    user.click(screen.getByTestId('report-type'));

    expect(screen.getByText('LMS016 - Redemption transaction report (All)')).toBeDefined();

    user.click(screen.getByText('LMS016 - Redemption transaction report (All)'));

    const reports = await screen.findAllByTestId('download-report');

    expect(reports.length).toBe(4);
  });
});
