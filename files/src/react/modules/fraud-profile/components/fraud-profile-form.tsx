import {Button, Modal, TextField} from '@setel/portal-ui';
import {Formik} from 'formik';
import * as React from 'react';
import {
  FormikCheckboxField,
  FormikDropdownField,
  FormikTextareaField,
} from 'src/react/components/formik';
import {useNotification} from 'src/react/hooks/use-notification';
import {
  FraudProfile,
  FraudProfilesFormInput,
  FraudProfilesInput,
  FraudProfilesRestrictionType,
  FraudProfilesRestrictionValue,
  FraudProfilesStatus,
  FraudProfilesTargetType,
} from 'src/react/services/api-blacklist.service';
import {useCustomerDetails} from '../../customers/customers.queries';
import {restrictionTypeLabel, statusOptions} from '../fraud-profile.const';
import {
  useCreateFraudProfileMutation,
  useUpdateFraudProfileMutation,
} from '../fraud-profile.queries';

export const enum FraudProfileFormType {
  ADD = 'add',
  UPDATE = 'update',
}
export interface FraudProfileFormProps {
  onDismiss: () => void;
  userId: string;
  current?: FraudProfile;
  isShowCustomerName: boolean;
}

export const FraudProfileForm = (props: FraudProfileFormProps) => {
  const showMsg = useNotification();
  const {data: customer} = useCustomerDetails(props.userId);

  const {mutate, isLoading} = props.current
    ? useUpdateFraudProfileMutation()
    : useCreateFraudProfileMutation();

  const initialValues = React.useMemo<FraudProfilesFormInput>(
    () => ({
      status: props.current?.status,
      remarks: props.current?.remarks,
      restrictions: props.current?.restrictions?.map((r) => r.type) || [],
    }),
    [props.current],
  );
  const handleSubmit = (values) => {
    const payload: FraudProfilesInput = {
      id: props.current?.id,
      targetId: props.userId,
      targetName: customer?.fullName,
      targetType: FraudProfilesTargetType.USER,
      status: values.status,
      remarks: values.status === FraudProfilesStatus.CLEARED ? '' : values.remarks,
      restrictions:
        values.status === FraudProfilesStatus.CLEARED
          ? []
          : values.restrictions.map((r) => ({
              type: r,
              value: FraudProfilesRestrictionValue.BLOCK,
            })),
    };
    mutate(payload, {
      onSuccess: () => {
        showMsg({
          title: 'Customer fraud profile was updated successfully',
        });
        props.onDismiss();
      },
      onError: (err: any) => {
        const response = err.response && err.response.data;
        showMsg({
          title: `Customer fraud profile failed to update`,
          variant: 'error',
          description: response?.message || err.message,
        });
        props.onDismiss();
      },
    });
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {(formikBag) => (
        <form onSubmit={formikBag.handleSubmit}>
          <Modal.Body>
            {props.isShowCustomerName && (
              <TextField
                label="Customer name"
                value={customer?.fullName}
                layout="horizontal-responsive"
                readOnly
              />
            )}
            <FormikDropdownField
              fieldName="status"
              options={statusOptions}
              label="Status"
              data-testid="fraud-profile-status"
              layout="horizontal-responsive"
            />
            {formikBag.values.status !== FraudProfilesStatus.CLEARED && (
              <>
                <FormikCheckboxField
                  fieldName="restrictions"
                  options={restrictionTypeOptions}
                  label="Restrictions"
                  layout="horizontal-responsive"
                />
                <FormikTextareaField
                  fieldName="remarks"
                  label="Remarks"
                  layout="horizontal-responsive"
                />
              </>
            )}
          </Modal.Body>
          <Modal.Footer className="text-right space-x-3">
            <Button onClick={props.onDismiss} disabled={isLoading} variant="outline">
              CANCEL
            </Button>
            <Button
              data-testid="fraud-profile-submit-button"
              isLoading={isLoading}
              type="submit"
              variant="primary">
              SAVE
            </Button>
          </Modal.Footer>
        </form>
      )}
    </Formik>
  );
};

const restrictionTypeOptions = Object.values(FraudProfilesRestrictionType).map((value) => ({
  value,
  label: restrictionTypeLabel[value],
}));
