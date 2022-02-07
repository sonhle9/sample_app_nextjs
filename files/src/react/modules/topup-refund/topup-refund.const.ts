import {BadgeProps} from '@setel/portal-ui';
import {TransactionStatus} from 'src/shared/enums/wallet.enum';

export const topupRefundStatusColor: Record<TransactionStatus, BadgeProps['color']> = {
  [TransactionStatus.CREATED]: 'grey',
  [TransactionStatus.CANCELLED]: 'grey',
  [TransactionStatus.EXPIRED]: 'error',
  [TransactionStatus.FAILED]: 'error',
  [TransactionStatus.PROCESSING]: 'lemon',
  [TransactionStatus.REFUNDED]: 'info',
  [TransactionStatus.SUCCEEDED]: 'success',
};
