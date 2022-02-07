import {
  Alert,
  Button,
  FileItem,
  FileSelector,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  UploadIcon,
} from '@setel/portal-ui';
import * as React from 'react';
import {AxiosError} from 'axios';
import {useBlacklistUpload} from '../risk-profile.queries';
import {useNotification} from 'src/react/hooks/use-notification';

function getAlertDescription(error: AxiosError<Error>): string {
  if (
    error.response?.status === 413 ||
    error.response?.data?.message === 'CSV file size cannot be more than 0.5 MB'
  ) {
    return 'Failed to upload file. Please check your file size.';
  }
  return error.response?.data?.message || String(error);
}

export function BlacklistUpload(props: {onSuccess?: () => void}) {
  const [isOpen, toggleOpen] = React.useState(false);
  const [file, setFile] = React.useState<File>(null);
  const showMsg = useNotification();
  const {
    mutate: uploadFile,
    isError,
    error,
    reset,
  } = useBlacklistUpload({
    onSuccess: () => {
      toggleOpen(false);
      reset();
      setFile(null);
      showMsg({
        title: 'Successful!',
        variant: 'success',
        description: 'CSV file is successfully imported.',
      });
      props.onSuccess();
    },
  });
  const onCancel = () => {
    setFile(null);
    toggleOpen(false);
    reset();
  };
  const onSaveChanges = () => {
    uploadFile(file);
  };

  return (
    <div data-testid="risk-profile-upload">
      <Button
        data-testid="risk-profile-upload-button"
        variant="outline"
        leftIcon={<UploadIcon />}
        onClick={() => toggleOpen(true)}>
        IMPORT CSV
      </Button>
      <Modal isOpen={isOpen} onDismiss={onCancel} aria-label="Upload CSV">
        <ModalHeader>Import CSV</ModalHeader>
        <ModalBody className="flex justify-center">
          <div className="max-w-md flex-grow">
            {isError && (
              <Alert className="mb-4" variant="error" description={getAlertDescription(error)} />
            )}
            {(!file || isError) && (
              <FileSelector
                className="px-0"
                multiple={false}
                accept={'.csv'}
                onFilesSelected={(files) => {
                  setFile(files[0]);
                }}
                description="CSV up to 0.5MB"
              />
            )}
            {file && <FileItem file={file} onRemove={() => setFile(null)} />}
          </div>
        </ModalBody>

        <ModalFooter className="text-right space-x-3">
          <Button variant="outline" onClick={onCancel}>
            CANCEL
          </Button>
          <Button variant="primary" disabled={!file} onClick={onSaveChanges}>
            IMPORT
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
