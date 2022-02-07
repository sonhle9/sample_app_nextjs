import React from 'react';
import {ModalFooter, Modal, ModalHeader, Button} from '@setel/portal-ui';
import {IPlan} from 'src/react/modules/bnpl-plan-config/bnpl.interface';
import {PlanStatus} from 'src/react/modules/bnpl-plan-config/bnpl.enum';
import {useVeryfiCreateBnplPlanModal} from './verify-create-plan-modal';
import {
  useGetPlanOverlaping,
  useUpdateStatusBnplPlan,
} from 'src/react/modules/bnpl-plan-config/bnpl-plan.queries';

export const useActiveBnplPlanConfigModal = (data: IPlan) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const [overLappingData, setOverLappingData] = React.useState<IPlan[]>(null);
  const updateStatusBnplPlanMutation = useUpdateStatusBnplPlan();
  const isLoading = updateStatusBnplPlanMutation.isLoading;

  const onConfirmDeactiveOverlapping = () => {
    updateStatusBnplPlanMutation.mutate(
      {id: data.id, data: PlanStatus.ACTIVE},
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const veryfiCreateBnplPlanModal = useVeryfiCreateBnplPlanModal({
    overLappingData,
    submitMethod: onConfirmDeactiveOverlapping,
  });

  const getOverlapingMutation = useGetPlanOverlaping();

  const handleActivateConfirm = () => {
    getOverlapingMutation.mutate(
      {
        minAmount: Number(data.minAmount),
        maxAmount: Number(data.maxAmount),
        effectiveDate: data.effectiveDate,
        expiredDate: data.expiredDate,
      },
      {
        onSuccess: (res) => {
          if (res.items.length > 0) {
            setOverLappingData(res.items);
            veryfiCreateBnplPlanModal.open();
          } else {
            onConfirmDeactiveOverlapping();
          }
        },
      },
    );
  };

  return {
    open: () => setIsOpen(true),
    component: (
      <>
        <Modal size="small" isOpen={isOpen} aria-label="Activate plan" onDismiss={onClose}>
          <ModalHeader>Are you sure you want to activate this plan</ModalHeader>
          <ModalFooter className="text-right space-x-3">
            <Button onClick={onClose} disabled={isLoading} variant="outline" minWidth="none">
              NO
            </Button>
            <Button
              onClick={handleActivateConfirm}
              disabled={isLoading}
              isLoading={isLoading}
              variant="error"
              minWidth="none">
              YES
            </Button>
          </ModalFooter>
        </Modal>
        {veryfiCreateBnplPlanModal.component}
      </>
    ),
  };
};
