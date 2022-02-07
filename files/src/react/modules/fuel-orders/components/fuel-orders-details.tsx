import {
  Badge,
  BareButton,
  Button,
  Card,
  CardHeading,
  DataTable as Table,
  DataTableCell as Td,
  DataTableExpandableGroup as ExpandGroup,
  DataTableExpandableRow as ExpandableRow,
  DataTableExpandButton as ExpandButton,
  DataTableRow as Tr,
  DataTableRowGroup,
  DescList,
  DropdownMenu,
  EditIcon,
  ExternalIcon,
  Fieldset,
  formatDate,
  formatMoney,
  JsonPanel,
  Skeleton,
  Timeline,
  TimelineItem,
  titleCase,
} from '@setel/portal-ui';
import React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useAdminFuelOrder} from 'src/react/modules/fuel-orders/fuel-orders.queries';
import {TransactionStatusName} from 'src/react/modules/loyalty/loyalty.type';
import {Link} from 'src/react/routing/link';
import {LoyaltyReferenceTypesEnum} from '../../../../shared/enums/loyalty.enum';
import {retailRoles} from '../../../../shared/helpers/roles.type';
import {useHasPermission} from '../../auth/HasPermission';
import {useCustomerDetails, usePaymentTransactions} from '../../customers/customers.queries';
import {useIndexTransactions as useLoyaltyTransactions} from '../../loyalty/loyalty.queries';
import {
  colorByStatus,
  colorByStatusTimeline,
  mapTransactionTypeToFriendlyName,
} from '../fuel-orders.const';
import {getBadgeColorForStatus} from '../fuel-orders.helpers';
import {CancelAuthorizeModal} from './cancel-authorize-modal';
import {ChargeByGeneratedInvoiceModal} from './charge-by-generated-invoice-modal';
import {ChargeByInvoiceModal} from './charge-by-invoice-modal';
import {EditTagsModal} from './edit-tags-modal';
import {ManualReleaseOrder} from './manual-release-modal';
import {environment} from 'src/environments/environment';

export function FuelOrdersDetails(props: {orderId: string}) {
  const [showCancelAuthorizeForm, setShowCancelAuthorizeForm] = React.useState(false);
  const [showChargeByInvoiceForm, setShowChargeByInvoiceForm] = React.useState(false);
  const [showChargeByGeneratedInvoiceForm, setShowChargeByGeneratedInvoiceForm] =
    React.useState(false);
  const [showEditTagsForm, setShowEditTagsForm] = React.useState(false);
  const [viewTransactionIDs, setViewTransactionIDs] = React.useState([]);

  const hasUpdatePermission = useHasPermission([retailRoles.fuelOrderUpdate]);

  const {data: order, isLoading: isLoadingOrder} = useAdminFuelOrder(props.orderId);

  const {data: customer} = useCustomerDetails(order?.userId, {
    enabled: !!order,
  });

  const {
    data: paymentTransactions,
    isError: hasFailedToRequestPaymentTransactions,
    isSuccess: hasFinishedRequestedPaymentTransactions,
  } = usePaymentTransactions(
    {orderId: order?.orderId},
    {
      enabled: !!order,
    },
  );

  const {data: loyaltyTransactions, isSuccess: hasFinishedRequestedLoyaltyTransactions} =
    useLoyaltyTransactions(
      {referenceId: order?.orderId, referenceTypes: [LoyaltyReferenceTypesEnum.order]},
      {
        enabled: !!order,
      },
    );

  const sortedPaymentTransactions = paymentTransactions
    ?.slice()
    .sort((a, b) => new Date(a?.createdAt).valueOf() - new Date(b?.createdAt).valueOf());

  const fuelInsideInvoice = order?.invoice?.invoice?.fuel;

  return (
    <PageContainer
      heading="Order details"
      action={order && hasUpdatePermission && <ManualReleaseOrder order={order} />}>
      <CancelAuthorizeModal
        amount={order?.paymentAuthorizedAmount}
        isOpen={showCancelAuthorizeForm}
        onDismiss={() => setShowCancelAuthorizeForm(false)}
        orderId={order?.orderId}
      />
      <ChargeByInvoiceModal
        amount={order?.invoice?.invoice?.grandTotal}
        isOpen={showChargeByInvoiceForm}
        onDismiss={() => setShowChargeByInvoiceForm(false)}
        orderId={order?.orderId}
      />
      {showChargeByGeneratedInvoiceForm && (
        <ChargeByGeneratedInvoiceModal
          isOpen={showChargeByGeneratedInvoiceForm}
          onDismiss={() => setShowChargeByGeneratedInvoiceForm(false)}
          orderId={order?.orderId}
          orderCreatedAt={order?.createdAt}
        />
      )}
      {order?.adminTags && (
        <EditTagsModal
          isOpen={showEditTagsForm}
          onDismiss={() => setShowEditTagsForm(false)}
          existingTags={order.adminTags}
          orderId={order.orderId}
        />
      )}
      <Card className="mb-8">
        <Card.Heading title={(order && order.orderId) || <Skeleton width="medium" />}>
          {hasUpdatePermission && (
            <Button
              onClick={() => setShowEditTagsForm(true)}
              variant="outline"
              leftIcon={<EditIcon />}>
              EDIT TAGS
            </Button>
          )}
        </Card.Heading>
        <Card.Content>
          <Fieldset legend="GENERAL" className="pb-3 border-b border-grey-500">
            <DescList className="py-3" isLoading={isLoadingOrder}>
              <DescList.Item label="Order ID" value={order && order.orderId} />
              <DescList.Item label="Fuel type" value={order && order.orderType} />
              <DescList.Item
                label="Customer name"
                value={
                  (customer && (
                    <div className="flex">
                      <span className="mr-2">{customer.fullName}</span>
                      <Link
                        data-testid="navigate-to-customer-page"
                        to={`/customers/${customer.userId}`}>
                        <ExternalIcon className="text-brand-500" />
                      </Link>
                    </div>
                  )) || <Skeleton width="medium" />
                }
              />
              <DescList.Item
                label="Customer email"
                value={(customer && customer.email) || <Skeleton width="medium" />}
              />
              <DescList.Item
                label="Phone number"
                value={(customer && customer.phone) || <Skeleton width="medium" />}
              />
              <DescList.Item label="Created on" value={order && formatDate(order.createdAt)} />
            </DescList>
          </Fieldset>
          <Fieldset legend="ORDER DETAILS" className="py-3 border-b border-grey-500">
            <DescList className="py-3" isLoading={isLoadingOrder}>
              <DescList.Item
                label="Status"
                value={
                  order &&
                  order.status && (
                    <Badge
                      className="uppercase"
                      color={getBadgeColorForStatus(order.status)}
                      rounded="rounded"
                      size="small">
                      {order.statusLabel}
                    </Badge>
                  )
                }
              />
              <DescList.Item
                label="Total amount"
                value={(order && formatMoney(order.amount, 'MYR')) || '-'}
              />
              <DescList.Item
                label="Payment method"
                value={(order && (order.cardBrand || order.paymentProvider)) || '-'}
              />
              <DescList.Item
                label="Filled petrol volume (L)"
                value={
                  (fuelInsideInvoice?.order?.completedVolume &&
                    fuelInsideInvoice.order.completedVolume) ||
                  '-'
                }
              />
              <DescList.Item
                label="Unit price"
                value={
                  (fuelInsideInvoice?.order?.pricePerUnit &&
                    formatMoney(fuelInsideInvoice.order.pricePerUnit, 'MYR')) ||
                  '-'
                }
              />
              <DescList.Item
                label="Fuel grade"
                value={(fuelInsideInvoice?.fuelGrade && fuelInsideInvoice.fuelGrade) || '-'}
              />
              <DescList.Item
                label="Full tank"
                value={
                  fuelInsideInvoice?.order?.isFullTank && fuelInsideInvoice.order.isFullTank
                    ? 'Yes'
                    : 'No'
                }
              />
              <DescList.Item
                label="Pump number"
                value={(fuelInsideInvoice?.pumpId && fuelInsideInvoice.pumpId) || '-'}
              />
              <DescList.Item
                label="Petrol station"
                value={
                  order && (
                    <div className="flex">
                      <span className="mr-2">{order.stationName}</span>
                      <Link
                        data-testid="navigate-to-stations-page"
                        to={`/stations/${order.stationId}/details`}>
                        <ExternalIcon className="text-brand-500" />
                      </Link>
                    </div>
                  )
                }
              />
              <DescList.Item
                label="Tax invoice number"
                value={(order?.invoice?.invoice?.id && `#${order.invoice.invoice.id}`) || '-'}
              />
            </DescList>
          </Fieldset>
          <Fieldset legend="MESRA DETAILS" className="py-3 border-b border-grey-500">
            <DescList className="py-3" isLoading={isLoadingOrder}>
              <DescList.Item
                label="Loyalty card number"
                value={
                  (order?.loyaltyTransaction?.petronas?.cardNumber &&
                    `• • • • ${order?.loyaltyTransaction.petronas.cardNumber.substr(-4, 4)}`) ||
                  '-'
                }
              />
              <DescList.Item
                label="Mesra points earned"
                value={
                  (order?.loyaltyTransaction?.petronas?.earnedPoints &&
                    `${order.loyaltyTransaction.petronas.earnedPoints} point${
                      order.loyaltyTransaction.petronas.earnedPoints > 1 && 's'
                    }`) ||
                  '-'
                }
              />
              <DescList.Item
                label="Mesra points after purchase"
                value={
                  (order?.loyaltyTransaction?.petronas?.balance &&
                    `${order.loyaltyTransaction.petronas.balance} Mesra point${
                      order.loyaltyTransaction.petronas.balance > 1 && 's'
                    }`) ||
                  '-'
                }
              />
            </DescList>
          </Fieldset>
          <Fieldset legend="OTHERS" className="py-3">
            <DescList className="py-3" isLoading={isLoadingOrder}>
              <DescList.Item
                label="Tags"
                value={
                  order && order.adminTags?.length
                    ? order.adminTags.map((tag) => (
                        <Badge
                          key={tag}
                          className="m-1 uppercase"
                          color="grey"
                          rounded="rounded"
                          size="small">
                          {tag}
                        </Badge>
                      ))
                    : '-'
                }
              />
            </DescList>
          </Fieldset>
        </Card.Content>
      </Card>
      <Card className="mb-8">
        <Card.Heading title="Payment transactions">
          {hasUpdatePermission && (
            <DropdownMenu variant="outline" label="ACTIONS">
              <DropdownMenu.Items>
                <DropdownMenu.Item onSelect={() => setShowCancelAuthorizeForm(true)}>
                  Cancel authorize
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setShowChargeByInvoiceForm(true)}>
                  Charge by invoice
                </DropdownMenu.Item>
                {environment.isGenerateInvoiceToManualChargeEnabled && (
                  <DropdownMenu.Item onSelect={() => setShowChargeByGeneratedInvoiceForm(true)}>
                    Generate invoice and charge
                  </DropdownMenu.Item>
                )}
              </DropdownMenu.Items>
            </DropdownMenu>
          )}
        </Card.Heading>
        <Card.Content>
          {sortedPaymentTransactions && !!sortedPaymentTransactions.length && (
            <Timeline>
              {sortedPaymentTransactions.map(({id, type, amount, status, createdAt, error}) => (
                <TimelineItem
                  key={id}
                  title={
                    <>
                      {mapTransactionTypeToFriendlyName[type]}
                      <Badge
                        className="ml-3 uppercase"
                        color={colorByStatus[status]}
                        rounded="rounded"
                        size="small">
                        {status}
                      </Badge>
                    </>
                  }
                  color={colorByStatusTimeline[type.toLowerCase()]}>
                  <>
                    <DescList className="mb-3">
                      <DescList.Item label="Amount" value={formatMoney(amount, 'MYR')} />
                      <DescList.Item
                        label="Transaction ID"
                        value={
                          <div className="flex">
                            <span className="mr-2">{id}</span>
                            <Link
                              data-testid="navigate-to-payments-transactions-page"
                              to={`/payments/transactions/${id}`}>
                              <ExternalIcon className="text-brand-500" />
                            </Link>
                          </div>
                        }
                      />
                      <DescList.Item label="Type" value="Petrol" />
                      <DescList.Item label="Created on" value={formatDate(createdAt)} />
                      {viewTransactionIDs.includes(id) && (
                        <>
                          <DescList.Item
                            label="Error message"
                            value={[error.code, ' - ', error.description].join('').trim()}
                          />
                        </>
                      )}
                    </DescList>
                    {!viewTransactionIDs.includes(id) && (
                      <BareButton
                        onClick={() => setViewTransactionIDs((ids) => [...ids, id])}
                        className="text-brand-500">
                        VIEW DETAILS
                      </BareButton>
                    )}
                  </>
                </TimelineItem>
              ))}
            </Timeline>
          )}
          {(hasFailedToRequestPaymentTransactions ||
            (hasFinishedRequestedPaymentTransactions && !sortedPaymentTransactions.length)) && (
            <p className="text-center text-darkgrey py-3">
              Order does not have any payment transactions
            </p>
          )}
        </Card.Content>
      </Card>
      <Card className="mb-8">
        <Table native heading={<CardHeading title="Loyalty transactions" />}>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td>Title</Td>
              <Td>Status</Td>
              <Td className="text-right">Points</Td>
              <Td className="text-right">Points Balance</Td>
              <Td className="text-right">Created On</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {loyaltyTransactions &&
              !!loyaltyTransactions.data.length &&
              loyaltyTransactions.data.map(
                ({
                  id,
                  title,
                  status,
                  deductedPoints,
                  amount,
                  receiverBalance,
                  createdAt,
                  issuedBy,
                  failureReason,
                }) => (
                  <ExpandGroup key={id}>
                    <Tr>
                      <Td>
                        <ExpandButton />
                        <Link className="inline-block" to={`/payments/transactions/loyalty/${id}`}>
                          {title}
                        </Link>
                      </Td>
                      <Td>
                        <Badge
                          rounded="rounded"
                          className="uppercase"
                          color={TransactionStatusName.get(status)?.color || 'grey'}>
                          {TransactionStatusName.get(status)?.text}
                        </Badge>
                      </Td>
                      <Td className="text-right">{deductedPoints || amount}</Td>
                      <Td className="text-right">{receiverBalance}</Td>
                      <Td className="text-right">{formatDate(createdAt)}</Td>
                    </Tr>
                    <ExpandableRow>
                      <DescList>
                        <DescList.Item label="Issued by" value={titleCase(issuedBy)} />
                        <DescList.Item label="Error message" value={failureReason || '-'} />
                      </DescList>
                    </ExpandableRow>
                  </ExpandGroup>
                ),
              )}
          </DataTableRowGroup>
          {hasFinishedRequestedLoyaltyTransactions && !loyaltyTransactions.data.length && (
            <Table.Caption className="text-center text-darkgrey py-8">
              Order does not have any loyalty transactions
            </Table.Caption>
          )}
        </Table>
      </Card>
      <JsonPanel
        title="Order JSON"
        className="mb-12"
        json={(({statusLabel, ...rest}) => rest)(order || ({} as any))}
        allowToggleFormat
        defaultOpen
        initialExpanded
        formatDate
      />
    </PageContainer>
  );
}
