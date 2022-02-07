import * as React from 'react';
import {DataTable as Table, Card, Tabs} from '@setel/portal-ui';
import {useFeePlan} from '../../fee-plans.queries';
import {
  FeePlanPaymentMethodFamilyLabels,
  FeePlanTypes,
  GLOBAL_FEE_PLAN_ID,
  PAYMENT_METHOD_DETAILS,
} from '../../fee-plans.constant';
import {SkeletonContent} from 'src/react/components/skeleton-display';
import {EmptyDataTableCaption} from 'src/react/components/empty-data-table-caption';
import {FeePlansPaymentMethod} from '../../fee-plans.type';
import {FeePlansPaymentMethodModalEdit} from './fee-plans-payment-method-modal-edit';
import {FeePlansPaymentMethodsRows} from './fee-plans-payment-methods-rows';
import {isEqual} from 'lodash';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {EnterpriseNameEnum} from 'src/shared/enums/enterprise.enum';

interface FeePlanPaymentMethodProps {
  feePlanId?: string;
  feePlanType: FeePlanTypes;
  merchantId?: string;
}

export const FeePlansPaymentMethods = ({
  feePlanId,
  feePlanType,
  merchantId,
}: FeePlanPaymentMethodProps) => {
  const enterpriseId = CURRENT_ENTERPRISE.name;
  const {data: feePlan, isLoading} = useFeePlan(feePlanId);
  const [paymentMethodsByGroups, setPaymentMethodsByGroups] = React.useState<any>();
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<FeePlansPaymentMethod>();

  const isEmptyPaymentMethods = !isLoading && feePlan?.paymentMethods.length === 0;

  React.useEffect(() => {
    setPaymentMethodsByGroups(
      feePlan?.paymentMethods.length > 0
        ? getFeePlanPaymentMethodsByGroups(feePlan?.paymentMethods)
        : {},
    );
  }, [feePlan]);

  return (
    <>
      <Card>
        {feePlanType === FeePlanTypes.PRE_DEFINED && (
          <Card.Heading title={<SkeletonContent isLoading={isLoading} content={feePlan?.name} />} />
        )}
        {feePlanType === FeePlanTypes.CUSTOMIZED && feePlanId === GLOBAL_FEE_PLAN_ID && (
          <div className="px-4 py-4 sm:px-7 border-b border-gray-200">
            <div className="text-xl leading-6 pr-2 py-2 font-medium text-gray-900">Fee Plan</div>
            <div className="text-sm pr-2 font-medium text-gray-500">Unassigned</div>
          </div>
        )}
        {feePlanType === FeePlanTypes.CUSTOMIZED &&
          feePlan?.type === FeePlanTypes.PRE_DEFINED.toString() && (
            <div className="px-4 py-4 sm:px-7 border-b border-gray-200">
              <div className="text-xl leading-6 pr-2 py-2 font-medium text-gray-900">Fee Plan</div>
              <div className="text-sm pr-2 font-medium text-gray-500">
                Plan name: {feePlan?.name}
              </div>
            </div>
          )}
        {feePlanType === FeePlanTypes.CUSTOMIZED &&
          feePlan?.type === FeePlanTypes.CUSTOMIZED.toString() && (
            <div className="px-4 py-4 sm:px-7 border-b border-gray-200">
              <div className="text-xl leading-6 pr-2 py-2 font-medium text-gray-900">Fee Plan</div>
              <div className="text-sm pr-2 font-medium text-gray-500">Customised fee plan</div>
            </div>
          )}

        {!isEmptyPaymentMethods && (
          <Tabs>
            <Tabs.TabList>
              {FeePlanPaymentMethodFamilyLabels[enterpriseId].map((label) => (
                <Tabs.Tab label={label} key={label} />
              ))}
            </Tabs.TabList>
            <Tabs.Panels>
              {enterpriseId === EnterpriseNameEnum.SETEL && (
                <Tabs.Panel>
                  <Table striped={false} isLoading={isLoading}>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th className="pl-7 w-1/5">Payment method</Table.Th>
                        <Table.Th className="w-2/15">Brand</Table.Th>
                        <Table.Th className="text-right w-2/15">Rate</Table.Th>
                        <Table.Th className="text-right w-1/5">Min. amount (RM)</Table.Th>
                        <Table.Th className="text-right w-1/5">Max. amount (RM)</Table.Th>
                        <Table.Th className="text-right w-2/15 pr-7"></Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {paymentMethodsByGroups?.setelWallet && (
                        <FeePlansPaymentMethodsRows
                          paymentMethodsByGroup={paymentMethodsByGroups?.setelWallet}
                          setShowModal={setShowEditModal}
                          setSelectedPaymentMethod={setSelectedPaymentMethod}
                        />
                      )}
                      {paymentMethodsByGroups?.setelCardTerus && (
                        <FeePlansPaymentMethodsRows
                          paymentMethodsByGroup={paymentMethodsByGroups?.setelCardTerus}
                          setShowModal={setShowEditModal}
                          setSelectedPaymentMethod={setSelectedPaymentMethod}
                          stripedColor="bg-lightergrey"
                        />
                      )}
                      {paymentMethodsByGroups?.setelWallelTerus && (
                        <FeePlansPaymentMethodsRows
                          paymentMethodsByGroup={paymentMethodsByGroups?.setelWallelTerus}
                          setShowModal={setShowEditModal}
                          setSelectedPaymentMethod={setSelectedPaymentMethod}
                        />
                      )}
                    </Table.Tbody>
                  </Table>
                </Tabs.Panel>
              )}
              {enterpriseId === EnterpriseNameEnum.PDB && (
                <Tabs.Panel>
                  <Table striped={false} isLoading={isLoading}>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th className="pl-7 w-1/5">Payment method</Table.Th>
                        <Table.Th className="w-2/15">Brand</Table.Th>
                        <Table.Th className="text-right w-2/15">Rate</Table.Th>
                        <Table.Th className="text-right w-1/5">Min. amount (RM)</Table.Th>
                        <Table.Th className="text-right w-1/5">Max. amount (RM)</Table.Th>
                        <Table.Th className="text-right w-2/15 pr-7"></Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {paymentMethodsByGroups?.petronasSmartPay && (
                        <FeePlansPaymentMethodsRows
                          paymentMethodsByGroup={paymentMethodsByGroups?.petronasSmartPay}
                          setShowModal={setShowEditModal}
                          setSelectedPaymentMethod={setSelectedPaymentMethod}
                        />
                      )}
                      {paymentMethodsByGroups?.petronasGift && (
                        <FeePlansPaymentMethodsRows
                          paymentMethodsByGroup={paymentMethodsByGroups?.petronasGift}
                          setShowModal={setShowEditModal}
                          setSelectedPaymentMethod={setSelectedPaymentMethod}
                        />
                      )}
                      {paymentMethodsByGroups?.petronasMesra && (
                        <FeePlansPaymentMethodsRows
                          paymentMethodsByGroup={paymentMethodsByGroups?.petronasMesra}
                          setShowModal={setShowEditModal}
                          setSelectedPaymentMethod={setSelectedPaymentMethod}
                        />
                      )}
                    </Table.Tbody>
                  </Table>
                </Tabs.Panel>
              )}
            </Tabs.Panels>
          </Tabs>
        )}
        {isEmptyPaymentMethods && (
          <Table striped={false} isLoading={isLoading}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="pl-7 w-1/5">Payment method</Table.Th>
                <Table.Th className="w-2/15">Brand</Table.Th>
                <Table.Th className="text-right w-2/15">Rate</Table.Th>
                <Table.Th className="text-right w-1/5">Min. amount (RM)</Table.Th>
                <Table.Th className="text-right w-1/5">Max. amount (RM)</Table.Th>
              </Table.Tr>
            </Table.Thead>
            {isEmptyPaymentMethods && <EmptyDataTableCaption />}
          </Table>
        )}
      </Card>
      {showEditModal && (
        <FeePlansPaymentMethodModalEdit
          feePlanId={feePlan.id}
          paymentMethod={selectedPaymentMethod}
          feePlanType={feePlanType}
          merchantId={merchantId}
          setShowModal={setShowEditModal}
        />
      )}
    </>
  );
};

function getFeePlanPaymentMethodsByGroups(paymentMethods: FeePlansPaymentMethod[]) {
  // SETEL
  const setelWallet = paymentMethods.filter(({family, type, brand}) =>
    isEqual(PAYMENT_METHOD_DETAILS.SETEL_SETELWALLET_SETEL, {family, type, brand}),
  );

  const setelCardTerus = paymentMethods.filter(
    ({family, type, brand}) =>
      isEqual(PAYMENT_METHOD_DETAILS.SETEL_SETELCARDTERUS_VISA, {family, type, brand}) ||
      isEqual(PAYMENT_METHOD_DETAILS.SETEL_SETELCARDTERUS_MASTERCARD, {family, type, brand}),
  );

  const setelWallelTerus = paymentMethods.filter(({family, type, brand}) =>
    isEqual(PAYMENT_METHOD_DETAILS.SETEL_SETELWALLETCARDTERUS_BOOST, {family, type, brand}),
  );

  // PDB
  const petronasSmartPay = paymentMethods.filter(({family, type, brand}) =>
    isEqual(PAYMENT_METHOD_DETAILS.CLOSEDLOOPCARD_GIFTCARD_PETRONASSMARTPAY, {family, type, brand}),
  );

  const petronasGift = paymentMethods.filter(({family, type, brand}) =>
    isEqual(PAYMENT_METHOD_DETAILS.CLOSEDLOOPCARD_GIFTCARD_PETRONASGIFT, {family, type, brand}),
  );

  const petronasMesra = paymentMethods.filter(({family, type, brand}) =>
    isEqual(PAYMENT_METHOD_DETAILS.CLOSEDLOOPCARD_LOYALTYCARD_PETRONASMESRA, {
      family,
      type,
      brand,
    }),
  );

  return {
    // SETEL
    setelWallet,
    setelCardTerus,
    setelWallelTerus,
    // PDB
    petronasSmartPay,
    petronasGift,
    petronasMesra,
  };
}
