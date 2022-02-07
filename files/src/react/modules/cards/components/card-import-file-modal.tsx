import {
  Alert,
  AlertMessages,
  Button,
  FileItem,
  FileSelector,
  formatDate,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@setel/portal-ui';
import * as React from 'react';
import {uploadFileBulkCard, validateFileBulkCard} from '../card.service';
import {convertToSensitiveNumber} from 'src/app/cards/shared/common';
import {BATCH_TRANSFER_DETAILS, useBatchTransferDetails} from '../card.queries';
import {EBatchStatus, IFileBulkCardDetails} from '../card.type';
import {useQueryClient} from 'react-query';

interface ICardImportFileModalProps {
  onClose: (status: string) => void;
}

const CardImportFileModal: React.VFC<ICardImportFileModalProps> = (props) => {
  const queryClient = useQueryClient();
  const [file, setFile] = React.useState<File>(undefined);
  const [fileValidate, setFileValidate] = React.useState<IFileBulkCardDetails>();
  const [errors, setErrors] = React.useState<string[]>([]);
  const [hasSelectedMulti, setHasSelectedMulti] = React.useState(false);
  const [confimSendFileModal, setConfimSendFileModal] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const {data} = useBatchTransferDetails(fileValidate?.batchId);

  const close = (status: string = '') => {
    props.onClose(status);
  };

  const closeConfimSendFileModal = () => {
    setConfimSendFileModal(false);
  };

  const onImportFile = () => {
    if (file && file.size < 5 * 1024 * 1024) {
      setIsUploading(true);

      validateFileBulkCard(file)
        .then((res) => {
          setFileValidate(res);
        })
        .catch((err) => {
          const res = err['response'] && err['response'].data;

          if (Array.isArray(res?.response?.errors) && !!res.response.errors.length) {
            setErrors(res.response.errors);
          } else {
            setErrors([res.message]);
          }

          setIsUploading(false);
        });
    } else {
      setErrors(['File too large']);
    }
  };

  const onSendForApproval = () => {
    setIsSending(true);

    uploadFileBulkCard(file, fileValidate.batchId)
      .then(() => {
        setIsSending(false);

        close('success');
      })
      .catch((err) => {
        const res = err['response'] && err['response'].data;

        if (Array.isArray(res?.response?.errors) && !!res.response.errors.length) {
          setErrors(res.response.errors);
        } else {
          setErrors([res.message]);
        }

        setIsSending(false);
        setConfimSendFileModal(false);
      });
  };

  React.useEffect(() => {
    if (data) {
      const interval = setInterval(() => {
        queryClient.invalidateQueries(BATCH_TRANSFER_DETAILS);
      }, 3000);

      if ([EBatchStatus.SUCCEEDED, EBatchStatus.FAILED].includes(data.status)) {
        clearInterval(interval);
        setIsUploading(false);

        if (!data.result.errors?.length) {
          setConfimSendFileModal(true);
        } else {
          setErrors(data.result.errors);
        }
      }

      return () => {
        clearInterval(interval);
      };
    }
  }, [data]);

  return (
    <>
      <Modal isOpen onDismiss={() => close()} aria-label="Import CSV">
        <ModalHeader>Import CSV</ModalHeader>
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
                <Alert
                  className="overflow-scroll max-h-40"
                  variant="error"
                  description="Something is error">
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
              description="CSV up to 5MB"
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
          <div className="flex items-center justify-end">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => close()}>
                CANCEL
              </Button>
              <Button
                variant="primary"
                disabled={!file}
                isLoading={isUploading}
                onClick={onImportFile}>
                IMPORT
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
      {confimSendFileModal && data && (
        <Modal isOpen onDismiss={closeConfimSendFileModal} aria-label="File details confirmation">
          <ModalHeader>File details confirmation</ModalHeader>
          <ModalBody>
            <div className="flex flex-col py-4 space-y-4">
              <div className="flex">
                <div className="w-1/4">
                  <Label>Total affected cards</Label>
                </div>
                <div className="flex-1">{data.result?.totalCount}</div>
              </div>
              <div className="flex">
                <div className="w-1/4">
                  <Label>Total transfer amount</Label>
                </div>
                <div className="flex-1">
                  RM {convertToSensitiveNumber(data.result?.totalAmount)}
                </div>
              </div>
              <div className="flex">
                <div className="w-1/4">
                  <Label>Created on</Label>
                </div>
                <div className="flex-1">
                  {formatDate(data.createdAt, {
                    formatType: 'dateAndTime',
                  })}
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="flex items-center justify-end">
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={closeConfimSendFileModal}>
                  CANCEL
                </Button>
                <Button variant="primary" isLoading={isSending} onClick={onSendForApproval}>
                  SEND FOR APPROVAL
                </Button>
              </div>
            </div>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
};

export default CardImportFileModal;
