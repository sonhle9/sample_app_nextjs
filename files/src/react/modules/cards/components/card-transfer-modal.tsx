import {
  Alert,
  AlertMessages,
  Button,
  DropdownSelect,
  Field,
  FileItem,
  FileSelector,
  HelpText,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  MoneyInput,
  Textarea,
  Dialog,
  DialogContent,
  DialogFooter,
  Badge,
  titleCase,
} from '@setel/portal-ui';
import * as React from 'react';
import {useDeleteRequest, useUpdateTransfer} from '../card.queries';
import {uploadFile} from '../card.service';
import {ETransferType, TransferDetails} from '../card.type';
import {useRouter} from '../../../routing/routing.context';
import {uniq} from '../../../lib/utils';
import {EApprovalRequestsStatus} from '../../approval-requests/approval-requests.enum';
import {colorByStatus} from '../../transactions/components/transaction-details';
import {EMessage} from '../card-message.-validate';

interface ITransferDetailsModalProps {
  visible: boolean;
  transfer?: TransferDetails;
  cardId?: string;
  onClose?: () => void;
}

function changeTransferType(type: ETransferType) {
  switch (type) {
    case ETransferType.GRANT:
      return 'Grants card balance (CR)';
    case ETransferType.REVOKE:
      return 'Revoke card balance (DR)';
    default:
      return '';
  }
}

export const TransferDetailsModal = (props: ITransferDetailsModalProps) => {
  const [errorMsg, setErrorMsg] = React.useState('');
  const [file, setFile] = React.useState(undefined);

  const [amount, setValue] = React.useState(
    props.transfer ? props.transfer.amount.toString() : null,
  );
  const [errAmount, setErrAmount] = React.useState('');

  const [transferType, setTransferType] = React.useState(
    props.transfer ? props.transfer.rawRequest.transferType.toString() : null,
  );
  const [errTransferType, setErrTransferType] = React.useState('');

  const [remark, setRemark] = React.useState(
    props.transfer ? props.transfer?.rawRequest?.remark : '',
  );
  const {mutate: setCardTransfer} = useUpdateTransfer(props.cardId);
  const [sending, setSending] = React.useState(false);
  const [urlAWS, setUrlAWS] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  const router = useRouter();

  const [err, setErr] = React.useState(false);

  const requestApprover =
    props.transfer?.status === EApprovalRequestsStatus.PENDING ||
    props.transfer?.status === EApprovalRequestsStatus.VERIFIED;
  const [visibleDeleteConfirm, setVisibleDeleteConfirm] = React.useState(false);
  const cancelRef = React.useRef(null);
  const {mutate: deleteRequest} = useDeleteRequest(props.transfer);
  const [isValidFile, setIsValidFile] = React.useState<boolean>(true);
  const sendForApproval = async () => {
    if (sending) {
      return;
    }
    if (!amount) {
      setErrAmount(EMessage.REQUIRED_FIELD);
      return;
    } else {
      setErrAmount('');
    }

    if (!transferType) {
      setErrTransferType(EMessage.REQUIRED_FIELD);
      return;
    } else {
      setErrTransferType('');
    }

    if (Number(amount) <= 0) {
      setErrAmount(EMessage.AMOUNT_GREATER_0);
      return;
    }
    setSending(true);
    setCardTransfer(
      {
        cardId: props.cardId,
        amount: Number(amount),
        transferType: transferType as ETransferType,
        ...(remark && {remark: remark}),
        ...(urlAWS && {attachment: urlAWS}),
        ...(fileName && {fileName: fileName}),
      },
      {
        onSuccess: (res: any) => {
          if (res.totalRecords === 1) {
            close();
            router.navigateByUrl(`/card-issuing/cards/${props.cardId}`);
          } else if (res.success === true) {
            close();
            router.navigateByUrl(`/card-issuing/cards/${props.cardId}`);
          } else if (res.success === false) {
            setErrorMsg(res.errorDescription);
            setErr(true);
          } else {
            setErrorMsg(res.message);
            setErr(true);
          }
          setSending(false);
        },
        onError: async (res: any) => {
          setErrorMsg(res?.message || '');
          setErr(true);
          const response = await (res.response && res.response.data);
          if (response && response.statusCode === 400) {
            if (!Array.isArray(response.message)) {
              setErrorMsg(response.message);
            } else if (Array.isArray(response.message) && !!response.message.length) {
              const messageErr = [];
              response.message.forEach((mess) => {
                messageErr.push(...Object.values(mess.constraints));
              });
              setErrorMsg(uniq(messageErr).join(', '));
            }
            return;
          }
          setSending(false);
        },
      },
    );
  };

  const onDeleteRequest = () => {
    deleteRequest(props.transfer.id, {
      onSuccess: () => {
        setVisibleDeleteConfirm(false);
        close();
        router.navigateByUrl(`/card-issuing/cards/${props.cardId}`);
      },
      onError: (e: any) => {
        setErrorMsg(e.response?.data?.message || '');
        setErr(true);
        setVisibleDeleteConfirm(false);
      },
    });
  };

  const handleUploadFile = (files: File[]) => {
    if (files[0].size > 10 * 1024 * 1024) {
      setErrorMsg('This file is too large to attach. The maximum supported file size is 10MB');
      setErr(true);
      setIsValidFile(false);
    } else {
      setErrorMsg('');
      setIsValidFile(true);
      setErr(false);
      setFile(files[0]);
      uploadFile(files[0])
        .then((res) => {
          if (res) {
            setUrlAWS(res);
            setFileName(files[0].name);
          }
        })
        .catch(async (res: any) => {
          const response = res.response && res.response.data;
          setErr(true);
          setErrorMsg(response?.response?.error);
        });
    }
  };

  const close = () => {
    setErrorMsg('');
    props.onClose();
  };

  return (
    <>
      <Modal
        isOpen={props.visible}
        onDismiss={close}
        aria-label={'update'}
        data-testid="update-modal">
        <ModalHeader>{props?.transfer ? 'View details' : 'Create new transfer'}</ModalHeader>
        {err && (
          <Alert variant="error" description="Something is wrong">
            <AlertMessages messages={[errorMsg].map((messageError) => titleCase(messageError))} />
          </Alert>
        )}
        <ModalBody className="space-y-4">
          {props?.transfer && (
            <Field className="sm:grid sm:grid-cols-4 sm:items-start">
              <Label className="pt-1">Approval status</Label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <Badge
                  className="tracking-wider font-semibold uppercase"
                  rounded="rounded"
                  color={colorByStatus[props.transfer?.status] || 'grey'}
                  style={{width: 'fit-content'}}>
                  {props.transfer?.status || 'none'}
                </Badge>
              </div>
            </Field>
          )}

          <Field className="sm:grid sm:grid-cols-4 sm:items-start">
            <Label className="pt-2 sm:col-span-1">Amount</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-1">
              <MoneyInput
                disabled={requestApprover}
                onChangeValue={(e) => {
                  setValue(e);
                }}
                value={amount || '0.00'}
                placeholder="0.00"
                className="w-56 text-sm"
              />
              {errAmount && <HelpText style={{color: 'red'}}>{errAmount}</HelpText>}
            </div>
          </Field>

          <Field className="sm:grid sm:grid-cols-4 sm:items-start">
            <Label className="pt-2">Transfer type</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <DropdownSelect
                disabled={requestApprover}
                className="w-64"
                name="targetType"
                placeholder="Please select"
                options={Object.values(ETransferType).map((value) => ({
                  value,
                  label: changeTransferType(value),
                }))}
                value={transferType}
                onChangeValue={(value) => {
                  setErrTransferType('');
                  setTransferType(value);
                }}
              />
              {errTransferType && <HelpText style={{color: 'red'}}>{errTransferType}</HelpText>}
            </div>
          </Field>

          <Field className="sm:grid sm:grid-cols-4 sm:items-start">
            <Label className="pt-2">Remarks</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-3 w-11/12">
              <Textarea
                disabled={requestApprover}
                value={remark}
                onChangeValue={setRemark}
                maxLength={500}
              />
            </div>
          </Field>

          <Field className="sm:grid sm:grid-cols-4 sm:items-start">
            <Label className="pt-2">Attachment</Label>
            {requestApprover ? (
              <div className="uppercase font-semibold text-xs text-brand-500 float-right col-span-3 tracking-wider mt-2">
                {' '}
                {(props.transfer?.attachments && props.transfer.rawRequest?.fileName) || ''}{' '}
              </div>
            ) : (
              <div className="mt-1 sm:mt-0 sm:col-span-3 w-9/12">
                <FileSelector
                  onFilesSelected={(files) => handleUploadFile(files)}
                  description="XLS, XLSX, CSV, TXT, PDF, DOC, DOCX, JPG, JPEG, GIF, PNG, BMP, RTF, HTML, ZIP or RAR up to 10MB"
                />
                {file && (
                  <FileItem
                    file={file}
                    onRemove={() => {
                      setErrorMsg('');
                      setErr(false);
                      setFile(null);
                    }}
                  />
                )}
              </div>
            )}
          </Field>
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center justify-between">
            <span></span>
            <div className="flex items-center">
              {requestApprover ? (
                <Button variant="error" onClick={() => setVisibleDeleteConfirm(true)}>
                  CANCEL REQUEST
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={close} className="mr-4">
                    CANCEL
                  </Button>
                  <Button
                    variant="primary"
                    onClick={sendForApproval}
                    disabled={(!amount && !transferType && !remark && !urlAWS) || !isValidFile}>
                    SEND FOR APPROVAL
                  </Button>
                </>
              )}
            </div>
          </div>
        </ModalFooter>
      </Modal>
      {visibleDeleteConfirm && (
        <Dialog
          className="mt-48"
          onDismiss={() => setVisibleDeleteConfirm(false)}
          leastDestructiveRef={cancelRef}>
          <DialogContent header="Cancel request">
            Are you sure you would like to cancel this request?
          </DialogContent>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setVisibleDeleteConfirm(false)}
              ref={cancelRef}>
              NO
            </Button>
            <Button variant="error" onClick={onDeleteRequest}>
              YES
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
};
