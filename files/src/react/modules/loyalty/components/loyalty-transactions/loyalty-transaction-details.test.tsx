import * as React from 'react';
import {screen} from '@testing-library/react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {LoyaltyTransactionDetails} from './loyalty-transaction-details';
import {server} from 'src/react/services/mocks/mock-server';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<LoyaltyTransactionDetails />', () => {
  it('renders page accordingly', async () => {
    renderWithConfig(<LoyaltyTransactionDetails id="5fea98b551c30500178e387d" />);

    expect(screen.getByText('Loyalty transactions')).toBeDefined();

    await screen.findByText('Fuel - PETRONAS PUTRA BESTARI DEV');
    expect(screen.getByText('Fuel - PETRONAS PUTRA BESTARI DEV')).toBeDefined();
    expect(screen.getByText('5fea98b551c30500178e387d')).toBeDefined();
  });
});
