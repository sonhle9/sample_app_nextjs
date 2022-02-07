import {
  Alert,
  Button,
  Card,
  Container,
  Dialog,
  DataTable as Table,
  Progress,
  FileItem,
  FileSelector,
  IconButton,
  Modal,
  Section,
  SectionHeading,
  Tooltip,
  TrashIcon,
  UploadIcon,
  useFileUploads,
  Badge,
} from '@setel/portal-ui';
import * as React from 'react';
import {ajax} from 'src/react/lib/ajax';
import {AuthGuard} from 'src/react/modules/auth';
import {useNotification} from 'src/react/hooks/use-notification';
import {
  BulkGrantOrderPreviewItem,
  useBulkGrantPreview,
  useBulkGrant,
} from '../external-orders.queries';
import {EXTERNAL_ORDER_STATUS_COLOR} from '../external-orders.const';
import {retailRoles} from 'src/shared/helpers/roles.type';

const permissions = [retailRoles.externalOrderUpdate];

export const ExternalOrdersBulkUpdate = () => {
  const [showModal, setShowModal] = React.useState(false);
  const dismissModal = () => setShowModal(false);

  const [file, setFile] = React.useState<File | undefined>(undefined);

  const [records, setRecords] =
    React.useState<Array<BulkGrantOrderPreviewItem> | undefined>(undefined);

  const [showConfirmGrant, setShowConfirmGrant] = React.useState(false);
  const dismissConfirmGrant = () => setShowConfirmGrant(false);
  const dismissConfirmGrantBtnRef = React.useRef<HTMLButtonElement>(null);

  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);
  const dismissConfirmDelete = () => setShowConfirmDelete(false);
  const dismissConfirmDeleteBtnRef = React.useRef<HTMLButtonElement>(null);

  const showMessage = useNotification();

  const {items, addFile} = useBulkGrant({
    onChange: () => {
      showMessage({
        title: 'Successfully uploaded',
      });
      setFile(undefined);
      setRecords(undefined);
    },
  });

  const uploadItem = items[0];

  return (
    <AuthGuard accessWith={permissions}>
      <Container heading="External orders">
        <div className="space-y-8">
          <Card>
            <Card.Heading title="File upload" />
            <Card.Content>
              {file ? (
                <div className="flex justify-between items-center gap-3">
                  <div className="flex-1 space-y-1" data-testid="file-details">
                    <p className="text-sm">{file.name}</p>
                    {uploadItem && uploadItem.uploadStatus === 'uploading' ? (
                      <>
                        <Progress progress={uploadItem.uploadProgress} />
                      </>
                    ) : (
                      records && (
                        <p className="text-xs text-lightgrey">{records.length} external orders</p>
                      )
                    )}
                  </div>
                  {!uploadItem && (
                    <div className="inline-flex" data-testid="file-actions">
                      <Tooltip label="Replace file">
                        <IconButton
                          onClick={() => setShowModal(true)}
                          aria-label="Replace file"
                          data-testid="replace-file-btn">
                          <UploadIcon className="text-brand-500 w-5 h-5" />
                        </IconButton>
                      </Tooltip>
                      <IconButton
                        onClick={() => setShowConfirmDelete(true)}
                        aria-label="Remove file"
                        data-testid="remove-file-btn">
                        <TrashIcon className="text-error-500 w-5 h-5" />
                      </IconButton>
                      <Dialog
                        isOpen={showConfirmDelete}
                        onDismiss={dismissConfirmDelete}
                        leastDestructiveRef={dismissConfirmDeleteBtnRef}>
                        <Dialog.Content header=" Are you sure you would like to delete this file?">
                          You are about to delete your uploaded file. This action can not be undone.
                        </Dialog.Content>
                        <Dialog.Footer className="text-right space-x-3">
                          <Button
                            onClick={dismissConfirmDelete}
                            variant="outline"
                            ref={dismissConfirmDeleteBtnRef}>
                            CANCEL
                          </Button>
                          <Button
                            onClick={() => {
                              setFile(undefined);
                              dismissConfirmDelete();
                            }}
                            variant="error"
                            data-testid="confirm-delete-btn">
                            DELETE
                          </Button>
                        </Dialog.Footer>
                      </Dialog>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-7">
                  <div className="mb-5">
                    <p className="text-sm mb-3">You have not uploaded any files yet.</p>
                    <p className="text-xs text-lightgrey">Recomended size: CSV up to 10MB</p>
                  </div>
                  <Button
                    onClick={() => setShowModal(true)}
                    leftIcon={<UploadIcon />}
                    variant="outline"
                    data-testid="select-file-btn">
                    SELECT FILE
                  </Button>
                </div>
              )}
            </Card.Content>
            <Modal header="Select file" isOpen={showModal} onDismiss={dismissModal}>
              {showModal && (
                <FileUploadModal
                  onSave={(selectedFile, parsedRecs) => {
                    setFile(selectedFile);
                    setRecords(parsedRecs);
                    dismissModal();
                  }}
                  onDismiss={dismissModal}
                />
              )}
            </Modal>
          </Card>
          {file && (
            <Section>
              <SectionHeading title="Preview">
                <Button
                  onClick={() => setShowConfirmGrant(true)}
                  isLoading={uploadItem && uploadItem.uploadStatus === 'uploading'}
                  variant="primary"
                  data-testid="process-granting-btn">
                  PROCESS GRANTING
                </Button>
              </SectionHeading>
              <Dialog
                isOpen={showConfirmGrant}
                onDismiss={dismissConfirmGrant}
                leastDestructiveRef={dismissConfirmGrantBtnRef}>
                <Dialog.Content header=" Are you sure you want to grant loyalty points to these external orders?">
                  You are about to grant loyalty points to these external orders. Click confirm to
                  proceed.
                </Dialog.Content>
                <Dialog.Footer className="text-right space-x-3">
                  <Button
                    onClick={dismissConfirmGrant}
                    variant="outline"
                    ref={dismissConfirmGrantBtnRef}>
                    CANCEL
                  </Button>
                  <Button
                    onClick={() => {
                      if (uploadItem) {
                        if (uploadItem.uploadStatus === 'error') {
                          uploadItem.onRetry();
                        }
                      } else {
                        addFile(file);
                      }
                      dismissConfirmGrant();
                    }}
                    variant="primary"
                    data-testid="confirm-btn">
                    CONFIRM
                  </Button>
                </Dialog.Footer>
              </Dialog>
              <div className="space-y-3">
                {uploadItem && uploadItem.uploadStatus === 'error' && (
                  <Alert variant="error" description={uploadItem.errorMessage} />
                )}
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>STATUS</Table.Th>
                      <Table.Th>RECEIPT NUMBER</Table.Th>
                      <Table.Th>TRANSACTION DATE</Table.Th>
                      <Table.Th>STATION NAME</Table.Th>
                      <Table.Th>PURCHASE TYPE</Table.Th>
                      <Table.Th>ITEMS</Table.Th>
                      <Table.Th>IS VALID EXTERNAL ORDER</Table.Th>
                      <Table.Th>IS GRANTED BASE POINT</Table.Th>
                      <Table.Th>POINTS ALREADY GRANTED</Table.Th>
                      <Table.Th className="text-right">POINTS TO BE GRANTED</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {records &&
                      records.map((rec, i) => (
                        <Table.Tr key={i}>
                          <Table.Td>
                            <Badge
                              color={EXTERNAL_ORDER_STATUS_COLOR[rec.status]}
                              className="uppercase">
                              {rec.status}
                            </Badge>
                          </Table.Td>
                          <Table.Td>{rec.receiptNumber}</Table.Td>
                          <Table.Td>{rec.transactionDate}</Table.Td>
                          <Table.Td>{rec.stationName}</Table.Td>
                          <Table.Td>{rec.purchaseType}</Table.Td>
                          <Table.Td>{rec.items}</Table.Td>
                          <Table.Td>{rec.isValidExternalOrder ? 'Yes' : '-'}</Table.Td>
                          <Table.Td>{rec.isGrantedBasePoint ? 'Yes' : '-'}</Table.Td>
                          <Table.Td>{rec.grantedBasePoints || '-'}</Table.Td>
                          <Table.Td className="text-right">{rec.pointsToBeGranted || '-'}</Table.Td>
                        </Table.Tr>
                      ))}
                  </Table.Tbody>
                </Table>
              </div>
            </Section>
          )}
        </div>
      </Container>
    </AuthGuard>
  );
};

const FileUploadModal = (props: {
  onDismiss: () => void;
  onSave: (file: File, records: Array<BulkGrantOrderPreviewItem>) => void;
}) => {
  const [validationError, setValidationError] = React.useState('');
  const fileUpload = useFileUploads({
    uploadOperation: 'local',
    validateBeforeUpload: (file) =>
      file.size > TEN_MB ? 'File size too big. The maximum supported file size is 4MB.' : undefined,
    maxCount: 1,
    onChange: () => setValidationError(''),
  });
  const record = fileUpload.items[0];
  const {mutate, isLoading} = useBulkGrantPreview({
    onSuccess: (records) => props.onSave(record.file, records),
  });

  return (
    <>
      <Modal.Body>
        <div className="max-w-lg mx-auto space-y-3">
          {validationError ? <Alert variant="error" description={validationError} /> : null}
          {record ? (
            <FileItem {...record} />
          ) : (
            <>
              <Alert
                variant="info"
                description="Please upload ONE file at a time for file validation purposes."
              />
              <FileSelector
                onFilesSelected={(files) => files.forEach(fileUpload.addFile)}
                description="CSV up to 10MB"
                fileType="csv"
                data-testid="file-selector"
              />
            </>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="text-right space-x-3">
        <Button onClick={props.onDismiss} variant="outline">
          CANCEL
        </Button>
        <Button
          onClick={() => {
            if (record) {
              mutate(record.file, {
                onError: (err) => {
                  if (ajax.isAxiosError(err)) {
                    setValidationError(err.response.data?.message || 'Invalid file');
                  } else {
                    console.error(err);
                  }
                },
              });
            }
          }}
          variant="primary"
          isLoading={isLoading}
          data-testid="save-btn">
          SAVE CHANGES
        </Button>
      </Modal.Footer>
    </>
  );
};

const TEN_MB = 10 * 1024 * 1024;
