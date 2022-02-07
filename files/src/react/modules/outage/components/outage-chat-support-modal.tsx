import {Button, Dialog, FieldContainer, Modal, Toggle} from '@setel/portal-ui';
import React from 'react';
import {useNotification} from 'src/react/hooks/use-notification';
import {IVariable} from '../../variables/types';
import {useUpdateVariable} from '../../variables/variables.queries';
import {SupportOutageVariantEnum} from '../contants/outage.contants';
import {isChatOutageOn} from '../outage.helper';

export const OutageChatSupportModal = ({
  onClose,
  chatVariable,
}: {
  onClose: () => void;
  chatVariable: IVariable;
}) => {
  const showMessage = useNotification();
  const initalValue = React.useMemo(
    () => isChatOutageOn(chatVariable.offVariation as SupportOutageVariantEnum),
    [chatVariable],
  );
  function handleSubmit() {
    updateVariable(
      {
        key: chatVariable.key,
        variable: {
          isToggled: chatVariable.isToggled,
          onVariation: chatToggleOn
            ? [{percent: 100, variantKey: SupportOutageVariantEnum.CHAT_OFF_SUPPORT_ON}]
            : [{percent: 100, variantKey: SupportOutageVariantEnum.CHAT_ON_SUPPORT_ON}],
          offVariation: chatToggleOn
            ? SupportOutageVariantEnum.CHAT_OFF_SUPPORT_ON
            : SupportOutageVariantEnum.CHAT_ON_SUPPORT_ON,
          targets: [], // [] because, chat outage will always rollout 100%
          comment: EDIT_VARIABLE_COMMENT,
        },
      },
      {
        onSuccess: () => {
          onClose();
          showMessage({
            description: 'Live chat successfully updated',
            variant: 'success',
            title: 'Successful!',
          });
        },
        onError: (e) => {
          console.error(e);
          showMessage({
            description: e.message,
            variant: 'error',
            title: 'Error',
          });
        },
      },
    );
  }

  const [chatToggleOn, setChatToggleOn] = React.useState(() =>
    isChatOutageOn(chatVariable.offVariation as SupportOutageVariantEnum),
  );
  const {mutate: updateVariable, isLoading} = useUpdateVariable();
  const [showChatModal, setShowChatModal] = React.useState(false);
  const [showChatDialog, setShowChatDialog] = React.useState(false);

  function isTouched() {
    return chatToggleOn !== initalValue;
  }

  return (
    <>
      <Modal isOpen={true} onDismiss={onClose} aria-label={'Edit details'}>
        <Modal.Header>Edit announcement</Modal.Header>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}>
          <Modal.Body className="space-y-4">
            <FieldContainer className="mt-5" label="Chat" layout="horizontal">
              <Toggle
                on={chatToggleOn}
                data-testid="chat-toggle"
                onChangeValue={(isOn) => {
                  isOn ? setShowChatDialog(true) : setShowChatModal(true);
                }}
              />
            </FieldContainer>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex items-center justify-end">
              <Button variant="outline" onClick={onClose}>
                CANCEL
              </Button>
              <div style={{width: 12}} />
              <Button
                variant="primary"
                type="submit"
                disabled={!isTouched()}
                data-testid="save-chat-outage-button"
                isLoading={isLoading}>
                SAVE CHANGES
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal>

      {showChatDialog && (
        <ConfirmChatTurnOnDialog
          onConfirm={() => {
            setShowChatDialog(false);
            setChatToggleOn(true);
          }}
          onDismiss={() => setShowChatDialog(false)}
        />
      )}
      {showChatModal && (
        <ConfirmChatTurnOffModal
          onDismiss={() => setShowChatModal(false)}
          onConfirm={() => {
            setShowChatModal(false);
            setChatToggleOn(false);
          }}
        />
      )}
    </>
  );
};

const ConfirmChatTurnOnDialog = ({
  onConfirm,
  onDismiss,
}: {
  onConfirm: () => void;
  onDismiss: () => void;
}) => {
  const cancelRef = React.useRef(null);

  return (
    <Dialog onDismiss={onDismiss} leastDestructiveRef={cancelRef}>
      <Dialog.Content header="Are you sure you want to turn on Live Chat maintenance?">
        Turning on Chat SDK will stop customers from accessing chat
      </Dialog.Content>
      <Dialog.Footer>
        <Button variant="outline" onClick={onDismiss} ref={cancelRef}>
          CANCEL
        </Button>
        <Button variant="error" className="ml-3" onClick={onConfirm}>
          TURN ON
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
};
const ConfirmChatTurnOffModal = ({
  onConfirm,
  onDismiss,
}: {
  onConfirm: () => void;
  onDismiss: () => void;
}) => {
  return (
    <Modal
      header="Are you sure you want to turn off live chat maintenance?"
      isOpen={true}
      onDismiss={onDismiss}>
      <Modal.Body>
        Turning off live chat maintenance will allow customers to chat normally.
      </Modal.Body>
      <Modal.Footer className="text-right">
        <Button variant="outline" onClick={onDismiss}>
          CANCEL
        </Button>
        <Button className="ml-3" onClick={onConfirm} variant="primary">
          TURN OFF
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const EDIT_VARIABLE_COMMENT = 'edited in chat outage maintanence page';
