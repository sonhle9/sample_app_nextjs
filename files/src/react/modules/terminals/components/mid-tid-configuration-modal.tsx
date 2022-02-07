import {
  Alert,
  AlertMessages,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text,
  classes,
  Skeleton,
} from '@setel/portal-ui';
import * as React from 'react';
import {useMutation, useQueryClient} from 'react-query';
import {AcquirerTypeOptions, CardBrandOptions, AcquirerStatus} from '../terminals.constant';
import {ACQUIRERS, ACQUIRER_DETAIL, useAcquirerDetails} from '../terminals.queries';
import {createAcquirer, deleteAcquirer, updateAcquirer} from '../terminals.service';
import {IAcquirer, ITerminal} from '../terminals.type';
import {AcquirerSchema} from '../terminals.schema';
import {AcquirersType} from 'src/app/api-switch.service';
import {getTerminalSwitchBatches} from '../../terminal-switch-batches/terminal-switch-batches.service';
import {BatchStatus} from '../../terminal-switch-batches/terminal-switch-batches.type';
import _ from 'lodash';
import {DeleteAcquirerConfirmationDialog} from './delete-acquirer.toggle';
import {Formik} from 'formik';
import {
  FormikCheckboxField,
  FormikDropdownField,
  FormikMultiSelectField,
  FormikTextField,
} from 'src/react/components/formik';
import {CardBrand} from '@setel/payment-interfaces';

interface ITerminalsModalProps {
  visible: boolean;
  terminal?: ITerminal;
  acquirer?: IAcquirer;
  onClose?: () => void;
  onSuccessCreate?: Function;
  onSuccessUpdate?: (message: string) => void;
  isLoading?: boolean;
  isError?: boolean;
}

interface IAddAcquirerModalProps {
  visible: boolean;
  terminal?: ITerminal;
  acquirerId: string;
  onClose?: () => void;
  onSuccessCreate?: Function;
  onSuccessUpdate?: (message: string) => void;
}

export const EditAcquirerModal = ({
  acquirerId,
  terminal,
  visible,
  onClose,
  onSuccessCreate,
  onSuccessUpdate,
}: IAddAcquirerModalProps) => {
  const {data, isLoading, isError} = useAcquirerDetails({
    acquirerId,
    terminalId: terminal?.terminalId,
    merchantId: terminal?.merchant?.id,
  });

  return AcquirerModal({
    acquirer: data,
    terminal,
    visible,
    onClose,
    onSuccessCreate,
    onSuccessUpdate,
    isError,
    isLoading,
  });
};

export const AcquirerModal = ({
  acquirer,
  terminal,
  visible,
  isError,
  isLoading,
  onClose,
  onSuccessCreate,
  onSuccessUpdate,
}: ITerminalsModalProps) => {
  const [cardBrands, setCardBrands] = React.useState([]);
  const [currentCardBrands, setCurrentCardBrands] = React.useState([]);
  const [terminalId] = React.useState<string>((terminal && terminal.terminalId) || '');
  const [acquirerType, setAcquirerType] = React.useState<AcquirersType | string>(
    acquirer?.acquirerType || '',
  );
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState([]);
  const {mutateAsync: mutateCreateTerminal, isLoading: isCreateLoading} =
    useMutation(createAcquirer);
  const {mutateAsync: mutateUpdateTerminal, isLoading: isUpdateLoading} =
    useMutation(updateAcquirer);
  const queryClient = useQueryClient();
  const {mutateAsync: mutateDeleteTerminal, isLoading: isDeleteLoading} =
    useMutation(deleteAcquirer);
  const [hasOpenBatches, setHasOpenBatches] = React.useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = React.useState(false);
  const [isHide, setIsHide] = React.useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = React.useState(null);

  const initialValues = React.useMemo(() => {
    return {
      status: acquirer?.status === AcquirerStatus.ACTIVE ? ['true'] : [],
      cardBrands: acquirer?.cardBrands || [],
      acquirerType: acquirer?.acquirerType,
      mid: acquirer?.mid,
      tid: acquirer?.tid,
    };
  }, [acquirer]);

  React.useEffect(() => {
    if (acquirer) {
      setAcquirerType(acquirer.acquirerType);
      setCardBrands(acquirer.cardBrands);
      setCurrentCardBrands(acquirer.cardBrands);
      setIsEditMode(true);
    }
  }, [acquirer]);

  const checkOpenBatches = async (listCardBrands: CardBrand[]) => {
    const {switchBatches} = await getTerminalSwitchBatches({
      terminalId: terminal.terminalId,
      cardBrands: listCardBrands,
      acquirerType,
      status: BatchStatus.OPEN,
    });

    return switchBatches.length > 0;
  };

  React.useEffect(() => {
    const checkTerminalOpenBatches = async () => {
      setHasOpenBatches(await checkOpenBatches(_.union([...cardBrands, ...currentCardBrands])));
    };
    if (acquirer && terminal && cardBrands.length) {
      checkTerminalOpenBatches();
    }
  }, [cardBrands, acquirerType, acquirer]);

  const handleDeleteTerminal = async (e) => {
    e.preventDefault();

    try {
      if (await checkOpenBatches(cardBrands)) {
        return;
      }
      await mutateDeleteTerminal({
        terminalId,
        merchantId: terminal.merchant.id,
        acquirerId: acquirer.id,
      });
      onSuccessUpdate('Delete acquirer successfully');
      queryClient.invalidateQueries([ACQUIRERS]);
      queryClient.invalidateQueries([ACQUIRER_DETAIL]);

      onClose();
    } catch (e) {
      const response = e.response;
      setDeleteErrorMessage(response && response.data && response.data.message);
    }
  };

  const handleCreateTerminal = async (value) => {
    try {
      if (await checkOpenBatches(value.cardBrands)) {
        return;
      }
      await mutateCreateTerminal({
        terminalId,
        merchantId: terminal.merchant.id,
        cardBrands: value.cardBrands,
        acquirerType: value.acquirerType,
        mid: value.mid,
        tid: value.tid,
      });
      onSuccessCreate('Add acquirer successfully');
      queryClient.invalidateQueries([ACQUIRERS]);
      queryClient.invalidateQueries([ACQUIRER_DETAIL]);

      onClose();
    } catch (e) {
      const response = e.response;
      setErrorMessage(response && response.data && [response.data.message].flat());
    }
  };

  const handleUpdateTerminal = async (value) => {
    try {
      if (await checkOpenBatches(value.cardBrands)) {
        return;
      }
      await mutateUpdateTerminal({
        terminalId,
        merchantId: terminal.merchant.id,
        cardBrands: value.cardBrands,
        mid: value.mid,
        tid: value.tid,
        status: value.status.length > 0 ? AcquirerStatus.ACTIVE : AcquirerStatus.DEACTIVE,
        id: acquirer.id,
      });
      queryClient.invalidateQueries([ACQUIRERS]);
      queryClient.invalidateQueries([ACQUIRER_DETAIL]);

      onSuccessUpdate('Update acquirer successfully');
      onClose();
    } catch ({response}) {
      setErrorMessage(response && response.data && [response.data.message].flat());
    }
  };

  const close = () => {
    onClose();
  };

  const title = isEditMode ? 'Edit TID/MID configuration' : 'Add TID/MID configuration';

  return (
    <>
      <Modal
        className="rounded-md"
        isOpen={visible && !isHide}
        onDismiss={close}
        aria-label={title}
        data-testid="terminal-modal">
        <Formik
          initialValues={initialValues}
          validationSchema={AcquirerSchema}
          enableReinitialize={true}
          validateOnMount={false}
          validateOnChange={false}
          onSubmit={(value: any) => {
            !isEditMode ? handleCreateTerminal(value) : handleUpdateTerminal(value);
          }}>
          {(formikBag) => (
            <form onSubmit={formikBag.handleSubmit}>
              <ModalHeader>{title}</ModalHeader>
              <ModalBody>
                {isLoading && (
                  <div className="flex">
                    <h1 className={classes.h1}>
                      <Skeleton />
                    </h1>
                  </div>
                )}
                {isError && (
                  <Alert className="mb-2" variant="error" description="Wrong loading">
                    <AlertMessages messages={['Something went wrong when loading acquirer']} />
                  </Alert>
                )}
                {errorMessage?.length > 0 && (
                  <Alert
                    className="mb-2"
                    variant="error"
                    description="Invalid TID/MID Configuration">
                    <AlertMessages messages={errorMessage} />
                  </Alert>
                )}
                {hasOpenBatches && (
                  <Alert
                    className="mb-2"
                    variant="error"
                    description="To edit TID & MID, please clear the pending settlement and open batches."></Alert>
                )}
                {!isLoading && !isError && (
                  <div className="flex">
                    <div className={`${classes.label} w-44 mr-11 h-1/2 flex items-center`}>
                      <Text color="lightgrey">CLOSE/OPEN LOOP CARD</Text>
                    </div>
                    <div className="flex-1 items-center gap-y-0">
                      <FormikDropdownField
                        data-testid="acquirer-type-input"
                        className="w-1/2"
                        label="Acquirer type"
                        placeholder="Select acquirer type"
                        fieldName="acquirerType"
                        disabled={hasOpenBatches || isEditMode}
                        onChangeValue={setAcquirerType}
                        options={AcquirerTypeOptions}
                      />
                      <FormikMultiSelectField
                        data-testid="card-brands-input"
                        placeholder="Select card brand"
                        label="Card brand"
                        fieldName="cardBrands"
                        disabled={hasOpenBatches || acquirer?.status === AcquirerStatus.ACTIVE}
                        options={CardBrandOptions}
                      />
                      <FormikTextField
                        label="MID"
                        className="w-1/2"
                        fieldName="mid"
                        layout="horizontal-responsive"
                        placeholder="Enter MID"
                        disabled={hasOpenBatches || acquirer?.status === AcquirerStatus.ACTIVE}
                      />
                      <FormikTextField
                        label="TID"
                        className="w-1/2"
                        fieldName="tid"
                        disabled={hasOpenBatches || acquirer?.status === AcquirerStatus.ACTIVE}
                        placeholder="Enter TID"
                        layout="horizontal-responsive"
                      />
                      {isEditMode && (
                        <FormikCheckboxField
                          fieldName="status"
                          options={[
                            {
                              disabled: hasOpenBatches,
                              label: 'Enabled',
                              value: 'true',
                            },
                          ]}
                          label=" Status"
                        />
                      )}
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter className="rounded-b-md">
                <div className="flex">
                  {isEditMode && !hasOpenBatches && acquirer?.status === AcquirerStatus.DEACTIVE && (
                    <Button
                      className="border-none shadow-none"
                      variant="error-outline"
                      onClick={() => {
                        setIsHide(true);
                        setIsConfirmDeleteOpen(true);
                      }}
                      isLoading={isDeleteLoading}>
                      <b>DELETE</b>
                    </Button>
                  )}

                  <div className="flex flex-grow items-center justify-end space-x-2">
                    <Button variant="outline" onClick={close}>
                      CANCEL
                    </Button>
                    {isEditMode ? (
                      <Button
                        isLoading={isUpdateLoading}
                        type="submit"
                        variant="primary"
                        disabled={hasOpenBatches}>
                        SAVE CHANGES
                      </Button>
                    ) : (
                      <Button
                        isLoading={isCreateLoading}
                        type="submit"
                        variant="primary"
                        disabled={hasOpenBatches}>
                        SAVE
                      </Button>
                    )}
                  </div>
                </div>
              </ModalFooter>
            </form>
          )}
        </Formik>
      </Modal>
      {isConfirmDeleteOpen && (
        <DeleteAcquirerConfirmationDialog
          isOpen
          isEditing={isDeleteLoading}
          error={deleteErrorMessage}
          onConfirm={handleDeleteTerminal}
          onDismiss={() => {
            setIsHide(false);
            setIsConfirmDeleteOpen(false);
          }}
        />
      )}
    </>
  );
};
