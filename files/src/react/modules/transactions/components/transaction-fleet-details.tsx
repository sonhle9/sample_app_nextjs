import React, {useState} from 'react';
import {
  Badge,
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
  formatMoney,
  JsonPanel,
  DataTableCaption,
  EyeShowIcon,
  Button,
  usePaginationState,
  PaginationNavigation,
} from '@setel/portal-ui';
import {
  useGetCardFleetDetails,
  useGetFleetTransactionDetails,
  useGetLoyaltyCategories,
  useGetRelatedFleetTransactions,
  useGetReloadFleetTransaction,
} from '../transaction.queries';
import {useRouter} from 'src/react/routing/routing.context';
import {EStatus, ETransaction_Type} from '../emum';
import {CardFleetTransactionConfirmModal} from './transaction-details-confirm-modal';
import {HasPermission} from '../../auth/HasPermission';
import {cardTransactionRole} from 'src/shared/helpers/roles.type';
import {TransactionFleetTimeline} from './transaction-fleet-timeline';
import {colorByStatus} from './transaction-fleet-status';
import {environment} from 'src/environments/environment';
import {FleetPlan} from '../../cards/card.type';

interface ITransactionFleetDetailsProps {
  id: string;
}

const TransactionFleetDetails: React.VFC<ITransactionFleetDetailsProps> = (props) => {
  const {data, isError} = useGetFleetTransactionDetails(props.id);
  const {data: loyaltyCategories} = useGetLoyaltyCategories();
  const {data: cardDetail} = useGetCardFleetDetails(data?.cardNumber as string);
  const {data: reloadTransaction} = useGetReloadFleetTransaction(data?.transactionUid as string);
  const [confirmModal, setConfirmModal] = useState(false);
  const router = useRouter();
  const {page, perPage, setPage, setPerPage} = usePaginationState();
  const {data: relatedTransactions, isLoading} = useGetRelatedFleetTransactions({
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
    data && data.status === EStatus.AUTHORISED && data.isoTransactionType === 'auth';
  return (
    <>
      <HasPermission accessWith={[cardTransactionRole.read]}>
        <div className="grid gap-8 max-w-6xl mx-auto px-4 pt-8 sm:px-6">
          <div className="flex justify-between">
            <h1 className={classes.h1}>Card transactions details</h1>
            {showReleaseButton && (
              <span className="ml-4">
                <Button
                  variant="primary"
                  onClick={() => {
                    setConfirmModal(true);
                  }}>
                  RELEASE
                </Button>
              </span>
            )}
          </div>

          <Card>
            <CardHeading title="General"></CardHeading>
            <CardContent className="p-7">
              {data && (
                <DescList>
                  <DescItem
                    valueClassName="capitalize"
                    label="Status"
                    value={
                      <Badge
                        color={colorByStatus[data.status]}
                        rounded="rounded"
                        className="uppercase">
                        {data?.status}
                      </Badge>
                    }
                  />
                  <DescItem
                    valueClassName="capitalize"
                    label="Amount"
                    value={
                      <>
                        <span>RM </span>
                        <span>{formatMoney(Number(data?.amount || '0.00'))}</span>
                      </>
                    }
                  />
                  <DescItem
                    valueClassName="capitalize"
                    label="Transaction type"
                    value={data?.type || '-'}
                  />
                  <DescItem
                    valueClassName="capitalize"
                    label="Transaction subtype"
                    value={data?.subtype?.toLowerCase() || '-'}
                  />
                  <DescItem
                    valueClassName="capitalize"
                    label="Reference number"
                    value={data?.rawResponse?.rrn || '-'}
                  />
                  <DescItem
                    valueClassName="capitalize"
                    label="Approval code"
                    value={data?.rawResponse?.authIdResponse || '-'}
                  />
                  <DescItem
                    valueClassName="capitalize"
                    label="STAN"
                    value={data?.rawResponse?.stan || '-'}
                  />
                  <DescItem
                    valueClassName="capitalize"
                    label="Response message"
                    value={
                      data?.rawResponse?.responseCode
                        ? data?.rawResponse?.responseCode === '00'
                          ? `${data?.rawResponse?.responseCode} - Approved`
                          : `${data?.rawResponse?.responseCode} - ${data?.rawResponse?.errorDescription}`
                        : '-'
                    }
                  />
                  <DescItem
                    valueClassName="capitalize"
                    label="Created on"
                    value={formatDate(data.createdAt, {
                      format: 'dd MMM yyyy, hh:mm:ss.SSS a',
                    })}
                  />
                  <DescItem
                    valueClassName="capitalize"
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

          <TransactionFleetTimeline transaction={data} />

          <Card>
            <div className="px-4 md:px-6 lg:px-8 text-darkgrey border-b border-gray-200 text-xl font-medium leading-7 pt-5 py-4 flex justify-between">
              <div className="flex items-center">Card details</div>
              <a
                href={`${environment.pdbWebDashboardUrl}/card-issuing/cards?merchantId=${cardDetail?.merchantId}&cardId=${cardDetail?.id}&redirect-from=admin`}>
                <Button type="button" leftIcon={<EyeShowIcon />} minWidth="none" variant="outline">
                  VIEW DETAILS
                </Button>
              </a>
            </div>
            <CardContent className="p-7">
              {data && (
                <DescList>
                  <DescItem
                    label="Card number"
                    value={
                      <div>
                        <div className="float-left w-11 h-6 mr-4">
                          <img
                            style={{top: -5}}
                            className="w-11 h-8 relative"
                            src={`assets/images/logo-card/card-${
                              (cardDetail?.merchant?.smartPayAccountAttributes?.fleetPlan ||
                                cardDetail?.merchant?.fleetPlan) === FleetPlan.POSTPAID
                                ? FleetPlan.POSTPAID
                                : FleetPlan.PREPAID
                            }.png`}
                          />
                        </div>
                        <span className="font-normal text-sm ">{data?.cardNumber}</span>
                        <span className="px-3">•</span>
                        <span className="font-normal text-sm">
                          <span>Expiry date: </span>
                          <span>
                            {cardDetail?.expiryDate &&
                              formatDate(cardDetail.expiryDate, {
                                format: 'MMM yyyy',
                              })}
                          </span>
                        </span>
                      </div>
                    }
                  />
                  <DescItem
                    label="Authorised card number"
                    value={
                      <div>
                        {(data?.rawRequest?.cardData?.authorisedCard && (
                          <>
                            <div className="float-left w-11 h-6 mr-4">
                              <img
                                style={{top: -5}}
                                className="w-11 h-8 relative"
                                src={`assets/images/logo-card/card-${
                                  (cardDetail?.merchant?.smartPayAccountAttributes?.fleetPlan ||
                                    cardDetail?.merchant?.fleetPlan) === FleetPlan.POSTPAID
                                    ? FleetPlan.POSTPAID
                                    : FleetPlan.PREPAID
                                }.png`}
                              />
                            </div>
                            <span className="font-normal text-sm ">
                              {data?.rawRequest?.cardData?.authorisedCard}
                            </span>
                            <span className="px-3">•</span>
                            <span className="font-normal text-sm">
                              <span>Expiry date: </span>
                              <span>
                                {cardDetail?.expiryDate &&
                                  formatDate(cardDetail.expiryDate, {
                                    format: 'MMM yyyy',
                                  })}
                              </span>
                            </span>
                          </>
                        )) ||
                          '-'}
                      </div>
                    }
                  />
                  <DescItem
                    label="Mileage reading"
                    value={data?.rawRequest?.driverInfo?.autoMeterMileageReading || '-'}
                  />
                  <DescItem
                    label="Smartpay account"
                    value={`${cardDetail?.merchant?.name || '-'} - ${
                      cardDetail?.merchant?.id || ''
                    }`}
                  />
                </DescList>
              )}
            </CardContent>
          </Card>
          <Card>
            <div className="px-4 md:px-6 lg:px-8 text-darkgrey border-b border-gray-200 text-xl font-medium leading-7 pt-5 py-4 flex justify-between">
              <div className="flex items-center">Merchant details</div>
              <Button
                leftIcon={<EyeShowIcon />}
                minWidth="none"
                variant="outline"
                onClick={() => {
                  router.navigateByUrl(`/merchants/${data?.merchantId}`);
                }}>
                VIEW DETAILS
              </Button>
            </div>

            <CardContent className="p-7">
              {data && (
                <DescList>
                  <DescItem
                    label="Batch number"
                    value={data?.rawResponse?.settlementBatchId || '-'}
                  />
                  <DescItem
                    label="Merchant name"
                    value={`${data?.merchantId || ''} - ${data.merchantName || ''}` || '-'}
                  />
                  <DescItem
                    label="Terminal ID"
                    value={
                      `${
                        data?.source === 'ipt_opt'
                          ? 'Invenco terminal'
                          : 'setel_terminal'
                          ? 'Setel terminal'
                          : 'rovr'
                          ? 'ROVR'
                          : ''
                      } - ${data?.rawRequest?.terminalId || data?.rawResponse?.terminalId || ''}` ||
                      '-'
                    }
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
                  <Td>Transaction type</Td>
                  <Td>Transaction subtype</Td>
                  <Td className="text-right pr-7">Transaction on</Td>
                </Tr>
              </DataTableRowGroup>
              <DataTableRowGroup groupType="tbody">
                {(relatedTransactions?.transactions || []).map((item, index) => {
                  return (
                    <Tr
                      render={(propsTransactionDetails) => (
                        <a
                          {...propsTransactionDetails}
                          href={`/card-issuing/card-transactions-fleet/${item.transactionUid}`}
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
                      <Td className="capitalize">{item?.subtype?.toLowerCase()}</Td>
                      <Td className="text-right pr-7">
                        {formatDate(item?.createdAt, {
                          format: 'dd MMM yyyy, hh:mm:ss.SSS',
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
                  {data && !data?.rawRequest?.products?.items.length && (
                    <div className="w-full flex items-center justify-center py-12 text-sm">
                      No itemised details found
                    </div>
                  )}
                </DataTableCaption>
              </DataTable>
            </Card>
          )}

          {data && data.type === ETransaction_Type.TOPUP && reloadTransaction && (
            <Card>
              <CardHeading title="Reload transactions"></CardHeading>
              <DataTable striped>
                <DataTableRowGroup groupType="thead">
                  <Tr>
                    <Td className="text-right w-44">Amount (RM)</Td>
                    <Td className="text-right pr-7">Reload transaction status</Td>
                  </Tr>
                </DataTableRowGroup>
                <DataTableRowGroup groupType="tbody">
                  {(reloadTransaction || []).map((item, index) => {
                    return (
                      <Tr key={index}>
                        <Td className="text-right w-44">{item?.amount}</Td>
                        <Td className="text-right pr-7">
                          <Badge
                            color={
                              colorByStatus[
                                item.status.toLowerCase() === EStatus.REFUNDED
                                  ? EStatus.VOIDED
                                  : (item?.status).toLowerCase()
                              ] || 'grey'
                            }
                            rounded="rounded"
                            className="uppercase">
                            {item?.status}
                          </Badge>
                        </Td>
                      </Tr>
                    );
                  })}
                </DataTableRowGroup>
                <DataTableCaption>
                  {reloadTransaction && !reloadTransaction.length && (
                    <div className="w-full flex items-center justify-center py-12 text-sm">
                      No reload transactions found
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
        <CardFleetTransactionConfirmModal
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

export default TransactionFleetDetails;
