import {
  Badge,
  Button,
  CardHeading,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DropdownSelect,
  FieldContainer,
  FileItem,
  FileSelector,
  formatDate,
  formatMoney,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  MoneyInput,
  PaginationNavigation,
  PlusIcon,
  Skeleton,
  TextareaField,
  TextField,
  usePaginationState,
  Card,
  Text,
  Dialog,
  DialogContent,
  DialogFooter,
  DataTableCaption,
} from '@setel/portal-ui';
import * as React from 'react';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {useNotification} from 'src/react/hooks/use-notification';
import {
  useCancelApprovalExternalTopupTrans,
  useExternalTopupTransaction,
  useSendForApprovalExternalTopupTrans,
} from '../merchants.queries';
import {Transaction} from '../../collections/collections.type';
import {TransactionSubType} from 'src/react/services/api-merchants.type';
import jwt_decode from 'jwt-decode';
import {merchantTrans} from '../../../../shared/helpers/pdb.roles.type';
import {HasPermission} from '../../auth/HasPermission';
import {computeMerchantAvailableBalance, computeMerchantPrepaidBalance} from '../merchants.lib';
import {Merchant} from '../merchants.type';

enum ExternalTopUpApprovalStatus {
  pending = 'PENDING',
  approved = 'APPROVED',
  reject = 'REJECT',
}

const arrSubTypeNotCancel = [
  TransactionSubType.BULK_ADJUSTMENT_AVAILABLE,
  TransactionSubType.BULK_ADJUSTMENT_PREPAID,
  TransactionSubType.BULK_TOPUP_AVAILABLE,
  TransactionSubType.BULK_TOPUP_PREPAID,
];

const renderApprovalStatus = (status: string) => {
  switch (status) {
    case 'VERIFIED':
    case 'SUCCEEDED':
    case 'APPROVED':
      return (
        <Badge rounded="rounded" color="turquoise" className="uppercase">
          {status}
        </Badge>
      );
    case 'REJECTED':
      return (
        <Badge rounded="rounded" color="error" className="uppercase">
          {status}
        </Badge>
      );
    case 'PENDING':
      return (
        <Badge rounded="rounded" color="lemon" className="uppercase">
          {status}
        </Badge>
      );
    default:
      return (
        <Badge rounded="rounded" color="offwhite" className="uppercase">
          {status}
        </Badge>
      );
  }
};

export const MerchantDetailExternalTopup = (props: {
  merchantId: string;
  merchant: Merchant;
  transactionEnabled: boolean;
}) => {
  const [showCreateExternalTopupModal, setShowCreateExternalTopupModal] = React.useState(false);

  const {page, perPage, setPage, setPerPage} = usePaginationState();
  const {data, isLoading} = useExternalTopupTransaction(props.merchantId, {
    page,
    perPage,
  });
  const transactions: any[] = data?.items || [];

  const [transSelected, setTransSelected] = React.useState(undefined);

  const session = localStorage.getItem('session');
  const sessionObj = JSON.parse(session);
  const payloadObj = jwt_decode(sessionObj.accessToken);

  const renderAction = (
    userId: string,
    enterpriseId: string,
    status: string,
    subType: TransactionSubType,
  ) => {
    if (
      payloadObj?.sub === userId &&
      enterpriseId === 'pdb' &&
      status === ExternalTopUpApprovalStatus.pending &&
      arrSubTypeNotCancel.indexOf(subType) < 0
    ) {
      return <span className="text-red-500">Cancel request</span>;
    }
    return <span className="text-brand-500">View Detail</span>;
  };

  const paymentMethodColumnName = 'REMARK';

  return (
    <div className="my-8">
      <Card>
        <CardHeading title="Merchant top-up">
          {props.transactionEnabled && (
            <HasPermission accessWith={[merchantTrans.update_top_up]}>
              <Button
                onClick={() => {
                  setTransSelected(undefined);
                  setShowCreateExternalTopupModal(true);
                }}
                variant="outline"
                minWidth="none"
                leftIcon={<PlusIcon />}>
                CREATE
              </Button>
            </HasPermission>
          )}
        </CardHeading>
        <Modal
          isOpen={showCreateExternalTopupModal}
          onDismiss={() => setShowCreateExternalTopupModal(false)}
          aria-label="Create top-up">
          <CreateExternalTopUpForm
            topup={transSelected}
            merchantId={props.merchantId}
            merchant={props.merchant}
            onDone={() => setShowCreateExternalTopupModal(false)}
            onCancel={() => setShowCreateExternalTopupModal(false)}
          />
        </Modal>
        <DataTable
          pagination={
            !!transactions.length && (
              <PaginationNavigation
                currentPage={page}
                perPage={perPage}
                total={data ? data.total : 0}
                onChangePage={setPage}
                onChangePageSize={setPerPage}
              />
            )
          }>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td className={'text-right w-40'}>AMOUNT(RM)</Td>
              <Td>APPROVAL STATUS</Td>
              <Td>{paymentMethodColumnName}</Td>
              <Td>CREATED ON</Td>
              <Td className={'text-right pr-8'}>ACTION</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {isLoading &&
              [1, 2, 3].map((index) => (
                <Tr key={index}>
                  <Td>
                    <Skeleton className={'w-24 h-6 float-right rounded animate-pulse'} />
                  </Td>
                  <Td>
                    <Skeleton className={'w-48 h-6 rounded animate-pulse'} />
                  </Td>
                  <Td>
                    <Skeleton className={'w-48 h-6 rounded animate-pulse'} />
                  </Td>
                  <Td>
                    <Skeleton className={'w-48 h-6 rounded animate-pulse'} />
                  </Td>
                  <Td>
                    <Skeleton className={'w-48 h-6 float-right rounded animate-pulse'} />
                  </Td>
                </Tr>
              ))}
            {transactions.map((item, index) => (
              <Tr key={index}>
                <Td className={'text-right'}>{formatMoney(item.amount)}</Td>
                <Td>{renderApprovalStatus(item.status)}</Td>
                <Td>{item.paymentMethod === 'cheque' ? 'Cheque' : 'Bank transfer (external)'}</Td>
                <Td>{formatDate(item.createdAt)}</Td>
                <Td className={'text-right pr-8'}>
                  <Text
                    className="cursor-pointer uppercase font-bold text-xs"
                    onClick={() => {
                      setTransSelected(item);
                      setShowCreateExternalTopupModal(true);
                    }}>
                    {renderAction(item.userId, item.enterpriseId, item.status, item.subType)}
                  </Text>
                </Td>
              </Tr>
            ))}
          </DataTableRowGroup>
          {!isLoading && transactions.length === 0 && (
            <DataTableCaption>
              <div className="py-8">
                <p className="text-center text-gray-400 text-sm">No data available.</p>
              </div>
            </DataTableCaption>
          )}
        </DataTable>
      </Card>
    </div>
  );
};

const CreateExternalTopUpForm = (props: {
  topup?: Transaction;
  merchantId: string;
  merchant?: Merchant;
  onDone: () => void;
  onCancel: () => void;
}) => {
  const [paymentMethod, setPaymentMethod] = React.useState(
    props.topup?.paymentMethod || props.topup?.attributes?.paymentMethod || '',
  );
  const [amount, setAmount] = React.useState(props.topup?.amount || '0');

  const transRemarks = props.topup?.attributes?.remark;

  const [remark, setRemark] = React.useState(
    transRemarks
      ? typeof transRemarks === 'string'
        ? transRemarks
        : transRemarks.length > 0
        ? transRemarks[0]
        : ''
      : '',
  );
  const [reference, setReference] = React.useState(props.topup?.attributes?.reference || '');
  const [assignment, setAssignment] = React.useState(props.topup?.attributes?.assignment || '');
  const [topupTarget, setTopupTarget] = React.useState(
    props.topup?.attributes?.destinationBalance || '',
  );
  const [file, setFile] = React.useState(undefined);
  const [fileError, setFileError] = React.useState(undefined);

  const [isShowError, setShowError] = React.useState(false);

  const attachment = props.topup?.attributes?.attachment || '';
  let attachmentFileName = '';
  if (attachment) {
    const index = attachment.lastIndexOf('/');
    if (index >= 0) {
      attachmentFileName = attachment.substring(index + 1);
    } else {
      attachmentFileName = attachment;
    }
  }

  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const {
    mutate: sendForApproval,
    error: createError,
    isLoading: isCreateLoading,
  } = useSendForApprovalExternalTopupTrans(props.merchantId);
  const {
    mutateAsync: cancelApproval,
    error: cancelError,
    isLoading: isCancelLoading,
  } = useCancelApprovalExternalTopupTrans();

  const paymentMethodOptions = [
    {
      label: 'Cheque',
      value: 'cheque',
    },
    {
      label: 'Bank transfer (external)',
      value: 'bank_transfer',
    },
  ];

  const topupTargetOptions = [
    {
      label: 'Available balance',
      value: 'AVAILABLE',
    },
    {
      label: 'Prepaid balance',
      value: 'PREPAID',
    },
  ];

  const error = createError || cancelError;
  const isLoading = isCreateLoading || isCancelLoading;

  React.useEffect(() => {
    if (!file && isShowError) {
      setFileError('Please select a file.');
    }
  }, [file, isShowError]);
  const showMessage = useNotification();

  const handleCancelApproval = () => {
    cancelApproval(props.topup?.attributes?.approvalRequestId, {
      onSuccess: () => {
        showMessage({
          title: 'Success',
        });
      },
      onError: (err: any) => {
        showMessage({
          title: err?.message || 'Error',
          variant: 'error',
        });
      },
    }).then(() => {
      setVisibleDeleteConfirm(false);
      props.onCancel();
    });
  };

  const handleSendForApproval = () => {
    setIsSubmitted(true);
    if (!formHasError) {
      sendForApproval(
        {
          merchantId: props.merchantId,
          paymentMethod: paymentMethod as any,
          amount: Number(amount),
          remark,
          reference,
          assignment,
          attachment: file.name,
          topUpTarget: topupTarget as any,
          transactionDate: new Date().toISOString(),
          file,
        },
        {
          onSuccess: () => {
            showMessage({
              title: 'Created',
            });
            props.onDone();
          },
        },
      );
    } else {
      setShowError(true);
    }
  };

  const [referenceError, setReferenceError] = React.useState('');
  const [assignmentError, setAssignmentError] = React.useState('');

  React.useEffect(() => {
    if (!reference) {
      setReferenceError('Please enter this field.');
    } else {
      setReferenceError('');
    }

    if (!assignment) {
      setAssignmentError('Please enter this field.');
    } else {
      setAssignmentError('');
    }
  }, [reference, assignment]);

  const formHasError = props.topup
    ? false
    : !file ||
      !paymentMethod ||
      referenceError ||
      assignmentError ||
      !topupTarget ||
      Number(amount) <= 0;

  const FILE_EXTENSION_SUPPORTED = [
    'xls',
    'xlsx',
    'csv',
    'txt',
    'pdf',
    'doc',
    'docx',
    'jpg',
    'jpeg',
    'gif',
    'png',
    'bmp',
    'rtf',
    'html',
    'zip',
    'rar',
  ];

  const [visibleDeleteConfirm, setVisibleDeleteConfirm] = React.useState(false);
  const cancelRef = React.useRef(null);

  const subType: any = props.topup?.subType;

  const session = localStorage.getItem('session');
  const sessionObj = JSON.parse(session);
  const payloadObj = jwt_decode(sessionObj.accessToken);

  const availableBalance = props.merchant ? computeMerchantAvailableBalance(props.merchant) : 0;
  const prepaidBalance = props.merchant ? computeMerchantPrepaidBalance(props.merchant) : 0;

  return (
    <>
      <ModalHeader>{props.topup ? 'Top-up details' : 'Create top-up'}</ModalHeader>
      <>
        <ModalBody>
          {error && <QueryErrorAlert error={error as any} />}
          {props.topup && (
            <FieldContainer label="Approval status" layout="horizontal-responsive">
              {renderApprovalStatus(props.topup.status)}
            </FieldContainer>
          )}
          {!props.topup && (
            <>
              <FieldContainer label="Available balance" layout="horizontal-responsive">
                <MoneyInput value={formatMoney(availableBalance)} disabled />
              </FieldContainer>
              <FieldContainer label="Prepaid balance" layout="horizontal-responsive">
                <MoneyInput value={formatMoney(prepaidBalance)} disabled />
              </FieldContainer>
            </>
          )}
          <FieldContainer
            label="Payment method"
            layout="horizontal-responsive"
            status={props.topup || !isSubmitted ? undefined : !paymentMethod ? 'error' : 'success'}
            helpText={isShowError && !paymentMethod ? 'Please enter this field.' : ''}>
            <DropdownSelect<string>
              className={'w-64'}
              value={paymentMethod}
              onChangeValue={setPaymentMethod}
              options={paymentMethodOptions}
              placeholder={'Select method'}
              disabled={isLoading || !!props.topup}
            />
          </FieldContainer>
          <FieldContainer
            label="Amount"
            layout="horizontal-responsive"
            status={
              props.topup || !isSubmitted ? undefined : Number(amount) <= 0 ? 'error' : 'success'
            }
            helpText={isShowError && Number(amount) <= 0 ? 'Amount must be more then 0' : ''}>
            <MoneyInput
              value={`${amount}`}
              onChangeValue={setAmount}
              disabled={isLoading || !!props.topup}
            />
          </FieldContainer>
          <TextareaField
            label="Remark"
            disabled={isLoading || !!props.topup}
            value={remark}
            onChangeValue={setRemark}
            layout="horizontal-responsive"
            placeholder={props.topup ? '' : 'Enter remark'}
          />
          <TextField
            className={'w-96'}
            label="Reference"
            value={reference}
            disabled={isLoading || !!props.topup}
            onChangeValue={setReference}
            layout="horizontal-responsive"
            placeholder="Enter reference"
            status={props.topup || !isSubmitted ? undefined : referenceError ? 'error' : 'success'}
            helpText={isShowError ? referenceError : ''}
            required
          />
          <TextField
            className={'w-96'}
            label="Assignment"
            value={assignment}
            disabled={isLoading || !!props.topup}
            onChangeValue={setAssignment}
            layout="horizontal-responsive"
            placeholder="Enter assignment"
            status={props.topup || !isSubmitted ? undefined : assignmentError ? 'error' : 'success'}
            helpText={isShowError ? assignmentError : ''}
            required
          />
          <FieldContainer
            label="Top up target"
            layout="horizontal-responsive"
            status={props.topup || !isSubmitted ? undefined : !topupTarget ? 'error' : 'success'}
            helpText={isShowError && !topupTarget ? 'Please select top-up target' : ''}>
            <DropdownSelect<string>
              className={'w-64'}
              value={topupTarget}
              onChangeValue={setTopupTarget}
              options={topupTargetOptions}
              placeholder={'Select top up target'}
              disabled={isLoading || !!props.topup}
            />
          </FieldContainer>
          {props.topup ? (
            <FieldContainer label="Attachment" layout="horizontal-responsive">
              <a href={attachment || '#'} className={'font-bold text-brand-500'}>
                {attachmentFileName}
              </a>
            </FieldContainer>
          ) : !file ? (
            <FieldContainer
              label="Attachment"
              layout="horizontal-responsive"
              status={fileError ? 'error' : 'success'}
              helpText={fileError}>
              <FileSelector
                file={file}
                onFilesSelected={(files) => {
                  const f = files[0];
                  setFileError('');
                  if (f) {
                    if (f.size > 10 * 1024 * 1024) {
                      setFileError('The file size cannot exceed 10MB.');
                    } else if (!FILE_EXTENSION_SUPPORTED.includes(f.name.split('.').pop())) {
                      setFileError(
                        'This file type is not permitted. Here are the file types allowed: ' +
                          '\n xls, xlsx, csv, txt, pdf, doc, docx, jpg, jpeg, gif, png, bmp, rtf, HTML, zip and rar.',
                      );
                    } else {
                      setFileError('');
                      setFile(f);
                    }
                  }
                }}
                description="File size up to 10MB"
                accept={
                  '.xls,.xlsx,.csv,.txt,.pdf,.doc,.docx,.jpg,.jpeg,.gif,.png,.bmp,rtf,.html,.zip,.rar'
                }
              />
            </FieldContainer>
          ) : (
            <FieldContainer label="Attachment" layout="horizontal-responsive">
              <FileItem file={file} className="mb-2 w-96" onRemove={() => setFile(undefined)} />
            </FieldContainer>
          )}
          {props.topup && (
            <FieldContainer label={'Created on'} layout={'horizontal-responsive'}>
              <p className={'text-sm'}>{formatDate(props.topup.createdAt)}</p>
            </FieldContainer>
          )}
        </ModalBody>
        <ModalFooter className="text-right">
          {payloadObj?.sub === props.topup?.userId &&
          props.topup?.enterpriseId === 'pdb' &&
          props.topup?.status === ExternalTopUpApprovalStatus.pending &&
          arrSubTypeNotCancel.indexOf(subType) < 0 ? (
            <Button variant="error" onClick={() => setVisibleDeleteConfirm(true)}>
              CANCEL REQUEST
            </Button>
          ) : (
            <>
              <Button
                onClick={props.onCancel}
                variant="outline"
                className={!props.topup ? 'mr-2' : ''}>
                {props.topup ? 'OK' : 'CANCEL'}
              </Button>
              {!props.topup && (
                <Button variant={'primary'} isLoading={isLoading} onClick={handleSendForApproval}>
                  SEND FOR APPROVAL
                </Button>
              )}
            </>
          )}
        </ModalFooter>
      </>

      {visibleDeleteConfirm && (
        <Dialog onDismiss={() => setVisibleDeleteConfirm(false)} leastDestructiveRef={cancelRef}>
          <DialogContent header="Are you sure to cancel the request?">
            This action cannot be undone and you will not be able to recover any data.
          </DialogContent>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setVisibleDeleteConfirm(false)}
              ref={cancelRef}>
              NO
            </Button>
            <Button variant="error" isLoading={isCancelLoading} onClick={handleCancelApproval}>
              YES
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
};
