import * as React from 'react';
import {screen} from '@testing-library/react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {LoyaltyTransactions} from './loyalty-transactions';

describe('<LoyaltyTransactions />', () => {
  it('renders page accordingly', async () => {
    renderWithConfig(<LoyaltyTransactions />);

    expect(screen.getByTestId('select-status')).toBeDefined();
    expect(screen.getByTestId('select-issuers')).toBeDefined();

    const transactions = await screen.findAllByTestId('transaction-title');

    expect(transactions.length).toBe(20);
  });
});
