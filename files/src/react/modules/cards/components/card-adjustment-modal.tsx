import {
  Alert,
  AlertMessages,
  Button,
  Field,
  FileItem,
  FileSelector,
  HelpText,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Textarea,
  Dialog,
  DialogContent,
  DialogFooter,
  Badge,
  MoneyInput,
  titleCase,
  DropdownSelect,
  TextInput,
} from '@setel/portal-ui';
import * as React from 'react';
import {useDeleteRequest, useUpdateAdjustment} from '../card.queries';
import {AdjustmentDetails, EAdjustmentTarget, EAdjustmentType} from '../card.type';
import {uploadFile} from '../card.service';
import {useRouter} from '../../../routing/routing.context';
import {uniq} from '../../../lib/utils';
import {EApprovalRequestsStatus} from '../../approval-requests/approval-requests.enum';
import {colorByStatus} from '../../transactions/components/transaction-details';
import {convertToSensitiveNumber} from 'src/app/cards/shared/common';
import {EMessage} from '../card-message.-validate';

interface IAdjustmentDetailsModalProps {
  visible: boolean;
  adjustment?: AdjustmentDetails;
  cardId?: string;
  onClose?: () => void;
}

function changeAdjustmentType(type: EAdjustmentType) {
  switch (type) {
    case EAdjustmentType.GRANT:
      return 'Grants card balance (CR)';
    case EAdjustmentType.REVOKE:
      return 'Revoke card balance (DR)';
    default:
      return '';
  }
}

function changeAdjustmentTarget(type: EAdjustmentTarget) {
  switch (type) {
    case EAdjustmentTarget.OWNER:
      return 'Own card';
    case EAdjustmentTarget.OTHER:
      return 'Other card';
    default:
      return '';
  }
}

interface Validate {
  amount?: string;
  adjustmentTarget?: string;
  adjustmentType?: string;
  cardNumberTarget?: string;
}

function validInput(e: string) {
  if (e === 'Backspace' || e === 'Control' || !isNaN(Number(e))) {
    return false;
  }
  return true;
}

export const AdjustmentDetailsModal = (props: IAdjustmentDetailsModalProps) => {
  const [errorMsg, setErrorMsg] = React.useState('');
  const [file, setFile] = React.useState(undefined);
  const [adjustmentType, setAdjustmentType] = React.useState(
    props.adjustment ? props.adjustment.rawRequest.adjustmentType?.toString() : null,
  );

  const [cardNumberTarget, setCardNumberTarget] = React.useState(
    props.adjustment ? props.adjustment.rawRequest?.cardNumberTarget?.toString() : '',
  );
  const [adjustmentTarget, setAdjustmentTarget] = React.useState(
    props.adjustment ? props.adjustment.rawRequest?.adjustmentTarget?.toString() : null,
  );
  const [amount, setValue] = React.useState(
    props.adjustment ? props.adjustment.amount.toString() : '',
  );

  const [remark, setRemark] = React.useState(
    props.adjustment ? props.adjustment?.rawRequest?.remark : '',
  );
  const {mutate: setCardAdjustment} = useUpdateAdjustment(props.cardId);
  const [sending, setSending] = React.useState(false);
  const [urlAWS, setUrlAWS] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  // const [fileError, setFileError] = React.useState<string>('');

  const router = useRouter();

  const cancelRef = React.useRef(null);
  const [visibleDeleteConfirm, setVisibleDeleteConfirm] = React.useState(false);
  const requestApprover =
    props.adjustment?.status === EApprovalRequestsStatus.PENDING ||
    props.adjustment?.status === EApprovalRequestsStatus.VERIFIED;

  const {mutate: deleteRequest} = useDeleteRequest(props.adjustment);
  const [isValidFile, setIsValidFile] = React.useState<boolean>(true);
  const [validate, setValidate] = React.useState<Validate>({
    amount: '',
    adjustmentTarget: '',
    adjustmentType: '',
    cardNumberTarget: '',
  });

  const validator = () => {
    const validates: Validate = {};
    if (!adjustmentTarget) {
      validates['adjustmentTarget'] = EMessage.REQUIRED_FIELD;
    }
    if (adjustmentTarget === EAdjustmentTarget.OWNER && !adjustmentType) {
      validates['adjustmentType'] = EMessage.REQUIRED_FIELD;
    }
    if (adjustmentTarget === EAdjustmentTarget.OTHER && !cardNumberTarget) {
      validates['cardNumberTarget'] = EMessage.REQUIRED_FIELD;
    }
    if (!amount || Number(amount) <= 0) {
      validates['amount'] = EMessage.AMOUNT_GREATER_0;
    }
    setValidate(validates);
    return Object.keys(validates).length === 0;
  };

  const sendForApproval = async () => {
    if (!validator() || sending) {
      return;
    }

    setSending(true);
    setCardAdjustment(
      {
        cardId: props.cardId,
        amount: Number(amount),
        ...(adjustmentType && {adjustmentType: adjustmentType}),
        ...(remark && {remark: remark}),
        ...(adjustmentTarget && {adjustmentTarget: adjustmentTarget}),
        ...(cardNumberTarget && {cardNumberTarget: cardNumberTarget}),
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
          } else {
            setErrorMsg(res.message);
          }
          setSending(false);
        },
        onError: async (res: any) => {
          console.log(res?.response);
          setErrorMsg(res?.response?.message?.data || '');
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
          } else if (response && (response.statusCode === 500 || response.statusCode === 404)) {
            setErrorMsg(response?.message || '');
          }
          setSending(false);
        },
      },
    );
  };

  const onDeleteRequest = () => {
    deleteRequest(props.adjustment.id, {
      onSuccess: () => {
        setVisibleDeleteConfirm(false);
        close();
        router.navigateByUrl(`/card-issuing/cards/${props.cardId}`);
      },
      onError: (e: any) => {
        setErrorMsg(e.response?.data?.message || '');
        setVisibleDeleteConfirm(false);
      },
    });
  };

  const handleUploadFile = (files: File[]) => {
    if (files[0].size > 10 * 1024 * 1024) {
      setErrorMsg('This file is too large to attach. The maximum supported file size is 10MB');
      setIsValidFile(false);
    } else {
      setErrorMsg('');
      setIsValidFile(true);
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
        <ModalHeader>{props?.adjustment ? 'Cancel request' : 'Create new adjustment'}</ModalHeader>
        {errorMsg?.length > 0 && (
          <Alert variant="error" description="Something is wrong">
            <AlertMessages messages={[errorMsg].map((messageError) => titleCase(messageError))} />
          </Alert>
        )}
        <ModalBody className="space-y-4">
          {props?.adjustment && (
            <Field className="sm:grid sm:grid-cols-4 sm:items-start">
              <Label className="pt-1">Approval status</Label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <Badge
                  className="tracking-wider font-semibold uppercase"
                  rounded="rounded"
                  color={colorByStatus[props.adjustment?.status] || 'grey'}
                  style={{width: 'fit-content'}}>
                  {props.adjustment?.status || 'none'}
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
                  setErrorMsg('');
                  setValidate({});
                  setValue(e);
                }}
                value={
                  requestApprover ? convertToSensitiveNumber(Number(amount)) : amount || '0.00'
                }
                className="w-60 text-right appearance-none text-sm "
              />
              {validate?.amount && <HelpText style={{color: 'red'}}>{validate.amount}</HelpText>}
            </div>
          </Field>
          <Field className="sm:grid sm:grid-cols-4 sm:items-start">
            <Label className="pt-2 sm:col-span-1">Adjustment target</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-1">
              <DropdownSelect
                disabled={requestApprover}
                className="w-64"
                name="targetType"
                placeholder="Please select"
                options={Object.values(EAdjustmentTarget).map((value) => ({
                  value,
                  label: changeAdjustmentTarget(value),
                }))}
                value={adjustmentTarget}
                onChangeValue={(value) => {
                  setErrorMsg('');
                  setValidate({});
                  if (value === EAdjustmentTarget.OTHER) {
                    setAdjustmentType(null);
                  } else {
                    setCardNumberTarget(null);
                  }

                  setAdjustmentTarget(value);
                }}
              />
              {validate?.adjustmentTarget && (
                <HelpText style={{color: 'red'}}>{validate.adjustmentTarget}</HelpText>
              )}
            </div>
          </Field>

          {adjustmentTarget === EAdjustmentTarget.OTHER && (
            <Field className="sm:grid sm:grid-cols-4 sm:items-start">
              <Label className="pt-2 sm:col-span-1">Card number</Label>
              <div className="mt-1 sm:mt-0 sm:col-span-1">
                <TextInput
                  disabled={requestApprover || adjustmentTarget !== EAdjustmentTarget.OTHER}
                  className="w-64"
                  name="targetType"
                  placeholder="Enter other card number"
                  value={cardNumberTarget}
                  onKeyDown={(e) => {
                    if (e.key === '-') {
                      e.preventDefault();
                    }
                  }}
                  onChangeValue={(value) => {
                    setErrorMsg('');
                    setValidate({});
                    if (!validInput(value.trim())) {
                      setCardNumberTarget(value.trim());
                    }
                  }}
                />
                {validate?.cardNumberTarget && (
                  <HelpText style={{color: 'red'}}>{validate.cardNumberTarget}</HelpText>
                )}
              </div>
            </Field>
          )}

          <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start">
            <Label className="pt-2">Adjustment type</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-1">
              <DropdownSelect
                disabled={requestApprover || adjustmentTarget !== EAdjustmentTarget.OWNER}
                className="w-64"
                name="targetType"
                placeholder="Please select"
                options={Object.values(EAdjustmentType).map((value) => ({
                  value,
                  label: changeAdjustmentType(value),
                }))}
                value={adjustmentType}
                onChangeValue={(value) => {
                  setErrorMsg('');
                  setValidate({});
                  setAdjustmentType(value);
                }}
              />
              {validate?.adjustmentType && (
                <HelpText style={{color: 'red'}}>{validate.adjustmentType}</HelpText>
              )}
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
                {props.adjustment?.rawRequest?.fileName}{' '}
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
                    disabled={(!amount && !remark && !urlAWS && !adjustmentType) || !isValidFile}>
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
