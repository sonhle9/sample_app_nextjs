import {
  Button,
  Card,
  DataTable,
  DataTableCaption,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup as Tg,
  DotVerticalIcon,
  DropdownMenu,
  FieldContainer,
  FileItem,
  FileSelector,
  InfoIcon,
  Modal,
  PaginationNavigation,
  Tooltip,
  UploadIcon,
  usePaginationState,
} from '@setel/portal-ui';
import * as React from 'react';
import {formatDate} from '@setel/web-utils';
import {
  useDeleteSmartpayFile,
  useGetSmartpayFiles,
  useGetSmartpayFileUrlSigned,
  useUploadSmartpayFiles,
} from '../../merchants.queries';
import {useNotification} from '../../../../hooks/use-notification';
import {QueryErrorAlert} from '../../../../components/query-error-alert';
import {MerchantSmartpayFile} from '../../merchants.type';
import {downloadFileFromLink} from 'src/react/lib/utils';

export const SmartpayDetailsFileManager = (props: {applicationId: string}) => {
  const {page, perPage, setPage, setPerPage} = usePaginationState();
  const {data, isFetching, isLoading} = useGetSmartpayFiles(props.applicationId, {
    page,
    perPage,
  });
  const {mutateAsync: getSignedUrl} = useGetSmartpayFileUrlSigned();

  const showMessage = useNotification();
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = React.useState(false);
  const [fileSelected, setFileSelected] = React.useState<MerchantSmartpayFile>();

  const handleDownloadFile = (fileId: string, filename: string) => {
    getSignedUrl(fileId)
      .then((signedUrl) => {
        downloadFileFromLink(signedUrl, filename);
      })
      .catch(() => {
        showMessage({
          title: 'Error',
          variant: 'error',
          description: 'Failed to download file. Please try again',
        });
      });
  };

  const calculateFileSize = (sizeInByte: number): number => {
    const sizeInMb = Math.round((sizeInByte * 100) / (1024 * 1024));
    return sizeInMb < 1 ? 0.01 : sizeInMb / 100;
  };

  return (
    <Card>
      <Card.Heading title={'File manager'}>
        <Button
          variant={'outline'}
          leftIcon={<UploadIcon />}
          onClick={() => setShowUploadModal(true)}>
          UPLOAD
        </Button>
        {showUploadModal && (
          <UploadFileModal
            id={props.applicationId}
            onDone={() => {
              setShowUploadModal(false);
              showMessage({
                title: 'Successfully',
                description: 'Files has been successfully uploaded.',
              });
            }}
            onDismiss={() => setShowUploadModal(false)}
          />
        )}
      </Card.Heading>
      <Card.Content className={'p-0'}>
        <DataTable
          isLoading={isLoading}
          isFetching={isFetching}
          pagination={
            <PaginationNavigation
              currentPage={page}
              perPage={perPage}
              total={data ? data.total : 0}
              onChangePage={setPage}
              onChangePageSize={setPerPage}
            />
          }>
          <Tg groupType={'thead'}>
            <Tr>
              <Td className={'pl-7'}>File name</Td>
              <Td className={'w-40'}>Size</Td>
              <Td className={'w-40'}>Type</Td>
              <Td className={'w-96 text-right'}>Created on</Td>
              <Td className={'w-20 text-right'} />
            </Tr>
          </Tg>
          <Tg>
            {data?.items.map((file) => (
              <Tr key={file.id}>
                <Td className={'pl-7'}>{file.fileName}</Td>
                <Td>{calculateFileSize(file.size)} MB</Td>
                <Td className={'uppercase'}>{file.type}</Td>
                <Td className={'text-right'}>{formatDate(file.createdAt)}</Td>
                <Td className={'text-right'}>
                  <DropdownMenu
                    variant="icon"
                    label={<DotVerticalIcon className="w-5 h-5 text-lightgrey" />}>
                    <DropdownMenu.Items className="min-w-32">
                      <DropdownMenu.Item
                        onSelect={() => handleDownloadFile(file.id, file.fileName)}>
                        Download
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onSelect={() => {
                          setFileSelected(file);
                          setShowConfirmDeleteModal(true);
                        }}>
                        Delete
                      </DropdownMenu.Item>
                    </DropdownMenu.Items>
                  </DropdownMenu>
                </Td>
              </Tr>
            ))}
            {showConfirmDeleteModal && fileSelected && (
              <ConfirmDeleteFileModal
                file={fileSelected}
                onDismiss={() => setShowConfirmDeleteModal(false)}
                onDone={() => {
                  setShowConfirmDeleteModal(false);
                  showMessage({
                    title: 'Successfully',
                    description: 'Files has been successfully deleted.',
                  });
                }}
              />
            )}
          </Tg>
          {data?.items.length === 0 && (
            <DataTableCaption>
              <div className="w-full flex items-center justify-center py-9 text-sm text-gray-400">
                No data available.
              </div>
            </DataTableCaption>
          )}
        </DataTable>
      </Card.Content>
    </Card>
  );
};

const UploadFileModal = (props: {onDismiss: () => void; onDone: () => void; id: string}) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [fileError, setFileError] = React.useState('');

  const {mutate: upload, error, isLoading} = useUploadSmartpayFiles(props.id);

  const handleUpload = () => {
    if (files.length > 0) {
      upload(files, {
        onSuccess: props.onDone,
      });
    }
  };

  const hasFileError = (files: File[]): boolean => {
    let hasError = false;
    files.map((f) => {
      if (f.size > 10 * 1024 * 1024) {
        hasError = true;
      }
    });
    return hasError;
  };

  return (
    <Modal isOpen onDismiss={props.onDismiss} aria-label={'smartpay-file-manager-upload'}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpload();
        }}>
        <Modal.Header>Upload file</Modal.Header>
        <Modal.Body>
          <div className={'px-40 py-5'}>
            {!isLoading && error && (
              <div className={'mb-5'}>
                <QueryErrorAlert error={error as any} />
              </div>
            )}
            <FieldContainer status={fileError ? 'error' : undefined} helpText={fileError}>
              <FileSelector
                multiple
                onFilesSelected={(newFiles) => {
                  setFileError('');
                  if (!hasFileError(newFiles)) {
                    setFiles((fs) => fs.concat(newFiles));
                  } else {
                    setFileError('Files size exceeds 10MB. Please select another file.');
                  }
                }}
                description={
                  <span className={'flex justify-center pu-pointer-events-auto'}>
                    <span className={'mr-1'}>Supported files up to 10MB</span>
                    <Tooltip
                      title="Format accepted"
                      label={
                        <>
                          <p>XLS, XLSX, CSV, TXT, PDF, DOC, DOCX, JPG</p>
                          <p>JPEG, GIF, PNG, BMP, RTF, HTML, ZIP, RAR</p>
                        </>
                      }>
                      <InfoIcon className="w-4 h-4 fill-current text-gray-400" />
                    </Tooltip>
                  </span>
                }
                accept={
                  '.xls,.xlsx,.csv,.txt,.pdf,.doc,.docx,.jpg,.jpeg,.gif,.png,.bmp,.rtf,.html,.zip,.rar'
                }
              />
            </FieldContainer>
            {files.length > 0 && (
              <div className="space-y-2 py-2 overflow-y-auto max-h-80">
                {files.map((file, index) => (
                  <FileItem
                    key={index}
                    file={file}
                    onRemove={() => setFiles((fs) => fs.filter((_, i) => i !== index))}
                  />
                ))}
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className={'text-right space-x-3'}>
          <Button variant="outline" onClick={props.onDismiss}>
            CANCEL
          </Button>
          <Button variant="primary" type={'submit'} isLoading={isLoading}>
            SAVE
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

const ConfirmDeleteFileModal = (props: {
  onDismiss: () => void;
  onDone: () => void;
  file: MerchantSmartpayFile;
}) => {
  const {mutate: deleteFile, error, isLoading} = useDeleteSmartpayFile();

  const handleDelete = () => {
    deleteFile(props.file.id, {
      onSuccess: props.onDone,
    });
  };
  return (
    <Modal isOpen onDismiss={props.onDismiss} aria-label={'confirm-delete-file-modal'}>
      <Modal.Header>Are you sure to delete file?</Modal.Header>
      <Modal.Body>
        {!isLoading && error && (
          <div className={'mb-5'}>
            <QueryErrorAlert error={error as any} />
          </div>
        )}
        This action cannot be undone. Once deleted, this file will be deleted from the file list.
      </Modal.Body>
      <Modal.Footer className={'text-right space-x-3'}>
        <Button variant="outline" onClick={props.onDismiss}>
          CANCEL
        </Button>
        <Button variant="error" onClick={handleDelete} isLoading={isLoading}>
          DELETE
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
