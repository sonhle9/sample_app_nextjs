import {BadgeProps} from '@setel/portal-ui';
import {BatchStatus, ForceCloseRequestType} from '../terminal-switch-batches.type';

export const BatchStatusColorMapping: Record<BatchStatus, BadgeProps['color']> = {
  [BatchStatus.CLOSED]: 'success',
  [BatchStatus.OPEN]: 'grey',
  [BatchStatus.ACQUIRER_PROCESSING]: 'lemon',
  [BatchStatus.BATCH_UPLOADING]: 'turquoise',
  [BatchStatus.FAILED]: 'error',
  [BatchStatus.NEED_BATCH_UPLOAD]: 'purple',
};

export const FORCE_CLOSE_MODAL_TITLE: Record<ForceCloseRequestType, string> = {
  approve: 'Approve force close batch',
  reject: 'Reject force close batch',
  request: 'Force close batch',
};

export const FORCE_CLOSE_DIALOG: Record<
  ForceCloseRequestType,
  {header: string; content: string; confirmLabel: string}
> = {
  approve: {
    header: 'Are you sure you want to approve this request?',
    content: 'This batch will be sent to host for settlement.',
    confirmLabel: 'PROCEED',
  },

  reject: {
    header: 'Are you sure you want to reject this request?',
    content: 'This batch status will be changed to closed.',
    confirmLabel: 'CONFIRM',
  },

  request: {
    header: 'Are you sure you want to force close this transaction batch?',
    content: 'This request will be sent for approval before proceeding to host for settlement.',
    confirmLabel: 'PROCEED',
  },
};
