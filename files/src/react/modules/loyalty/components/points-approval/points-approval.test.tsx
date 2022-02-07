import * as React from 'react';
import {screen} from '@testing-library/react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {server} from 'src/react/services/mocks/mock-server';
import {rest} from 'msw';
import {LoyaltyPointApproval} from './points-approval';

describe(`<LoyaltyPointApproval />`, () => {
  it('renders accordingly when data is received', async () => {
    renderWithConfig(<LoyaltyPointApproval />);

    expect(screen.getByText('Points approval')).toBeDefined();

    const transactionRow = await screen.findAllByTestId('transaction-row');

    expect(transactionRow.length).toBe(15);
  });

  it('renders accordingly when no data is received', async () => {
    renderWithConfig(<LoyaltyPointApproval />);

    server.use(
      rest.get(/points\/transactions/g, (_, res, ctx) => {
        return res(
          ctx.json({
            data: [],
            metadata: {currentPage: 0, pageCount: 0, totalCount: 0, pageSize: 0},
          }),
        );
      }),
    );

    expect(screen.getByText('Points approval')).toBeDefined();

    expect(await screen.findByTestId('no-transaction')).toBeDefined();
  });
});
