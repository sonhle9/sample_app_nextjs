import * as React from 'react';
import {screen} from '@testing-library/react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {LoyaltyDaily} from './loyalty-daily';

describe('<LoyaltyDaily />', () => {
  it('renders page accordingly', async () => {
    renderWithConfig(<LoyaltyDaily />);

    const transactions = await screen.findAllByTestId('daily-transaction-row');

    expect(transactions.length).toBe(50);
  });
});
