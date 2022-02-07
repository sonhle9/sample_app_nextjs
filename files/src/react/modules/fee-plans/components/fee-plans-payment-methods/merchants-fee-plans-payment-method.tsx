import * as React from 'react';
import {useFeePlanByMerchantId} from '../../fee-plans.queries';
import {IMerchantsFeePlansPaymentMethod} from '../../fee-plans.type';
import {FeePlanTypes} from '../../fee-plans.constant';
import {FeePlansPaymentMethods} from '.';

export const MerchantsFeePlansPaymentMethod = ({merchantId}: IMerchantsFeePlansPaymentMethod) => {
  const {data: feePlanByMerchantId} = useFeePlanByMerchantId(merchantId);

  if (!feePlanByMerchantId) {
    return null;
  }

  return (
    <FeePlansPaymentMethods
      feePlanId={feePlanByMerchantId.feePlanId}
      feePlanType={FeePlanTypes.CUSTOMIZED}
      merchantId={merchantId}
    />
  );
};
