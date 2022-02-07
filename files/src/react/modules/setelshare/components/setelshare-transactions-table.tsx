import {
  Badge,
  DataTable as Table,
  formatDate,
  isNil,
  PaginationNavigation,
  usePaginationState,
  Text,
  classes,
} from '@setel/portal-ui';
import * as React from 'react';
import {EmptyDataTableCaption} from 'src/react/components/empty-data-table-caption';
import {IPaginationResult} from 'src/react/lib/ajax';
import {Link} from 'src/react/routing/link';
import {ICircleTransaction, IPagination} from 'src/shared/interfaces/circles.interface';
import {circleTransactionsColorMap} from '../setelshare.const';
import {capitalizeFirstLetter} from '../setelshare.helper';
import {SetelShareUserExternalIcon} from './setelshare-user-external-icon';

interface Props {
  circleTransactionsResult: IPaginationResult<ICircleTransaction>;
  isLoading: boolean;
  isFetching: boolean;
  pagination: IPagination;
}

export const SetelShareTransactionsTable: React.VFC<Props> = (props) => {
  const {items: circleTransactions, isEmpty, total} = props.circleTransactionsResult || {};
  const {page, perPage, setPage, setPerPage} = props.pagination || usePaginationState();

  return (
    <Table
      data-testid="setelshare-transaction-listing"
      isLoading={props.isLoading}
      isFetching={props.isFetching}
      pagination={
        <PaginationNavigation
          variant="prev-next"
          total={total}
          currentPage={page}
          perPage={perPage}
          onChangePage={setPage}
          onChangePageSize={setPerPage}
          hideIfSinglePage={false}
          isFetching={props.isFetching}
        />
      }>
      <Table.Thead>
        <Table.Tr>
          <Table.Td>MEMBERS</Table.Td>
          <Table.Td>TRANSACTION STATUS</Table.Td>
          <Table.Td>TRANSACTION ID</Table.Td>
          <Table.Td className="text-right">AMOUNT (RM)</Table.Td>
          <Table.Td className="text-right">TRANSACTION DATE</Table.Td>
        </Table.Tr>
      </Table.Thead>

      {!props.isLoading && (!circleTransactions?.length || isEmpty) ? (
        <EmptyDataTableCaption />
      ) : (
        <Table.Tbody>
          {!props.isLoading &&
            circleTransactions?.map((circleTransaction, index) => (
              <Table.Tr key={index}>
                <Table.Td>
                  {circleTransaction.fullName && (
                    <div className="flex text-black">
                      {circleTransaction.fullName}
                      <SetelShareUserExternalIcon userId={circleTransaction.userId} />
                    </div>
                  )}
                </Table.Td>
                <Table.Td>
                  {circleTransaction.status && (
                    <Badge
                      color={circleTransactionsColorMap[circleTransaction.status] || 'grey'}
                      className="uppercase">
                      {circleTransaction.status}
                    </Badge>
                  )}
                </Table.Td>
                <Table.Td>
                  <Link
                    className="inline"
                    to={`/payments/transactions/details/${circleTransaction.id}`}>
                    {circleTransaction.id}
                  </Link>
                  <Text
                    className={classes.bodySecondary}
                    color="lightgrey"
                    style={{lineHeight: '20px'}}>
                    {capitalizeFirstLetter(circleTransaction.type)}
                  </Text>
                </Table.Td>
                <Table.Td className="text-right">
                  {!isNil(circleTransaction.amount) && circleTransaction.amount.toFixed(2)}
                </Table.Td>
                <Table.Td className="text-right">
                  {circleTransaction.createdAt ? formatDate(circleTransaction.createdAt) : '-'}
                </Table.Td>
              </Table.Tr>
            ))}
        </Table.Tbody>
      )}
    </Table>
  );
};
