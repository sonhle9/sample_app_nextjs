import {
  Alert,
  Button,
  DownloadIcon,
  FieldContainer,
  FileItem,
  FileSelector,
  formatDate,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@setel/portal-ui';
import * as React from 'react';
import {QueryErrorAlert} from '../../../components/query-error-alert';
import {downloadFile} from '../../../lib/utils';
import {useParams} from '../../../routing/routing.context';
import {useImportSalesTerritory} from '../sales-territories.queries';
import {SalesTerritoryModalMessage} from '../sales-territories.type';

interface SalesTerritoryImportModalProps {
  onClose: (string) => void;
}

export const SalesTerritoryImportModal = (props: SalesTerritoryImportModalProps) => {
  const [file, setFile] = React.useState<File | undefined>(undefined);
  const [uploadError, setUploadError] = React.useState('');
  const [importError, setImportError] = React.useState({});
  const [invalidCsvFile, setInvalidCsvFile] = React.useState(new Blob());

  const params = useParams();

  const {
    mutate: importSalesTerritory,
    isLoading,
    error: importSalesTerritoryError,
  } = useImportSalesTerritory(params.id);

  const checkFileBeforeSet = (f: File) => {
    if (f.size > 10 * 1024 * 1024) {
      setUploadError('The file size cannot exceed 10MB.');
    } else {
      setUploadError('');
      setFile(f);
    }
  };

  const handleImport = () => {
    importSalesTerritory(file, {
      onSuccess: (res) => {
        const {duplicateMerchantIds, invalidInputSalesTerritoryCodes, invalidMerchantIds, errCsv} =
          res;
        let errors = '';
        if (duplicateMerchantIds.length) {
          errors = errors.concat(
            `Duplicate merchant ids in file: ${duplicateMerchantIds.join(', ')}. `,
          );
        }
        if (invalidMerchantIds.length) {
          errors = errors.concat(
            `Invalid merchant Ids in file: ${invalidMerchantIds.join(', ')}. `,
          );
        }
        if (invalidInputSalesTerritoryCodes.length) {
          errors = errors.concat(
            `Invalid sales territory codes: ${invalidInputSalesTerritoryCodes.join(', ')}.`,
          );
        }
        if (errors) {
          const contentType = 'text/csv';
          setInvalidCsvFile(new Blob([errCsv], {type: contentType}));
          setImportError({
            message: errors,
          });
        } else {
          props.onClose(SalesTerritoryModalMessage.IMPORT_SUCCESS);
        }
      },
    });
  };

  const handleDownloadCSV = () => {
    downloadFile(
      invalidCsvFile,
      `invalid-territory-merchants-${formatDate(new Date(), {format: 'yyyyMMddhhmmss'})}.csv`,
    );
  };

  const title = 'Import territory merchant linkage CSV';
  return (
    <>
      <Modal isOpen onDismiss={props.onClose} aria-label={title}>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody style={{paddingLeft: '11rem', paddingRight: '11rem'}}>
          {importSalesTerritoryError && (
            <QueryErrorAlert className="mb-2" error={importSalesTerritoryError as any} />
          )}
          {importError.hasOwnProperty('message') && (
            <>
              <QueryErrorAlert className="mb-2" error={importError as any} />
              <div className="rounded-md px-4 py-3 bg-error-100 mb-2">
                <div className="flex">
                  <div className="flex-shrink-0 pt-0.25 mr-3">
                    <DownloadIcon className="w-4 h-4 block text-error-500" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm leading-5 text-error-500">
                      Download merchants that have not been imported{' '}
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
            </>
          )}
          {file ? (
            <FileItem file={file} onRemove={() => setFile(undefined)} />
          ) : (
            <>
              <Alert variant="info" description="Please upload ONE file at a time for a preview." />
              <FieldContainer status={uploadError ? 'error' : 'success'} helpText={uploadError}>
                <FileSelector
                  onFilesSelected={(files) => checkFileBeforeSet(files[0])}
                  file={file}
                  fileType={'csv'}
                  description="CSV file up to 10MB"
                  className={'pt-4'}
                />
              </FieldContainer>
            </>
          )}
        </ModalBody>
        <ModalFooter className="text-right">
          <Button onClick={props.onClose} variant="outline" className="mr-4">
            CANCEL
          </Button>
          <Button disabled={!file || isLoading} onClick={handleImport} variant="primary">
            UPLOAD
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
