import {
  Alert,
  Button,
  Card,
  Container,
  DataTable as Table,
  Dialog,
  FileItem,
  FileSelector,
  formatMoney,
  IconButton,
  Modal,
  Section,
  SectionHeading,
  Tooltip,
  TrashIcon,
  UploadIcon,
  useFileUploads,
  Progress,
} from '@setel/portal-ui';
import * as React from 'react';
import {useNotification} from 'src/react/hooks/use-notification';
import {ajax} from 'src/react/lib/ajax';
import {
  useParseBulkWalletGrantingFile,
  BulkWalletGrantingRecord,
  useBulkGrantWalletBalance,
} from '../wallet-balance-granting.queries';
import {WalletBalanceGrantingBatchHistory} from './wallet-balance-granting-batch-history';

export const WalletBalanceGrantingListing = () => {
  const [showModal, setShowModal] = React.useState(false);
  const dismissModal = () => setShowModal(false);

  const [file, setFile] = React.useState<File | undefined>(undefined);

  const [records, setRecords] =
    React.useState<Array<BulkWalletGrantingRecord> | undefined>(undefined);

  const [showConfirmUpload, setShowConfirmUpload] = React.useState(false);
  const dismissConfirmUpload = () => setShowConfirmUpload(false);
  const dismissConfirmBtnRef = React.useRef<HTMLButtonElement>(null);

  const showMessage = useNotification();

  const {grantBalance, isGranting, isProcessing, progress} = useBulkGrantWalletBalance({
    onComplete: () => {
      showMessage({
        title: `All grantings for ${file.name} are processed successfully.`,
      });
      setFile(undefined);
      setRecords(undefined);
    },
    onFailed: () => {
      dismissConfirmUpload();
      showMessage({
        title: `Failed to process ${file.name}.`,
        variant: 'error',
      });
    },
  });

  return (
    <Container heading="Wallet balance grantings">
      <div className="space-y-8">
        <Card>
          <Card.Heading title="File upload" />
          <Card.Content>
            {file ? (
              <div className="flex justify-between items-center gap-3">
                <div className="flex-1 space-y-1" data-testid="file-details">
                  <p className="text-sm">{file.name}</p>
                  {progress ? (
                    <>
                      <p className="text-xs text-lightgrey">
                        Processed {progress.processed} of {progress.total} records
                      </p>
                      <Progress progress={progress.processed / progress.total} />
                    </>
                  ) : (
                    records && <p className="text-xs text-lightgrey">{records.length} records</p>
                  )}
                </div>
                {!isProcessing && (
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
                      onClick={() => setFile(undefined)}
                      aria-label="Remove file"
                      data-testid="remove-file-btn">
                      <TrashIcon className="text-error-500 w-5 h-5" />
                    </IconButton>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-7">
                <div className="mb-5">
                  <p className="text-sm mb-3">You have not uploaded any files yet.</p>
                  <p className="text-xs text-lightgrey">Recomended size: CSV up to 4MB</p>
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
        {file ? (
          <Section>
            <SectionHeading title="Preview">
              <Button
                onClick={() => setShowConfirmUpload(true)}
                isLoading={isProcessing}
                variant="primary"
                data-testid="upload-file-btn">
                UPLOAD FILE
              </Button>
            </SectionHeading>
            <Dialog
              isOpen={showConfirmUpload}
              onDismiss={dismissConfirmUpload}
              leastDestructiveRef={dismissConfirmBtnRef}>
              <Dialog.Content header=" Are you sure you would like to upload this file?">
                You are about to upload this file for bulk wallet balance granting. Click confirm to
                proceed.
              </Dialog.Content>
              <Dialog.Footer className="text-right space-x-3">
                <Button onClick={dismissConfirmUpload} variant="outline" ref={dismissConfirmBtnRef}>
                  CANCEL
                </Button>
                <Button
                  isLoading={isGranting}
                  onClick={() => {
                    grantBalance(
                      {
                        batchName: file.name,
                        items: records,
                      },
                      {onSuccess: dismissConfirmUpload},
                    );
                  }}
                  variant="primary"
                  data-testid="confirm-btn">
                  CONFIRM
                </Button>
              </Dialog.Footer>
            </Dialog>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>USER ID</Table.Th>
                  <Table.Th className="text-right">CB AMOUNT (RM)</Table.Th>
                  <Table.Th className="text-right">DESCRIPTION</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {records &&
                  records.map((rec, i) => (
                    <Table.Tr key={i}>
                      <Table.Td>{rec.userId}</Table.Td>
                      <Table.Td className="text-right">{formatMoney(rec.amount)}</Table.Td>
                      <Table.Td className="text-right">{rec.message}</Table.Td>
                    </Table.Tr>
                  ))}
              </Table.Tbody>
            </Table>
          </Section>
        ) : (
          <WalletBalanceGrantingBatchHistory />
        )}
      </div>
    </Container>
  );
};

const FileUploadModal = (props: {
  onDismiss: () => void;
  onSave: (file: File, records: Array<BulkWalletGrantingRecord>) => void;
}) => {
  const [validationError, setValidationError] = React.useState('');
  const fileUpload = useFileUploads({
    uploadOperation: 'local',
    validateBeforeUpload: (file) =>
      file.size > FOUR_MB
        ? 'File size too big. The maximum supported file size is 4MB.'
        : undefined,
    maxCount: 1,
    onChange: () => setValidationError(''),
  });
  const record = fileUpload.items[0];
  const {mutate, isLoading} = useParseBulkWalletGrantingFile({
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
                description="CSV up to 4MB"
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

const FOUR_MB = 4 * 1024 * 1024;
