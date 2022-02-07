import * as React from 'react';
import {
  Alert,
  Button,
  Card,
  CrossIcon,
  FieldContainer,
  FileItem,
  FileSelector,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@setel/portal-ui';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {
  useSendForApproval,
  useValidateBulkImportFile,
} from '../modules/merchants/merchants.queries';

export interface BuckActionImportModalProps {
  onDismiss: () => void;
  withoutWrapper?: boolean;
}

export const BuckActionImportModal = (props: BuckActionImportModalProps) => {
  const [file, setFile] = React.useState<File | undefined>(undefined);
  const [error, setError] = React.useState('');
  const [showFileConfirmModal, setShowFileConfirmModal] = React.useState(false);
  const [isFileChanged, setFileChanged] = React.useState(false);
  const [isValidateSubmitted, setValidateSubmitted] = React.useState(false);
  const [isSendForApprovalSubmitted, setSendForApprovalSubmitted] = React.useState(false);
  const {
    mutateAsync: validateBulkImportFile,
    data: validateResult,
    isLoading,
    error: validateFileError,
  } = useValidateBulkImportFile();

  const {
    mutateAsync: sendForApproval,
    isLoading: sendForApprovalLoading,
    error: sendForApprovalError,
  } = useSendForApproval();

  const checkFileBeforeSet = (f: File) => {
    if (f.size > 5 * 1024 * 1024) {
      setError('The file size cannot exceed 5MB.');
    } else {
      setError('');
      setFile(f);
    }
  };

  React.useEffect(() => {
    setFileChanged(true);
    if (!file) {
      setError('');
    }
  }, [file]);

  React.useEffect(() => {
    if (isSendForApprovalSubmitted && !sendForApprovalLoading && !sendForApprovalError) {
      setShowFileConfirmModal(false);
      setSendForApprovalSubmitted(false);
      props.onDismiss();
    }
  }, [isSendForApprovalSubmitted, sendForApprovalLoading, sendForApprovalError]);

  React.useEffect(() => {
    if (isValidateSubmitted && !isLoading && !validateFileError) {
      setShowFileConfirmModal(true);
      setValidateSubmitted(false);
    }
  }, [isValidateSubmitted, isLoading, validateFileError]);

  const validateFile = () => {
    setFileChanged(false);
    validateBulkImportFile(file).then(() => {
      setValidateSubmitted(true);
    });
  };

  const handleSendForApproval = () => {
    sendForApproval(file).then(() => {
      setSendForApprovalSubmitted(true);
    });
  };

  const content = (
    <>
      <ModalHeader>Import merchant external top-up CSV</ModalHeader>
      <ModalBody style={{paddingLeft: '10rem', paddingRight: '10rem'}}>
        <Alert
          variant="info"
          description="Please upload ONE file at a time for file validation purposes."
        />
        {!!validateFileError && !isFileChanged && (
          <QueryErrorAlert error={validateFileError as any} />
        )}
        {/*{*/}
        {/*  error && <Alert*/}
        {/*    variant="error"*/}
        {/*    description="You have uploaded more than one file. Please upload ONE file at a time for validation purposes." />*/}
        {/*}*/}
        <FieldContainer status={error ? 'error' : 'success'} helpText={error}>
          <FileSelector
            onFilesSelected={(files) => checkFileBeforeSet(files[0])}
            file={file}
            fileType={'csv'}
            description="CSV file up to 5MB"
            className={'pt-4'}
          />
        </FieldContainer>
        {file && <FileItem file={file} onRemove={() => setFile(undefined)} />}
      </ModalBody>
      <ModalFooter className="text-right">
        <Button onClick={props.onDismiss} variant="outline" className="mr-4">
          CANCEL
        </Button>
        <Button disabled={!file || isLoading} onClick={validateFile} variant="primary">
          IMPORT
        </Button>
      </ModalFooter>

      <Modal
        overlayClassName={'z-index-1000'}
        aria-label={'File confirmation modal'}
        isOpen={showFileConfirmModal}
        onDismiss={() => {
          setShowFileConfirmModal(false);
        }}>
        <ModalHeader>File details confirmation</ModalHeader>
        <ModalBody>
          {!!sendForApprovalError && <QueryErrorAlert error={sendForApprovalError as any} />}
          {validateResult && (
            <p>
              <span className={'font-bold'}>{validateResult.totalTransaction || ''}</span> records
              counted in the excel file will be uploaded and sent for approval. Would you like to
              continue the process?
            </p>
          )}
        </ModalBody>
        <ModalFooter className="text-right">
          <Button onClick={() => setShowFileConfirmModal(false)} variant="outline" className="mr-4">
            CANCEL
          </Button>
          <Button
            disabled={sendForApprovalLoading}
            onClick={handleSendForApproval}
            variant="primary">
            SEND FOR APPROVAL
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );

  return props.withoutWrapper ? (
    content
  ) : (
    <Card style={{margin: '-1.5em'}} className={'relative'}>
      <div className={'pr-4 absolute top-0 right-0 pt-3'} style={{width: '50px'}}>
        <CrossIcon onClick={props.onDismiss} className="text-gray-400 fill-current" />
      </div>
      {content}
    </Card>
  );
};
