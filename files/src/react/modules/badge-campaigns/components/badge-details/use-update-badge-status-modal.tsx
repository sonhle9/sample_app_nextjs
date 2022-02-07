import {IBadge, IBadgeStatus} from 'src/react/modules/badge-campaigns/badge-campaigns.type';
import {useUpdateBadge} from 'src/react/modules/badge-campaigns/badge-campaigns.queries';
import {useConfirmModal, ConfirmProps} from './use-confirm-modal';

type ActionProps = Record<IBadgeStatus, ConfirmProps>;

const ACTION_PROPS: ActionProps = {
  DRAFT: {
    title: 'Are you sure you want to stop this badge?',
    description: 'This badge will be stopped.',
    confirmButton: {variant: 'error', text: 'stop'},
    successAlert: {
      variant: 'info',
      description: 'Badge has been stopped, relaunch to activate it again.',
    },
  },
  INACTIVE: {
    title: 'Are you sure you want to stop this badge?',
    description: 'This badge will be stopped.',
    confirmButton: {variant: 'error', text: 'stop'},
    successAlert: {
      variant: 'info',
      description: 'Badge has been stopped, relaunch to activate it again.',
    },
  },
  ACTIVE: {
    title: 'Are you sure you want to launch this badge?',
    description: 'This badge will be launched.',
    confirmButton: {variant: 'primary', text: 'confirm'},
    successAlert: {
      variant: 'success',
      description: 'Badges successfully launched.',
    },
  },
  ARCHIVED: {
    title: 'Are you sure you want to archive this badge?',
    description: 'This badge will be archived',
    confirmButton: {variant: 'error', text: 'archive'},
    successAlert: {
      variant: 'info',
      description: 'Badge has been archived, relaunch to activate it again.',
    },
  },
};

export function useUpdateBadgeStatusModal(badge: IBadge) {
  const {mutateAsync: updateBadge, isLoading} = useUpdateBadge({hideNetworkError: true});
  const confirmModal = useConfirmModal(isLoading);
  return {
    open: (status: IBadgeStatus) => {
      confirmModal.open({
        confirmProps: ACTION_PROPS[status],
        onConfirm: ({onSuccess, onError}) => {
          updateBadge({id: badge?.id, availabilityStatus: status}, {onSuccess, onError});
        },
      });
    },
    component: confirmModal.component,
  };
}
