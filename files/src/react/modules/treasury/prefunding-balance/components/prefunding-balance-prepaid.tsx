import {Button, Card, CardContent, formatMoney, PlusIcon} from '@setel/portal-ui';
import React, {useState} from 'react';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {useAggregatesBalances, useMerchantBalances} from '../prefunding-balance.query';
import {MerchantBalanceType} from '../shared/prefunding-balance.type';
import {PrefundingBalanceAdjustModal} from './common/prefunding-balance-adjust-modal';

export const PrefundingBalancePrepaid = () => {
  const [visibleAdjustmentModalPrepaid, setVisibleAdjustmentModalPrepaid] = useState(false);
  const [visibleAdjustmentModalAvailable, setVisibleAdjustmentModalAvailable] = useState(false);
  const {data: merchantBalances, isLoading, isError, error} = useMerchantBalances();
  const {data: bufferAccount} = useAggregatesBalances();
  const merchantBalanceAvailable = merchantBalances?.find(
    (balance) => balance.type === MerchantBalanceType.AVAILABLE,
  );
  const merchantBalancePrepaid = merchantBalances?.find(
    (balance) => balance.type === MerchantBalanceType.PREPAID,
  );
  return (
    <>
      {isError && <QueryErrorAlert error={error as any} />}
      {!isError && (
        <>
          <Card isLoading={isLoading} className="mb-8">
            <CardContent>
              <div className="flex items-center justify-between font-medium">
                <div>
                  <p className="text-lightgrey uppercase uppercase font-bold text-xs">
                    Available balance
                  </p>
                  <p className="text-2xl mt-2">
                    {formatMoney(merchantBalanceAvailable?.balance, 'RM')}
                  </p>
                </div>
                <div>
                  <Button
                    onClick={() => {
                      setVisibleAdjustmentModalAvailable(true);
                    }}
                    leftIcon={<PlusIcon />}
                    variant="primary">
                    ADD FUNDS FROM BUFFER
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card isLoading={isLoading} className="mb-8">
            <CardContent>
              <div className="flex items-center justify-between font-medium">
                <div>
                  <p className="text-lightgrey uppercase uppercase font-bold text-xs">
                    Prepaid balance
                  </p>
                  <p className="text-2xl mt-2">
                    {formatMoney(merchantBalancePrepaid?.balance, 'RM')}
                  </p>
                </div>
                <div>
                  <Button
                    onClick={() => {
                      setVisibleAdjustmentModalPrepaid(true);
                    }}
                    leftIcon={<PlusIcon />}
                    variant="primary">
                    TRANSFER AVAILABLE TO PREPAID
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          {visibleAdjustmentModalPrepaid && (
            <PrefundingBalanceAdjustModal
              adjustType={MerchantBalanceType.PREPAID}
              visible={true}
              onClose={() => setVisibleAdjustmentModalPrepaid(false)}
              maxDataBuffer={merchantBalanceAvailable?.balance}
            />
          )}
          {visibleAdjustmentModalAvailable && (
            <PrefundingBalanceAdjustModal
              adjustType={MerchantBalanceType.AVAILABLE}
              visible={true}
              onClose={() => setVisibleAdjustmentModalAvailable(false)}
              maxDataBuffer={bufferAccount?.availableBalance.amount}
            />
          )}
        </>
      )}
    </>
  );
};
