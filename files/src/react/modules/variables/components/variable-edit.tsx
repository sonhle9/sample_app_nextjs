import * as React from 'react';
import {Button, EditIcon, Modal, Textarea} from '@setel/portal-ui';
import {Confirm} from './confirm';
import {Field, Formik} from 'formik';
import {IUpdateVariableInput, IVariable} from '../types';
import {IVariableEditorFormValues, VariableEditor} from './variable-editor';
import {useQueryClient} from 'react-query';
import {useUpdateVariableDetails} from '../variables.queries';

interface IVariableEditProps {
  id: string;
  variable: IVariable;
}

export function VariableEdit({id, variable}: IVariableEditProps) {
  const {mutate: updateVariableDetails} = useUpdateVariableDetails();
  const [showEditor, setShowEditor] = React.useState(false);
  const queryClient = useQueryClient();
  const [isCancelOpen, toggleCancel] = React.useState(false);

  return (
    <>
      <Button
        variant="outline"
        className="uppercase"
        leftIcon={<EditIcon />}
        onClick={() => setShowEditor(true)}
        data-testid="btn-edit">
        Edit
      </Button>
      <Modal
        isOpen={showEditor}
        onDismiss={() => toggleCancel(true)}
        aria-label="Edit variable"
        data-testid="variable-editor">
        <Modal.Header>Edit variable</Modal.Header>
        <Formik<IVariableEditorFormValues>
          initialValues={{...variable}}
          validateOnMount
          onSubmit={(newVariable, actions) => {
            const input: IUpdateVariableInput = {
              name: newVariable.name,
              description: newVariable.description,
              tags: newVariable.tags,
              comment: newVariable.comment,
            };
            updateVariableDetails(
              {key: id, variable: input},
              {
                onSuccess: (data) => {
                  queryClient.setQueryData(['variableDetails', id], data);
                  queryClient.invalidateQueries(['variableHistory', id]);
                  actions.setSubmitting(false);
                  setShowEditor(false);
                },
                onError: (e) => {
                  console.error(e);
                },
              },
            );
          }}>
          {(formikProps) => (
            <>
              <Modal.Body>
                <VariableEditor isExisting formikProps={formikProps} />
              </Modal.Body>
              <Modal.Footer>
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
                        disabled={formikProps.isSubmitting}
                        onClick={() => onTrigger()}
                        data-testid="btn-cancel">
                        Cancel
                      </Button>
                    )}
                  </Confirm>
                  <Confirm
                    header="Do you want to save this variable?"
                    caption={
                      <>
                        <div className="mb-6">
                          You are about to save changes to variable <i>{id}</i>. Click save to
                          proceed.
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
                    onConfirm={() => formikProps.handleSubmit()}>
                    {(onTrigger) => (
                      <Button
                        variant="primary"
                        className="uppercase"
                        disabled={!(formikProps.dirty && formikProps.isValid)}
                        isLoading={formikProps.isSubmitting}
                        onClick={() => onTrigger()}
                        data-testid="btn-save">
                        Save changes
                      </Button>
                    )}
                  </Confirm>
                </div>
              </Modal.Footer>

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
