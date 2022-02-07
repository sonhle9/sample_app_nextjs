import * as React from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  classes,
  DescList,
  EditIcon,
  ExclamationIcon,
  formatDate,
  formatMoney,
  JsonPanel,
  Notification,
  PaginationNavigation,
  Tabs,
  Text,
  usePaginationState,
  useTransientState,
  CardHeading,
  DataTable as Table,
  Pagination,
} from '@setel/portal-ui';
import {PageContainer} from 'src/react/components/page-container';
import {SkeletonContent, SkeletonDescItem} from 'src/react/components/skeleton-display';
import {
  useBillingActivityLogs,
  useBillingHistory,
  useBillingSubscription,
} from '../billing-subscriptions.queries';
import {
  Activity,
  ApplyChangeEditStatus,
  CancelStatus,
  getSubscriptionStatusColor,
  IBillingSubscriptionsDetailsProps,
  SubscriptionPhysicalText,
  SubscriptionStatus,
} from '../billing-subscriptions.types';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {BillingSubscriptionsModalEditGeneralActive} from './billing-subscriptions-modal-edit-general-active';
import {BillingSubscriptionsModalEditGeneralPendingFutureInTrial} from './billing-subscriptions-modal-edit-general-pending-future-in-trial';
import {BillingSubscriptionsModalEditSubscription} from './billing-subscriptions-modal-edit-subscription';
import {BillingSubscriptionsModalCancelActive} from './billing-subscriptions-modal-cancel-active';
import {
  buildBillingAddress,
  buildBillingDate,
  buildPeriodTime,
  buildPaymentDueNoticePeriodTime,
  useMalaysiaTime,
  buildCreditTerm,
} from '../billing-subscriptions.helpers';
import {HistoryTabLabels, mappingInterval, mappingStatus} from '../billing-subscriptions.constants';
import {BillingSubscriptionsModalCancelPendingFutureInTrial} from './billing-subscriptions-modal-cancel-pending-future-in-trial';
import {PricingModel} from '../../billing-plans/billing-plan.types';
import {billingSubscriptionsRole} from '../../../../shared/helpers/roles.type';
import {HasPermission} from '../../auth/HasPermission';
import {EmptyDataTableCaption} from '../../../components/empty-data-table-caption';
import {getInvoiceStatusColor, InvoicesStatus} from '../../billing-invoices/billing-invoices.types';
import {
  mappingBillingCreditNotesStatusColor,
  mappingBillingCreditNotesStatusName,
} from '../../billing-credit-notes/billing-credit-notes.constants';
import {mappingInvoiceStatus} from '../../billing-invoices/billing-invoices.constants';
import {CURRENT_ENTERPRISE} from '../../../../shared/const/enterprise.const';

export const indicatorClassBillingSubscriptions = (status: SubscriptionStatus) => {
  switch (status) {
    case SubscriptionStatus.FUTURE:
      return 'text-blue';
    default:
      return '';
  }
};

export const BillingSubscriptionsDetails = ({
  billingSubscriptionId,
}: IBillingSubscriptionsDetailsProps) => {
  const [showModalEditGeneralActive, setShowModalEditGeneralActive] = React.useState(false);
  const [showModalEditGeneralPendingFutureInTrial, setShowModalEditGeneralPendingFutureInTrial] =
    React.useState(false);
  const [showModalEditSubscription, setShowModalEditSubscription] = React.useState(false);
  const [showModalCancelActive, setShowModalCancelActive] = React.useState(false);
  const [showModalCancelPendingFutureInTrial, setShowModalCancelPendingFutureInTrial] =
    React.useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useTransientState(false, 10000);
  const [successNotificationDescription, setSuccessNotificationDescription] = React.useState('');
  const {
    data: billingSubscription,
    isLoading,
    isError,
    error,
  } = useBillingSubscription(billingSubscriptionId);
  const isPendingStatus = billingSubscription?.status === SubscriptionStatus.PENDING;
  const isActiveStatus = billingSubscription?.status === SubscriptionStatus.ACTIVE;
  const isCancelStatus = billingSubscription?.status === SubscriptionStatus.CANCELLED;
  const isScheduledToCancel = [
    CancelStatus.SPECIFIC_DATE,
    CancelStatus.END_OF_INTERVAL,
    CancelStatus.END_OF_TRIAL,
  ].includes(billingSubscription?.cancelStatus);
  const isScheduledToEdit = [
    ApplyChangeEditStatus.ON_NEXT_RENEWAL,
    ApplyChangeEditStatus.ON_SPECIFIC_DATE,
  ].includes(billingSubscription?.applyChangeEditStatus);
  const isMeteredPricingModal = billingSubscription?.pricingModel === PricingModel.METERED;

  return (
    <>
      <PageContainer
        heading={'Billing subscription details'}
        action={
          <HasPermission accessWith={[billingSubscriptionsRole.modify]}>
            <Button
              disabled={isCancelStatus}
              variant="error-outline"
              onClick={() => {
                if (isActiveStatus) {
                  return setShowModalCancelActive(true);
                }

                return setShowModalCancelPendingFutureInTrial(true);
              }}>
              CANCEL SUBSCRIPTION
            </Button>
          </HasPermission>
        }>
        {isError && <QueryErrorAlert error={error as any} />}
        {!isCancelStatus && isScheduledToEdit && (
          <Alert
            variant="info"
            description="This subscription is scheduled to be updated"
            leftIcon={ExclamationIcon}
            onClick={() => setShowModalEditSubscription(true)}
            feature="button"
            className="mb-5"
          />
        )}
        {!isCancelStatus && isScheduledToCancel && (
          <Alert
            variant="error"
            description="This subscription is scheduled to be cancelled"
            leftIcon={ExclamationIcon}
            onClick={() => {
              if (isActiveStatus) {
                return setShowModalCancelActive(true);
              }

              return setShowModalCancelPendingFutureInTrial(true);
            }}
            feature="button"
            className="mb-5"
          />
        )}
        <Card>
          <CardHeading
            title={
              <SkeletonContent
                isLoading={isLoading}
                content={billingSubscription?.attributes?.merchantName}
                className="mb-2"
              />
            }>
            <HasPermission accessWith={[billingSubscriptionsRole.modify]}>
              <Button
                variant="outline"
                leftIcon={<EditIcon />}
                minWidth="none"
                disabled={isCancelStatus}
                onClick={() => {
                  if (isActiveStatus) {
                    return setShowModalEditGeneralActive(true);
                  }

                  return setShowModalEditGeneralPendingFutureInTrial(true);
                }}>
                EDIT
              </Button>
            </HasPermission>
          </CardHeading>

          <CardContent>
            {isPendingStatus && (
              <Alert
                variant="warning"
                description="Please fill in additional details to active this subscription."
                leftIcon={ExclamationIcon}
                onClick={() => setShowModalEditGeneralPendingFutureInTrial(true)}
                feature="button"
                className="mb-5"
              />
            )}
            <DescList>
              <SkeletonDescItem
                isLoading={isLoading}
                label="Status"
                value={
                  <Badge
                    rounded="rounded"
                    color={getSubscriptionStatusColor(billingSubscription?.status)}
                    className={`uppercase ${indicatorClassBillingSubscriptions(
                      billingSubscription?.status,
                    )}`}
                    key={billingSubscription?.status}>
                    {mappingStatus[billingSubscription?.status]}
                  </Badge>
                }
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Merchant name"
                value={billingSubscription?.attributes?.merchantName}
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Billing address"
                value={buildBillingAddress(billingSubscription)}
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Contact person"
                value={billingSubscription?.contactPerson}
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Billing plan"
                value={billingSubscription?.attributes?.billingPlanName}
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Invoice name"
                value={billingSubscription?.invoiceName}
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Billing plan description"
                value={billingSubscription?.billingPlanDescription}
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Setup fee"
                value={
                  billingSubscription?.setupFee >= 0 &&
                  `RM ${formatMoney(billingSubscription?.setupFee)}`
                }
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Trial period"
                value={buildPeriodTime(
                  billingSubscription?.trialPeriod,
                  billingSubscription?.trialPeriodUnit,
                )}
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Trial start date"
                value={
                  billingSubscription?.trialStartDate &&
                  formatDate(useMalaysiaTime(billingSubscription.trialStartDate), {
                    formatType: 'dateOnly',
                  })
                }
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Trial end date"
                value={
                  billingSubscription?.trialEndDate &&
                  formatDate(useMalaysiaTime(billingSubscription.trialEndDate), {
                    formatType: 'dateOnly',
                  })
                }
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Start at"
                value={
                  billingSubscription?.startAt &&
                  formatDate(useMalaysiaTime(billingSubscription.startAt), {formatType: 'dateOnly'})
                }
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="End date"
                value={
                  billingSubscription?.endDate &&
                  formatDate(useMalaysiaTime(billingSubscription.endDate), {formatType: 'dateOnly'})
                }
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Created on"
                value={
                  billingSubscription?.createdAt &&
                  formatDate(useMalaysiaTime(billingSubscription.createdAt), {
                    formatType: 'dateOnly',
                  })
                }
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Updated on"
                value={
                  billingSubscription?.updatedAt &&
                  formatDate(useMalaysiaTime(billingSubscription.updatedAt), {
                    formatType: 'dateOnly',
                  })
                }
              />
            </DescList>
          </CardContent>
        </Card>
        <Card className="mt-8">
          <CardHeading title="Subscription details">
            <HasPermission accessWith={[billingSubscriptionsRole.modify]}>
              <Button
                onClick={() => setShowModalEditSubscription(true)}
                disabled={isMeteredPricingModal || isPendingStatus || isCancelStatus}
                variant="outline"
                leftIcon={<EditIcon />}
                minWidth="none">
                EDIT
              </Button>
            </HasPermission>
          </CardHeading>
          <CardContent className="flex border-b border-gray-200">
            <Text className={`${classes.label} w-44 mr-11`} color="lightgrey">
              BILLING
            </Text>
            <DescList>
              <SkeletonDescItem
                isLoading={isLoading}
                label="Bill every"
                value={buildPeriodTime(
                  billingSubscription?.billingInterval,
                  billingSubscription?.billingIntervalUnit,
                )}
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Billing date"
                value={
                  billingSubscription?.billingDate &&
                  billingSubscription?.billingIntervalUnit &&
                  buildBillingDate(
                    billingSubscription?.billingDate,
                    billingSubscription?.billingIntervalUnit,
                    billingSubscription?.hasCustomBillingDate,
                  )
                }
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Bill at"
                value={mappingInterval[billingSubscription?.billingAt]}
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Credit term"
                value={buildCreditTerm(
                  billingSubscription?.paymentTerm,
                  billingSubscription?.paymentTermDays,
                )}
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Payment due notice period"
                value={buildPaymentDueNoticePeriodTime(billingSubscription?.paymentDueNoticePeriod)}
              />
            </DescList>
          </CardContent>
          <CardContent className="flex border-b border-gray-200">
            <Text className={`${classes.label} w-44 mr-11`} color="lightgrey">
              CURRENT INTERVAL
            </Text>
            <DescList>
              <SkeletonDescItem
                isLoading={isLoading}
                label="Current interval start"
                value={
                  billingSubscription?.currentIntervalStartDate &&
                  formatDate(useMalaysiaTime(billingSubscription.currentIntervalStartDate), {
                    formatType: 'dateOnly',
                  })
                }
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Current interval end"
                value={
                  billingSubscription?.currentIntervalEndDate &&
                  formatDate(useMalaysiaTime(billingSubscription.currentIntervalEndDate), {
                    formatType: 'dateOnly',
                  })
                }
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Next renewal at"
                value={
                  billingSubscription?.nextRenewalAt &&
                  formatDate(useMalaysiaTime(billingSubscription.nextRenewalAt), {
                    formatType: 'dateOnly',
                  })
                }
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Next billing at"
                value={
                  billingSubscription?.nextBillingAt &&
                  formatDate(useMalaysiaTime(billingSubscription.nextBillingAt), {
                    formatType: 'dateOnly',
                  })
                }
              />
            </DescList>
          </CardContent>
          <CardContent className="flex border-b border-gray-200">
            <Text className={`${classes.label} w-44 mr-11`} color="lightgrey">
              STATEMENT PREFERENCE
            </Text>
            <DescList>
              <SkeletonDescItem
                isLoading={isLoading}
                label="E-statement"
                value={
                  billingSubscription?.eStatementEmails
                    ? billingSubscription?.eStatementEmails.join(', ')
                    : null
                }
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Physical"
                value={SubscriptionPhysicalText[billingSubscription?.physical]}
              />
            </DescList>
          </CardContent>
        </Card>
        <TabHistories subscriptionId={billingSubscriptionId} />
        <PaginatedActivities subscriptionId={billingSubscriptionId} />
        <JsonPanel
          className="mt-8"
          defaultOpen
          allowToggleFormat
          json={billingSubscription as any}
        />
      </PageContainer>
      {showModalEditGeneralActive && (
        <BillingSubscriptionsModalEditGeneralActive
          billingSubscription={billingSubscription}
          showModal={showModalEditGeneralActive}
          setShowModal={setShowModalEditGeneralActive}
          onSuccess={(description) => {
            setShowSuccessNotification(true);
            setSuccessNotificationDescription(description);
          }}
        />
      )}
      {showModalEditGeneralPendingFutureInTrial && (
        <BillingSubscriptionsModalEditGeneralPendingFutureInTrial
          billingSubscription={billingSubscription}
          showModal={showModalEditGeneralPendingFutureInTrial}
          setShowModal={setShowModalEditGeneralPendingFutureInTrial}
        />
      )}
      {showModalEditSubscription && (
        <BillingSubscriptionsModalEditSubscription
          billingSubscription={billingSubscription}
          showModal={showModalEditSubscription}
          setShowModal={setShowModalEditSubscription}
        />
      )}
      {showModalCancelActive && (
        <BillingSubscriptionsModalCancelActive
          billingSubscription={billingSubscription}
          showModal={showModalCancelActive}
          setShowModal={setShowModalCancelActive}
        />
      )}
      {showModalCancelPendingFutureInTrial && (
        <BillingSubscriptionsModalCancelPendingFutureInTrial
          billingSubscription={billingSubscription}
          showModal={showModalCancelPendingFutureInTrial}
          setShowModal={setShowModalCancelPendingFutureInTrial}
        />
      )}
      {showSuccessNotification && (
        <Notification
          isShow={showSuccessNotification}
          onDismiss={() => setShowSuccessNotification(false)}
          variant="success"
          title="Successful!"
          description={successNotificationDescription}
        />
      )}
    </>
  );
};

export const PaginatedActivities = (props: {subscriptionId: string}) => {
  const pagination = usePaginationState();
  const {data, isLoading, isError, error} = useBillingActivityLogs(
    {
      page: pagination.page,
      perPage: pagination.perPage,
    },
    props.subscriptionId,
  );

  const isEmptyBillingActivityLogs = !isLoading && data?.activityLogs?.length === 0;
  const totalPage = Math.ceil(data?.total / pagination.perPage);
  return (
    <>
      {isError && <QueryErrorAlert error={error as any} />}
      {!isError && (
        <Table
          expandable
          defaultIsOpen
          heading={<CardHeading title={'Activity log'} />}
          pagination={
            <Pagination
              currentPage={pagination.page}
              lastPage={totalPage}
              pageSize={pagination.perPage}
              onChangePage={pagination.setPage}
              onChangePageSize={pagination.setPerPage}
              onGoToLast={() => pagination.setPage(totalPage)}
            />
          }>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ACTIVITY</Table.Th>
              <Table.Th className="text-right">TIME-STAMP</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {!isEmptyBillingActivityLogs &&
              data?.activityLogs?.map((activity: Activity) => (
                <Table.Tr key={activity.id}>
                  <Table.Td>{activity.description}</Table.Td>
                  <Table.Td className="text-right">
                    {activity.createdAt
                      ? formatDate(useMalaysiaTime(activity.createdAt), {
                          formatType: 'dateAndTime',
                        })
                      : '-'}
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table>
      )}
    </>
  );
};

export const TabHistories = (props: {subscriptionId: string}) => {
  return (
    <>
      <Card expandable defaultIsOpen className="my-8">
        <CardHeading title="History" />
        <CardContent className="p-0">
          <Tabs>
            <Tabs.TabList>
              {Object.entries(HistoryTabLabels).map(([, key]) => (
                <Tabs.Tab label={key} key={key} />
              ))}
            </Tabs.TabList>
            <Tabs.Panels>
              {Object.entries(HistoryTabLabels).map(([, key]) => (
                <Tabs.Panel key={key}>
                  <PaginatedHistories subscriptionId={props.subscriptionId} historyType={key} />
                </Tabs.Panel>
              ))}
            </Tabs.Panels>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
};

export const PaginatedHistories = (props: {subscriptionId: string; historyType: string}) => {
  const pagination = usePaginationState();
  let {data, isLoading, isError, error} = useBillingHistory(
    {
      page: pagination.page,
      perPage: pagination.perPage,
      subscriptionId: props.subscriptionId,
    },
    props.historyType,
  );

  const isEmptyBillingHistory = !isLoading && data?.isEmpty;
  const webDashboardUrl = CURRENT_ENTERPRISE.dashboardUrl;
  return (
    <>
      {isError && <QueryErrorAlert error={error as any} />}
      {!isError && (
        <Table
          isLoading={isLoading}
          striped
          pagination={
            <PaginationNavigation
              total={data && data.total}
              currentPage={pagination.page}
              perPage={pagination.perPage}
              onChangePage={pagination.setPage}
              onChangePageSize={pagination.setPerPage}
            />
          }>
          <Table.Thead>
            <Table.Th className="w-1/5 px-7">ID</Table.Th>
            <Table.Th className="w-2/5">STATUS</Table.Th>
            <Table.Th className="text-right w-1/5">AMOUNT (RM)</Table.Th>
            <Table.Th className="text-right w-1/5 px-7">CREATED ON</Table.Th>
          </Table.Thead>
          <Table.Tbody>
            {!isEmptyBillingHistory &&
              data?.histories?.map((history, index) => (
                <Table.Tr
                  key={index}
                  render={(billingProps) => (
                    <a
                      target={'_blank'}
                      href={`${webDashboardUrl}/billing/${
                        InvoicesStatus[history.status] ? 'invoices' : 'credit-notes'
                      }?merchantId=${history.merchantId}&id=${
                        history.objectId
                      }&redirect-from=admin`}
                      {...billingProps}
                    />
                  )}>
                  <Table.Td className="px-7">{history.id}</Table.Td>
                  <Table.Td>
                    <Badge
                      rounded="rounded"
                      color={
                        InvoicesStatus[history.status]
                          ? getInvoiceStatusColor(InvoicesStatus[history.status])
                          : mappingBillingCreditNotesStatusColor[history.status]
                      }
                      className="uppercase"
                      key={history.status}>
                      {InvoicesStatus[history.status]
                        ? mappingInvoiceStatus[history.status]
                        : mappingBillingCreditNotesStatusName[history.status]}
                    </Badge>
                  </Table.Td>
                  <Table.Td className="text-right">{formatMoney(history.amount)}</Table.Td>
                  <Table.Td className="text-right px-7">
                    {formatDate(useMalaysiaTime(history.createAt), {
                      formatType: 'dateOnly',
                    })}
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
          {isEmptyBillingHistory && <EmptyDataTableCaption />}
        </Table>
      )}
    </>
  );
};
