import {
  Button,
  Checkbox,
  DropdownSelect,
  FieldContainer,
  Modal,
  MultiInput,
  SearchableDropdown,
  useDebounce,
} from '@setel/portal-ui';
import {useFormik} from 'formik';
import _ from 'lodash';
import React, {useCallback} from 'react';
import {useBillingPlans} from 'src/react/modules/billing-plans/billing-plan.queries';
import {
  PricingModel,
  BillingDateTextPair,
} from 'src/react/modules/billing-plans/billing-plan.types';
import {subscriptionNotifications} from 'src/react/modules/billing-subscriptions/billing-subscriptions.constants';
import {
  useCreateBillingSubscriptionSPAccount,
  useEditBillingSubscriptionSPAccount,
} from 'src/react/modules/billing-subscriptions/billing-subscriptions.queries';
import {
  BillingSubscription,
  SubscriptionPhysicals,
} from 'src/react/modules/billing-subscriptions/billing-subscriptions.types';
import {requiredText} from 'src/shared/helpers/input-error-message-helper';
import * as Yup from 'yup';
import {useNotification} from 'src/react/hooks/use-notification';
import {
  creditTermOptions,
  dunningCodeOptions,
  physicalStatementOptions,
} from '../../merchant.const';

interface SmartpayDetailsBillingModalCreateProps {
  isEdit: boolean;
  showModal: boolean;
  onDismiss: () => void;
  merchantId: string;
  initData?: BillingSubscription;
  dataContact?: string | undefined;
}

const SmartpayDetailsBillingModalCreate: React.VFC<SmartpayDetailsBillingModalCreateProps> = ({
  isEdit,
  showModal,
  onDismiss,
  merchantId,
  initData,
  dataContact,
}) => {
  const [billPlanOptions, setBillPlanOptions] = React.useState([]);
  const [isCheckedEstatement, setIsCheckedEstatement] = React.useState(
    initData?.eStatement || false,
  );
  const [searchBillingPlans, setSearchBillingPlans] = React.useState(
    initData?.attributes?.billingPlanName || '',
  );
  const showMessage = useNotification();

  const searchPlans = useDebounce(searchBillingPlans, 500);

  const {data: dataPlan, isLoading: isLoadingPlan} = useBillingPlans({
    page: 1,
    perPage: 20,
    searchName: searchPlans,
    pricingModel: PricingModel.METERED, // current only support create by plan pricingModel = METERED
  });
  const {mutateAsync: createBillingMutateAsync, isLoading: isLoadingCreateBilling} =
    useCreateBillingSubscriptionSPAccount();
  const {mutateAsync: editBillingMutateAsync, isLoading: isLoadingEditBilling} =
    useEditBillingSubscriptionSPAccount(initData?.id);

  const validationSchema1 = Yup.object({
    billingPlanId: Yup.string().required('This field is required.'),
    dunningCode: Yup.string().required('This field is required.'),
    physical: Yup.string(),
    eStatement: Yup.boolean().required(requiredText('E-Statement')),
    eStatementEmails: Yup.array()
      .of(Yup.string().email('Please enter a valid email address. Eg. johndoe@domain.com'))
      .required('This field is required.')
      .max(1, 'Please ensure to add only ONE email address.'),

    paymentTermDays: Yup.number()
      .notOneOf([0], 'This field is required.')
      .required('This field is required.'),
  });

  const validationSchema2 = Yup.object({
    billingPlanId: Yup.string().required('This field is required.'),
    dunningCode: Yup.string().required('This field is required.'),
    physical: Yup.string(),
    eStatement: Yup.boolean().required(requiredText('E-Statement')),
    paymentTermDays: Yup.number()
      .notOneOf([0], 'This field is required.')
      .required('This field is required.'),
  });

  const validationSchema = React.useMemo(() => {
    switch (isCheckedEstatement) {
      case true:
        return validationSchema1;
      case false:
        return validationSchema2;
    }
  }, [isCheckedEstatement]);

  const {values, errors, setFieldValue, touched, handleSubmit} = useFormik({
    initialValues: {
      merchantId,
      billingPlanId: initData?.billingPlanId || '',
      dunningCode: initData?.dunningCode?.toString() || '',
      physical: initData?.physical || SubscriptionPhysicals.NONE,
      eStatement:
        initData?.eStatement && initData?.eStatementEmails.length ? initData?.eStatement : false,
      eStatementEmails: initData?.eStatementEmails || [],
      paymentTermDays: Number(initData?.paymentTermDays || 0),
    },
    validationSchema,
    onSubmit: (values) => {
      if (isEdit && initData?.id) {
        const data = _.pick(values, [
          'billingPlanId',
          'dunningCode',
          'physical',
          'eStatement',
          'eStatementEmails',
          'paymentTermDays',
        ]);
        if (
          (values.eStatement && values.eStatementEmails.length === 1) ||
          (values.eStatement && dataContact) ||
          !values.eStatement
        ) {
          editBillingMutateAsync(
            {
              ...data,
              dunningCode: Number(data.dunningCode),
            },
            {
              onSuccess: () => {
                showMessage({
                  title: 'Successful!',
                  description: subscriptionNotifications.updated,
                });
                onDismiss();
              },
            },
          );
        }
      } else {
        if (
          (values.eStatement && values.eStatementEmails.length === 1) ||
          (values.eStatement && dataContact) ||
          !values.eStatement
        ) {
          createBillingMutateAsync(
            {
              ...values,
              dunningCode: Number(values.dunningCode),
            },
            {
              onSuccess: () => {
                showMessage({
                  title: 'Successful!',
                  description: subscriptionNotifications.updated,
                });
                onDismiss();
              },
            },
          );
        }
      }
    },
  });

  const setBillingPlan = useCallback((value: string) => {
    setFieldValue('billingPlanId', value);
  }, []);

  const setDunningCode = useCallback((value: string) => {
    setFieldValue('dunningCode', value);
  }, []);

  const setPhysicalStatement = useCallback((value: string) => {
    setFieldValue('physical', value);
  }, []);

  const setEStatement = useCallback((value: boolean) => {
    setIsCheckedEstatement(value);
    setFieldValue('eStatement', value);
  }, []);

  const setPaymentTermDays = useCallback((value: number) => {
    setFieldValue('paymentTermDays', value);
  }, []);

  const setEstatementEmails = useCallback((value: string[]) => {
    setFieldValue('eStatementEmails', value);
  }, []);

  const handleCreateBilling = useCallback(() => {
    handleSubmit();
  }, []);

  React.useEffect(() => {
    if ((dataContact && !isEdit) || (dataContact && isEdit)) {
      setFieldValue('eStatementEmails', [dataContact]);
    }
  }, [isCheckedEstatement, dataContact, isEdit]);

  React.useEffect(() => {
    if (searchBillingPlans !== searchPlans) {
      return setBillPlanOptions(undefined);
    }

    if (isLoadingPlan) {
      return setBillPlanOptions(undefined);
    }

    if (!dataPlan?.billingPlans || dataPlan?.billingPlans.length === 0) {
      return setBillPlanOptions([]);
    }

    setBillPlanOptions(
      dataPlan.billingPlans.map((billingPlanInfo) => {
        return {
          label: `${billingPlanInfo.name} • ${BillingDateTextPair[billingPlanInfo.billingDate]}`,
          value: billingPlanInfo.id,
        };
      }),
    );
  }, [isLoadingPlan, searchBillingPlans, searchPlans, dataPlan]);

  return (
    <Modal
      aria-label={`${isEdit ? 'Edit' : 'Create'} billing details`}
      isOpen={showModal}
      onDismiss={() => onDismiss()}
      initialFocus="dismiss">
      <Modal.Header>{isEdit ? 'Edit' : 'Create'} billing details</Modal.Header>
      <Modal.Body>
        <FieldContainer
          label="Billing plan"
          status={touched.billingPlanId && errors.billingPlanId ? 'error' : undefined}
          helpText={touched.billingPlanId && errors.billingPlanId}
          layout="horizontal-responsive">
          <div className="w-3/4">
            <SearchableDropdown
              value={values.billingPlanId}
              onChangeValue={setBillingPlan}
              options={billPlanOptions}
              placeholder="Enter billing plan name"
              onInputValueChange={setSearchBillingPlans}
            />
          </div>
        </FieldContainer>
        <FieldContainer
          label="Dunning code"
          status={touched.dunningCode && errors.dunningCode ? 'error' : undefined}
          helpText={touched.dunningCode && errors.dunningCode}
          layout="horizontal-responsive">
          <div className="w-3/4">
            <DropdownSelect
              value={values.dunningCode}
              onChangeValue={setDunningCode}
              options={dunningCodeOptions}
              placeholder="Please select"
            />
          </div>
        </FieldContainer>
        <FieldContainer label="Physical statement (Optional)" layout="horizontal-responsive">
          <div className="w-1/2">
            <DropdownSelect
              value={values.physical}
              onChangeValue={setPhysicalStatement}
              options={physicalStatementOptions}
              placeholder="None"
            />
          </div>
        </FieldContainer>
        <FieldContainer
          label="E-statement"
          status={touched.eStatement && errors.eStatement ? 'error' : undefined}
          helpText={touched.eStatement && errors.eStatement}
          layout="horizontal-responsive">
          <div className="w-1/2">
            <Checkbox checked={values.eStatement} onChangeValue={setEStatement} label="Enable" />
          </div>
        </FieldContainer>
        {(values.eStatement && initData?.eStatementEmails?.length && isEdit && !dataContact) ||
        (values.eStatement && !initData?.eStatementEmails?.length && isEdit && !dataContact) ||
        (values.eStatement && !dataContact && !isEdit) ? (
          <FieldContainer
            label=""
            status={touched.eStatementEmails && errors.eStatementEmails ? 'error' : undefined}
            helpText={
              touched.eStatementEmails && errors.eStatementEmails
                ? errors.eStatementEmails
                : 'Please ensure to add only ONE email address.'
            }
            layout="horizontal-responsive">
            <div className="mr-9">
              <MultiInput
                badgeColor="grey"
                autoComplete="off"
                values={values.eStatementEmails}
                onChangeValues={setEstatementEmails}
                variant="textarea"
                className="py-1 px-3"
              />
            </div>
          </FieldContainer>
        ) : null}
        <FieldContainer
          label="Credit term"
          status={touched.paymentTermDays && errors.paymentTermDays ? 'error' : undefined}
          helpText={touched.paymentTermDays && errors.paymentTermDays}
          layout="horizontal-responsive">
          <div className="w-1/2">
            <DropdownSelect
              value={values.paymentTermDays}
              onChangeValue={setPaymentTermDays}
              options={creditTermOptions}
              placeholder="Please select"
            />
          </div>
        </FieldContainer>
      </Modal.Body>
      <Modal.Footer className="text-right">
        <Button onClick={onDismiss} variant="outline" className="mr-4">
          CANCEL
        </Button>
        <Button
          onClick={handleCreateBilling}
          variant="primary"
          isLoading={isLoadingCreateBilling || isLoadingEditBilling}>
          SAVE {isEdit && 'CHANGES'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SmartpayDetailsBillingModalCreate;
