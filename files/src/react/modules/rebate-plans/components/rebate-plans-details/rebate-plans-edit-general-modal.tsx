import * as React from 'react';
import {
  Button,
  Modal,
  TextField,
  FieldContainer,
  RadioGroup,
  Radio,
  TextareaField,
  MultiInputWithSuggestions,
  TextInput,
  Alert,
} from '@setel/portal-ui';
import {useNotification} from 'src/react/hooks/use-notification';
import {useEditGeneralRebatePlan, useLoyaltyCategoryCodes} from '../../rebate-plans.queries';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {
  ALL_CATEGORIES,
  fieldRequiredMessageError,
  RebatePlansNotificationMessages,
} from '../../rebate-plans.constant';
import {buildServerError} from '../../rebate-plans.helper';
import {IRebatePlan} from '../../../../services/api-rebates.type';

export const RebatePlansModalGeneralEdit = ({
  setShowModal,
  rebatePlanDetail,
}: {
  setShowModal: Function;
  rebatePlanDetail: IRebatePlan;
}) => {
  const showMessage = useNotification();
  const [options, setOptions] = React.useState([]);
  const [searchString, setSearchString] = React.useState('');
  const {
    mutateAsync: editRebatePlanGeneral,
    isLoading,
    isError,
    error,
  } = useEditGeneralRebatePlan();
  const serverErrorMessage: any = buildServerError(error);
  const {data: loyaltyCategoryCodes} = useLoyaltyCategoryCodes(searchString);

  const validationSchema: any = Yup.object({
    planName: Yup.string().max(100).required(fieldRequiredMessageError),
    type: Yup.string().max(40),
    loyaltyCategoryIds: Yup.array().when('isAllLoyaltyCategoryIds', {
      is: false,
      then: Yup.array().required(fieldRequiredMessageError),
      otherwise: Yup.array().optional(),
    }),
  });

  const {values, errors, setFieldValue, touched, handleSubmit} = useFormik({
    initialValues: {
      planName: rebatePlanDetail.planName,
      type: rebatePlanDetail.type,
      loyaltyCategoryIds: rebatePlanDetail.loyaltyCategoryIds,
      remarks: rebatePlanDetail.remarks,
      isAllLoyaltyCategoryIds: rebatePlanDetail.isAllLoyaltyCategoryIds,
      ...rebatePlanDetail,
    },
    validationSchema,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: async (values) => {
      await editRebatePlanGeneral({body: values, planId: rebatePlanDetail.planId});
      setShowModal(false);
      showMessage({
        title: RebatePlansNotificationMessages.successTitle,
        description: RebatePlansNotificationMessages.updatedRebatePlan,
      });
    },
  });
  React.useEffect(() => {
    if (loyaltyCategoryCodes) {
      setOptions([
        ALL_CATEGORIES,
        ...loyaltyCategoryCodes.items
          .filter((category) => !values.loyaltyCategoryIds.includes(category.categoryName))
          .map((category) => category.categoryName),
      ]);
    } else {
      setOptions([]);
    }
  }, [loyaltyCategoryCodes]);

  return (
    <Modal
      header="Edit details"
      isOpen={true}
      onDismiss={() => setShowModal(false)}
      data-testid="Edit details general"
      className={'w-full'}>
      {isError && <Alert variant="error" description={serverErrorMessage?.message} />}
      <Modal.Body>
        <TextField
          label="Plan name"
          status={touched?.planName && errors?.planName ? 'error' : undefined}
          helpText={touched?.planName && errors?.planName}
          value={values.planName}
          onChangeValue={(value) => setFieldValue('planName', value)}
          layout="horizontal-responsive"
          maxLength={100}
          placeholder="Enter plan name"
          className="w-9/12"
        />
        <TextField
          layout="horizontal-responsive"
          label={'Plan ID'}
          value={values.planId}
          maxLength={100}
          disabled={true}
          className="w-1/2"
        />
        <FieldContainer
          label={'Rebate plan type'}
          status={touched?.type && errors?.type ? 'error' : undefined}
          helpText={touched?.type && errors?.type}
          layout="horizontal-responsive">
          <RadioGroup
            value={values.type}
            onChangeValue={(value) => setFieldValue('type', value)}
            name="rebatePlanType">
            <Radio value="Volume">Volume</Radio>
            <Radio value="Amount">Amount</Radio>
          </RadioGroup>
        </FieldContainer>
        <FieldContainer
          label={'Loyalty category'}
          status={touched?.loyaltyCategoryIds && errors?.loyaltyCategoryIds ? 'error' : undefined}
          helpText={touched?.loyaltyCategoryIds && errors?.loyaltyCategoryIds}
          layout="horizontal-responsive">
          {!values.isAllLoyaltyCategoryIds && (
            <MultiInputWithSuggestions
              values={values.loyaltyCategoryIds}
              onChangeValues={(value) => {
                if (value[value.length - 1] === ALL_CATEGORIES) {
                  setFieldValue('isAllLoyaltyCategoryIds', true);
                  setFieldValue('loyaltyCategoryIds', []);
                }
                setFieldValue('loyaltyCategoryIds', value);
                setOptions([
                  ALL_CATEGORIES,
                  ...loyaltyCategoryCodes.items
                    .filter((option) => !value.includes(option.categoryName))
                    .map((category) => category.categoryName),
                ]);
              }}
              suggestions={options}
              autoComplete="off"
              onInputValueChange={setSearchString}
              className="w-9/12 max-h-44 portal-ui-scrollbar"
            />
          )}
          {values.isAllLoyaltyCategoryIds && (
            <TextInput
              value={ALL_CATEGORIES}
              onChangeValue={() => {
                setFieldValue('loyaltyCategoryIds', []);
                setFieldValue('isAllLoyaltyCategoryIds', false);
                setOptions([
                  ALL_CATEGORIES,
                  ...loyaltyCategoryCodes.items.map((category) => category.categoryName),
                ]);
              }}
              className="w-9/12"
            />
          )}
        </FieldContainer>
        <TextareaField
          label="Remarks (Optional)"
          layout="horizontal-responsive"
          value={values.remarks}
          status={touched?.remarks && errors?.remarks ? 'error' : undefined}
          helpText={touched?.remarks && errors?.remarks}
          onChangeValue={(value) => setFieldValue('remarks', value)}
          className="w-11/12"
          maxLength={100}
        />
      </Modal.Body>
      <Modal.Footer className="flex justify-end">
        <Button className="mr-2" onClick={() => setShowModal(false)} variant="outline">
          {'CANCEL'}
        </Button>
        <Button onClick={() => handleSubmit()} variant="primary" isLoading={isLoading}>
          {'SAVE CHANGES'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
