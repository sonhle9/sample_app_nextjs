import * as React from 'react';
import * as RS from '@setel/portal-ui';
import {DealOrderStatus as DealOrderStatusEnum} from './dealOrder.type';

export type DealStatusProps = {
  status: DealOrderStatusEnum;
};

const ColorMap: Record<DealOrderStatusEnum, RS.BadgeProps['color']> = {
  [DealOrderStatusEnum.PROCESSING]: 'warning',
  [DealOrderStatusEnum.PURCHASE_FAILED]: 'error',
  [DealOrderStatusEnum.NOT_CLAIMED]: 'success',
  [DealOrderStatusEnum.CAPTURE_FAILED]: 'error',
  [DealOrderStatusEnum.CLAIMED]: 'grey',
  [DealOrderStatusEnum.VOIDED]: 'grey',
};

export const DealOrderStatus: React.VFC<DealStatusProps> = ({status}) => {
  return (
    <RS.Badge rounded="rounded" color={ColorMap[status]}>
      {status.replace('_', ' ')}
    </RS.Badge>
  );
};
