import * as React from 'react';
import {Confirm} from './confirm';
import {Field, FieldArray, Formik} from 'formik';
import {IVariable, IVariant} from '../types';
import {useUpdateVariable} from '../variables.queries';
import {VariableOptionValueField, validateVariableOptionValue} from './variable-option-value-field';
import {VariableType} from '../const';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  PlusIcon,
  Textarea,
  TextInput,
  FieldContainer,
  FieldStatus,
} from '@setel/portal-ui';

interface IVariableOptionCreateProps {
  variable: IVariable;
}

export function VariableOptionCreate({variable}: IVariableOptionCreateProps) {
  const {mutate: updateVariable} = useUpdateVariable();
  const [showEditor, setShowEditor] = React.useState(false);
  const [isCancelOpen, toggleCancel] = React.useState(false);

  return (
    <>
      <Button
        variant="outline"
        className="uppercase"
        leftIcon={<PlusIcon />}
        onClick={() => setShowEditor(true)}
        data-testid="btn-create">
        Create
      </Button>
      <Modal
        isOpen={showEditor}
        onDismiss={() => toggleCancel(true)}
        aria-label="Create new variable options"
        data-testid="editor">
        <ModalHeader>Create new variable options</ModalHeader>
        <Formik<{variants: IVariant[]; comment?: string}>
          initialValues={{variants: getInitialValues(variable.type)}}
          validateOnMount
          validate={(values) => {
            const duplicateKeys = new Set(
              findDuplicates(values.variants.map((variant) => variant.key)),
            );

            const result = values.variants.map((variant) => {
              const errors: Map<string, string> = new Map();

              if (variant.key === '') {
                errors.set('key', 'Required');
              } else if (duplicateKeys.has(variant.key)) {
                errors.set('key', 'Already in use');
              }

              if (!validateVariableOptionValue(variant.value, variable.type)) {
                errors.set('value', 'Required');
              } else if (variant.value instanceof Error) {
                errors.set('value', variant.value.message);
              }

              if (errors.size > 0) {
                return Object.fromEntries(errors);
              }
            });

            if (result.some(Boolean)) {
              return {variants: result};
            } else {
              return {};
            }
          }}
          onSubmit={(values, actions) => {
            updateVariable(
              {
                key: variable.key,
                variable: {
                  variants: Object.fromEntries([
                    ...Object.entries(variable.variants || {}),
                    ...values.variants.map((variant) => [variant.key, variant]),
                  ]),
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
          {({values, isSubmitting, handleSubmit, errors, touched, dirty, isValid}) => (
            <>
              <ModalBody>
                <FieldArray
                  name="variants"
                  render={() => (
                    <>
                      <div>
                        {values.variants.map((_variant, i) => {
                          const getHelpProps = (name: string) =>
                            errors?.variants?.[i]?.[name]
                              ? {
                                  status: touched?.variants?.[i]?.[name]
                                    ? ('error' as FieldStatus)
                                    : null,
                                  helpText: errors.variants[i][name],
                                }
                              : {helpText: ' '};

                          return (
                            <React.Fragment key={i}>
                              <div className="grid grid-cols-4 -mb-2">
                                <div className="mt-3">
                                  <p className="text-gray-500 text-sm">Name</p>
                                </div>
                                <FieldContainer {...getHelpProps('key')}>
                                  <Field
                                    as={TextInput}
                                    name={`variants.${i}.key`}
                                    placeholder="Enter variable option name"
                                  />
                                </FieldContainer>
                              </div>
                              <div className="grid grid-cols-4 -mb-2">
                                <div className="mt-3">
                                  <p className="text-gray-500 text-sm">Description</p>
                                </div>
                                <FieldContainer
                                  className="col-span-3"
                                  {...getHelpProps('description')}>
                                  <Field
                                    as={Textarea}
                                    name={`variants.${i}.description`}
                                    placeholder="Enter variable option description"
                                  />
                                  <span className="text-xs font-normal leading-4 text-mediumgrey">
                                    Optional
                                  </span>
                                </FieldContainer>
                              </div>
                              <div className="grid grid-cols-4 -mb-2">
                                <div className="mt-3">
                                  <p className="text-gray-500 text-sm">Value</p>
                                </div>
                                <FieldContainer className="col-span-3" {...getHelpProps('value')}>
                                  <Field
                                    name={`variants.${i}.value`}
                                    component={VariableOptionValueField}
                                    type={variable.type}
                                    placeholder="Enter variable option value"
                                  />
                                </FieldContainer>
                              </div>
                              {i !== Object.keys(values.variants).length - 1 && (
                                <div className="mb-4">
                                  <hr />
                                </div>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </>
                  )}
                />
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
                    header="Do you want to save these variable options?"
                    caption={
                      <>
                        <div className="mb-6">
                          You are about to create new variable options. Click save to proceed.
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
          )}
        </Formik>
      </Modal>
    </>
  );
}

function getInitialValues(type: VariableType): IVariant[] {
  if (type === VariableType.Boolean) {
    return [
      {key: '', value: true, description: ''},
      {key: '', value: false, description: ''},
    ];
  } else {
    return [{key: '', value: undefined, description: ''}];
  }
}

function findDuplicates<T>(items: T[]): T[] {
  const counts: Map<T, number> = new Map();
  items.forEach((item) => {
    counts.set(item, (counts.has(item) ? counts.get(item) : 0) + 1);
  });
  return Array.from(counts.entries())
    .filter(([_, value]) => value > 1)
    .map(([key]) => key);
}
