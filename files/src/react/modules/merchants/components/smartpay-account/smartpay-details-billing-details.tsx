import React, {useState} from 'react';
import {
  Text,
  Card,
  Button,
  DescItem,
  DescList,
  EditIcon,
  PlusIcon,
  Badge,
  formatDate,
  classes,
} from '@setel/portal-ui';
import SmartpayDetailsBillingModalCreate from './smartpay-details-billing-modal-create';
import {useSubscriptionSPAccountDetails} from 'src/react/modules/billing-subscriptions/billing-subscriptions.queries';
import {getSubscriptionStatusColor} from 'src/react/modules/billing-subscriptions/billing-subscriptions.types';
import {indicatorClassBillingSubscriptions} from 'src/react/modules/billing-subscriptions/components/billing-subscriptions-details';
import {mappingStatus} from 'src/react/modules/billing-subscriptions/billing-subscriptions.constants';
import {useMalaysiaTime} from 'src/react/modules/billing-subscriptions/billing-subscriptions.helpers';
import {balanceStatusText, creditTermText, dunningText, physicalText} from '../../merchant.const';
import {BillingDateTextPair} from 'src/react/modules/billing-plans/billing-plan.types';
import {useDataTableState} from '../../../../hooks/use-state-with-query-params';
import {merchantQueryKey} from '../../merchants.queries';
import {getSmartpayAccountContacts} from '../../merchants.service';
import {SmartpayPukalAccountDetails} from './smartpay-pukal-account-details';

interface SmartpayDetailsBillingDetailsProps {
  merchantId: string;
  applicationId: string;
}

export function SmartpayDetailsBillingDetails(props: SmartpayDetailsBillingDetailsProps) {
  const [showCreateBillingModal, setShowCreateBillingModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const {data: dataBilling, isLoading: isLoadingBilling} = useSubscriptionSPAccountDetails(
    props.merchantId,
  );

  const {query} = useDataTableState({
    initialFilter: {},
    queryKey: [merchantQueryKey.smartpayContactsList, props.applicationId],
    queryFn: (pagingParam) => getSmartpayAccountContacts(props.applicationId, pagingParam),
  });

  const dataContact = React.useMemo(() => {
    return query?.data?.items?.find((i) => i.default)?.email;
  }, [query?.data?.items]);

  return (
    <>
      <Card className="mb-8" isLoading={isLoadingBilling}>
        <Card.Heading title="Billing details">
          {dataBilling && (
            <Button
              variant="outline"
              leftIcon={<EditIcon />}
              onClick={() => {
                setShowEditModal(true);
              }}>
              EDIT
            </Button>
          )}
        </Card.Heading>
        {isLoadingBilling && <Card.Content></Card.Content>}
        {dataBilling && (
          <Card.Content>
            <DescList>
              <DescItem
                label="Billing subscription status"
                value={
                  dataBilling?.status && (
                    <Badge
                      rounded="rounded"
                      color={getSubscriptionStatusColor(dataBilling.status)}
                      className={`uppercase ${indicatorClassBillingSubscriptions(
                        dataBilling.status,
                      )}`}
                      key={dataBilling.status}>
                      {mappingStatus[dataBilling.status]}
                    </Badge>
                  )
                }
              />
              <DescItem
                label="Billing plan"
                value={
                  (dataBilling?.attributes?.billingPlanName && dataBilling?.billingDate && (
                    <div className="flex items-center">
                      <span>{dataBilling?.attributes?.billingPlanName}</span>
                      <span className="mx-2">•</span>
                      <span>{BillingDateTextPair[dataBilling?.billingDate]}</span>
                    </div>
                  )) ||
                  '-'
                }
              />
              <DescItem label="SmartPay account" value={dataBilling?.merchantName || '-'} />
              <DescItem label="SmartPay account number" value={dataBilling?.merchantId || '-'} />
              <DescItem
                label="Dunning code"
                value={`${dataBilling?.dunningCode}: ${dunningText[dataBilling?.dunningCode]}`}
              />
              <DescItem
                label="E-statement"
                value={
                  dataBilling?.eStatement &&
                  dataBilling?.eStatementEmails &&
                  dataBilling?.eStatementEmails.length
                    ? dataBilling?.eStatementEmails[0]
                    : '-'
                }
              />
              <DescItem label="Physical statement" value={physicalText[dataBilling?.physical]} />
              <DescItem label="Credit term" value={creditTermText[dataBilling?.paymentTermDays]} />
              <DescItem
                label="Payment status"
                value={balanceStatusText[dataBilling?.balanceStatus?.balanceStatus] || '-'}
              />
              <DescItem
                label="Next billing date"
                value={
                  dataBilling?.nextBillingAt
                    ? formatDate(useMalaysiaTime(dataBilling.nextBillingAt), {
                        formatType: 'dateOnly',
                      })
                    : '-'
                }
              />
              <DescItem
                label="Created on"
                value={dataBilling?.createdAt ? formatDate(dataBilling?.createdAt) : '-'}
              />
              <DescItem
                label="Created by"
                value={
                  dataBilling?.createdByInfo?.fullName?.trim() ||
                  dataBilling?.createdByInfo?.email ||
                  '-'
                }
              />
              <DescItem
                label="Updated on"
                value={
                  dataBilling?.updatedBy && dataBilling?.updatedAt
                    ? formatDate(dataBilling?.updatedAt)
                    : '-'
                }
              />
              <DescItem
                label="Updated by"
                value={
                  dataBilling?.updatedByInfo?.fullName?.trim() ||
                  dataBilling?.updatedByInfo?.email ||
                  '-'
                }
              />
            </DescList>
          </Card.Content>
        )}
        {!isLoadingBilling && !dataBilling && (
          <Card.Content className="p-8 text-center">
            <Text className={`${classes.body} mb-4`}>
              You have not created any billing details yet.
            </Text>
            <Button
              variant="outline"
              leftIcon={<PlusIcon />}
              onClick={() => setShowCreateBillingModal(true)}>
              CREATE
            </Button>
          </Card.Content>
        )}
      </Card>

      {/* <JsonPanel defaultOpen allowToggleFormat json={Object.assign({}, {...data})} /> */}

      {showCreateBillingModal && (
        <SmartpayDetailsBillingModalCreate
          isEdit={false}
          showModal
          dataContact={dataContact}
          merchantId={props.merchantId}
          onDismiss={() => setShowCreateBillingModal(false)}
        />
      )}

      {showEditModal && (
        <SmartpayDetailsBillingModalCreate
          isEdit
          showModal
          dataContact={dataContact}
          merchantId={props.merchantId}
          initData={dataBilling}
          onDismiss={() => setShowEditModal(false)}
        />
      )}
      <SmartpayPukalAccountDetails merchantId={props.merchantId} />
    </>
  );
}
