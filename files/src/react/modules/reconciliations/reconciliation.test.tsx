import * as React from 'react';
import {server} from 'src/react/services/mocks/mock-server';
import {screen} from '@testing-library/react';
import {ReconciliationDetails} from './components/reconciliation-details';
import {renderWithConfig} from 'src/react/lib/test-helper';

jest.setTimeout(60000);

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<ReconciliationDetails />', () => {
  it('render the exceptions record listing', async () => {
    renderWithConfig(<ReconciliationDetails id="5fcdfb693de9710010b9405d" />);
    const exceptionListing = await screen.findByText(/Exceptions records listing/i, undefined, {
      timeout: 3000,
    });
    expect(exceptionListing).toBeVisible();
  });

  it('do not render exception listing if type is INITIAL', async () => {
    renderWithConfig(<ReconciliationDetails id="5fcdfb693de9710010b9405e" />);
    await screen.findByText('GENERAL');
    expect(screen.queryAllByText(/Exceptions records listing/i)).toHaveLength(0);
  });

  it('do not render exception listing if missing posBatchUploadReportId', async () => {
    renderWithConfig(<ReconciliationDetails id="5fcdfb693de9710010b9405g" />);
    await screen.findByText('GENERAL');
    expect(screen.queryAllByText(/Exceptions records listing/i)).toHaveLength(0);
  });

  it('render different column name if settlementType = LOYALTY_CARD', async () => {
    renderWithConfig(<ReconciliationDetails id="5fcdfb693de9710010b9405h" />);
    await screen.findByText('GENERAL');
    expect(screen.queryAllByText(/Total net redemption count/i)).toHaveLength(2);
    expect(screen.queryAllByText(/Total net redemption amount/i)).toHaveLength(2);
    expect(screen.queryAllByText('Total net point issuance')).toHaveLength(2);
    expect(screen.queryAllByText(/Total net point issuance amount/i)).toHaveLength(2);
  });
});
