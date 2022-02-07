import * as React from 'react';
import {Button, Modal, TextField} from '@setel/portal-ui';
import {useCreateFeePlan} from '../../fee-plans.queries';
import {useRouter} from 'src/react/routing/routing.context';
import {useNotification} from 'src/react/hooks/use-notification';
import {FeePlansNotificationMessages} from '../../fee-plans.constant';

export const FeePlansModalCreate = ({setShowModal}: {setShowModal: Function}) => {
  const showMessage = useNotification();
  const [name, setName] = React.useState('');
  const {mutateAsync: createFeePlan, isLoading, error} = useCreateFeePlan();
  const router = useRouter();
  const handleSave = async () => {
    const feePlan = await createFeePlan({name});

    showMessage({
      title: FeePlansNotificationMessages.successTitle,
      description: FeePlansNotificationMessages.createdFeePlan,
    });
    router.navigateByUrl(`pricing/fee-plans/${feePlan.id}`);
  };

  return (
    <Modal
      header="Create new plan"
      isOpen={true}
      onDismiss={() => setShowModal(false)}
      aria-label="Create new plan"
      data-testid="create-new-plan">
      <Modal.Body>
        <TextField
          label="Fee plan"
          value={name}
          onChangeValue={setName}
          status={error ? 'error' : undefined}
          helpText={buildDuplicatedFeePlanError(error as any)}
          layout="horizontal-responsive"
          className="lg:w-1/2"
          maxLength={20}
          placeholder="Enter fee plan name"
        />
      </Modal.Body>
      <Modal.Footer className="flex justify-end">
        <Button onClick={() => setShowModal(false)} variant="outline" className="mr-2">
          CANCEL
        </Button>
        <Button
          onClick={handleSave}
          variant="primary"
          isLoading={isLoading}
          disabled={!name.trim()}>
          SAVE
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const buildDuplicatedFeePlanError = (error) => {
  return error?.response?.status === 400 ? error.response?.data?.message : undefined;
};
