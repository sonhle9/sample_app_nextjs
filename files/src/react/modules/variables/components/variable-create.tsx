import * as React from 'react';
import {Confirm} from './confirm';
import {Formik} from 'formik';
import {ICreateVariableInput} from '../types';
import {IVariableEditorFormValues, VariableEditor} from './variable-editor';
import {useQueryClient} from 'react-query';
import {useCreateVariable} from '../variables.queries';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader, PlusIcon} from '@setel/portal-ui';

interface IVariableCreateProps {
  onSuccess(id: string): void;
}

export function VariableCreate({onSuccess}: IVariableCreateProps) {
  const queryClient = useQueryClient();
  const {mutate: createVariable} = useCreateVariable();
  const [showEditor, setShowEditor] = React.useState(false);
  const [isCancelOpen, toggleCancel] = React.useState(false);

  return (
    <>
      <Button
        variant="primary"
        leftIcon={<PlusIcon />}
        onClick={() => setShowEditor(true)}
        data-testid="btn-create">
        CREATE
      </Button>
      <Modal
        isOpen={showEditor}
        onDismiss={() => toggleCancel(true)}
        aria-label="Create new variable"
        data-testid="variable-editor">
        <ModalHeader>Create new variable</ModalHeader>
        <Formik<IVariableEditorFormValues>
          initialValues={{}}
          validateOnMount
          onSubmit={(newValues, actions) => {
            const input: ICreateVariableInput = {
              key: newValues.key,
              name: newValues.name,
              description: newValues.description,
              type: newValues.type,
              tags: newValues.tags,
              isToggled: false,
              group: newValues.group,
            };
            createVariable(input, {
              onSuccess: (data) => {
                const id = data.key;
                queryClient.setQueryData(['variableDetails', id], data);
                actions.setSubmitting(false);
                setShowEditor(false);
                onSuccess(id);
              },
              onError: (e) => {
                console.error(e);
              },
            });
          }}>
          {(formikProps) => (
            <>
              <ModalBody>
                <VariableEditor isExisting={false} formikProps={formikProps} />
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
                        onClick={() => onTrigger()}
                        data-testid="btn-cancel">
                        Cancel
                      </Button>
                    )}
                  </Confirm>
                  <Confirm
                    header="Do you want to save this variable?"
                    caption="You are about to create a new variable. Click save to proceed."
                    cancel="Cancel"
                    confirm="Save"
                    onConfirm={() => formikProps.handleSubmit()}>
                    {(onTrigger) => (
                      <Button
                        variant="primary"
                        className="uppercase"
                        onClick={() => onTrigger()}
                        disabled={!(formikProps.dirty && formikProps.isValid)}
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
