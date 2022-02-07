import {cleanup, screen, within} from '@testing-library/react';
import * as React from 'react';
import {renderWithConfig} from '../../../lib/test-helper';
import {SetelShareTransactionsTable} from './setelshare-transactions-table';

describe(`<SetelShareTransactionsTable />`, () => {
  const pagingResult = {
    items: [],
    isEmpty: true,
    page: 1,
    perPage: 20,
    total: 0,
    pageCount: 0,
  };

  const pagination = {
    page: 1,
    perPage: 1,
    isLastPage: false,
    setPage: jest.fn(),
    setPerPage: jest.fn(),
    setIsLastPage: jest.fn(),
  };

  const tableComponent = (
    <SetelShareTransactionsTable
      circleTransactionsResult={pagingResult}
      isLoading={false}
      isFetching={false}
      pagination={pagination}
    />
  );

  afterAll(() => {
    cleanup();
  });

  it('should renders list', async () => {
    renderWithConfig(tableComponent);
    const table = within(screen.getByTestId('setelshare-transaction-listing'));
    expect(await table.findByText('MEMBERS')).toBeDefined();
    expect(await table.findByText('TRANSACTION STATUS')).toBeDefined();
    expect(await table.findByText('TRANSACTION ID')).toBeDefined();
    expect(await table.findByText('AMOUNT (RM)')).toBeDefined();
    expect(await table.findByText('TRANSACTION DATE')).toBeDefined();
    expect(await table.findByText('You have no data to be displayed here')).toBeDefined();
  });
});
