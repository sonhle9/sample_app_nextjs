import * as React from 'react';
import {screen} from '@testing-library/react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {LoyaltyMemberTransactionDetails} from './loyalty-member-transaction-details';
import {server} from 'src/react/services/mocks/mock-server';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<LoyaltyMemberTransactionDetails />', () => {
  it('renders page accordingly', async () => {
    renderWithConfig(<LoyaltyMemberTransactionDetails id="5fea98b551c30500178e387d" />);

    expect(screen.getByText('Member details'));

    await screen.findByText('NAME');
    expect(screen.getByText('Fuel - PETRONAS PUTRA BESTARI DEV')).toBeDefined();
    expect(screen.getByTestId('transaction-summary')).toBeDefined();
    expect(screen.getByText('Transaction type')).toBeDefined();
    expect(screen.getByText('Point earnings')).toBeDefined();
  });
});
