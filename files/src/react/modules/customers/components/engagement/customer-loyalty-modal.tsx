import {useNotification} from 'src/react/hooks/use-notification';
import * as React from 'react';
import {
  useAddUserloyaltyCard,
  useDeleteUserLoyaltyCard,
  useManualGrantLoyaltyPoints,
  useUpdateUserLoyaltyCard,
} from '../../customers.queries';
import {
  Button,
  DaySelector,
  DecimalInput,
  Dialog,
  DropdownSelectField,
  FieldContainer,
  Modal,
  TextField,
  TimeInput,
} from '@setel/portal-ui';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {LoyaltyCardStatusesEnum} from 'src/shared/enums/loyalty.enum';
import {LoyaltyManualGrantPointsParams} from 'src/react/modules/loyalty/loyalty.type';
import {maskCardNumber} from '../../customers.helper';
import {IUpdateLoyaltyCardInput} from 'src/shared/interfaces/loyaltyCard.interface';

export function GrantLoyaltyPointsModal({
  userId,
  isOpen,
  dismiss,
}: {
  userId: string;
  dismiss: () => void;
  isOpen: boolean;
}) {
  const {mutate: grantPoints, isLoading: isGrantingPoints, error} = useManualGrantLoyaltyPoints();
  const [formInputs, setFormInputs] = React.useState<GrantPointsInputs>({
    transactionDateTime: new Date(),
    grandTotal: undefined,
  });

  const isValidForm = !!formInputs.grandTotal;
  const showMessage = useNotification();

  function handleSubmit() {
    if (!isValidForm) {
      return;
    }

    grantPoints(
      {userId, ...formInputs},
      {
        onSuccess: () => {
          showMessage({
            title: `Successful!`,
            variant: 'success',
            description: 'Loyalty points was successfully granted.',
          });
          dismiss();
        },
        onError: (err: any) => {
          const response = err.response && err.response.data;
          showMessage({
            title: `Grant points failed`,
            variant: 'error',
            description: response?.message || err.message,
          });
          dismiss();
        },
      },
    );
  }

  return (
    <Modal isOpen={isOpen} onDismiss={dismiss} header="Grant points">
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          handleSubmit();
        }}>
        <Modal.Body>
          {error && <QueryErrorAlert className="my-2" error={error as any} />}
          <FieldContainer layout="horizontal-responsive" label="Points">
            <DecimalInput
              data-testid="grant-point-input-points"
              decimalPlaces={0}
              className="w-60"
              value={'' + formInputs.grandTotal}
              onChangeValue={(value) => setFormInputs((prev) => ({...prev, grandTotal: +value}))}
            />
          </FieldContainer>
          <FieldContainer layout="horizontal-responsive" label="Transaction date and time">
            <div className="inline-flex space-x-2">
              <DaySelector
                value={formInputs.transactionDateTime}
                onChangeValue={(date) => {
                  setFormInputs((prev) => ({...prev, transactionDateTime: date}));
                }}
              />
              <TimeInput
                hours={formInputs.transactionDateTime.getHours()}
                minutes={formInputs.transactionDateTime.getMinutes()}
                onChangeValue={({hours, minutes}) => {
                  setFormInputs((prev) => ({
                    ...prev,
                    transactionDateTime: new Date(
                      prev.transactionDateTime.setHours(hours, minutes),
                    ),
                  }));
                }}
              />
            </div>
          </FieldContainer>
          <TextField
            label="Transaction ID (Optional)"
            layout="horizontal-responsive"
            className="w-60"
            value={formInputs.transactionId}
            onChangeValue={(value) => setFormInputs((prev) => ({...prev, transactionId: value}))}
          />
          <TextField
            label="Reference ID (Optional)"
            layout="horizontal-responsive"
            className="w-60"
            value={formInputs.referenceId}
            onChangeValue={(value) => setFormInputs((prev) => ({...prev, referenceId: value}))}
          />
        </Modal.Body>
        <Modal.Footer className="text-right">
          <Button variant="outline" className="mr-2" onClick={dismiss}>
            CANCEL
          </Button>
          <Button
            variant="primary"
            disabled={!isValidForm}
            isLoading={isGrantingPoints}
            type="submit">
            SAVE CHANGES
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export function UpdateLoyaltyCardModal({
  cardNumber,
  userId,
  currentCardStatus,
  isOpen,
  dismiss,
  inputFreezeReason,
}: {
  cardNumber: string;
  userId: string;
  currentCardStatus: string;
  isOpen: boolean;
  dismiss: () => void;
  inputFreezeReason?: string;
}) {
  const {mutate: updateLoyaltyCard, error, isLoading} = useUpdateUserLoyaltyCard();
  const [currentCardStatusText, setCurrentCardStatusText] = React.useState<string>(
    transformLoyaltyCard[currentCardStatus] || CARD_STATUS_TEXT.active,
  );
  const [freezeReason, setFreezeReason] = React.useState(
    FREEZE_REASON_TEXT[inputFreezeReason] || FREEZE_REASON_TEXT.suspectedFraud,
  );

  const showMessage = useNotification();

  function handleSubmit() {
    let body: IUpdateLoyaltyCardInput = {};
    switch (currentCardStatusText) {
      case CARD_STATUS_TEXT.frozen:
        body = {
          freezeReason: FREEZE_REASON[freezeReason],
          overriddenToFrozen: true,
          overriddenToTemporarilyFrozen: false,
        };

        break;

      case CARD_STATUS_TEXT.temporarilyFrozen:
        body = {
          overriddenToFrozen: false,
          overriddenToTemporarilyFrozen: true,
        };
        break;

      default:
        body = {
          overriddenToFrozen: false,
          overriddenToTemporarilyFrozen: false,
        };
    }

    updateLoyaltyCard(
      {userId, cardNumber, body},
      {
        onSuccess: () => {
          showMessage({
            title: `Successful!`,
            variant: 'success',
            description: 'Card updated',
          });
          dismiss();
        },
        onError: (err: any) => {
          const response = err.response && err.response.data;
          showMessage({
            title: `Update Loyalty Card failed`,
            variant: 'error',
            description: response?.message || err.message,
          });
          dismiss();
        },
      },
    );
  }

  return (
    <>
      <Modal isOpen={isOpen} onDismiss={dismiss} header="Update loyalty card">
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            handleSubmit();
          }}>
          <Modal.Body>
            {error && <QueryErrorAlert className="my-2" error={error as any} />}
            <TextField
              label="Card number"
              layout="horizontal-responsive"
              className="w-60"
              disabled={true}
              value={maskCardNumber(cardNumber)}
            />
            <DropdownSelectField
              layout="horizontal-responsive"
              onChangeValue={(value) => setCurrentCardStatusText(value)}
              options={CARD_STATUS_TEXT_OPTIONS}
              value={currentCardStatusText}
              label="Status"
            />
            {currentCardStatusText === CARD_STATUS_TEXT.frozen && (
              <DropdownSelectField
                layout="horizontal-responsive"
                onChangeValue={(value) => setFreezeReason(value)}
                options={FREEZE_REASON_TEXT_OPTIONS}
                value={freezeReason}
                label="Freeze Reason"
              />
            )}
          </Modal.Body>
          <Modal.Footer className="text-right">
            <Button variant="outline" className="mr-2" onClick={dismiss}>
              CANCEL
            </Button>
            <Button variant="primary" isLoading={isLoading} type="submit">
              SAVE CHANGES
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

export function UnlinkLoyaltyCardModal({
  userId,
  isOpen,
  dismiss,
  cardNumber,
  customerName,
}: {
  userId: string;
  isOpen: boolean;
  dismiss: () => void;
  cardNumber: string;
  customerName: string;
}) {
  const cancelBtnRef = React.useRef<HTMLButtonElement>(null);
  const {mutate: unlinkCard, isLoading: unlinkingCard, error} = useDeleteUserLoyaltyCard();
  const showMessage = useNotification();

  return (
    <Dialog isOpen={isOpen} onDismiss={dismiss} leastDestructiveRef={cancelBtnRef}>
      <Dialog.Content header="Unlink loyalty card">
        {error && <QueryErrorAlert className="my-2" error={error as any} />}
        Are you sure you want to unlink the following loyalty card from {customerName} ?
      </Dialog.Content>
      <Dialog.Footer>
        <Button ref={cancelBtnRef} variant="outline" className="mr-2" onClick={dismiss}>
          CANCEL
        </Button>
        <Button
          variant="error"
          isLoading={unlinkingCard}
          onClick={() =>
            unlinkCard(
              {userId, cardNumber},
              {
                onSuccess: () => {
                  showMessage({
                    description: 'Card unlinked!',
                    variant: 'success',
                    title: 'Success',
                  });
                  dismiss();
                },
                onError: (err: any) => {
                  const response = err.response && err.response.data;
                  showMessage({
                    title: `Unlink Loyalty Card failed`,
                    variant: 'error',
                    description: response?.message || err.message,
                  });
                  dismiss();
                },
              },
            )
          }>
          DELETE
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}

export function AddLoyaltyCardModal({
  userId,
  isOpen,
  dismiss,
}: {
  userId: string;
  isOpen: boolean;
  dismiss: () => void;
}) {
  const [inputCardNumber, setInputCardNumber] = React.useState('');
  const [errorText, setErrorText] = React.useState('');
  const {mutate: addLoyaltyCard, isLoading, error} = useAddUserloyaltyCard();
  const showMessage = useNotification();

  function onCardNumberChange(value: string) {
    /*
      did not set maxLength in input to allow user to use paste card number in clipboard
      eg:  mesra card number with spaces in between
    */
    setErrorText('');
    value = value.replace(/\s/g, '');

    if (value.length > 17) {
      setErrorText('Card number must be 17 characters long');
    }
    if (!/^[0-9]*$/.test(value)) {
      setErrorText('Card number must be numeric');
    }

    setInputCardNumber(value);
  }

  function handleSubmit() {
    /**
     * must be 17 letter
     * must be numeric - but can do validation onChange
     */

    if (inputCardNumber.length !== 17) {
      setErrorText('Card number must be 17 characters long');
      return;
    }

    setErrorText('');

    addLoyaltyCard(
      {userId, cardNumber: inputCardNumber},
      {
        onSuccess: () => {
          showMessage({
            description: 'Loyalty card added!',
            variant: 'success',
            title: 'Success',
          });
          dismiss();
        },
        onError: (err: any) => {
          const response = err.response && err.response.data;
          showMessage({
            title: `Add loyalty card failed`,
            variant: 'error',
            description: response?.message || err.message,
          });
          dismiss();
        },
      },
    );
  }

  return (
    <>
      <Modal isOpen={isOpen} onDismiss={dismiss} header="Add loyalty card">
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            handleSubmit();
          }}>
          <Modal.Body>
            {error && <QueryErrorAlert className="my-2" error={error as any} />}
            <TextField
              label="Card number"
              layout="horizontal-responsive"
              className="w-60"
              data-testid="add-card-input"
              value={inputCardNumber}
              helpText={errorText}
              status={errorText ? 'error' : undefined}
              onChangeValue={(value) => onCardNumberChange(value)}
            />
          </Modal.Body>
          <Modal.Footer className="text-right">
            <Button variant="outline" className="mr-2" onClick={dismiss}>
              CANCEL
            </Button>
            <Button
              variant="primary"
              isLoading={isLoading}
              type="submit"
              data-testid="add-modal-save-button">
              SAVE CHANGES
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

const CARD_STATUS_TEXT = {
  active: 'Active or Issued',
  frozen: 'Frozen',
  temporarilyFrozen: 'Temporarily Frozen',
} as const;

const CARD_STATUS_TEXT_OPTIONS = Object.values(CARD_STATUS_TEXT);

const FREEZE_REASON_TEXT = {
  cardClosed: 'Card is closed',
  customerContactVendor: 'Need to contact vendor',
  suspectedFraud: 'Suspected fraud',
};

type CardStatusText =
  | typeof CARD_STATUS_TEXT.active
  | typeof CARD_STATUS_TEXT.frozen
  | typeof CARD_STATUS_TEXT.temporarilyFrozen;

const transformLoyaltyCard: Record<LoyaltyCardStatusesEnum, CardStatusText> = {
  [LoyaltyCardStatusesEnum.active]: 'Active or Issued',
  [LoyaltyCardStatusesEnum.issued]: 'Active or Issued',
  [LoyaltyCardStatusesEnum.frozen]: 'Frozen',
  [LoyaltyCardStatusesEnum.temporarilyFrozen]: 'Temporarily Frozen',
};

const FREEZE_REASON_TEXT_OPTIONS = Object.values(FREEZE_REASON_TEXT);

const FREEZE_REASON = {
  [FREEZE_REASON_TEXT.cardClosed]: 'cardClosed',
  [FREEZE_REASON_TEXT.customerContactVendor]: 'customerContactVendor',
  [FREEZE_REASON_TEXT.suspectedFraud]: 'suspectedFraud',
};

type GrantPointsInputs = Omit<LoyaltyManualGrantPointsParams, 'userId'>;
