import * as React from 'react';
import user from '@testing-library/user-event';
import {screen, within} from '@testing-library/react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {LoyaltyPointTransactions} from './loyalty-point-transactions';
import {TransactionTypes} from '../../loyalty.type';
import {server} from 'src/react/services/mocks/mock-server';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<LoyaltyPointTransactions />', () => {
  it('renders earnings page accordingly', async () => {
    renderWithConfig(<LoyaltyPointTransactions type={TransactionTypes.EARN} />);

    expect(screen.getByTestId('select-status')).toBeDefined();
    expect(screen.getByTestId('search-input')).toBeDefined();

    expect(screen.getByText('Loyalty point earnings'));

    const transactions = await screen.findAllByTestId('loyalty-transaction');

    const transactionColumnNames = screen.getByTestId('transaction-column-names');

    expect(within(transactionColumnNames).getByText('Points')).toBeDefined();
    expect(within(transactionColumnNames).getByText('Status')).toBeDefined();
    expect(within(transactionColumnNames).getByText('Card number')).toBeDefined();
    expect(within(transactionColumnNames).getByText('Transaction ID')).toBeDefined();
    expect(within(transactionColumnNames).getByText('Merchant')).toBeDefined();
    expect(within(transactionColumnNames).getByText('Created on')).toBeDefined();

    expect(transactions.length).toBe(20);
  });

  it('renders redemptions page accordingly', async () => {
    renderWithConfig(<LoyaltyPointTransactions type={TransactionTypes.REDEEM} />);

    expect(screen.getByTestId('select-status')).toBeDefined();
    expect(screen.getByTestId('search-input')).toBeDefined();

    expect(screen.getByText('Loyalty point redemptions'));

    const transactions = await screen.findAllByTestId('loyalty-transaction');

    const transactionColumnNames = screen.getByTestId('transaction-column-names');

    expect(within(transactionColumnNames).getByText('Points')).toBeDefined();
    expect(within(transactionColumnNames).getByText('Status')).toBeDefined();
    expect(within(transactionColumnNames).getByText('Card number')).toBeDefined();
    expect(within(transactionColumnNames).getByText('Transaction ID')).toBeDefined();
    expect(within(transactionColumnNames).getByText('Merchant')).toBeDefined();
    expect(within(transactionColumnNames).getByText('Created on')).toBeDefined();

    expect(transactions.length).toBe(20);
  });

  it('shows error if card number or transaction id is invalid', () => {
    renderWithConfig(<LoyaltyPointTransactions type={TransactionTypes.REDEEM} />);

    const searchInput = screen.getByPlaceholderText('Search by card number or transaction ID');
    const searchButton = screen.getByRole('button', {name: /Search/i});

    expect(searchInput).toBeDefined();
    expect(searchButton).toBeDefined();

    user.type(searchInput, 'aaa');
    user.click(searchButton);

    expect(screen.getByText('Not a valid card number or transaction ID')).toBeDefined();
  });
});
