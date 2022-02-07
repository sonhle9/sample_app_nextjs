import {
  Alert,
  Button,
  DescItem,
  DescList,
  DownloadIcon,
  FieldContainer,
  FileItem,
  FileSelector,
  formatDate,
  formatMoney,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@setel/portal-ui';
import React from 'react';
import {QueryErrorAlert} from '../../../../components/query-error-alert';
import {downloadFile} from '../../../../lib/utils';
import {SPAImportType} from '../../merchant.const';
import {useSmartpayAccountImportCsv, useSPAValidateBulkAdjustFile} from '../../merchants.queries';
import {SmartpayAccountImportRes} from '../../merchants.type';

export const SmartpayAccountImportModal = (props: {
  onDismiss: () => void;
  onDone: (any, string) => void;
  importType: SPAImportType;
}) => {
  const [file, setFile] = React.useState<File | undefined>(undefined);
  const [uploadError, setUploadError] = React.useState('');
  const [importError, setImportError] = React.useState(false);
  const [errCsvFile, setErrCsvFile] = React.useState(new Blob());
  const [showVerifyModal, setShowVerifyModal] = React.useState(false);

  const {
    mutate: importFile,
    isLoading,
    error: importFileError,
  } = useSmartpayAccountImportCsv(props.importType);

  const {
    mutateAsync: validateBulkAdjustFile,
    data: validateRes,
    isLoading: validateLoading,
    error: validateError,
  } = useSPAValidateBulkAdjustFile();

  const checkFileBeforeSet = (f: File) => {
    if (f.size > 5 * 1024 * 1024) {
      setUploadError('The file size cannot exceed 5MB.');
    } else {
      setUploadError('');
      setFile(f);
    }
  };

  const text = {
    title: '',
    successMss: '',
    submitBtn: 'UPLOAD',
  };
  switch (props.importType) {
    case SPAImportType.ADJUST:
      text.title = 'Import bulk adjustments CSV';
      text.successMss = 'You have successfully imported bulk adjustments.';
      text.submitBtn = 'IMPORT';
      break;
    case SPAImportType.LIMIT:
      text.title = 'Import temporary credit limit CSV';
      text.successMss = 'You have successfully imported temporary credit limit CSV.';
      break;
    case SPAImportType.PERIOD:
      text.title = 'Import deferment period CSV';
      text.successMss = 'You have successfully imported deferment period CSV.';
      break;
  }

  const handleImport = () => {
    importFile(file, {
      onSuccess: (res: SmartpayAccountImportRes) => {
        setShowVerifyModal(false);
        if (res.errCsv) {
          const contentType = 'text/csv';
          setErrCsvFile(new Blob([res.errCsv], {type: contentType}));
          setImportError(true);
        } else {
          props.onDone('success', text.successMss);
        }
      },
    });
  };

  const handleValidateFile = () => {
    validateBulkAdjustFile(file).then(() => {
      setShowVerifyModal(true);
    });
  };

  const handleDownloadCSV = () => {
    downloadFile(
      errCsvFile,
      `spa-failed-imports-${formatDate(new Date(), {format: 'yyyyMMddhhmmss'})}.csv`,
    );
  };

  const loading = validateLoading || isLoading;
  const error = validateError || importFileError;

  return (
    <Modal isOpen onDismiss={props.onDismiss} aria-label={text.title}>
      <ModalHeader>{text.title}</ModalHeader>
      <ModalBody className="px-44 pt-7">
        {error && !loading && <QueryErrorAlert className="mb-2" error={error as any} />}
        {importError && props.importType !== SPAImportType.ADJUST && (
          <div className="rounded-md px-4 py-3 bg-error-100 mb-2">
            <div className="flex">
              <div className="flex-shrink-0 pt-0.25 mr-3">
                <DownloadIcon className="w-4 h-4 block text-error-500" />
              </div>
              <div className="text-left">
                <div className="text-sm leading-5 text-error-500">
                  Some rows were not imported due to invalid data. Download them{' '}
                  <span
                    style={{textDecoration: 'underline', cursor: 'pointer'}}
                    onClick={handleDownloadCSV}>
                    here
                  </span>
                  .
                </div>
              </div>
            </div>
          </div>
        )}
        {file ? (
          <FileItem file={file} onRemove={() => setFile(undefined)} />
        ) : (
          <>
            <Alert
              variant="info"
              description="Please upload ONE file at a time for file validation purposes."
            />
            <FieldContainer status={uploadError ? 'error' : 'success'} helpText={uploadError}>
              <FileSelector
                onFilesSelected={(files) => checkFileBeforeSet(files[0])}
                file={file}
                fileType={'csv'}
                description="CSV up to 5MB"
                className={'pt-4'}
              />
            </FieldContainer>
          </>
        )}
        {showVerifyModal && (
          <Modal
            isOpen
            onDismiss={() => setShowVerifyModal(false)}
            size={'small'}
            aria-label={'Validate bulk adjustment file'}>
            <ModalHeader>Are you sure you want to upload?</ModalHeader>
            <ModalBody>
              {importFileError && !isLoading && <QueryErrorAlert error={importFileError as any} />}
              <p>
                Please ensure that all data for this file is correct before uploading as they cannot
                be undone and edited later.
              </p>
              <div className={'rounded-lg border p-4 mt-4'}>
                <DescList isLoading={validateLoading}>
                  <DescItem label={'Transaction type'} value={validateRes?.transactionType} />
                  <DescItem
                    label={
                      <span>
                        Total of affected
                        <br /> accounts
                      </span>
                    }
                    value={validateRes?.totalTransaction}
                  />
                  <DescItem
                    label={
                      <span>
                        Total adjusted
                        <br /> amount
                      </span>
                    }
                    value={
                      validateRes?.totalAmount ? `RM ${formatMoney(validateRes.totalAmount)}` : ''
                    }
                  />
                </DescList>
              </div>
            </ModalBody>
            <ModalFooter className="text-right">
              <Button onClick={() => setShowVerifyModal(false)} variant="outline" className="mr-4">
                CANCEL
              </Button>
              <Button onClick={handleImport} isLoading={isLoading} variant="primary">
                CONFIRM
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalBody>
      <ModalFooter className="text-right">
        <Button onClick={props.onDismiss} variant="outline" className="mr-4">
          CANCEL
        </Button>
        <Button
          disabled={!file}
          isLoading={loading}
          onClick={props.importType === SPAImportType.ADJUST ? handleValidateFile : handleImport}
          variant="primary">
          {text.submitBtn}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
