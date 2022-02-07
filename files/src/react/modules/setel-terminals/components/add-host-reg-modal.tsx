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
  DropdownMultiSelect,
} from '@setel/portal-ui';
import * as React from 'react';
import {
  SetelTerminalNotificationMessage,
  TerminalHostRegAcquirerTypeOptions,
  TerminalHostRegCardBrandOptions,
} from '../setel-terminals.const';
import {useAddHostTerminalReg} from '../setel-terminals.queries';
import {Formik, Form} from 'formik';
import {validationAddHostSchema} from '../setel-terminals.schema';
import {filterCardBrand} from '../setel-terminals.helper';

interface IAddHostRegModal {
  serialNum: string;
  visible: boolean;
  onClose?: () => void;
  onSuccessUpdate?: (message: string) => void;
}

const AddHostRegModal = ({serialNum, visible, onClose, onSuccessUpdate}: IAddHostRegModal) => {
  const title = 'Add TID/MID configuration';
  const [errorMessage, setErrorMessage] = React.useState<string[]>([]);
  const {mutate, isLoading} = useAddHostTerminalReg();

  const handleAddHostTerminal = async ({values, actions}) => {
    const addHostTerminalReg = {
      acquirerType: values.acquirerType,
      cardBrand: values.cardBrand,
      merchantId: values.merchantId,
      terminalId: values.terminalId,
    };

    mutate(
      {serialNum: serialNum, request: addHostTerminalReg},
      {
        onSuccess: () => {
          onSuccessUpdate(SetelTerminalNotificationMessage.CREATE_SUCCESS);
          onClose();
        },
        onError: (e: any) => {
          const errorMessage = e.response?.data?.message;
          setErrorMessage([errorMessage].flat());
        },
      },
    );
    actions.setSubmitting(false);
  };

  const initialValues = {
    acquirerType: '',
    cardBrand: [],
    merchantId: '',
    terminalId: '',
  };

  return (
    <Modal
      isOpen={visible}
      onDismiss={onClose}
      aria-label={title}
      data-testid="add-terminal-host-modal">
      <Formik
        initialValues={initialValues}
        validationSchema={validationAddHostSchema}
        onSubmit={async (values, actions) => handleAddHostTerminal({values, actions})}>
        {({values, errors, isSubmitting, setFieldValue}) => (
          <Form data-testid="add-terminal-host-form">
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>
              {errorMessage.length > 0 && (
                <Alert className="mb-2" variant="error" description="Wrong validation">
                  <AlertMessages messages={errorMessage} />
                </Alert>
              )}
              <Fieldset legend="CLOSE/OPEN LOOP CARD">
                <FieldContainer
                  status={errors.acquirerType ? 'error' : undefined}
                  helpText={errors.acquirerType ? errors.acquirerType : undefined}
                  label="Acquirer type"
                  layout="horizontal-responsive">
                  <DropdownSelect
                    data-testid="terminal-host-acquirer-type-input"
                    className="w-2/3"
                    placeholder="Select acquirer type"
                    value={values.acquirerType}
                    onChangeValue={(value) => {
                      setFieldValue('acquirerType', value);
                      setFieldValue('cardBrand', []);
                    }}
                    options={TerminalHostRegAcquirerTypeOptions}
                  />
                </FieldContainer>
                <FieldContainer
                  status={errors.cardBrand ? 'error' : undefined}
                  helpText={errors.cardBrand ? errors.cardBrand : undefined}
                  label="Card type"
                  layout="horizontal-responsive">
                  <DropdownMultiSelect
                    data-testid="terminal-host-card-brand-input"
                    className="w-full"
                    placeholder="Select card type"
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
                    data-testid="terminal-host-terminal-id-input"
                    className="w-2/3"
                    value={values.terminalId}
                    onChange={(e) => setFieldValue('terminalId', e.target.value)}
                    placeholder="Enter TID"
                  />
                </FieldContainer>
              </Fieldset>
            </ModalBody>
            <ModalFooter>
              <div className="flex items-center justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>
                  CANCEL
                </Button>
                <Button
                  isLoading={isLoading}
                  disabled={!validationAddHostSchema.isValidSync(values) || isSubmitting}
                  data-testid="terminal-host-submit"
                  type="submit"
                  variant="primary">
                  SAVE CHANGES
                </Button>
              </div>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddHostRegModal;
