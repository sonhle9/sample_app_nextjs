import * as React from 'react';
import * as RS from '@setel/portal-ui';
import {DealStatus as DealStatusEnum} from './deal.const';

export type DealStatusProps = {
  status: DealStatusEnum;
};

const ColorMap: Record<DealStatusEnum, RS.BadgeProps['color']> = {
  [DealStatusEnum.DRAFT]: 'grey',
  [DealStatusEnum.PENDING]: 'lemon',
  [DealStatusEnum.APPROVED]: 'info',
  [DealStatusEnum.REJECTED]: 'error',
  [DealStatusEnum.STOPPED]: 'error',
  [DealStatusEnum.ARCHIVED]: 'purple',
  [DealStatusEnum.LAUNCHED]: 'success',
};

export const DealStatus: React.VFC<DealStatusProps> = ({status}) => (
  <RS.Badge className="tracking-wider font-semibold" rounded="rounded" color={ColorMap[status]}>
    {status}
  </RS.Badge>
);
