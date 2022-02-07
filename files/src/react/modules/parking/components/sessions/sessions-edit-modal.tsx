import * as React from 'react';
import {
  Notification,
  Modal,
  Button,
  DropdownSelectField,
  TextareaField,
  Dialog,
} from '@setel/portal-ui';
import {useNotification} from 'src/react/hooks/use-set-notification';
import {useVoidSession} from '../../parking.queries';
import {SessionData, SessionStatuses} from '../../parking.type';
import {EditSessionStatusesOptions} from '../../parking.const';
import {QueryErrorAlert} from '../../../../components/query-error-alert';

export type ParkingSessionEditProps = {
  session?: SessionData;
  isOpen: boolean;
  onDismiss: () => void;
};

export const EditSessionModal: React.FC<ParkingSessionEditProps> = ({
  session,
  isOpen,
  onDismiss,
}) => {
  const [status, setStatus] = React.useState(null);
  const [showDialog, setShowDialog] = React.useState(false);

  React.useEffect(() => {
    setStatus(session?.status);
  }, [session]);

  const handleDismiss = () => {
    setStatus(session?.status);
    setShowDialog(false);
    onDismiss();
  };

  return (
    <>
      <SessionVoidDialog
        isOpen={showDialog}
        id={session?.id}
        onDismiss={() => setShowDialog(false)}
        handleDismiss={handleDismiss}
      />
      <Modal
        header="Edit"
        aria-label="edit-session-modal"
        data-testid="edit-session-modal"
        isOpen={isOpen}
        onDismiss={handleDismiss}>
        <Modal.Body>
          <DropdownSelectField
            label="Status"
            layout="horizontal-responsive"
            className="w-48"
            options={EditSessionStatusesOptions}
            value={status}
            onChangeValue={(val) => setStatus(val as SessionStatuses)}
          />
          <TextareaField label="Remarks" layout="horizontal-responsive" disabled />
        </Modal.Body>
        <Modal.Footer>
          <div className="flex flex-grow justify-end">
            <Button variant="outline" className="mr-5" onClick={handleDismiss}>
              CANCEL
            </Button>
            <Button
              variant="primary"
              onClick={() => setShowDialog(true)}
              disabled={status !== SessionStatuses.VOIDED}>
              SAVE CHANGES
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

type SessionVoidDialog = {
  id: string;
  onDismiss: () => void;
  handleDismiss: () => void;
  isOpen: boolean;
};

const SessionVoidDialog: React.FC<SessionVoidDialog> = ({id, onDismiss, isOpen, handleDismiss}) => {
  const {notificationProps, setShowNotifications} = useNotification();
  const {mutateAsync: mutateVoidSession, isLoading, error, isError} = useVoidSession();

  const handleVoid = () => {
    mutateVoidSession(id, {
      onSuccess: () => {
        setShowNotifications({
          variant: 'success',
          title: 'Successfully voided session',
        });
        handleDismiss();
      },
      onError: () => {
        setShowNotifications({
          variant: 'error',
          title: 'Error while voiding the session',
        });
      },
    });
  };

  const cancelRef = React.useRef(null);

  return (
    <>
      <Notification {...notificationProps} />
      {isOpen && (
        <Dialog onDismiss={onDismiss} leastDestructiveRef={cancelRef}>
          <Dialog.Content
            header="Are you sure you want to void this parking session?"
            aria-labelledby="void-parking-session"
            data-testid="void-session-dialog">
            <>
              {isError && (
                <div className="pb-4">
                  <QueryErrorAlert
                    error={(error as any) || null}
                    description="Error while voiding session"
                  />
                </div>
              )}
              You are about to void this parking session. This action cannot be undone.
            </>
          </Dialog.Content>
          <Dialog.Footer>
            <Button variant="outline" onClick={onDismiss} ref={cancelRef}>
              CANCEL
            </Button>
            <Button variant="primary" onClick={handleVoid} isLoading={isLoading}>
              SUBMIT
            </Button>
          </Dialog.Footer>
        </Dialog>
      )}
    </>
  );
};
