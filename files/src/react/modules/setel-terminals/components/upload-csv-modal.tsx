import {
  Modal,
  ModalHeader,
  ModalBody,
  Alert,
  ModalFooter,
  Button,
  AlertMessages,
  BareButton,
  FileSelector,
  FileItem,
} from '@setel/portal-ui';
import * as React from 'react';
import {SetelTerminalNotificationMessage} from '../setel-terminals.const';
import {useUploadCSV} from '../setel-terminals.queries';

interface IUploadCSVModalModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccessUpload: (message: string) => void;
}
const title = 'Upload CSV';
const UploadCSVModal = ({visible, onClose, onSuccessUpload}: IUploadCSVModalModalProps) => {
  const [errors, setErrors] = React.useState<string[]>([]);
  const [hasSelectedMulti, setHasSelectedMulti] = React.useState(false);
  const [file, setFile] = React.useState<File>(undefined);
  const {mutate, isLoading} = useUploadCSV();

  const onUploadFile = () => {
    if (file && file.size < 10 * 1024 * 1024) {
      mutate(
        {file},
        {
          onSuccess: () => {
            onSuccessUpload(SetelTerminalNotificationMessage.CREATE_SUCCESS);
            onClose();
          },
          onError: (e: any) => {
            setErrors([e.response?.data?.message]);
          },
        },
      );
    } else {
      setErrors(['File too large']);
    }
  };

  return (
    <Modal
      isOpen={visible}
      onDismiss={() => onClose()}
      aria-label={title}
      data-testid="import-serial-no-modal">
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>
        <div className="w-2/3 mx-auto py-2 space-y-3">
          <div className="p-1 mb-4">
            {hasSelectedMulti && errors.length === 0 && (
              <Alert
                variant="error"
                description="You have uploaded more than one file. Please upload ONE card transfer file at a time for file validation purposes."></Alert>
            )}
            {!hasSelectedMulti && errors.length === 0 && (
              <Alert
                variant="info"
                description="Please upload ONE card transfer file at a time for file validation purposes."></Alert>
            )}
            {errors.length > 0 && (
              <Alert className="max-h-40" variant="error" description="Something is error">
                <AlertMessages messages={errors} />
              </Alert>
            )}
          </div>
          <FileSelector
            onFilesSelected={(files: File[]) => {
              setFile(files[0]);
              setHasSelectedMulti(files.length > 1);
              setErrors([]);
            }}
            fileType="csv"
            file={file}
            description="CSV up to 10MB"
          />
          <div className="p-1">
            {file && (
              <FileItem
                file={file}
                onRemove={() => {
                  setFile(null);
                  setHasSelectedMulti(false);
                  setErrors([]);
                }}
              />
            )}
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="flex items-center justify-between space-x-2">
          <BareButton className="text-brand-500">DOWNLOAD CSV TEMPLATE</BareButton>
          <div className="flex items-center justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              CANCEL
            </Button>
            <Button
              isLoading={isLoading}
              disabled={!file}
              type="submit"
              variant="primary"
              onClick={onUploadFile}>
              UPLOAD
            </Button>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default UploadCSVModal;
