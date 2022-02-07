import * as React from 'react';
import {IBadge} from 'src/react/modules/badge-campaigns/badge-campaigns.type';
import {Formik} from 'formik';
import {Button, Modal} from '@setel/portal-ui';
import * as Yup from 'yup';
import {
  FormikDropdownField,
  FormikFieldArray,
  FormikFieldArrayTextInput,
} from 'src/react/components/formik';
import {useUpdateBadge} from 'src/react/modules/badge-campaigns/badge-campaigns.queries';

type IOutCome = 'GRANT_PERK' | '';
type FormValues = {
  outcome: IOutCome;
  grantsCampaigns?: Array<string>;
};

const validationSchema = Yup.object().shape({
  grantsCampaigns: Yup.array()
    .of(Yup.string())
    .when(['outcome'], {
      is: (outcome: IOutCome) => outcome === 'GRANT_PERK',
      then: Yup.array().of(Yup.string().required('Required')),
    }),
});

export function useOutcomesModal(badge: IBadge) {
  const [isOpen, setIsOpen] = React.useState(false);
  const {mutateAsync: updateBadge, isLoading} = useUpdateBadge();
  const onClose = () => setIsOpen(false);

  const initialValues: FormValues = {
    outcome: badge?.grantsCampaigns.length > 0 ? 'GRANT_PERK' : '',
    grantsCampaigns: badge?.grantsCampaigns.length > 0 ? badge.grantsCampaigns : [''],
  };
  return {
    open: () => setIsOpen(true),
    component: (
      <Modal isOpen={isLoading || isOpen} onDismiss={onClose} header="Outcomes">
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={(values) => {
            const {outcome, grantsCampaigns} = values;
            const formData = {
              id: badge?.id,
              grantsCampaigns: outcome === 'GRANT_PERK' ? grantsCampaigns : [],
            };
            updateBadge(formData, {onSuccess: onClose});
          }}>
          {({values, isValid, handleSubmit}) => {
            return (
              <>
                <Modal.Body>
                  <FormikDropdownField
                    fieldName="outcome"
                    label="Outcome for user"
                    placeholder="Please select"
                    options={[
                      {label: 'Do nothing', value: ''},
                      {label: 'Grant a perk', value: 'GRANT_PERK'},
                    ]}
                    className="w-60"
                  />
                  {values.outcome === 'GRANT_PERK' && (
                    <FormikFieldArray
                      label="Reward campaign ID"
                      arrayName="grantsCampaigns"
                      newItemValue=""
                      renderField={(props) => (
                        <FormikFieldArrayTextInput
                          {...props}
                          className="w-60"
                          placeholder={'55b0f337d0e783001084cf62'}
                          required={props.index === 0}
                        />
                      )}
                    />
                  )}
                </Modal.Body>
                <Modal.Footer className="flex justify-end">
                  <Button
                    variant="outline"
                    disabled={isLoading}
                    className="uppercase mr-3"
                    onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="uppercase"
                    onClick={() => handleSubmit()}
                    isLoading={isLoading}
                    disabled={isLoading || !isValid}>
                    Save
                  </Button>
                </Modal.Footer>
              </>
            );
          }}
        </Formik>
      </Modal>
    ),
  };
}
