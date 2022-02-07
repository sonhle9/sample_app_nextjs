import {Button, Dialog, TextInput} from '@setel/portal-ui';
import React from 'react';
import {IUpdateDeviceBody} from 'src/react/services/api-accounts.service';
import {useAuth} from '../../../auth';
import {useDeleteDevice, useUpdateDevice} from '../../customers.queries';
import {IUpdateDeviceData} from '../../customers.type';

interface IUpdateDeviceModal {
  isOpen: boolean;
  deviceData: IUpdateDeviceData;
  onClose?: () => void;
}

interface IDeleteDeviceModal {
  id: string;
  isOpen: boolean;
  deviceId: string;
  onClose?: () => void;
}
export function UpdateDeviceModal(props: IUpdateDeviceModal) {
  const cancelRef = React.useRef(null);
  const {session} = useAuth();

  const [remark, setRemark] = React.useState('');

  const updateDeviceBody: IUpdateDeviceBody = {
    adminUsername: session?.sub,
    isBlocked: !props.deviceData?.isBlocked,
    remark: remark,
  };
  const handleDismiss = () => {
    props.onClose();
    setRemark('');
    //reset mutation
  };
  const {
    mutate: mutateDeviceStatus,
    isLoading: isUpdateDeviceLoading,
    // isError: isUpdateDeviceError,
    // error: updateDeviceError,
  } = useUpdateDevice();

  return (
    <>
      {props.isOpen && (
        <Dialog onDismiss={handleDismiss} leastDestructiveRef={cancelRef}>
          <Dialog.Content
            header={
              props.deviceData?.isBlocked
                ? 'Are you sure you want to reactivate this device?'
                : 'Are you sure you want to blacklist this device?'
            }>
            <div className="mb-2">{props.deviceData?.deviceId}</div>
            {!props.deviceData?.isBlocked && (
              <TextInput
                value={remark}
                onChange={(e) => {
                  setRemark(e.target.value);
                }}
                placeholder="Remark"
              />
            )}
          </Dialog.Content>
          <Dialog.Footer>
            <Button variant="outline" onClick={handleDismiss} ref={cancelRef}>
              CANCEL
            </Button>
            <Button
              variant={props.deviceData?.isBlocked ? 'primary' : 'error'}
              isLoading={isUpdateDeviceLoading}
              disabled={!(remark || props.deviceData?.isBlocked)} // isblocked= true, only able to Reactivate it, which not require remark, disable will always false
              onClick={() =>
                mutateDeviceStatus(
                  {deviceId: props.deviceData.deviceId, updateDeviceBody},
                  {onSuccess: handleDismiss},
                )
              }>
              CONFIRM
            </Button>
          </Dialog.Footer>
        </Dialog>
      )}
    </>
  );
}

export function DeleteDeviceModal(props: IDeleteDeviceModal) {
  const cancelRef = React.useRef(null);
  const {session} = useAuth();

  const handleDismiss = () => {
    props.onClose();
    //reset mutation
  };
  const {
    mutate: deleteDevice,
    isLoading: isDeleteDeviceLoading,
    // isError: isUpdateDeviceError,
    // error: updateDeviceError,
  } = useDeleteDevice();

  return (
    <>
      {props.isOpen && (
        <Dialog onDismiss={handleDismiss} leastDestructiveRef={cancelRef}>
          <Dialog.Content header="Are you sure you want to unlink the following device?">
            <div className="mb-2">{props.deviceId}</div>
          </Dialog.Content>
          <Dialog.Footer>
            <Button variant="outline" onClick={handleDismiss} ref={cancelRef}>
              CANCEL
            </Button>
            <Button
              variant="error"
              isLoading={isDeleteDeviceLoading}
              onClick={() =>
                deleteDevice(
                  {deviceId: props.id, adminUsername: session?.sub},
                  {onSuccess: handleDismiss},
                )
              }>
              CONFIRM
            </Button>
          </Dialog.Footer>
        </Dialog>
      )}
    </>
  );
}
