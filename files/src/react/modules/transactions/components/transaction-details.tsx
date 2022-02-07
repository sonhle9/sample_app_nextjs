import React, {useState} from 'react';
import {
  Badge,
  BadgeProps,
  Card,
  CardContent,
  CardHeading,
  classes,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DescItem,
  DescList,
  formatDate,
  IndicatorProps,
  formatMoney,
  JsonPanel,
  PaginationNavigation,
  Timeline,
  TimelineItem,
  titleCase,
  usePaginationState,
  DataTableCaption,
} from '@setel/portal-ui';
import {
  useGetLoyaltyCategories,
  useGetRelatedTransactions,
  useGetTransactionDetails,
} from '../transaction.queries';
import {useRouter} from 'src/react/routing/routing.context';
import {EStatus, ETransactionTypeTextPair, ETransaction_Type} from '../emum';
import {CardTransactionConfirmModal} from './transaction-details-confirm-modal';
import {HasPermission} from '../../auth/HasPermission';
import {cardTransactionRole} from 'src/shared/helpers/roles.type';

export const colorByStatus: Record<string, BadgeProps['color']> = {
  [EStatus.SUCCEEDED]: 'success',
  [EStatus.SETTLED]: 'success',
  [EStatus.PENDING]: 'lemon',
  [EStatus.UNPOSTED]: 'lemon',
  [EStatus.FAILED]: 'error',
  [EStatus.AUTHORISED]: 'blue',
  [EStatus.POSTED]: 'blue',
  [EStatus.VOIDED]: 'blue',
  [EStatus.CREATED]: 'grey',
  [EStatus.VERIFIED]: 'blue',
};

const colorByStatusTimeline: Record<string, IndicatorProps['color']> = {
  [EStatus.CREATED]: 'brand',
  [EStatus.SUCCEEDED]: 'success',
  [EStatus.SETTLED]: 'success',
  [EStatus.PENDING]: 'lemon',
  [EStatus.UNPOSTED]: 'lemon',
  [EStatus.FAILED]: 'error',
  [EStatus.AUTHORISED]: 'blue',
  [EStatus.POSTED]: 'blue',
  [EStatus.VOIDED]: 'blue',
};

interface ITransactionDetailsProps {
  id: string;
}

const TransactionDetails: React.VFC<ITransactionDetailsProps> = (props) => {
  const {data, isError} = useGetTransactionDetails(props.id);
  const {data: loyaltyCategories} = useGetLoyaltyCategories();
  const [confirmModal, setConfirmModal] = useState(false);
  const router = useRouter();
  const {page, perPage, setPage, setPerPage} = usePaginationState();
  const {data: relatedTransactions, isLoading} = useGetRelatedTransactions({
    page,
    perPage,
    transactionId: props.id,
  });

  React.useEffect(() => {
    if (isError) {
      router.navigateByUrl('card-issuing/card-transactions');
      return;
    }
  }, [isError]);
  const showReleaseButton =
    data && data.status === EStatus.AUTHORISED && data.isoTransactionType === 'auth_eps';
  return (
    <>
      <HasPermission accessWith={[cardTransactionRole.read]}>
        <div className="grid gap-8 max-w-6xl mx-auto px-4 pt-8 sm:px-6">
          <div className="flex justify-between">
            <h1 className={classes.h1}>Card transactions details</h1>
          </div>

          <Card>
            <CardHeading title="General"></CardHeading>
            <CardContent className="p-7">
              {data && (
                <DescList>
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-normal capitalize"
                    label="Status"
                    value={
                      <Badge
                        color={
                          colorByStatus[
                            data.status === EStatus.REFUNDED ? EStatus.VOIDED : data?.status
                          ] || 'grey'
                        }
                        rounded="rounded"
                        className="uppercase">
                        {data?.status === EStatus.REFUNDED ? EStatus.VOIDED : data?.status}
                      </Badge>
                    }
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-normal capitalize"
                    label="Amount"
                    value={
                      <>
                        <span>RM</span>
                        <span>
                          {formatMoney(
                            Number(
                              data?.amount
                                ? data.multiplier && data.multiplier === 'dr'
                                  ? -data.amount
                                  : data.amount
                                : '0.00',
                            ),
                          )}
                        </span>
                        {showReleaseButton && (
                          <span className="ml-4">
                            <button
                              onClick={() => {
                                setConfirmModal(true);
                              }}
                              className="font-bold text-brand-500 bg-opacity-0 hover:bg-opacity-25 focus:outline-none text-xs tracking-1">
                              RELEASE
                            </button>
                          </span>
                        )}
                      </>
                    }
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-normal capitalize"
                    label="Transaction type"
                    value={ETransactionTypeTextPair[data.type] || '-'}
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-normal capitalize"
                    label="Transaction desc."
                    value={data?.isoTransactionType || '-'}
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-normal capitalize"
                    label="RRN"
                    value={data?.rawResponse?.rrn || '-'}
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-normal capitalize"
                    label="STAN"
                    value={data?.rawResponse?.stan || '-'}
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-normal capitalize"
                    label="Response desc."
                    value={
                      data?.rawResponse?.responseCode
                        ? data?.rawResponse?.responseCode === '00'
                          ? `${data?.rawResponse?.responseCode} - Approved`
                          : `${data?.rawResponse?.responseCode} - ${data?.rawResponse?.errorDescription}`
                        : '-'
                    }
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-normal capitalize"
                    label="Created on"
                    value={formatDate(data.createdAt, {
                      format: 'dd MMM yyyy, hh:mm:ss.SSS a',
                    })}
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-normal capitalize"
                    label="Transaction on"
                    value={formatDate(
                      data?.transactionDate ? data.transactionDate : data.createdAt,
                      {
                        format: 'dd MMM yyyy, hh:mm:ss.SSS a',
                      },
                    )}
                  />
                </DescList>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeading title="Timeline"></CardHeading>
            <CardContent className="p-7">
              <Timeline>
                {data?.timeline.map((item, index) => (
                  <TimelineItem
                    title={
                      <div className="text-sm">
                        {' '}
                        {titleCase(
                          item.status === EStatus.REFUNDED ? EStatus.VOIDED : item.status,
                        )}{' '}
                      </div>
                    }
                    description={
                      <>
                        <div className="text-xs">
                          {item.createdAt &&
                            formatDate(item.createdAt, {format: 'dd MMM yyyy, h:mma'})}
                        </div>
                      </>
                    }
                    color={
                      colorByStatusTimeline[
                        item.status === EStatus.REFUNDED ? EStatus.VOIDED : item.status
                      ] || 'purple'
                    }
                    key={index}
                  />
                ))}
              </Timeline>
            </CardContent>
          </Card>
          <Card>
            <CardHeading title="Card details"></CardHeading>
            <CardContent className="p-7">
              {data && (
                <DescList>
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-normal capitalize"
                    label="Card no."
                    value={data?.cardNumber || '-'}
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-normal capitalize"
                    label="Card expiry date"
                    value={
                      data?.cardDetail?.expiryDate
                        ? formatDate(data.cardDetail.expiryDate, {
                            format: 'MMM yyyy',
                          })
                        : '-'
                    }
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-normal capitalize"
                    label="Card groups"
                    value={data?.cardDetail?.cardGroup?.name || '-'}
                  />
                </DescList>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeading title="Merchant details"></CardHeading>
            <CardContent className="p-7">
              {data && (
                <DescList>
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-normal capitalize"
                    label="Batch no."
                    value={data?.rawRequest?.settlementBatchId || '-'}
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-normal capitalize"
                    label="Merchant name"
                    value={data?.merchant?.name || '-'}
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-normal capitalize"
                    label="Terminal ID"
                    value={data?.rawRequest?.deviceId || '-'}
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-normal capitalize"
                    label="Sale territory"
                    value={data?.merchant?.saleTerritory?.name || '-'}
                  />
                </DescList>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeading title="Related transactions"></CardHeading>
            <DataTable
              striped
              isLoading={isLoading}
              pagination={
                relatedTransactions &&
                !!relatedTransactions.transactions.length && (
                  <PaginationNavigation
                    total={relatedTransactions.totalDocs}
                    currentPage={page}
                    perPage={perPage}
                    onChangePage={setPage}
                    onChangePageSize={setPerPage}
                  />
                )
              }>
              <DataTableRowGroup groupType="thead">
                <Tr>
                  <Td className="text-right w-44">Amount (RM)</Td>
                  <Td>Status</Td>
                  <Td>Trans. type</Td>
                  <Td>Trans. description</Td>
                  <Td className="text-right pr-7">Created on</Td>
                </Tr>
              </DataTableRowGroup>
              <DataTableRowGroup groupType="tbody">
                {(relatedTransactions?.transactions || []).map((item, index) => {
                  return (
                    <Tr
                      render={(propsTransactionDetails) => (
                        <a
                          {...propsTransactionDetails}
                          href={`/card-issuing/card-transactions/${item.transactionUid}`}
                          target="_blank"
                        />
                      )}
                      key={index}>
                      <Td className="text-right w-44">{formatMoney(item?.amount)}</Td>
                      <Td>
                        <Badge
                          color={colorByStatus[item?.status]}
                          rounded="rounded"
                          className="uppercase">
                          {item?.status}
                        </Badge>
                      </Td>
                      <Td className="capitalize">{item?.type}</Td>
                      <Td
                        title={
                          item?.type === ETransaction_Type.ADJUSTMENT ||
                          item?.type === ETransaction_Type.TRANSFER
                            ? item?.remark || ''
                            : item?.isoTransactionType
                        }>
                        <div className="truncate" style={{maxWidth: '550px'}}>
                          {item?.type === ETransaction_Type.ADJUSTMENT ||
                          item?.type === ETransaction_Type.TRANSFER
                            ? item?.remark || ''
                            : item?.isoTransactionType}
                        </div>
                      </Td>
                      <Td className="text-right pr-7">
                        {formatDate(item.createdAt, {
                          formatType: 'dateAndTime',
                        })}
                      </Td>
                    </Tr>
                  );
                })}
              </DataTableRowGroup>
              <DataTableCaption>
                {relatedTransactions && !relatedTransactions?.transactions.length && (
                  <div className="w-full flex items-center justify-center py-12 text-sm">
                    No related transaction found
                  </div>
                )}
              </DataTableCaption>
            </DataTable>
          </Card>

          {data && data.type === ETransaction_Type.CHARGE && (
            <Card>
              <CardHeading title="Itemised details"></CardHeading>
              <DataTable striped>
                <DataTableRowGroup groupType="thead">
                  <Tr>
                    <Td className="pl-7">Item categories code</Td>
                    <Td>Item categories name</Td>
                    <Td>unit price</Td>
                    <Td>Quantity</Td>
                    <Td className="text-right pr-7">Item amount (RM)</Td>
                  </Tr>
                </DataTableRowGroup>
                <DataTableRowGroup groupType="tbody">
                  {(data?.rawRequest?.products?.items || []).map((item) => {
                    const category = loyaltyCategories?.find(
                      (obj) => obj.categoryCode === item?.categoryCode,
                    );
                    return (
                      <Tr key={item.id}>
                        <Td className="pl-7">{category?.categoryCode}</Td>
                        <Td>{category?.categoryName}</Td>
                        <Td>{formatMoney(item?.unitPrice)}</Td>
                        <Td>{item?.quantity}</Td>
                        <Td className="text-right pr-7">{formatMoney(item?.totalAmount)}</Td>
                      </Tr>
                    );
                  })}
                </DataTableRowGroup>
                <DataTableCaption>
                  {data && !data?.rawRequest?.products?.items?.length && (
                    <div className="w-full flex items-center justify-center py-12 text-sm">
                      No itemised details found
                    </div>
                  )}
                </DataTableCaption>
              </DataTable>
            </Card>
          )}

          <JsonPanel className="mb-20" allowToggleFormat json={Object.assign({...data})} />
        </div>
      </HasPermission>
      {confirmModal && (
        <CardTransactionConfirmModal
          visible={confirmModal}
          data={data}
          onClose={() => {
            setConfirmModal(false);
          }}
        />
      )}
    </>
  );
};

export default TransactionDetails;
