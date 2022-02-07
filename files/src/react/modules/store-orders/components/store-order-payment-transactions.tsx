import * as React from 'react';
import {CardHeading, DataTable as Table, formatDate, formatMoney} from '@setel/portal-ui';
import {usePaymentTransactions} from '../../payments-transactions/payment-transactions.queries';
import {Link} from 'src/react/routing/link';

export function StoreOrderPaymentTransactions(props: {orderId: string}) {
  const {
    data: transactions,
    isLoading,
    isSuccess,
  } = usePaymentTransactions({orderId: props.orderId});
  return (
    <div className="mb-8">
      <Table
        heading={<CardHeading title="Payment transactions"></CardHeading>}
        isLoading={isLoading}
        data-testid="store-order-payment-transactions">
        <Table.Thead>
          <Table.Tr>
            <Table.Th className="w-3/12">Transaction ID</Table.Th>
            <Table.Th className="w-2/12 text-right">Amount (RM)</Table.Th>
            <Table.Th className="w-2/12">Type</Table.Th>
            <Table.Th className="w-3/12">Error message</Table.Th>
            <Table.Th className="w-2/12 text-right">Created On</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {transactions?.items.map((transaction) => (
            <Table.Tr key={transaction.id}>
              <Table.Td>
                <Link
                  className="hover:text-brand-500"
                  to={`/payments/transactions/${transaction.id}`}>
                  {transaction.id}
                </Link>
              </Table.Td>
              <Table.Td className="text-right">{formatMoney(transaction.amount)}</Table.Td>
              <Table.Td className="capitalize">{String(transaction.type).toLowerCase()}</Table.Td>
              <Table.Td className="break-all">
                {(transaction.status === 'error' && transaction.rawError) || '-'}
              </Table.Td>
              <Table.Td className="text-right">{formatDate(transaction.createdAt)}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
        {isSuccess && transactions?.items?.length === 0 && (
          <Table.Caption className="text-center text-darkgrey py-8">
            Order does not have any payment transactions
          </Table.Caption>
        )}
      </Table>
    </div>
  );
}
