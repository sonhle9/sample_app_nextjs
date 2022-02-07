import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeading,
  DataTableCaption,
  DataTableRowGroup,
  DataTable as Table,
  DataTableCell as Td,
  DataTableRow as Tr,
  PaginationNavigation,
  formatDate,
  usePaginationState,
} from '@setel/portal-ui';
import {useExceptionTransactions} from '../exceptions.queries';
import {RemarkType} from '../exceptions.type';

interface IExceptionTxTableProps {
  exceptionId: string;
}

export const ExceptionTxTable = ({exceptionId}: IExceptionTxTableProps) => {
  const {page, perPage, setPage, setPerPage} = usePaginationState();
  const {data: transactions, isLoading} = useExceptionTransactions({
    id: exceptionId,
    page,
    perPage,
  });

  return (
    <Card className="mb-8">
      <CardHeading title="Exceptions records listing"></CardHeading>
      <CardContent>
        <Table
          isLoading={isLoading}
          striped
          pagination={
            <PaginationNavigation
              total={transactions?.total}
              currentPage={page}
              perPage={perPage}
              onChangePage={setPage}
              onChangePageSize={setPerPage}
            />
          }>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td className="w-1/6 text-left">Transaction date</Td>
              <Td className="w-1/6 text-left">Batch Number</Td>
              <Td className="w-1/6 text-left">RRN</Td>
              <Td className="w-1/6 text-left">STAN</Td>
              <Td className="w-1/3 text-right">Remarks</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {!isLoading &&
              transactions?.transactions &&
              transactions?.transactions.map((transaction, index) => (
                <Tr key={index} data-testid="exception-tx-row">
                  <Td className="w-1/6 text-left">
                    {transaction.createdAt &&
                      formatDate(transaction.createdAt, {
                        formatType: 'dateAndTime',
                      })}
                  </Td>
                  <Td className="w-1/6 text-left">{transaction?.posBatchSettlementId || '-'}</Td>
                  <Td className="w-1/6 text-left">{transaction?.rrn || '-'}</Td>
                  <Td className="w-1/6 text-left">{transaction?.stan || '-'}</Td>
                  <Td className="w-1/3 text-right">
                    {transaction?.failType ? RemarkType(transaction?.failType) : '-'}
                  </Td>
                </Tr>
              ))}
          </DataTableRowGroup>
          <DataTableCaption>
            {!isLoading && !(transactions?.transactions && transactions?.transactions.length) && (
              <div className="py-12">
                <p className="text-center text-gray-400 text-sm">No data available</p>
              </div>
            )}
          </DataTableCaption>
        </Table>
      </CardContent>
    </Card>
  );
};
