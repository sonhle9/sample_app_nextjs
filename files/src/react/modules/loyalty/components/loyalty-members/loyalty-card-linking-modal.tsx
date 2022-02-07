import * as React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Dialog,
  DialogContent,
  DialogFooter,
  FieldContainer,
  Radio,
  RadioGroup,
  Button,
  TextField,
  Notification,
  useTransientState,
} from '@setel/portal-ui';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {useGetUnlinkHistory} from '../../loyalty-members.queries';
import {useIssueCardByUserId, useLinkToPhysicalCard} from '../../loyalty.queries';
import {useGetLoyaltyMembersByCardNumber} from '../../loyalty.queries';
import {isValidMesra} from 'src/shared/helpers/check-valid-id';

export enum LinkCardOptions {
  VIRTUAL = 'virtual',
  PHYSICAL = 'physical',
}

export type LoyaltyCardLinkingModalProps = {
  isOpen: boolean;
  onDismiss: () => void;
  userId?: string;
};

export const LoyaltyCardLinkingModal: React.VFC<LoyaltyCardLinkingModalProps> = ({
  isOpen,
  onDismiss,
  userId,
}) => {
  const [value, setValue] = React.useState<LinkCardOptions | string>('');
  const [cardNumber, setCardNumber] = React.useState<string | string>('');
  const [showNotification, setShowNotification] = useTransientState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = React.useState<boolean>(false);
  const {data: unlinkHistory} = useGetUnlinkHistory({userId}, {enabled: isOpen});
  const {
    data: memberByCardNumber,
    isSuccess,
    isLoading,
  } = useGetLoyaltyMembersByCardNumber(cardNumber, {
    enabled: isValidMesra(cardNumber),
  });
  const isExisting = React.useMemo(() => {
    if (unlinkHistory?.data?.length) {
      return true;
    }
    return false;
  }, [unlinkHistory]);
  const availableCardNumber = React.useMemo(() => {
    return isSuccess && memberByCardNumber?.data?.length === 0;
  }, [memberByCardNumber]);
  const isDisabled = React.useMemo(() => {
    if (value === LinkCardOptions.VIRTUAL) {
      return false;
    }

    if (value === LinkCardOptions.PHYSICAL && isValidMesra(cardNumber) && availableCardNumber) {
      return false;
    }

    return true;
  }, [value, cardNumber, availableCardNumber]);

  const handleReset = () => {
    setValue('');
    setCardNumber('');
  };

  const handleConfirmation = () => {
    setShowNotification(true);
    handleDismiss();
  };

  const handleDismiss = () => {
    handleReset();
    setIsOpenConfirmModal(false);
    onDismiss();
  };

  return (
    <>
      <Notification
        isShow={showNotification}
        variant="success"
        title="Successfully linked card to member"
      />
      <LoyaltyCardConfirmModal
        isOpen={isOpenConfirmModal}
        onDismiss={() => setIsOpenConfirmModal(false)}
        option={value as LinkCardOptions}
        onSuccess={handleConfirmation}
        cardNumber={cardNumber}
        isExisting={isExisting}
        userId={userId}
      />
      <Modal
        isOpen={isOpen}
        onDismiss={handleDismiss}
        data-testid="linkModal"
        aria-label="linking-card">
        <ModalHeader>Link a card</ModalHeader>
        <ModalBody>
          <FieldContainer label="Loyalty card" layout="horizontal-responsive" labelAlign="start">
            <RadioGroup
              value={value}
              onChangeValue={(val) => setValue(val as LinkCardOptions)}
              name="loyalty-card">
              <Radio value={LinkCardOptions.VIRTUAL}>New virtual card</Radio>
              <Radio value={LinkCardOptions.PHYSICAL}>Link to physical card</Radio>
            </RadioGroup>
          </FieldContainer>
          {value === LinkCardOptions.PHYSICAL && (
            <FieldContainer
              label="Card number"
              layout="horizontal-responsive"
              labelAlign="start"
              className="-mb-5">
              <TextField
                value={cardNumber}
                className="w-72"
                placeholder="Insert card number"
                onChangeValue={setCardNumber}
                status={
                  cardNumber && (!isValidMesra(cardNumber) || !availableCardNumber) ? 'error' : null
                }
                helpText={
                  cardNumber && !isValidMesra(cardNumber)
                    ? 'Insert a valid Mesra card number'
                    : isValidMesra(cardNumber) && !availableCardNumber
                    ? 'This card is already linked to another member'
                    : null
                }
              />
            </FieldContainer>
          )}
        </ModalBody>
        <ModalFooter className="text-right">
          <Button variant="outline" className="mr-5" onClick={handleDismiss}>
            CANCEL
          </Button>
          <Button
            variant="primary"
            disabled={isDisabled}
            isLoading={isLoading}
            onClick={() => setIsOpenConfirmModal(true)}>
            SAVE
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export type LoyaltyCardConfirmModalProps = {
  isOpen: boolean;
  onDismiss: () => void;
  option: LinkCardOptions;
  isExisting?: boolean;
  onSuccess: () => void;
  cardNumber?: string;
  userId?: string;
};

export const LoyaltyCardConfirmModal: React.VFC<LoyaltyCardConfirmModalProps> = ({
  isOpen,
  onDismiss,
  option,
  isExisting,
  onSuccess,
  cardNumber,
  userId,
}) => {
  const cancelRef = React.useRef(null);

  const {
    mutateAsync: mutateIssueCard,
    isError: issueIsError,
    error: issueError,
    reset: resetIssue,
  } = useIssueCardByUserId();
  const {
    mutateAsync: mutateLinkCard,
    isError: linkIsError,
    error: linkError,
    reset: resetLink,
  } = useLinkToPhysicalCard();

  const handleSubmission = async () => {
    if (option === LinkCardOptions.VIRTUAL) {
      const res = await mutateIssueCard(userId);
      if (res) {
        onSuccess();
      }
    } else {
      const res = await mutateLinkCard({userId, cardNumber});
      if (res) {
        onSuccess();
      }
    }
  };

  const handleDismiss = () => {
    resetIssue();
    resetLink();
    onDismiss();
  };

  return (
    isOpen && (
      <Dialog
        onDismiss={handleDismiss}
        leastDestructiveRef={cancelRef}
        data-testid="confirm-link-modal">
        <DialogContent
          header={
            option === LinkCardOptions.VIRTUAL
              ? 'Confirm granting a new virtual card'
              : 'Confirm linking with a physical card'
          }
          aria-labelledby="issueOrLinkCard">
          <>
            {(issueIsError || linkIsError) && (
              <div className="pb-4">
                <QueryErrorAlert
                  error={(issueError as any) || (linkError as any) || null}
                  description={
                    issueIsError ? 'Error while issuing card' : 'Error while linking card'
                  }
                />
              </div>
            )}

            {option === LinkCardOptions.VIRTUAL
              ? 'Do you want to proceed with granting member with a new virtual card'
              : isExisting
              ? 'Replacement fee of 150 points will be deducted in order to process your linking process.'
              : `Do you want to proceed with linking member with card number ${cardNumber}`}
          </>
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={handleDismiss} ref={cancelRef}>
            CANCEL
          </Button>
          <Button variant="primary" onClick={handleSubmission}>
            CONFIRM
          </Button>
        </DialogFooter>
      </Dialog>
    )
  );
};
