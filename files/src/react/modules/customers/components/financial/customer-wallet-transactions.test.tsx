import {screen, within} from '@testing-library/dom';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {server} from 'src/react/services/mocks/mock-server';
import {CustomerWalletTransactions} from './customer-wallet-transactions';
import user from '@testing-library/user-event';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe(`CustomerFinancialWalletSection`, () => {
  it('render customer payment transaction list', async () => {
    renderWithConfig(
      <CustomerWalletTransactions userId={'07698130-a257-427e-adac-bdffa84e771a'} />,
    );
    const customerWalletTransactionsCard = await screen.findByTestId(
      'customer-financial-wallet-transactions-card',
    );
    user.click(await within(customerWalletTransactionsCard).findByRole('button'));

    expect(await screen.findByTestId('customer-wallet-transactions-card-id')).toBeVisible();
    expect(await screen.findByText(/60266f8147e0a900106bb4fb/)).toBeDefined();

    const customerWalletTransactionsRowBtns = await screen.findAllByTestId(
      /expand-customer-wallet-transaction-details-btn/i,
    );

    user.click(customerWalletTransactionsRowBtns[0]);
    expect(await screen.findByTestId('customer-wallet-transaction-details')).toBeVisible();
    expect(await screen.findByText(/amount/i)).toBeVisible();
    expect(await screen.findByText(/Message/g)).toBeVisible();
  });
});
