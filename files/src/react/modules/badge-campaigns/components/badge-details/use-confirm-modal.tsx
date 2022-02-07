import * as React from 'react';
import {Alert, Button, Modal, Text, classes, useTransientState} from '@setel/portal-ui';
import {AxiosError} from 'axios';

type AlertProps = {
  variant: React.ComponentProps<typeof Alert>['variant'];
  description: string;
};

export type ConfirmProps = {
  title: string;
  description: string;
  confirmButton: {
    variant: React.ComponentProps<typeof Button>['variant'];
    text: string;
  };
  successAlert: AlertProps;
  errorAlert?: AlertProps;
};

type ModalProps = {
  isOpen: boolean;
  confirmProps: ConfirmProps;
  onConfirm: ({
    onSuccess,
    onError,
  }: {
    onSuccess: () => void;
    onError?: (error: AxiosError) => void;
  }) => void;
};

export function useConfirmModal(isLoading: boolean) {
  const initialProps: ModalProps = {isOpen: false, confirmProps: undefined, onConfirm: () => {}};
  const [modalProps, setModalProps] = React.useState(initialProps);
  const {isOpen, onConfirm, confirmProps: action} = modalProps;
  const onClose = () => setModalProps(initialProps);

  const [alertProps, setAlertProps] = useTransientState<AlertProps>(
    {variant: undefined, description: undefined},
    8000,
  );

  return {
    open: (props: Pick<ModalProps, 'confirmProps' | 'onConfirm'>) => {
      setModalProps({...props, isOpen: true});
    },
    component: (
      <>
        {isOpen && (
          <Modal
            isOpen={isOpen}
            onDismiss={onClose}
            aria-label="Edit badge status"
            showCloseBtn={false}
            size="small">
            <Modal.Body>
              <Text className={`${classes.h2} mt-3`}>{action?.title}</Text>
              <Text className="mt-4">{action?.description}</Text>
            </Modal.Body>
            <Modal.Footer className="text-right">
              <Button
                variant="outline"
                disabled={isLoading}
                className="uppercase mr-3"
                onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant={action?.confirmButton.variant}
                className="uppercase"
                isLoading={isLoading}
                disabled={isLoading}
                onClick={() => {
                  onConfirm({
                    onSuccess: () => {
                      onClose();
                      setAlertProps(action?.successAlert);
                    },
                    onError: (error) => {
                      onClose();
                      setAlertProps(
                        error.response?.status === 400 && error.response?.data
                          ? {
                              variant: 'error',
                              description: error.response.data.message,
                            }
                          : action?.errorAlert,
                      );
                    },
                  });
                }}>
                {action?.confirmButton.text}
              </Button>
            </Modal.Footer>
          </Modal>
        )}
        {alertProps.description && (
          <Alert
            variant={alertProps.variant}
            description={alertProps.description}
            className="mb-4"
          />
        )}
      </>
    ),
  };
}
