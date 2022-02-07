import {Button, Modal, Fieldset, Label, Field, titleCase} from '@setel/portal-ui';
import * as React from 'react';
import * as Yup from 'yup';
import {Formik} from 'formik';

import {FormikRadioGroup, FormikTextareaField} from '../../../../components/formik';
import {useNotification} from '../../../../hooks/use-notification';
import {IJumioAssessmentUpdate} from '../../../../services/api-verifications.type';
import {isUndefined, omitBy} from 'lodash';
import {useUpdateJumioAssessment} from '../../verifications.queries';
import {getMessageFromApiError} from '../../../../../shared/helpers/errorHandling';
import {IJumioAssessment} from '../../../../../shared/interfaces/verifications.interface';
import {textLooselyMatching} from '../../../../../shared/helpers/common';

export interface IUpdateJumioAssessmentProps {
  onDismiss: () => void;
  data: IJumioAssessment;
}

export const VerificationsUpdateJumioAssessmentModal = ({
  onDismiss,
  data,
}: IUpdateJumioAssessmentProps) => {
  const notify = useNotification();
  const {mutate: updateJumioAssessment, isLoading: isUpdating} = useUpdateJumioAssessment(data.id);

  const radioField = [
    {
      className: 'mt-3',
      fieldName: 'documentAuthenticity',
      label: 'Document authenticity',
    },
    {
      fieldName: 'biometricMatching',
      label: 'Biometric matching',
    },
    {
      fieldName: 'others',
      label: 'Others',
    },
  ];

  const onSubmit = (formData: typeof initialValue) => {
    const _toBool = (val: string) => (val ? val === 'true' : undefined);
    const updateData: IJumioAssessmentUpdate = {
      documentAuthenticity: _toBool(formData.documentAuthenticityAssessment),
      biometricMatching: _toBool(formData.biometricMatchingAssessment),
      others: _toBool(formData.othersAssessment),
      remark: formData.remark,
    };
    updateJumioAssessment(omitBy(updateData, isUndefined) as IJumioAssessmentUpdate, {
      onSuccess: onDismiss,
      onError: (error: any) => {
        notify({
          title: 'Error!',
          variant: 'error',
          description: getMessageFromApiError(error),
        });
      },
    });
  };

  const isNotAvailable = textLooselyMatching('not available');
  const validationSchema = Yup.object({
    remark: Yup.string().trim().nullable(),
    documentAuthenticityAssessment: Yup.string().when('documentAuthenticityClassification', {
      is: (value) => isNotAvailable(value),
      otherwise: Yup.string().required('Must choose one option'),
    }),
    biometricMatchingAssessment: Yup.string().when('biometricMatchingClassification', {
      is: (value) => isNotAvailable(value),
      otherwise: Yup.string().required('Must choose one option'),
    }),
    othersAssessment: Yup.string().when('othersClassification', {
      is: (value) => isNotAvailable(value),
      otherwise: Yup.string().required('Must choose one option'),
    }),
  });

  const getClassification = (fieldName) => initialValue[fieldName + 'Classification'];
  const initialValue = {
    documentAuthenticityClassification: titleCase(data.documentAuthenticity.classification, {
      hasUnderscore: true,
    }),
    biometricMatchingClassification: titleCase(data.biometricMatching.classification, {
      hasUnderscore: true,
    }),
    othersClassification: titleCase(data.others.classification, {hasUnderscore: true}),
    documentAuthenticityAssessment: data.documentAuthenticity.assessment?.toString(),
    biometricMatchingAssessment: data.biometricMatching.assessment?.toString(),
    othersAssessment: data.others.assessment?.toString(),
    remark: data.remark,
  };

  return (
    <>
      <Formik
        initialValues={initialValue}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        validateOnChange={false}
        validateOnMount={false}>
        {(formikProps) => (
          <Modal
            header="Edit Jumio's result"
            isOpen
            data-testid="update-jumio-assessment-modal"
            onDismiss={onDismiss}>
            <form onSubmit={formikProps.handleSubmit}>
              <Modal.Body>
                <Fieldset legend="MANUAL VERIFICATION" data-testid="manual-verification-fieldset">
                  {radioField.map(({fieldName, label, className}) => (
                    <Field
                      className={`sm:grid sm:grid-cols-4 sm:items-start ${className}`}
                      key={label}
                      data-testid={fieldName + 'Field'}>
                      <Label>{label}</Label>
                      <div className="col-span-2 text-sm">
                        <div className="ml-3">{getClassification(fieldName)}</div>
                        <FormikRadioGroup
                          wrapperClass="ml-3"
                          fieldName={fieldName + 'Assessment'}
                          layout="vertical"
                          options={[
                            {
                              value: 'true',
                              label: 'True',
                              disabled: isNotAvailable(getClassification(fieldName)),
                            },
                            {
                              value: 'false',
                              label: 'False',
                              disabled: isNotAvailable(getClassification(fieldName)),
                            },
                          ]}
                        />
                      </div>
                    </Field>
                  ))}
                  <FormikTextareaField
                    fieldName="remark"
                    label="Remarks"
                    placeholder="Enter reason"
                    data-testid="update-jumio-assessment-remark-textarea"
                  />
                </Fieldset>
              </Modal.Body>
              <Modal.Footer className="text-right">
                <Button variant="outline" className="mr-2" onClick={onDismiss}>
                  CANCEL
                </Button>
                <Button
                  variant="primary"
                  data-testid="submit-btn"
                  isLoading={isUpdating}
                  type="submit">
                  SAVE CHANGES
                </Button>
              </Modal.Footer>
            </form>
          </Modal>
        )}
      </Formik>
    </>
  );
};
