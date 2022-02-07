import * as React from 'react';
import {useListCardGroups} from '../../custom-hooks/use-list-card-groups';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Notification,
  useTransientState,
  SearchableDropdownField,
  useDebounce,
} from '@setel/portal-ui';
import {useCardDetails} from 'src/react/modules/cards/card.queries';
import {Member} from '../../loyalty-members.type';
import {useUpdateCards} from '../../card-groups.queries';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';

export type LoyaltyMemberCardGroupModalProps = {
  isOpen: boolean;
  onDismiss: () => void;
  member?: Member;
};

export const LoyaltyMemberCardGroupModal: React.VFC<LoyaltyMemberCardGroupModalProps> = ({
  isOpen,
  onDismiss,
  member,
}) => {
  const [cardGroupSearchText, setCardGroupSearchText] = React.useState('');
  const cardGroupSearch = useDebounce(cardGroupSearchText);
  const {optionsGroup} = useListCardGroups(true, {search: cardGroupSearch});

  const [cardGroupId, setCardGroupId] = React.useState<string>('');
  React.useEffect(() => {
    setCardGroupId(member?.cardGroupId);
  }, [isOpen]);
  const {data: cardData} = useCardDetails(member?.cardId);
  const {mutateAsync: updateCard, isError, error} = useUpdateCards(member?.cardId);
  const [showNotification, setShowNotification] = useTransientState(false);
  const handleDismiss = () => {
    setCardGroupId('');
    onDismiss();
  };

  const handleUpdate = async () => {
    const res = await updateCard({
      status: cardData.status,
      cardGroup: cardGroupId,
    });

    if (res) {
      setShowNotification(true);
      handleDismiss();
    }
  };

  return (
    <>
      <Notification
        isShow={showNotification}
        variant="success"
        title="Successfully update member card group"
      />
      <Modal isOpen={isOpen} onDismiss={handleDismiss}>
        <ModalHeader>Manage card group</ModalHeader>
        <ModalBody>
          {isError && (
            <div className="pb-4">
              <QueryErrorAlert
                error={(error as any) || null}
                description="Error while updating card group"
              />
            </div>
          )}
          <SearchableDropdownField
            label="Card group"
            layout="horizontal"
            className="w-72"
            options={optionsGroup}
            value={cardGroupId}
            onChangeValue={(value: string) => {
              setCardGroupId(value);
            }}
            noResultText="No card groups found with the text specified"
            placeholder="Select card group"
            onInputValueChange={setCardGroupSearchText}
          />
        </ModalBody>
        <ModalFooter className="text-right">
          <Button variant="outline" className="rounded mr-5" onClick={handleDismiss}>
            CANCEL
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            SAVE
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
