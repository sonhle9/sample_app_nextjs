import {Button, EditIcon, Modal, ModalBody, ModalFooter, ModalHeader} from '@setel/portal-ui';
import {Formik} from 'formik';
import * as React from 'react';
import {useNotification} from 'src/react/hooks/use-notification';
import _capitalize from 'lodash/capitalize';
import {
  ATTR_RULE_METADATA_LABELS,
  ATTR_RULE_SCHEMA,
  ATTR_RULE_SOURCE_LABELS,
  ATTR_RULE_TYPE_LABELS,
} from '../const';
import {IAttributionRule} from '../types';
import {ConfirmDialog, FormikDropdownField, FormikTextField} from './attribution-form';
import {useDeleteAttributionRule, useEditAttributionRule} from '../attribution.queries';
import {useQueryClient} from 'react-query';

export function AttributionEdit(props: {
  attributeRule: IAttributionRule;
  onEdited?: (newValue?: IAttributionRule) => void;
  onDeleted?: () => void;
}) {
  const [isModalOpen, toggleModal] = React.useState(false);
  const [isCancelOpen, toggleCancel] = React.useState(false);
  const [isSaveOpen, toggleSave] = React.useState(false);
  const [isDeleteOpen, toggleDelete] = React.useState(false);
  const referenceId = props.attributeRule?.referenceId;

  const showMessage = useNotification();

  const {
    mutate: editRule,
    isLoading: isEditLoading,
    reset: editReset,
    error: editError,
  } = useEditAttributionRule({
    onSettled: () => {
      editReset();
      toggleModal(false);
    },
    onSuccess: (response) => {
      showMessage({
        title: 'Attribution rule successfully updated!',
      });
      props.onEdited?.(response);
    },
    onError: () => {
      showMessage({
        variant: 'error',
        title: 'Error occured while updating attribution rule!',
        description: String(editError),
      });
    },
  });
  const queryClient = useQueryClient();
  const {
    mutate: deleteRule,
    isLoading: isDeleteLoading,
    reset: deleteReset,
    error: deleteError,
  } = useDeleteAttributionRule({
    onSettled: () => {
      toggleModal(false);
      deleteReset();
    },
    onSuccess: () => {
      showMessage({
        title: 'Attribution rule successfully deleted!',
      });
      queryClient.invalidateQueries('attributionRuleList');
      props.onDeleted?.();
    },
    onError: () =>
      showMessage({
        title: 'Error occured while deleting attribution rule!',
        description: String(deleteError),
      }),
  });

  return (
    <>
      <Button
        variant="outline"
        leftIcon={<EditIcon />}
        minWidth="none"
        onClick={() => toggleModal(true)}
        data-testid="btn-edit">
        EDIT
      </Button>
      <Modal isOpen={isModalOpen} onDismiss={() => toggleCancel(true)} aria-label="Edit details">
        <ModalHeader>Edit details</ModalHeader>
        <Formik<IAttributionRule>
          initialValues={props.attributeRule}
          validationSchema={ATTR_RULE_SCHEMA}
          validateOnMount
          onSubmit={(values) => editRule({referenceId, newRule: values})}>
          {(formik) => (
            <>
              <ModalBody>
                <form onSubmit={formik.handleSubmit}>
                  <FormikDropdownField
                    label="Type"
                    name={'type'}
                    formik={formik}
                    placeholder={'Please select'}
                    options={Object.entries(ATTR_RULE_TYPE_LABELS).map(([key, label]) => ({
                      value: key,
                      label,
                    }))}
                    data-testid="dd-type"
                  />
                  <FormikDropdownField
                    label="Reference source"
                    name={'referenceSource'}
                    formik={formik}
                    placeholder={'Please select'}
                    options={Object.entries(ATTR_RULE_SOURCE_LABELS).map(([key, label]) => ({
                      value: key,
                      label,
                    }))}
                    data-testid="dd-reference-source"
                  />
                  <FormikTextField
                    name={'referenceId'}
                    label={'Reference ID'}
                    formik={formik}
                    placeholder={'Enter reference ID'}
                    data-testid="txt-reference-id"
                  />
                  {props.attributeRule?.metadata?.map((metadata, index) => (
                    <FormikTextField
                      key={metadata.key}
                      name={`metadata[${index}].value`}
                      label={_capitalize(ATTR_RULE_METADATA_LABELS[metadata.key]) || metadata.key}
                      formik={formik}
                      placeholder={`Enter ${
                        ATTR_RULE_METADATA_LABELS[metadata.key] || metadata.key
                      }`}
                      data-testid={`txt-metadata-${metadata.key}`}
                    />
                  ))}
                </form>
              </ModalBody>
              <ModalFooter className="flex space-x-3">
                <Button
                  className="bg-gray-50 text-error-500 -ml-6 shadow-none"
                  onClick={() => toggleDelete(true)}
                  isLoading={isDeleteLoading}
                  data-testid="btn-delete">
                  DELETE
                </Button>
                <div className="flex-grow"></div>
                <Button
                  variant="outline"
                  onClick={() => toggleCancel(true)}
                  data-testid="btn-cancel">
                  CANCEL
                </Button>
                <Button
                  variant="primary"
                  disabled={!formik.isValid}
                  onClick={() => toggleSave(true)}
                  isLoading={isEditLoading}
                  data-testid="btn-save">
                  SAVE CHANGES
                </Button>
              </ModalFooter>

              <ConfirmDialog
                header={'Are you sure you want leave this page? '}
                confirmLabel={'LEAVE'}
                onConfirm={() => {
                  editReset();
                  toggleModal(false);
                }}
                open={isCancelOpen}
                toggleOpen={toggleCancel}>
                {'If you leave this page, all unsaved changes will be lost.'}
              </ConfirmDialog>
              <ConfirmDialog
                header={'Do you want to save this attribution rule?'}
                confirmLabel={'SAVE'}
                confirmElement={
                  <Button
                    variant="primary"
                    onClick={() => {
                      toggleSave(false);
                      formik.submitForm();
                    }}
                    data-testid="btn-confirm-save">
                    SAVE
                  </Button>
                }
                open={isSaveOpen}
                toggleOpen={toggleSave}>
                {`You are about to save changes to rule ${referenceId}. Click save to proceed.`}
              </ConfirmDialog>
              <ConfirmDialog
                header={`Are you sure you want to delete this ${referenceId}?`}
                confirmElement={
                  <Button
                    variant="error"
                    onClick={() => {
                      toggleDelete(false);
                      deleteRule(referenceId);
                    }}
                    data-testid="btn-confirm-delete">
                    DELETE
                  </Button>
                }
                open={isDeleteOpen}
                toggleOpen={toggleDelete}>
                {`You are about to permanently delete ${referenceId} and all its contents. This action cannot be undone and you will not be able to recover any data.`}
              </ConfirmDialog>
            </>
          )}
        </Formik>
      </Modal>
    </>
  );
}
