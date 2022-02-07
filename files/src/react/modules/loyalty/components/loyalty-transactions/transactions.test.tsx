import * as React from 'react';
import {screen, waitFor, within} from '@testing-library/react';
import user from '@testing-library/user-event';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {LoyaltyTransactions} from './transactions';
import {server} from 'src/react/services/mocks/mock-server';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<Transactions />', () => {
  it('renders page accordingly', async () => {
    renderWithConfig(<LoyaltyTransactions />);

    expect(screen.getByTestId('select-status')).toBeDefined();
    expect(screen.getByTestId('select-date')).toBeDefined();
    expect(screen.getByTestId('search')).toBeDefined();

    const transactions = await screen.findAllByTestId('loyalty-transaction');

    expect(transactions.length).toBe(20);
  });

  it('shows error if card number or transaction id is invalid', () => {
    renderWithConfig(<LoyaltyTransactions />);

    const searchInput = screen.getByPlaceholderText('Search by card number or transaction ID');
    const searchButton = screen.getByRole('button', {name: /Search/i});

    expect(searchInput).toBeDefined();
    expect(searchButton).toBeDefined();

    user.type(searchInput, 'aaa');
    user.click(searchButton);

    expect(screen.getByText('Not a valid card number or transaction ID')).toBeDefined();
  });

  it('searches for the right transaction id', async () => {
    renderWithConfig(<LoyaltyTransactions />);

    const searchInput = screen.getByPlaceholderText('Search by card number or transaction ID');
    const searchButton = screen.getByRole('button', {name: /Search/i});

    expect(searchInput).toBeDefined();
    expect(searchButton).toBeDefined();

    user.type(searchInput, '5f753e0b3127f000110aa682');
    user.click(searchButton);

    await waitFor(() => {
      const transactions = screen.getAllByTestId('loyalty-transaction');

      expect(transactions.length).toBe(1);

      expect(within(transactions[0]).getByText('5f753e0b3127f000110aa682')).toBeDefined();
      expect(within(transactions[0]).getByText('PETRONAS PUTRA BESTARI DEV')).toBeDefined();
      expect(within(transactions[0]).getByText('7083815-61238-02341')).toBeDefined();
      expect(within(transactions[0]).getByText('Succeeded')).toBeDefined();
    });
  });

  it('searches for the right card number', async () => {
    renderWithConfig(<LoyaltyTransactions />);

    const searchInput = screen.getByPlaceholderText('Search by card number or transaction ID');
    const searchButton = screen.getByRole('button', {name: /Search/i});

    expect(searchInput).toBeDefined();
    expect(searchButton).toBeDefined();

    user.type(searchInput, '70838156123802341');
    user.click(searchButton);

    await waitFor(() => {
      const transactions = screen.getAllByTestId('loyalty-transaction');

      expect(transactions.length).toBe(2);

      expect(within(transactions[0]).getByText('5f753e0b3127f000110aa682')).toBeDefined();
      expect(within(transactions[0]).getByText('PETRONAS PUTRA BESTARI DEV')).toBeDefined();
      expect(within(transactions[0]).getByText('7083815-61238-02341')).toBeDefined();
      expect(within(transactions[0]).getByText('Succeeded')).toBeDefined();

      expect(within(transactions[1]).getByText('5f753e0b3127f000110aa683')).toBeDefined();
      expect(within(transactions[1]).getByText('PETRONAS PUTRA BESTARI DEV 2')).toBeDefined();
      expect(within(transactions[1]).getByText('7083815-61238-02341')).toBeDefined();
      expect(within(transactions[1]).getByText('Failed')).toBeDefined();
    });
  });
});
