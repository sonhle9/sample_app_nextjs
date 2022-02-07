import {
  Button,
  Card,
  EditIcon,
  ImageThumbnail,
  FileSelector,
  Modal,
  Text,
  UploadIcon,
  SearchTextInput,
  DropdownSelect,
  FilterControls,
  FieldContainer,
  ImageSelection,
  ImageGrid,
  ImageCard,
  ImageUploadItem,
} from '@setel/portal-ui';
import * as React from 'react';
import {
  useUploadBadgeIcon,
  useGetIconGallery,
  useUpdateBadge,
  useDeleteGalleryIcon,
} from '../../badge-campaigns.queries';
import {IBadge, UserBadgeStatus} from '../../badge-campaigns.type';
import {useConfirmModal} from './use-confirm-modal';

type EditIconModalProps = {
  isFetching: boolean;
  status: UserBadgeStatus;
  badge: IBadge;
};

const sortByOptions = [
  {label: 'Date (new to old)', value: 'createdAt:desc'},
  {label: 'Date (old to new)', value: 'createdAt:asc'},
  {label: 'Name (A-Z)', value: 'filename:asc'},
  {label: 'Name (Z-A)', value: 'filename:desc'},
];

export function EditIconModal({isFetching, badge, status}: EditIconModalProps) {
  const statusText =
    (status === 'LOCKED' && 'Locked') ||
    (status === 'IN_PROGRESS' && 'In-progress') ||
    (status === 'UNLOCKED' && 'Unlocked');
  const isEdit = Boolean(badge?.content?.iconUrls?.[status]);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Card className="mt-10" expandable defaultIsOpen isLoading={isFetching}>
      <Card.Heading title={`${statusText} badge icon`}>
        {isEdit && (
          <Button
            variant="outline"
            leftIcon={<EditIcon />}
            minWidth="none"
            onClick={() => setIsOpen(true)}>
            EDIT ICON
          </Button>
        )}
      </Card.Heading>
      <Card.Content className="p-10">
        {isEdit ? (
          <ImageThumbnail src={badge?.content?.iconUrls?.[status]} allowZoom={false} isStarred />
        ) : (
          <section className="flex flex-col items-center">
            <Text className="mb-3">You have not added any icon yet</Text>
            <Button
              variant="outline"
              leftIcon={<UploadIcon />}
              minWidth="none"
              onClick={() => setIsOpen(true)}>
              ADD NEW ICON
            </Button>
          </section>
        )}
      </Card.Content>
      {isOpen && (
        <IconModal
          isEdit={isEdit}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          badge={badge}
          statusText={statusText}
          status={status}
        />
      )}
    </Card>
  );
}

type IconModalProps = {
  statusText: string;
  isEdit: boolean;
  isOpen: boolean;
  onClose: () => void;
} & Pick<EditIconModalProps, 'status' | 'badge'>;

function IconModal({status, statusText, badge, onClose, isOpen, isEdit}: IconModalProps) {
  const headerText = `${isEdit ? 'Edit' : 'Add'} ${statusText.toLowerCase()} badge`;
  const [filename, setFilename] = React.useState('');
  const [selected, setSelected] = React.useState(badge?.content?.iconUrls?.[status]);
  const [sort, setSort] = React.useState(sortByOptions[0].value);
  const {data: images} = useGetIconGallery({status, filename, sort, enabled: isOpen});
  const galleryIconMutation = useDeleteGalleryIcon();
  const confirmModal = useConfirmModal(galleryIconMutation.isLoading);
  const {addFile, hasPendingRequest, items} = useUploadBadgeIcon(status);
  const {mutateAsync: updateBadge, isLoading} = useUpdateBadge();
  const onSubmit = () => {
    const payload = {
      id: badge?.id,
      content: {
        ...badge?.content,
        iconUrls: {
          ...badge?.content?.iconUrls,
          [status]: selected,
        },
      },
    };
    updateBadge(payload, {onSuccess: onClose});
  };
  return (
    <Modal isOpen={isLoading || isOpen} onDismiss={onClose} header={headerText}>
      <FileSelector
        onFilesSelected={(newFiles) => newFiles.forEach(addFile)}
        fileType="image"
        className="px-3 sm:px-7 pt-5"
        description={
          <>
            PNG up to 10MB
            <br />
            Recommended size: 160 x 160px
          </>
        }
      />
      <FilterControls className="py-0 px-3 sm:px-7 mt-5 mb-4 shadow-none">
        <FieldContainer className="md:col-span-2">
          <SearchTextInput
            value={filename}
            onChangeValue={setFilename}
            placeholder="Enter file name or format"
          />
        </FieldContainer>
        <FieldContainer>
          <DropdownSelect
            value={sort}
            onChangeValue={(value) => setSort(value)}
            options={sortByOptions}
            placeholder="Select a number"
          />
        </FieldContainer>
      </FilterControls>
      <div className="px-3 sm:px-7">{confirmModal.component}</div>
      <div className="border-t border-grey-200" />
      <ImageSelection name={headerText} value={selected} onChangeValue={setSelected}>
        <section className="portal-ui-scrollbar portal-ui-scroll-overlay-y max-h-screen-60">
          <ImageGrid>
            {items?.map((item) => (
              <ImageUploadItem {...item} />
            ))}
            {images?.map((image) => (
              <ImageCard
                key={image.id}
                src={image.s3Url}
                imageName={image.originalname}
                imageSizeInByte={image.byteSize}
                value={image.s3Url}
                onDelete={() => {
                  confirmModal.open({
                    confirmProps: {
                      title: 'Are you sure you want to delete icon from the gallery?',
                      description:
                        'This action cannot be undone and you will no longer be able to view or recover it.',
                      confirmButton: {
                        text: 'delete',
                        variant: 'error',
                      },
                      successAlert: {
                        variant: 'success',
                        description: 'Successfully deleted icon',
                      },
                      errorAlert: {
                        variant: 'error',
                        description: 'Unable to delete icon.',
                      },
                    },
                    onConfirm: ({onSuccess, onError}) =>
                      galleryIconMutation.mutate(image.id, {onSuccess, onError}),
                  });
                }}
              />
            ))}
          </ImageGrid>
        </section>
      </ImageSelection>
      <Modal.Footer className="flex justify-end">
        <Button variant="outline" disabled={isLoading} className="uppercase mr-3" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          className="uppercase"
          isLoading={isLoading}
          disabled={isLoading || hasPendingRequest || galleryIconMutation.isLoading}
          onClick={onSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
