import {
  Modal,
  ModalHeader,
  ModalBody,
  Alert,
  AlertMessages,
  FieldContainer,
  TextInput,
  ModalFooter,
  Button,
  Fieldset,
  DropdownSelect,
  Checkbox,
  DropdownMultiSelect,
  BareButton,
} from '@setel/portal-ui';
import * as React from 'react';
import {
  SetelTerminalNotificationMessage,
  TerminalHostRegAcquirerTypeOptions,
  TerminalHostRegCardBrandOptions,
  TerminalSwitchSource,
  SetelTerminalMessage,
} from '../setel-terminals.const';
import {
  useDeleteHostTerminalReg,
  useEditHostTerminalReg,
  useCheckPendingSettlement,
} from '../setel-terminals.queries';
import {
  IsPendingSettlementRes,
  ISubmitButtonType,
  ITerminalGetPendingSettlementReq,
  ITerminalHostTerminalRegistration,
} from 'src/react/services/api-terminal.type';
import {Formik, Form} from 'formik';
import {validationEditHostSchema} from '../setel-terminals.schema';
import {filterCardBrand} from '../setel-terminals.helper';
import HostDeleteDialog from './host-delete.dialog';

interface IEditHostRegModal {
  data: ITerminalHostTerminalRegistration;
  serialNum: string;
  hostId: string;
  visible: boolean;
  onClose?: () => void;
  onSuccessUpdate?: (message: string) => void;
}

const EditHostRegModal = ({
  data,
  serialNum,
  hostId,
  visible,
  onClose,
  onSuccessUpdate,
}: IEditHostRegModal) => {
  const title = 'Edit TID/MID configuration';
  const [showHostDeleteDialog, setShowHostDeleteDialog] = React.useState(false);
  const closeHostDeleteDialog = () => setShowHostDeleteDialog(false);
  const [errorMessage, setErrorMessage] = React.useState<string[]>([]);
  const [infoMessage, setInfoMessage] = React.useState<string[]>([]);
  const [acquirerType] = React.useState(data.acquirerType);
  const [cardBrand] = React.useState(data.cardBrand);
  const [merchantId] = React.useState(data.merchantId);
  const [terminalId] = React.useState(data.terminalId);
  const [isEnabled] = React.useState(data?.isEnabled);
  const [batchNum] = React.useState(data.batchNum);
  const params: ITerminalGetPendingSettlementReq = {
    source: TerminalSwitchSource.SETEL,
    merchantId,
    terminalId,
    acquirerType,
    batchNum,
    acquirerTID: terminalId,
    acquirerMID: merchantId,
  };
  const editHost = useEditHostTerminalReg();
  const deleteHost = useDeleteHostTerminalReg();
  const {data: pendingSettlementData} = useCheckPendingSettlement(params);

  const handleEditHostTerminal = ({values, actions}) => {
    const {isPendingSettlement, isOpenBatch}: IsPendingSettlementRes = pendingSettlementData;
    const editHostTerminalReg = {
      acquirerType: values.acquirerType,
      cardBrand: values.cardBrand,
      merchantId: values.merchantId,
      terminalId: values.terminalId,
      isEnabled: values.isEnabled,
    };
    if (!isPendingSettlement && !isOpenBatch) {
      editHost.mutate(
        {serialNum: serialNum, hostId: hostId, request: editHostTerminalReg},
        {
          onSuccess: () => {
            actions.setSubmitting(false);
            onSuccessUpdate(SetelTerminalNotificationMessage.UPDATE_SUCCESS);
            onClose();
          },
          onError: (e: any) => {
            const errorMessage = e.response?.data?.message;
            setErrorMessage([errorMessage].flat());
          },
        },
      );
    } else {
      setInfoMessage([SetelTerminalMessage.HAS_PENDING_SETTLEMENT].flat());
    }
  };

  const handleDeleteHostTerminal = () => {
    const {isPendingSettlement, isOpenBatch}: IsPendingSettlementRes = pendingSettlementData;
    if (!isPendingSettlement && !isOpenBatch) {
      deleteHost.mutate(
        {serialNum: serialNum, hostId: hostId},
        {
          onSuccess: () => {
            onSuccessUpdate(SetelTerminalNotificationMessage.DELETE_SUCCESS);
            onClose();
          },
          onError: (e: any) => {
            const errorMessage = e.response?.data?.message;
            setErrorMessage([errorMessage].flat());
          },
        },
      );
    } else {
      setInfoMessage([SetelTerminalMessage.HAS_PENDING_SETTLEMENT].flat());
    }
  };

  const handleSubmitButtonDisabled = ({values, isEnabled}: ISubmitButtonType) => {
    let result: boolean = false;
    // current is Enabled
    if (isEnabled && infoMessage.length > 0) result = true;
    else if (isEnabled && values.isEnabled) result = true;
    else result = false;
    // current is Disabled
    if (!isEnabled && validationEditHostSchema.isValidSync(values) && infoMessage.length === 0)
      result = false;
    if (!isEnabled && validationEditHostSchema.isValidSync(values) && infoMessage.length !== 0)
      result = true;
    if (!isEnabled && !validationEditHostSchema.isValidSync(values)) result = true;

    return result;
  };

  const initialValues = {
    acquirerType: acquirerType,
    cardBrand: cardBrand,
    merchantId: merchantId,
    terminalId: terminalId,
    isEnabled: isEnabled,
    batchNum: batchNum,
  };

  return (
    <Modal
      isOpen={visible}
      onDismiss={onClose}
      aria-label={title}
      data-testid="edit-terminal-host-modal">
      <Formik
        initialValues={initialValues}
        validationSchema={validationEditHostSchema}
        onSubmit={(values, actions) => handleEditHostTerminal({values, actions})}>
        {({values, errors, setFieldValue}) => (
          <Form data-testid="add-terminal-host-form">
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>
              {errorMessage.length > 0 && (
                <Alert className="mb-2" variant="error" description="Wrong validation">
                  <AlertMessages messages={errorMessage} />
                </Alert>
              )}
              {infoMessage.length > 0 && (
                <Alert className="mb-2" variant="info" description={infoMessage} />
              )}
              <Fieldset legend="CLOSE/OPEN LOOP CARD">
                <FieldContainer
                  status={errors.acquirerType ? 'error' : undefined}
                  helpText={errors.acquirerType ? errors.acquirerType : undefined}
                  label="Acquirer type"
                  layout="horizontal-responsive">
                  <DropdownSelect
                    disabled
                    aria-disabled="true"
                    data-testid="terminal-host-acquirer-type-input"
                    className="w-2/3"
                    placeholder="Select acquirer type"
                    value={values.acquirerType}
                    onChange={(value) => setFieldValue('acquirerType', value)}
                    options={TerminalHostRegAcquirerTypeOptions as any}
                  />
                </FieldContainer>
                <FieldContainer
                  status={errors.cardBrand ? 'error' : undefined}
                  helpText={errors.cardBrand ? errors.cardBrand : undefined}
                  label="Card type"
                  layout="horizontal-responsive">
                  <DropdownMultiSelect
                    disabled={infoMessage.length === 0 && !isEnabled ? false : true}
                    aria-disabled={infoMessage.length === 0 && !isEnabled ? 'false' : 'true'}
                    data-testid="terminal-host-card-brand-input"
                    className="w-full"
                    placeholder="Select card type"
                    showSelected={true}
                    values={values.cardBrand}
                    onChangeValues={(value) => setFieldValue('cardBrand', value)}
                    options={filterCardBrand(TerminalHostRegCardBrandOptions, values.acquirerType)}
                  />
                </FieldContainer>
                <FieldContainer
                  status={errors.merchantId ? 'error' : undefined}
                  helpText={errors.merchantId ? errors.merchantId : undefined}
                  label="MID"
                  layout="horizontal-responsive">
                  <TextInput
                    disabled={infoMessage.length === 0 && !isEnabled ? false : true}
                    aria-disabled={infoMessage.length === 0 && !isEnabled ? 'false' : 'true'}
                    data-testid="terminal-host-merchant-id-input"
                    className="w-2/3"
                    value={values.merchantId}
                    onChange={(e) => setFieldValue('merchantId', e.target.value)}
                    placeholder="Enter MID"
                  />
                </FieldContainer>
                <FieldContainer
                  status={errors.terminalId ? 'error' : undefined}
                  helpText={errors.terminalId ? errors.terminalId : undefined}
                  label="TID"
                  layout="horizontal-responsive">
                  <TextInput
                    disabled={infoMessage.length === 0 && !isEnabled ? false : true}
                    aria-disabled={infoMessage.length === 0 && !isEnabled ? 'false' : 'true'}
                    data-testid="terminal-host-terminal-id-input"
                    className="w-2/3"
                    value={values.terminalId}
                    onChange={(e) => setFieldValue('terminalId', e.target.value)}
                    placeholder="Enter TID"
                  />
                </FieldContainer>
                <FieldContainer label="Status" layout="horizontal-responsive">
                  <Checkbox
                    disabled={infoMessage.length === 0 ? false : true}
                    aria-disabled={infoMessage.length === 0 ? 'false' : 'true'}
                    data-testid="terminal-host-is-enabled-input"
                    onChangeValue={(value) => setFieldValue('isEnabled', value)}
                    checked={values.isEnabled}
                    label={'Enabled'}
                  />
                </FieldContainer>
              </Fieldset>
            </ModalBody>
            <ModalFooter>
              <div
                className={`${
                  isEnabled || infoMessage.length > 0 ? 'justify-end' : 'justify-between'
                } flex items-center`}>
                <BareButton
                  className={`${
                    isEnabled || infoMessage.length > 0 ? 'hidden' : 'block'
                  } text-red-500`}
                  onClick={() => setShowHostDeleteDialog(true)}>
                  DELETE
                </BareButton>
                <div className="flex items-center justify-end space-x-2">
                  <Button variant="outline" onClick={onClose}>
                    CANCEL
                  </Button>
                  <Button
                    isLoading={editHost.isLoading}
                    disabled={handleSubmitButtonDisabled({values, isEnabled})}
                    data-testid="terminal-host-submit"
                    type="submit"
                    variant="primary">
                    SAVE CHANGES
                  </Button>
                </div>
              </div>
            </ModalFooter>
          </Form>
        )}
      </Formik>
      <HostDeleteDialog
        isVisible={showHostDeleteDialog}
        onConfirm={handleDeleteHostTerminal}
        onClose={closeHostDeleteDialog}
      />
    </Modal>
  );
};

export default EditHostRegModal;
