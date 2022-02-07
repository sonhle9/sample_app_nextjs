import * as React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  DropdownSelectField,
  FieldContainer,
  TextInput,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  Notification,
  useTransientState,
  SearchableDropdownField,
  useDebounce,
} from '@setel/portal-ui';
import {useListCardGroups} from '../../custom-hooks/use-list-card-groups';
import {SourcesType, SourcesTypeName, PointRulesExpiries} from '../../point-rules.type';
import {
  useUpdatePointExpiry,
  useDeletePointExpiry,
  useCreatePointExpiry,
} from '../../point-rules.queries';
import {formatThousands} from 'src/shared/helpers/formatNumber';
import {useCanEditPointExpiries} from '../../custom-hooks/use-check-permissions';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';

type PointExpiriesCreateEditModalProps = {
  pointExpiries?: PointRulesExpiries;
  isOpen: boolean;
  onDismiss: () => void;
};

type PointExpiriesDeleteDialogProps = {
  isOpen: boolean;
  onDismiss: () => void;
  handleDismiss: () => void;
  id?: string;
};

const sourceTypeOptions = Object.values(SourcesType).map((value) => SourcesTypeName.get(value));

const PointExpiriesDeleteDialog: React.VFC<PointExpiriesDeleteDialogProps> = ({
  isOpen,
  onDismiss,
  handleDismiss,
  id,
}) => {
  const cancelRef = React.useRef(null);
  const {
    mutateAsync: mutateDeletePointExpiries,
    isLoading,
    isError,
    error,
  } = useDeletePointExpiry();

  const handleDelete = async () => {
    const res = await mutateDeletePointExpiries(id);
    if (res) {
      handleDismiss();
    }
  };

  return (
    isOpen && (
      <Dialog onDismiss={onDismiss} leastDestructiveRef={cancelRef}>
        {isError && (
          <div className="pb-4">
            <QueryErrorAlert
              error={(error as any) || null}
              description="Error while deleting point expiry"
            />
          </div>
        )}
        <DialogContent
          header="Confirm deletion"
          aria-labelledby="delete-expiry"
          data-testid="delete-expiry-confirmation-modal">
          Delete loyalty point expiries? It will be removed from your loyalty point expiries list
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={onDismiss} ref={cancelRef}>
            CANCEL
          </Button>
          <Button variant="error" onClick={handleDelete} isLoading={isLoading}>
            DELETE
          </Button>
        </DialogFooter>
      </Dialog>
    )
  );
};

export const PointExpiriesCreateEditModal: React.VFC<PointExpiriesCreateEditModalProps> = ({
  isOpen,
  onDismiss,
  pointExpiries,
}) => {
  const canEditPointExpiries = useCanEditPointExpiries();
  const {
    mutateAsync: mutateUpdateExpiries,
    isLoading: updateIsLoading,
    isError: updateIsError,
    error: updateError,
  } = useUpdatePointExpiry();
  const {
    mutateAsync: mutateCreateExpiries,
    isLoading: createIsLoading,
    isError: createIsError,
    error: createError,
  } = useCreatePointExpiry();
  const [cardGroupSearchText, setCardGroupSearchText] = React.useState('');
  const cardGroupSearch = useDebounce(cardGroupSearchText);
  const {optionsGroup: cardGroupOptions} = useListCardGroups(true, {search: cardGroupSearch});

  const [cardCategory, setCardCategory] = React.useState('');
  const [sourceType, setSourceType] = React.useState('');
  const [days, setDays] = React.useState(null);
  const [displayDuration, setDisplayDuration] = React.useState('');
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showNotification, setShowNotification] = useTransientState(false);
  const [notificationMessage, setNotificationMessage] = React.useState('');

  React.useEffect(() => {
    setCardCategory(pointExpiries?.cardCategory[0] || '');
    setSourceType(pointExpiries?.sourceType);
    setDays(pointExpiries?.expireAfter?.days);
    setDisplayDuration(formatThousands(pointExpiries?.expireAfter?.days || ''));
  }, [isOpen]);

  const isDisabled = !sourceType || !days || !cardCategory || !canEditPointExpiries;

  const onChangeDuration = (input: string) => {
    const cleaned = input.replace(/,/g, '');
    setDays(cleaned);
    setDisplayDuration(formatThousands(cleaned));
  };

  const handleDeleteExpiry = () => {
    setShowNotification(true);
    setNotificationMessage('Successfully deleted point expiry');
    handleDismiss();
  };

  const handleDismiss = () => {
    setCardCategory(undefined);
    setSourceType(SourcesType.LOYALTY_POINT as string);
    setDays(null);
    setDisplayDuration('');
    setShowDeleteDialog(false);
    onDismiss();
  };

  const handleSubmit = async () => {
    const res = pointExpiries
      ? await mutateUpdateExpiries({
          ...pointExpiries,
          cardCategory: [cardCategory],
          sourceType: sourceType as SourcesType,
          expireAfter: {days},
        })
      : await mutateCreateExpiries({
          cardCategory: [cardCategory],
          sourceType: sourceType as SourcesType,
          expireAfter: {days},
        });
    if (res) {
      setShowNotification(true);
      setNotificationMessage(
        res.status === 200
          ? 'Successfully updated point expiry'
          : 'Successfully created point expiry',
      );
      handleDismiss();
    }
  };

  return (
    <>
      <Notification isShow={showNotification} variant="success" title={notificationMessage} />
      <PointExpiriesDeleteDialog
        isOpen={showDeleteDialog}
        onDismiss={() => {
          setShowDeleteDialog(false);
        }}
        handleDismiss={handleDeleteExpiry}
        id={pointExpiries?.id}
      />
      <Modal
        isOpen={isOpen}
        onDismiss={handleDismiss}
        aria-label="create-edit-expiry"
        data-testid="create-edit-expiry-modal">
        <ModalHeader>{`${pointExpiries ? 'Edit' : 'Create'} loyalty point expiries`}</ModalHeader>
        <ModalBody>
          {(updateIsError || createIsError) && (
            <div className="pb-4">
              <QueryErrorAlert
                error={(updateError as any) || (createError as any) || null}
                description="Error while creating / updating point expiry"
              />
            </div>
          )}
          <SearchableDropdownField
            label="Card group"
            layout="horizontal"
            className="w-64"
            options={cardGroupOptions}
            value={cardCategory}
            onChangeValue={(value: string) => {
              setCardCategory(value);
            }}
            noResultText="No card groups found with the text specified"
            placeholder="Select card group"
            onInputValueChange={setCardGroupSearchText}
          />
          <DropdownSelectField
            label="Source type"
            layout="horizontal"
            className="w-64"
            options={sourceTypeOptions}
            value={sourceType}
            onChangeValue={(value: string) => {
              setSourceType(value);
            }}
            placeholder="Select source type"
          />
          <FieldContainer label="Validity days" layout="horizontal">
            <div className="relative w-32">
              <div className="absolute flex inset-y-0 right-0 px-2 my-1 mr-1 items-center text-mediumgrey text-sm">
                days
              </div>
              <TextInput
                className="pr-12"
                value={displayDuration}
                onChangeValue={onChangeDuration}
              />
            </div>
          </FieldContainer>
        </ModalBody>
        <ModalFooter>
          <div className="flex">
            {pointExpiries ? (
              <Button
                onClick={() => {
                  setShowDeleteDialog(true);
                }}
                variant="error"
                data-testid="delete-button"
                disabled={!canEditPointExpiries}>
                DELETE
              </Button>
            ) : null}
            <div className="flex flex-grow justify-end">
              <Button
                variant="outline"
                className="mr-5"
                data-testid="cancel-button"
                onClick={handleDismiss}>
                CANCEL
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                data-testid="save-button"
                isLoading={updateIsLoading || createIsLoading}
                disabled={isDisabled}>
                {pointExpiries ? 'SAVE CHANGES' : 'CREATE'}
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};
