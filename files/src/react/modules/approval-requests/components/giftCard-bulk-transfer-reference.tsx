import {
  Button,
  Card,
  CardHeading,
  DataTable,
  EyeShowIcon,
  Badge,
  BadgeProps,
  DataTableRowGroup,
  DataTableCell as Td,
  DataTableRow as Tr,
  BareButton,
  PaginationNavigation,
} from '@setel/portal-ui';
import * as React from 'react';
import {convertToSensitiveNumber} from 'src/app/cards/shared/common';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {useRouter} from 'src/react/routing/routing.context';
import {getTransactionWithRequestID} from '../../transactions/transaction.service';
import {ICardTransaction} from '../../transactions/transaction.type';

function changeTransferTypeOther(type) {
  switch (type) {
    case 'cr':
      return 'Grants card balance (CR)';
    case 'dr':
      return 'Revoke card balance (DR)';
    default:
      return '-';
  }
}

export const getMerchantStatusBadgeColor = (status: string): BadgeProps['color'] => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'success';
    case 'frozen':
      return 'error';
  }
  return 'grey';
};
interface IGiftCardBulkTransferReference {
  type?: string;
  target?: string;
  transactions?: [ICardTransaction];
  requestID?: string;
}
interface FilterValue {
  requestId: string;
}

const GiftCardBulkTransferReference: React.VFC<IGiftCardBulkTransferReference> = (props) => {
  const initialFilter: FilterValue = {
    requestId: props.requestID,
  };
  const {
    query: {data: data, isFetching},
    pagination,
  } = useDataTableState({
    initialFilter,
    queryKey: 'transaction-requestId',
    queryFn: (currentValues) => getTransactionWithRequestID(currentValues),
  });
  const router = useRouter();
  return (
    <>
      <Card>
        <CardHeading title="Reference">
          <Button
            variant="outline"
            leftIcon={<EyeShowIcon />}
            minWidth="none"
            onClick={() => {
              router.navigateByUrl(
                `/card-issuing/card-transactions?requestId=${props?.requestID}&tab=0`,
              );
            }}>
            VIEW TRANSACTION
          </Button>
        </CardHeading>
        <DataTable
          striped
          pagination={
            <PaginationNavigation
              currentPage={pagination.page}
              total={data && data.totalDocs}
              perPage={pagination.perPage}
              onChangePage={pagination.setPage}
              onChangePageSize={pagination.setPerPage}
            />
          }
          isFetching={isFetching}>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td className="pl-7">Merchant details</Td>
              <Td>STATUS</Td>
              <Td>Transfer type</Td>
              <Td className="text-right">prepaid balance (RM)</Td>
              <Td className="text-right pr-7">Actions</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup groupType="tbody">
            {data?.transactions?.map((transaction) => (
              <>
                <Tr>
                  <Td className="pl-7">
                    <div className="text-sm">{transaction?.merchant?.name || '-'}</div>
                    <div className="text-xs text-mediumgrey">{transaction?.merchantId}</div>
                  </Td>
                  <Td>
                    {(
                      <Badge
                        color={getMerchantStatusBadgeColor(transaction?.merchant?.status)}
                        className={'uppercase'}>
                        {transaction?.merchant?.status}
                      </Badge>
                    ) || '-'}
                  </Td>
                  <Td>{changeTransferTypeOther(transaction?.multiplier)}</Td>
                  <Td className="text-right">
                    {transaction?.merchant?.balances?.find((value) => value?.type === 'PREPAID')
                      ? convertToSensitiveNumber(
                          transaction?.merchant?.balances?.find(
                            (value) => value?.type === 'PREPAID',
                          ).balance,
                        )
                      : '-'}
                  </Td>
                  <Td className="text-right pr-7">
                    <BareButton
                      className="text-brand-500"
                      onClick={() => {
                        router.navigateByUrl(`/card-issuing/cards/${transaction?.cardDetail?.id}`);
                      }}>
                      VIEW DETAILS
                    </BareButton>
                  </Td>
                </Tr>
              </>
            ))}
          </DataTableRowGroup>
        </DataTable>
      </Card>
    </>
  );
};

export default GiftCardBulkTransferReference;
