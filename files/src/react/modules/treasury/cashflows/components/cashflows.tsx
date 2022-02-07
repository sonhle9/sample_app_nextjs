import {
  Card,
  CardHeading,
  Button,
  CardContent,
  DescList,
  DescItem,
  formatMoney,
  EditIcon,
} from '@setel/portal-ui';
import moment from 'moment';

import React from 'react';
import {AccountBalanceTypes} from 'src/app/ledger/ledger-accounts.enum';
import {PageContainer} from 'src/react/components/page-container';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {
  useAggregatesBalances,
  useDailyMerChantPayout,
  usePlatformAccounts,
} from '../cashflows.query';
import {CashflowsModalAdjustCollection} from './cashflows-modal-adjust-collection';
import {CashflowsModalAdjustOperation} from './cashflows-modal-adjust-operation';
import {CashflowsModalAdjustTrustAccount} from './cashflows-modal-adjust-trust-account';
import {CashflowsModalTransferToOperation} from './cashflows-modal-transfer-to-operation';

export const Cashflows = () => {
  const [visibleCollectionModal, setVisibleCollectionModal] = React.useState(false);
  const [visibleTrustAccountModal, setVisibleTrustAccountModal] = React.useState(false);
  const [visibleOperationModal, setVisibleOperationModal] = React.useState(false);
  const [visibleTransferOperationModal, setVisibleTransferOperationModal] = React.useState(false);

  const {data: platformAccounts, isLoading, isError, error} = usePlatformAccounts();
  const {data} = useAggregatesBalances();
  const {data: todaySummary} = useDailyMerChantPayout();

  const calculateTotalPassThrough = (todaySummary) => {
    let total = 0;
    if (todaySummary?.amountBreakdown.PASSTHROUGH_FUEL?.amount) {
      total += todaySummary.amountBreakdown.PASSTHROUGH_FUEL.amount;
    }
    if (todaySummary?.amountBreakdown.PASSTHROUGH_STORE?.amount) {
      total += todaySummary.amountBreakdown.PASSTHROUGH_STORE.amount;
    }
    if (todaySummary?.amountBreakdown.PASSTHROUGH_CHECKOUT?.amount) {
      total += todaySummary.amountBreakdown.PASSTHROUGH_CHECKOUT.amount;
    }
    return formatMoney(total);
  };

  return (
    <PageContainer heading="Cash flow">
      {isError && <QueryErrorAlert error={error as any} />}
      {!isError && (
        <>
          <div className="mb-8">
            <Card isLoading={isLoading}>
              <CardHeading title="Collection account">
                <Button
                  onClick={() => {
                    setVisibleCollectionModal(true);
                  }}
                  variant="outline"
                  minWidth="none"
                  leftIcon={<EditIcon />}
                  data-testid="adjust-collection-account">
                  EDIT
                </Button>
              </CardHeading>
              <CardContent>
                <DescList className="grid-cols-2">
                  <DescItem
                    labelClassName="sm:text-black"
                    valueClassName="text-right font-medium"
                    label="Pending Balance"
                    value={formatMoney(platformAccounts?.collection?.pendingBalance?.amount, 'RM')}
                  />
                  <DescItem
                    labelClassName="sm:text-black"
                    valueClassName="text-right font-medium"
                    label="Available Balance"
                    value={formatMoney(
                      platformAccounts?.collection?.availableBalance?.amount,
                      'RM',
                    )}
                  />
                </DescList>
              </CardContent>
            </Card>
          </div>
          <div className="mb-8">
            <Card isLoading={isLoading}>
              <CardHeading title="Trust Account 1">
                <Button
                  onClick={() => setVisibleTrustAccountModal(true)}
                  variant="outline"
                  minWidth="none"
                  leftIcon={<EditIcon />}
                  data-testid="adjust-trust-account">
                  EDIT
                </Button>
              </CardHeading>
              <CardContent>
                <div className="flex items-center justify-between font-medium">
                  <span>Available balance</span>
                  <span>
                    {formatMoney(platformAccounts?.trust?.availableBalance?.amount, 'RM')}
                  </span>
                </div>
                <button
                  onClick={() => setVisibleTransferOperationModal(true)}
                  className="text-xs font-bold text-brand-500 mb-4"
                  data-testid="transfer-to-operating-account">
                  TRANSFER TO OPERATING ACCOUNT
                </button>
                <DescList className="border-t pt-5 grid-cols-2">
                  {data?.trustAccounts &&
                    data?.trustAccounts.map((item, index) => (
                      <DescItem
                        labelClassName="sm:text-black"
                        key={index}
                        valueClassName="text-right font-medium"
                        label={item.label}
                        value={formatMoney(
                          item?.balanceType === AccountBalanceTypes.PREPAID
                            ? item.account?.prepaidBalance?.amount
                            : item?.balanceType === AccountBalanceTypes.AVAILABLE
                            ? item.account?.availableBalance?.amount
                            : item.account?.pendingBalance?.amount,
                        )}
                      />
                    ))}
                </DescList>
              </CardContent>
            </Card>
          </div>
          <div className="mb-8">
            <Card isLoading={isLoading}>
              <CardHeading title="Daily merchant payout" />
              <CardContent>
                <DescList className="grid-cols-2 border-b pb-5">
                  <DescItem
                    valueClassName="text-right text-base font-medium"
                    labelClassName="sm:text-black font-medium"
                    label={`Amount to be paid ${moment().format('DD/MM/YYYY')}`}
                    value={formatMoney(todaySummary?.totalAmount ?? 0, 'RM')}
                  />
                </DescList>
                <DescList className="grid-cols-2 mt-5">
                  <DescItem
                    labelClassName="sm:text-black"
                    valueClassName="text-right font-medium"
                    label="Total from Setel Wallet"
                    value={formatMoney(todaySummary?.amountBreakdown.WALLET_SETEL.amount ?? 0)}
                  />
                  <DescItem
                    labelClassName="sm:text-black"
                    valueClassName="text-right font-medium"
                    label="Total from pass-through"
                    value={calculateTotalPassThrough(todaySummary)}
                  />
                  <DescItem
                    labelClassName="sm:text-black"
                    valueClassName="text-right font-medium"
                    label="Total from Boost"
                    value={formatMoney(todaySummary?.amountBreakdown.BOOST.amount ?? 0)}
                  />
                </DescList>
              </CardContent>
            </Card>
          </div>
          <div className="mb-8">
            <Card isLoading={isLoading}>
              <CardHeading title="Operating account">
                <Button
                  onClick={() => setVisibleOperationModal(true)}
                  variant="outline"
                  minWidth="none"
                  leftIcon={<EditIcon />}
                  data-testid="adjust-operating-account">
                  EDIT
                </Button>
              </CardHeading>
              <CardContent>
                <DescList className="grid-cols-2">
                  <DescItem
                    valueClassName="text-right text-base font-medium"
                    labelClassName="sm:text-black font-medium"
                    label="Available balance"
                    value={formatMoney(platformAccounts?.operating?.availableBalance?.amount, 'RM')}
                  />
                </DescList>
                <DescList className="grid-cols-2 mt-5">
                  {data?.operatingCollectionAggregatesAccounts &&
                    data?.operatingCollectionAggregatesAccounts.map((item, index) => (
                      <DescItem
                        labelClassName="sm:text-black"
                        key={index}
                        valueClassName="text-right font-medium"
                        label={item.label}
                        value={formatMoney(item.details.availableBalance.amount)}
                      />
                    ))}
                </DescList>
              </CardContent>
            </Card>
          </div>
          {visibleCollectionModal && (
            <CashflowsModalAdjustCollection
              visible={true}
              onClose={() => setVisibleCollectionModal(false)}
            />
          )}
          {visibleTrustAccountModal && (
            <CashflowsModalAdjustTrustAccount
              visible={true}
              onClose={() => setVisibleTrustAccountModal(false)}
            />
          )}
          {visibleOperationModal && (
            <CashflowsModalAdjustOperation
              visible={true}
              onClose={() => setVisibleOperationModal(false)}
            />
          )}
          {visibleTransferOperationModal && (
            <CashflowsModalTransferToOperation
              visible={true}
              onClose={() => setVisibleTransferOperationModal(false)}
            />
          )}
        </>
      )}
    </PageContainer>
  );
};
