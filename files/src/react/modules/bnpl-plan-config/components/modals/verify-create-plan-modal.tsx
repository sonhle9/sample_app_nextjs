import * as React from 'react';
import {Button, Indicator, Modal, ModalBody, ModalFooter} from '@setel/portal-ui';
import {useCreateBnplPlan} from 'src/react/modules/bnpl-plan-config/bnpl-plan.queries';
import {IPlan} from 'src/react/modules/bnpl-plan-config/bnpl.interface';

interface useVeryfiCreateBnplPlanModalProps {
  overLappingData: IPlan[];
  submitMethod: () => void;
}

export const useVeryfiCreateBnplPlanModal = ({
  overLappingData,
  submitMethod,
}: useVeryfiCreateBnplPlanModalProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const onClose = () => setIsOpen(false);

  const createBnplPlanMutation = useCreateBnplPlan();

  const isLoading = createBnplPlanMutation.isLoading;

  const handleSubmit = () => {
    submitMethod();
    setIsOpen(false);
  };

  return {
    open: () => setIsOpen(true),
    component: (
      <Modal
        size="small"
        header="Are you sure you want to create this plan?"
        isOpen={isOpen}
        onDismiss={onClose}
        aria-label="Create new plan"
        data-testid="create-new-plan">
        <ModalBody>
          <span>
            The following plan configuration's (minimum amount/ maximum amount/ effective date/
            expired date) are overlapping with the plan you wish to create, if you proceed, the
            following plan config will be deactivated:
          </span>

          <div className="pt-5">
            {overLappingData &&
              overLappingData.map((item, index) => (
                <div className="space-x-2" key={`plan_overlaping_${index + 1}`}>
                  <Indicator className="pu-h-2 pu-w-2 bg-black" />
                  <span>{item.name}</span>
                </div>
              ))}
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-end">
          <Button
            minWidth="none"
            onClick={onClose}
            variant="outline"
            className="mr-2"
            disabled={isLoading}>
            NO
          </Button>
          <Button
            minWidth="none"
            onClick={() => handleSubmit()}
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading}>
            YES
          </Button>
        </ModalFooter>
      </Modal>
    ),
  };
};
