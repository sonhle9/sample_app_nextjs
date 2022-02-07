import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  Button,
  Notification,
  useTransientState,
} from '@setel/portal-ui';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {useUnlinkCard} from '../../loyalty.queries';
import {Member} from '../../loyalty-members.type';

export type CardUnlinkResult = {
  message?: string;
  statusCode?: number;
};

export type LoyaltyCardUnlinkingModalProps = {
  isOpen: boolean;
  onDismiss: () => void;
  member?: Member;
  setUnlinkResult?: React.Dispatch<React.SetStateAction<CardUnlinkResult>>;
};

export const LoyaltyCardUnlinkingModal: React.VFC<LoyaltyCardUnlinkingModalProps> = ({
  isOpen,
  onDismiss,
  member,
  setUnlinkResult,
}) => {
  const cancelRef = React.useRef(null);

  const {mutateAsync: mutateUnlinkCard, isError, error, isLoading, reset} = useUnlinkCard();

  const [showNotification, setShowNotification] = useTransientState(false);

  const handleSubmit = async () => {
    const res = await mutateUnlinkCard(
      {
        userId: member?.userId,
        cardNumber: member?.cardNumber,
      },
      {onError: (err) => setUnlinkResult && setUnlinkResult(err)},
    );

    if (res) {
      setUnlinkResult && setUnlinkResult({message: 'Card unlinked', statusCode: 200});
      setShowNotification(true);
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    reset();
    onDismiss();
  };

  return (
    <>
      <Notification
        isShow={showNotification}
        variant="success"
        title="Successfully unlinked card from member"
      />
      {isOpen && (
        <Dialog onDismiss={handleDismiss} leastDestructiveRef={cancelRef}>
          <DialogContent
            header="Confirm unlinking card"
            aria-labelledby="unlink-card"
            data-testid="unlink-card-modal">
            <>
              {isError && (
                <div className="pb-4">
                  <QueryErrorAlert
                    error={(error as any) || null}
                    description="Error while unlinking card"
                  />
                </div>
              )}
              Do you want to proceed with unlinking this card?
            </>
          </DialogContent>
          <DialogFooter>
            <Button variant="outline" onClick={handleDismiss} ref={cancelRef}>
              CANCEL
            </Button>
            <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>
              CONFIRM
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
};
