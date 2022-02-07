import * as React from 'react';
import {Confirm} from './confirm';
import {Field, Formik} from 'formik';
import {IVariable, IVariant} from '../types';
import {replaceVariant} from '../const';
import {useUpdateVariable} from '../variables.queries';
import {VariableOptionValueField, validateVariableOptionValue} from './variable-option-value-field';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Textarea,
  TextInput,
  FieldContainer,
  FieldStatus,
} from '@setel/portal-ui';

interface IVariableOptionEditProps {
  variable: IVariable;
  variantKey: string;
  children(onTrigger: () => void): JSX.Element;
}

export function VariableOptionEdit({variable, variantKey, children}: IVariableOptionEditProps) {
  const {mutate: updateVariable} = useUpdateVariable();
  const [showEditor, setShowEditor] = React.useState(false);
  const [isCancelOpen, toggleCancel] = React.useState(false);

  return (
    <>
      {children(() => setShowEditor(true))}
      <Modal
        isOpen={showEditor}
        onDismiss={() => toggleCancel(true)}
        aria-label="Edit variable option"
        data-testid="editor">
        <ModalHeader>Edit variable option</ModalHeader>
        <Formik<{variant: IVariant; comment?: string}>
          initialValues={{variant: variable.variants[variantKey]}}
          validateOnMount
          onSubmit={(values, actions) => {
            updateVariable(
              {
                key: variable.key,
                variable: {
                  ...replaceVariant(variable, variantKey, values.variant),
                  comment: values.comment,
                },
              },
              {
                onSuccess: () => {
                  actions.setSubmitting(false);
                  setShowEditor(false);
                },
                onError: (e) => {
                  console.error(e);
                },
              },
            );
          }}>
          {({isSubmitting, handleSubmit, errors, touched, dirty, isValid}) => {
            const getHelpProps = (name: string) =>
              errors.variant?.[name]
                ? {
                    status: touched.variant?.[name] ? ('error' as FieldStatus) : null,
                    helpText: errors.variant[name],
                  }
                : {helpText: ' '};
            return (
              <>
                <ModalBody>
                  <FieldContainer label="Variable option name" {...getHelpProps('key')}>
                    <Field
                      as={TextInput}
                      name="variant.key"
                      validate={(value: string) => {
                        if (value === '') {
                          return 'Required';
                        }

                        const otherKeys: Set<string> = new Set(
                          Object.keys(variable.variants || {}).filter(
                            (variantKey2) => variantKey2 !== variantKey,
                          ),
                        );

                        if (otherKeys.has(value)) {
                          return 'Already in use';
                        }
                      }}
                    />
                  </FieldContainer>
                  <FieldContainer
                    label="Variable option description"
                    {...getHelpProps('description')}>
                    <Field as={TextInput} name="variant.description" />
                  </FieldContainer>
                  <FieldContainer label="Variable option value" {...getHelpProps('value')}>
                    <Field
                      component={VariableOptionValueField}
                      type={variable.type}
                      name="variant.value"
                      placeholder="Enter variable value"
                      validate={(value: any) => {
                        if (!validateVariableOptionValue(value, variable.type)) {
                          return 'Required';
                        }
                        if (value instanceof Error) {
                          return value.message;
                        }
                      }}
                    />
                  </FieldContainer>
                </ModalBody>
                <ModalFooter>
                  <div className="flex gap-3 justify-end">
                    <Confirm
                      header="Are you sure you want to leave this page?"
                      caption="If you leave this page, all unsaved changes will be lost."
                      cancel="Cancel"
                      confirm="Leave"
                      onConfirm={() => setShowEditor(false)}>
                      {(onTrigger) => (
                        <Button
                          variant="outline"
                          className="uppercase"
                          disabled={isSubmitting}
                          onClick={() => onTrigger()}
                          data-testid="btn-cancel">
                          Cancel
                        </Button>
                      )}
                    </Confirm>
                    <Confirm
                      header="Do you want to save this variable option?"
                      caption={
                        <>
                          <div className="mb-6">
                            You are about to save changes to variable <i>{variable.key}</i>. Click
                            save to proceed.
                          </div>
                          <Field
                            as={Textarea}
                            name="comment"
                            placeholder="Leave a comment… (optional)"
                          />
                        </>
                      }
                      cancel="Cancel"
                      confirm="Save"
                      onConfirm={() => handleSubmit()}>
                      {(onTrigger) => (
                        <Button
                          variant="primary"
                          className="uppercase"
                          disabled={!(dirty && isValid)}
                          isLoading={isSubmitting}
                          onClick={() => onTrigger()}
                          data-testid="btn-save">
                          Save changes
                        </Button>
                      )}
                    </Confirm>
                  </div>
                </ModalFooter>

                <Confirm
                  header="Are you sure you want to leave this page?"
                  caption="If you leave this page, all unsaved changes will be lost."
                  cancel="Cancel"
                  confirm="Leave"
                  open={isCancelOpen}
                  onConfirm={() => {
                    toggleCancel(false);
                    setShowEditor(false);
                  }}
                  onCancel={() => {
                    toggleCancel(false);
                  }}>
                  {(_) => <></>}
                </Confirm>
              </>
            );
          }}
        </Formik>
      </Modal>
    </>
  );
}
