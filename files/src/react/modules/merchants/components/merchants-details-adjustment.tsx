import {
  Badge,
  Button,
  Card,
  CardHeading,
  DataTable as Table,
  DataTableCaption,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  Dialog,
  DialogContent,
  DialogFooter,
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
  Text,
  Textarea,
  TextInput,
  usePaginationState,
} from '@setel/portal-ui';
import jwt_decode from 'jwt-decode';
import * as React from 'react';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {useNotification} from 'src/react/hooks/use-notification';
import {TransactionSubType} from 'src/react/services/api-merchants.type';
import {merchantTrans} from '../../../../shared/helpers/pdb.roles.type';
import {formatMoneyCustom} from '../../../components/input-custom-with-label';
import {HasPermission} from '../../auth/HasPermission';
import {computeMerchantAvailableBalance, computeMerchantPrepaidBalance} from '../merchants.lib';
import {
  useAdjustmentTransaction,
  useCancelApprovalAdjustmentTrans,
  useCreatePrepaidAdjustmentTransaction,
} from '../merchants.queries';
import {Merchant} from '../merchants.type';

const destinationOptions = [
  {label: 'Available balance', value: 'AVAILABLE'},
  {label: 'Prepaid balance', value: 'PREPAID'},
];

const glProfileOptions = [
  {label: 'Fleet card', value: 'fleet_card'},
  {label: 'Gift card', value: 'gift_card'},
  {label: 'Loyalty card', value: 'loyalty_card'},
];

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

export function MerchantsDetailsAdjustment(props: {
  merchantId: string;
  merchant: Merchant;
  transactionEnabled: boolean;
}) {
  const [showAdjustmentForm, setShowAdjustmentForm] = React.useState(false);
  const [showAdjustmentDetails, setShowAdjustmentDetails] = React.useState(false);
  const [dataAdjustmentDetails, setDataAdjustmentDetails] = React.useState({} as any);
  const showMessage = useNotification();
  const {page, perPage, setPage, setPerPage} = usePaginationState();
  const {data} = useAdjustmentTransaction(props.merchantId, {page, perPage});
  const items = data && data.items ? data.items : [];

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
      status === 'PENDING' &&
      arrSubTypeNotCancel.indexOf(subType) < 0
    ) {
      return <span className="text-red-500">Cancel request</span>;
    }
    return <span className="text-brand-500">View Detail</span>;
  };

  return (
    <div>
      <Card>
        <CardHeading title="Merchant adjustment">
          {props.transactionEnabled && (
            <HasPermission accessWith={[merchantTrans.update_adjustment]}>
              <Button
                variant="outline"
                leftIcon={<PlusIcon />}
                onClick={() => setShowAdjustmentForm(true)}>
                CREATE
              </Button>
            </HasPermission>
          )}
        </CardHeading>
        <Table
          pagination={
            !!items.length && (
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
              <Td className="text-right w-40">Amount(RM)</Td>
              <Td>Approval status</Td>
              <Td>Adjustment type</Td>
              <Td>Created on</Td>
              <Td className="text-right pr-8">Action</Td>
            </Tr>
          </DataTableRowGroup>
          {Array.isArray(items) && items.length ? (
            <DataTableRowGroup>
              {data.items.map((item: any, i: number) => {
                return (
                  <Tr key={'adjustment-' + i}>
                    <Td className="text-right">{formatMoney(item.amount, '')}</Td>
                    <Td>{renderApprovalStatus(item.status)}</Td>
                    <Td>{item.subType}</Td>
                    <Td>{formatDate(item.createdAt)}</Td>
                    <Td className="text-right pr-8">
                      <Text
                        className="cursor-pointer uppercase font-bold text-xs"
                        onClick={() => {
                          setDataAdjustmentDetails(item);
                          setShowAdjustmentDetails(true);
                        }}>
                        {renderAction(item.userId, item.enterpriseId, item.status, item.subType)}
                      </Text>
                    </Td>
                  </Tr>
                );
              })}
            </DataTableRowGroup>
          ) : (
            <DataTableCaption>
              <div className="py-8">
                <p className="text-center text-gray-400 text-sm">No data available.</p>
              </div>
            </DataTableCaption>
          )}
        </Table>
      </Card>
      <AdjustmentForm
        merchantId={props.merchantId}
        merchant={props.merchant}
        isOpen={showAdjustmentForm}
        onDone={() => {
          setShowAdjustmentForm(false);
          showMessage({
            title: 'Created',
          });
        }}
        onCancel={() => setShowAdjustmentForm(false)}
      />
      <AdjustmentDetails
        isOpen={showAdjustmentDetails}
        data={dataAdjustmentDetails}
        onCancel={() => setShowAdjustmentDetails(false)}
      />
    </div>
  );
}

const AdjustmentForm = (props: {
  merchantId: string;
  merchant?: Merchant;
  isOpen: boolean;
  onDone: (message?: string) => void;
  onCancel: () => void;
}) => {
  const {
    mutate: createAdjustment,
    isLoading,
    error,
  } = useCreatePrepaidAdjustmentTransaction(props.merchantId);
  const [showResError, setShowResError] = React.useState(false);
  const [amount, setAmount] = React.useState('');
  const [remark, setRemark] = React.useState('');
  const [reference, setReference] = React.useState('');
  const [assignment, setAssignment] = React.useState('');
  const [adjustDestination, setAdjustDestination] = React.useState('');
  const [glProfile, setGlProfile] = React.useState('');
  const [file, setFile] = React.useState<File>(undefined);
  const [isSending, setIsSending] = React.useState(false);
  const [amountError, setAmountError] = React.useState('');
  const [referenceError, setReferenceError] = React.useState('');
  const [assignmentError, setAssignmentError] = React.useState('');
  const [adjTargetError, setAdjTargetError] = React.useState('');
  const [glProfileError, setGlProfileError] = React.useState('');
  const [fileError, setFileError] = React.useState('');
  const allowedFileType = [
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

  const availableBalance = props.merchant ? computeMerchantAvailableBalance(props.merchant) : 0;
  const prepaidBalance = props.merchant ? computeMerchantPrepaidBalance(props.merchant) : 0;
  const isGlProfileEnabled =
    props.merchant?.settlementsEnabled === true && props.merchant.payoutEnabled === true;

  return (
    <Modal aria-label="Adjustment Modal" isOpen={props.isOpen} onDismiss={props.onCancel}>
      <ModalHeader>Create adjustment</ModalHeader>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          if (
            !amount ||
            !reference ||
            !assignment ||
            !adjustDestination ||
            (isGlProfileEnabled && !glProfile) ||
            !file
          ) {
            if (!amount) {
              setAmountError('This field is required.');
            }
            if (!reference) {
              setReferenceError('This field is required.');
            }
            if (!assignment) {
              setAssignmentError('This field is required.');
            }
            if (!adjustDestination) {
              setAdjTargetError('This field is required.');
            }
            if (isGlProfileEnabled && !glProfile) {
              setGlProfileError('This field is required.');
            }
            if (!file) {
              setFileError('This field is required.');
            }
            return;
          }

          setIsSending(true);
          createAdjustment(
            {
              merchantId: props.merchantId,
              amount,
              remark,
              reference,
              assignment,
              adjustDestination,
              glProfile: glProfile ? glProfile : undefined,
              file,
            },
            {
              onSuccess: () => {
                setIsSending(false);
                props.onDone();
                setAmount('');
                setRemark('');
                setReference('');
                setAssignment('');
                setGlProfile('');
                setAdjustDestination('');
                setFile(undefined);
              },
              onSettled: () => {
                setIsSending(false);
                setShowResError(true);
              },
            },
          );
        }}>
        <ModalBody>
          {error && showResError && (
            <div className="pb-4">
              <QueryErrorAlert error={error as any} description="Error while create adjustment" />
            </div>
          )}
          <FieldContainer label="Available balance" layout="horizontal-responsive">
            <MoneyInput value={formatMoney(availableBalance)} disabled />
          </FieldContainer>
          <FieldContainer label="Prepaid balance" layout="horizontal-responsive">
            <MoneyInput value={formatMoney(prepaidBalance)} disabled />
          </FieldContainer>
          <FieldContainer
            label="Amount"
            layout="horizontal"
            status={amountError ? 'error' : undefined}
            helpText={amountError}>
            <MoneyInput
              allowNegative
              value={amount}
              disabled={isLoading}
              onChangeValue={(val) => {
                setAmount(formatMoneyCustom(val));
                setAmountError('');
              }}
            />
          </FieldContainer>
          <FieldContainer label="Remark" layout="horizontal">
            <Textarea
              value={remark}
              onChangeValue={setRemark}
              placeholder="Enter remark"
              disabled={isLoading}
            />
          </FieldContainer>
          <FieldContainer
            label="Reference"
            layout="horizontal"
            status={referenceError ? 'error' : undefined}
            helpText={referenceError}>
            <TextInput
              value={reference}
              onChangeValue={(val) => {
                setReference(val);
                setReferenceError('');
              }}
              placeholder="Enter reference"
              disabled={isLoading}
            />
          </FieldContainer>
          <FieldContainer
            label="Assignment"
            layout="horizontal"
            status={assignmentError ? 'error' : undefined}
            helpText={assignmentError}>
            <TextInput
              value={assignment}
              onChangeValue={(val) => {
                setAssignment(val);
                setAssignmentError('');
              }}
              placeholder="Enter assignment"
              disabled={isLoading}
            />
          </FieldContainer>
          <FieldContainer
            label="GL profile"
            layout="horizontal"
            status={glProfileError ? 'error' : undefined}
            helpText={glProfileError}>
            <DropdownSelect
              value={glProfile}
              options={glProfileOptions}
              placeholder="Select profile"
              onChangeValue={(val) => {
                setGlProfile(val);
                setGlProfileError('');
              }}
              className={'w-48'}
              disabled={isLoading || isGlProfileEnabled !== true}
            />
          </FieldContainer>
          <FieldContainer
            label="Adjustment target"
            layout="horizontal"
            status={adjTargetError ? 'error' : undefined}
            helpText={adjTargetError}>
            <DropdownSelect
              value={adjustDestination}
              options={destinationOptions}
              placeholder="Select adjustment target"
              onChangeValue={(val) => {
                setAdjustDestination(val);
                setAdjTargetError('');
              }}
              className={'w-48'}
              disabled={isLoading}
            />
          </FieldContainer>
          <FieldContainer
            label="Attachment"
            layout="horizontal"
            status={fileError ? 'error' : undefined}
            helpText={fileError}>
            {file ? (
              <FileItem
                file={file}
                onRemove={() => {
                  setFile(undefined);
                }}
              />
            ) : (
              <FileSelector
                onFilesSelected={(files) => {
                  const fileAttachment = files[0];
                  const fileAttachmentFullName = fileAttachment.name.split('.');
                  const fileAttachmentExtent =
                    fileAttachmentFullName[fileAttachmentFullName.length - 1];
                  if (allowedFileType.indexOf(fileAttachmentExtent) < 0) {
                    setFileError(
                      `This file type is not permitted. Here are the file types allowed: ${allowedFileType.join(
                        ', ',
                      )}.`,
                    );
                  } else if (fileAttachment.size > 10 * 1024 * 1024) {
                    setFileError('Maximum file size allowed: 10MB.');
                  } else {
                    setFileError('');
                    setFile(fileAttachment);
                  }
                }}
                accept={allowedFileType.map((o) => `.${o}`).join(',')}
                description="PDF or CSV file up to 10MB"
                disabled={isLoading}
              />
            )}
          </FieldContainer>
        </ModalBody>
        <ModalFooter className="text-right">
          <Button
            variant="outline"
            onClick={() => {
              setShowResError(false);
              setAmount('');
              setRemark('');
              setReference('');
              setAssignment('');
              setGlProfile('');
              setAdjustDestination('');
              setFile(undefined);
              props.onCancel();
            }}>
            CANCEL
          </Button>
          <Button type="submit" variant="primary" className="ml-2" isLoading={isSending}>
            SEND FOR APPROVAL
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

const AdjustmentDetails = (props: {isOpen: boolean; data: any; onCancel: () => void}) => {
  const {mutate: cancelApprovalAdjustmentTrans, isLoading} = useCancelApprovalAdjustmentTrans(
    props.data?.attributes?.approvalRequestId,
  );
  const [visibleDeleteConfirm, setVisibleDeleteConfirm] = React.useState(false);
  const showMessage = useNotification();
  const cancelRef = React.useRef(null);

  const session = localStorage.getItem('session');
  const sessionObj = JSON.parse(session);
  const payloadObj = jwt_decode(sessionObj.accessToken);

  if (Object.keys(props.data)) {
    const importedFileUrl = props.data?.attributes?.attachment;
    let importedFileName;
    if (importedFileUrl) {
      const arr = importedFileUrl.split('/');
      importedFileName = arr[arr.length - 1];
    }

    return (
      <>
        <Modal aria-label="Adjustment Modal" isOpen={props.isOpen} onDismiss={props.onCancel}>
          <ModalHeader>View details</ModalHeader>
          <ModalBody>
            <FieldContainer label="Approval status" layout="horizontal">
              {renderApprovalStatus(props.data?.status)}
            </FieldContainer>
            <FieldContainer label="Amount" layout="horizontal">
              <MoneyInput allowNegative value={formatMoney(props.data.amount)} disabled={true} />
            </FieldContainer>
            <FieldContainer label="Remark" layout="horizontal">
              <Textarea value={props.data?.attributes?.remark} onChangeValue={() => {}} disabled />
            </FieldContainer>
            <FieldContainer label="Reference" layout="horizontal">
              <TextInput
                value={props.data?.attributes?.reference}
                onChangeValue={() => {}}
                disabled
              />
            </FieldContainer>
            <FieldContainer label="Assignment" layout="horizontal">
              <TextInput
                value={props.data?.attributes?.assignment}
                onChangeValue={() => {}}
                disabled
              />
            </FieldContainer>
            <FieldContainer label="GL profile" layout="horizontal">
              <DropdownSelect
                value={props.data?.glProfile}
                options={glProfileOptions}
                onChangeValue={() => {}}
                placeholder="Select profile"
                className={'w-min'}
                disabled
              />
            </FieldContainer>
            <FieldContainer label="Adjustment target" layout="horizontal">
              <DropdownSelect
                value={props.data?.attributes?.destinationBalance}
                options={destinationOptions}
                onChangeValue={() => {}}
                className={'w-min'}
                disabled
              />
            </FieldContainer>

            <FieldContainer label="Attachment" layout="horizontal-responsive">
              <a href={importedFileUrl || '#'} className={'font-bold text-brand-500'}>
                <Text className="text-brand-500 uppercase font-bold text-xs">
                  {importedFileName}
                </Text>
              </a>
            </FieldContainer>
          </ModalBody>

          {payloadObj?.sub === props.data?.userId &&
            props.data?.enterpriseId === 'pdb' &&
            props.data?.status === 'PENDING' &&
            arrSubTypeNotCancel.indexOf(props.data?.subType) < 0 && (
              <ModalFooter className="text-right">
                <Button variant="error" onClick={() => setVisibleDeleteConfirm(true)}>
                  CANCEL REQUEST
                </Button>
              </ModalFooter>
            )}
        </Modal>

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
              <Button
                variant="error"
                isLoading={isLoading}
                onClick={() =>
                  // cancelApprovalAdjustmentTrans(props.data?.id, {
                  cancelApprovalAdjustmentTrans(props.data?.attributes?.approvalRequestId, {
                    onSuccess: () => {
                      showMessage({
                        title: 'success',
                      });
                    },
                    onError: (err: any) => {
                      showMessage({
                        title: err?.message || 'Error',
                        variant: 'error',
                      });
                    },
                    onSettled: () => {
                      setVisibleDeleteConfirm(false);
                      props.onCancel();
                    },
                  })
                }>
                YES
              </Button>
            </DialogFooter>
          </Dialog>
        )}
      </>
    );
  }
};
