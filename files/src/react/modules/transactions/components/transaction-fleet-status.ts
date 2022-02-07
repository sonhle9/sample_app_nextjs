import {BadgeProps, IndicatorProps} from '@setel/portal-ui';
import {EStatus} from '../emum';

export const colorByStatusTimeline: Record<string, IndicatorProps['color']> = {
  [EStatus.CREATED]: 'brand',
  [EStatus.SUCCEEDED]: 'success',
  [EStatus.SETTLED]: 'success',
  [EStatus.PENDING]: 'lemon',
  [EStatus.UNPOSTED]: 'lemon',
  [EStatus.FAILED]: 'error',
  [EStatus.AUTHORISED]: 'blue',
  [EStatus.POSTED]: 'blue',
  [EStatus.VOIDED]: 'error',
  [EStatus.REFUNDED]: 'success',
};

export const colorByStatus: Record<string, BadgeProps['color']> = {
  [EStatus.SUCCEEDED]: 'success',
  [EStatus.SETTLED]: 'success',
  [EStatus.PENDING]: 'lemon',
  [EStatus.UNPOSTED]: 'lemon',
  [EStatus.FAILED]: 'error',
  [EStatus.AUTHORISED]: 'blue',
  [EStatus.POSTED]: 'blue',
  [EStatus.VOIDED]: 'grey',
  [EStatus.CREATED]: 'grey',
  [EStatus.VERIFIED]: 'blue',
  [EStatus.REFUNDED]: 'success',
};
