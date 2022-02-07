import * as React from 'react';
import {screen} from '@testing-library/react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {LoyaltyMonthly} from './loyalty-monthly';
import {server} from 'src/react/services/mocks/mock-server';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<LoyaltyMonthly />', () => {
  it('renders page accordingly', async () => {
    renderWithConfig(<LoyaltyMonthly />);

    const transactions = await screen.findAllByTestId('monthly-transaction-row');

    expect(transactions.length).toBe(19);
  });
});
