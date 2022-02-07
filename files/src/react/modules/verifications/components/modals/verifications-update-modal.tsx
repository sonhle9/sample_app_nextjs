import {
  Button,
  FieldContainer,
  ModalBody,
  ModalFooter,
  Radio,
  TextareaField,
} from '@setel/portal-ui';
import * as React from 'react';
import {useNotification} from 'src/react/hooks/use-notification';
import {IVerification} from 'src/shared/interfaces/verifications.interface';
import {useUpdateVerifications} from '../../verifications.queries';
import {getMessageFromApiError} from '../../../../../shared/helpers/errorHandling';

export interface IVerificationsFormProps {
  currentVerifications?: IVerification;
  onSuccess: (result?: IVerification) => void;
  onCancel: () => void;
}

export const VerificationsUpdateModal = ({
  currentVerifications,
  onSuccess,
  onCancel,
}: IVerificationsFormProps) => {
  const {mutate: update, isLoading: isUpdating} = useUpdateVerifications(
    currentVerifications ? currentVerifications.id : '',
  );
  const [verStatus, setVerStatus] = React.useState(
    currentVerifications ? currentVerifications.verificationStatus : '',
  );
  const [remarks, setRemarks] = React.useState(
    currentVerifications ? currentVerifications.updateRemarks : '',
  );
  const setNotification = useNotification();

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        update(
          {
            verificationStatus: verStatus as 'APPROVED' | 'REJECTED',
            updateRemarks: remarks,
          },
          {
            onSuccess: () => {
              setNotification({
                title: 'Successful!',
                variant: 'success',
                description: 'Result is successfully updated.',
              });
              onSuccess();
            },
            onError: (error: any) => {
              setNotification({
                title: 'Error',
                variant: 'error',
                description: getMessageFromApiError(error),
              });
            },
          },
        );
      }}>
      <ModalBody>
        <FieldContainer
          layout={'horizontal-responsive'}
          label={'Verification status'}
          labelAlign={'start'}>
          <Radio
            name="applyLogo"
            value="Yes"
            onChangeValue={() => setVerStatus('APPROVED')}
            checked={verStatus === 'APPROVED'}>
            Approved
          </Radio>
          <Radio
            name="applyLogo"
            value="No"
            onChangeValue={() => setVerStatus('REJECTED')}
            checked={verStatus === 'REJECTED'}>
            Reject
          </Radio>
        </FieldContainer>
        <TextareaField onChangeValue={setRemarks} label="Remarks" layout="horizontal" />
      </ModalBody>
      <ModalFooter className="text-right space-x-2">
        <Button onClick={onCancel} variant="outline">
          CANCEL
        </Button>
        <Button
          disabled={!currentVerifications || verStatus === currentVerifications.verificationStatus}
          isLoading={isUpdating}
          type="submit"
          variant="primary">
          SAVE
        </Button>
      </ModalFooter>
    </form>
  );
};
