import React from 'react';
import {ModalFooter, Modal, ModalHeader, Button} from '@setel/portal-ui';
import {PlanStatus} from 'src/react/modules/bnpl-plan-config/bnpl.enum';
import {useUpdateStatusBnplPlan} from 'src/react/modules/bnpl-plan-config/bnpl-plan.queries';

export const useDeactivateBnplPlanConfigModal = (planId: string) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const updateStatusBnplPlanMutation = useUpdateStatusBnplPlan();
  const isLoading = updateStatusBnplPlanMutation.isLoading;

  const handleDeactivateConfirm = () => {
    updateStatusBnplPlanMutation.mutate(
      {id: planId, data: PlanStatus.INACTIVE},
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return {
    open: () => setIsOpen(true),
    component: (
      <Modal size="small" isOpen={isOpen} aria-label="Deactivate plan" onDismiss={onClose}>
        <ModalHeader>Are you sure you want to deactivate this plan</ModalHeader>
        <ModalFooter className="text-right space-x-3">
          <Button onClick={onClose} isLoading={isLoading} variant="outline" minWidth="none">
            NO
          </Button>
          <Button
            onClick={handleDeactivateConfirm}
            isLoading={isLoading}
            disabled={isLoading}
            variant="error"
            minWidth="none">
            YES
          </Button>
        </ModalFooter>
      </Modal>
    ),
  };
};
