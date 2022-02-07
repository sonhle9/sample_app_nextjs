import * as React from 'react';
import _startCase from 'lodash/startCase';
import _isEmpty from 'lodash/isEmpty';
import _capitalize from 'lodash/capitalize';

import {
  Alert,
  AlertMessages,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  PlusIcon,
  Button,
} from '@setel/portal-ui';

import {Formik} from 'formik';

import {useNotification} from 'src/react/hooks/use-notification';
import {IAttributionRule} from '../types';
import {useCreateAttributionRule} from '../attribution.queries';
import {
  ATTR_RULE_INIT_VALUE,
  ATTR_RULE_METADATA_LABELS,
  ATTR_RULE_SCHEMA,
  ATTR_RULE_SOURCE_LABELS,
  ATTR_RULE_TYPE_LABELS,
} from '../const';
import {ConfirmDialog, FormikDropdownField, FormikTextField} from './attribution-form';

export function AttributionCreate(props: {onSuccess?: () => void}) {
  const [isOpen, toggleModal] = React.useState(false);
  const [isCancelOpen, toggleCancel] = React.useState(false);
  const [isSaveOpen, toggleSave] = React.useState(false);

  const showMessage = useNotification();

  const {
    mutate: createRule,
    isLoading,
    error,
    reset: resetQuery,
  } = useCreateAttributionRule({
    onSuccess: () => {
      showMessage({
        title: 'Attribution rule successfully created!',
      });
      toggleModal(false);
      resetQuery();
      props.onSuccess?.();
    },
  });

  return (
    <>
      <Button
        variant="primary"
        leftIcon={<PlusIcon />}
        onClick={() => toggleModal(true)}
        data-testid="btn-create">
        CREATE
      </Button>
      <Modal aria-label="Demo Modal" isOpen={isOpen} onDismiss={() => toggleCancel(true)}>
        <ModalHeader>Create new attribution rule</ModalHeader>
        <Formik<IAttributionRule>
          initialValues={ATTR_RULE_INIT_VALUE}
          validationSchema={ATTR_RULE_SCHEMA}
          validateOnMount
          onSubmit={(values) => createRule(values)}>
          {(formik) => (
            <>
              <ModalBody>
                {error && (
                  <Alert
                    className="mb-4"
                    variant="error"
                    description="Error occured while creating new attribution rule!">
                    <AlertMessages messages={[error?.response?.data?.message || String(error)]} />
                  </Alert>
                )}
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
                  {ATTR_RULE_INIT_VALUE.metadata.map((metadata, index) => (
                    <FormikTextField
                      key={metadata.key}
                      name={`metadata[${index}].value`}
                      label={_capitalize(ATTR_RULE_METADATA_LABELS[metadata.key])}
                      formik={formik}
                      placeholder={`Enter ${ATTR_RULE_METADATA_LABELS[metadata.key]}`}
                      data-testid={`txt-metadata-${metadata.key}`}
                    />
                  ))}
                </form>
              </ModalBody>
              <ModalFooter className="text-right space-x-3">
                <Button
                  variant="outline"
                  disabled={isLoading}
                  onClick={() => toggleCancel(true)}
                  data-testid="btn-cancel">
                  CANCEL
                </Button>
                <Button
                  variant="primary"
                  isLoading={isLoading}
                  disabled={!formik.isValid}
                  onClick={() => toggleSave(true)}
                  data-testid="btn-save">
                  SAVE
                </Button>
              </ModalFooter>
              <ConfirmDialog
                header={'Are you sure you want leave this page? '}
                confirmLabel={'LEAVE'}
                onConfirm={() => toggleModal(false)}
                open={isCancelOpen}
                toggleOpen={toggleCancel}>
                {'If you leave this page, all unsaved changes will be lost.'}
              </ConfirmDialog>
              <ConfirmDialog
                header={'Do you want to save this attribution rule?'}
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
                {'You are about to create a new attribution rule. Click save to proceed.'}
              </ConfirmDialog>
            </>
          )}
        </Formik>
      </Modal>
    </>
  );
}
