import * as React from 'react';
import {CreditLimitOverrun} from '../../../merchants.type';

export const CreditLimitOverrunModal = (props: {
  merchantId: string;
  details?: CreditLimitOverrun;
  onDone: () => void;
}) => {
  return <>{props.merchantId}</>;
};
