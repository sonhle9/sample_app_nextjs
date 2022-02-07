import * as React from 'react';
import {Button, BareButton, classes, Modal, Text, Field, pick} from '@setel/portal-ui';
import {Formik, useField} from 'formik';
import * as Yup from 'yup';
import {IBadge, IUnlockBy, ILocale, IBadgeVerificationFormField} from '../../badge-campaigns.type';
import {UNLOCK_OPTIONS} from 'src/react/modules/badge-campaigns/badge-campaigns.const';
import {
  FormikTextField,
  FormikTextareaField,
  FormikDropdownField,
  FormikFieldArray,
  FormikFieldArrayComponentProps,
} from 'src/react/components/formik';
import {useUpdateBadge} from 'src/react/modules/badge-campaigns/badge-campaigns.queries';

const validationSchema = Yup.object().shape({
  dependsOnCampaign: Yup.string().when(['unlockBy'], (unlockBy: IUnlockBy) =>
    unlockBy === 'CAMPAIGN' ? Yup.string().required('Required') : Yup.string(),
  ),
});

export function useUnlockRequirementsModal(badge: IBadge) {
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const {mutateAsync: updateBadge, isLoading} = useUpdateBadge();
  const isCategoryOptin = badge?.category === 'OPT_IN';
  const unlockOptions = UNLOCK_OPTIONS.filter(
    ({value}) => value === (isCategoryOptin ? 'MANUAL' : 'CAMPAIGN'),
  );

  const initialValues: Pick<IBadge, 'content' | 'dependsOnCampaign'> & {
    unlockBy: IUnlockBy;
  } = {
    unlockBy: isCategoryOptin ? 'MANUAL' : 'CAMPAIGN',
    dependsOnCampaign: badge?.dependsOnCampaign,
    content: {
      ...badge?.content,
      verification: {
        ...badge?.content?.verification,
        form: {
          ...badge?.content?.verification?.form,
          fields: badge?.content?.verification?.form?.fields ?? [],
        },
      },
    },
  };

  return {
    open: () => setIsOpen(true),
    component: (
      <Modal onDismiss={onClose} header="Unlock requirement" isOpen={isLoading || isOpen}>
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={(values) => {
            updateBadge(
              {
                id: badge?.id,
                ...pick(values, isCategoryOptin ? ['content'] : ['dependsOnCampaign']),
              },
              {onSuccess: onClose},
            );
          }}>
          {({dirty, isValid, handleSubmit}) => (
            <>
              <Modal.Body>
                <FormikDropdownField
                  label="Unlock badge by"
                  fieldName="unlockBy"
                  options={unlockOptions}
                />
                {isCategoryOptin ? (
                  <>
                    <div className="w-full border-t my-4" />
                    <FormikTextField
                      label="Form title"
                      fieldName={`content.verification.form.title.${'en' as ILocale}`}
                      placeholder="Insert title"
                    />
                    <FormikFieldArray
                      label="Input fields"
                      arrayName="content.verification.form.fields"
                      newItemValue={{type: 'TEXT'} as IBadgeVerificationFormField}
                      renderField={(props) => <FormikFieldArrayInputField {...props} />}
                      addButtonText={() => 'add input'}
                    />
                    <div className="w-full border-t my-4" />
                    <FormikTextField
                      label="Button text"
                      fieldName={`content.verification.form.submitButtonText.${'en' as ILocale}`}
                      placeholder="Insert text"
                    />
                    <FormikTextareaField
                      label="On submit text"
                      fieldName={`content.verification.form.onSubmitText.${'en' as ILocale}`}
                      placeholder="Insert text"
                    />
                    <FormikTextareaField
                      label="Rejected remarks"
                      fieldName={`content.verification.statusMessageMap.REJECTED.${
                        'en' as ILocale
                      }`}
                      placeholder="Insert remark"
                    />
                    <FormikTextareaField
                      label="Submitted remarks"
                      fieldName={`content.verification.statusMessageMap.SUBMITTED.${
                        'en' as ILocale
                      }`}
                      placeholder="Insert remark"
                    />
                  </>
                ) : (
                  <FormikTextField
                    label="Reward campaign"
                    fieldName="dependsOnCampaign"
                    placeholder="56b84ffefbe5370018af3a0e"
                  />
                )}
              </Modal.Body>
              <Modal.Footer className="text-right">
                <Button variant="outline" disabled={isLoading} className="mr-3" onClick={onClose}>
                  CANCEL
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  onClick={() => handleSubmit()}
                  isLoading={isLoading}
                  disabled={isLoading || !(dirty && isValid)}>
                  SAVE
                </Button>
              </Modal.Footer>
            </>
          )}
        </Formik>
      </Modal>
    ),
  };
}

function FormikFieldArrayInputField({index, remove, fieldName}: FormikFieldArrayComponentProps) {
  const [, {touched, error}] = useField(fieldName);
  const [, {value}] = useField(`${fieldName}.type`);
  const fieldType: IBadgeVerificationFormField['type'] = value;

  return (
    <Field status={touched && error ? 'error' : undefined}>
      <section className="border rounded-md p-4">
        <section className="flex items-center justify-between mb-4">
          <Text className={classes.h3}>Input {index + 1}</Text>
          <BareButton className="h-10 text-error-500" onClick={() => remove(index)}>
            REMOVE
          </BareButton>
        </section>
        <FormikDropdownField
          label="Type"
          fieldName={`${fieldName}.type`}
          options={[
            {label: '', value: ''},
            {label: 'Text', value: 'TEXT'},
            {label: 'Image', value: 'IMAGE'},
          ]}
        />
        <FormikTextField
          label="Field"
          fieldName={`${fieldName}.name.${'en' as ILocale}`}
          placeholder="Insert text"
        />
        <FormikTextField
          label="Description"
          fieldName={`${fieldName}.description.${'en' as ILocale}`}
          placeholder="Insert text"
        />
        {fieldType === 'TEXT' && (
          <FormikTextField
            label="Hint"
            fieldName={`${fieldName}.hint.${'en' as ILocale}`}
            placeholder="Insert text"
          />
        )}
        {fieldType === 'IMAGE' && (
          <>
            <FormikTextField
              label="Sample image URL"
              fieldName={`${fieldName}.sampleImageUrl`}
              placeholder="Insert text"
            />
            <FormikTextareaField
              label="Image description"
              fieldName={`${fieldName}.sampleImageDescription.${'en' as ILocale}`}
              placeholder="Insert text"
            />
          </>
        )}
      </section>
    </Field>
  );
}
