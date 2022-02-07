import {
  Button,
  DaySelector,
  DropdownSelect,
  FieldContainer,
  Modal,
  TextField,
} from '@setel/portal-ui';
import {useFormik} from 'formik';
import * as React from 'react';
import {QueryErrorAlert} from '../../../../components/query-error-alert';
import {useCreateSmartpayAccountOrApplication} from '../../merchants.queries';
import {
  MerchantSmartpayBusinessCategoryOptions,
  MerchantSmartpayCompanyInfo,
  MerchantSmartpayCompanyTypeOptions,
  MerchantSmartpayFleetPlanOption,
  SmartpayType,
  SPAContactInfo,
  SPASubscriptionInfo,
} from '../../merchants.type';
import {ProgressStepByStep} from './progress-step-by-step';
import {
  SmartpayCompanyValidationSchema,
  SPAContactInfoValidationSchema,
  SPASubscriptionInfoValidationSchema,
} from './smartpay-validation-schema';

const progressSteps = [
  {
    label: 'Company/individual details',
  },
  {
    label: 'Contact details',
  },
  {
    label: 'Subscription details',
  },
];

export const SmartpayAccountCreateModal = (props: {
  onDismiss: () => void;
  onDone: () => void;
  userEmail?: string;
  smartpayType?: SmartpayType;
}) => {
  const [step, setStep] = React.useState(1);
  const [showConfirmSubmitModal, setShowConfirmSubmitModal] = React.useState(false);
  const {
    mutate: createSmartpayAccount,
    error: createError,
    isLoading,
  } = useCreateSmartpayAccountOrApplication(props.smartpayType);
  const isCreateAccount = props.smartpayType === SmartpayType.ACCOUNT;

  const {
    setFieldValue: setValueStep2,
    handleBlur: handleBlueStep2,
    touched: touchedStep2,
    errors: errorsStep2,
    handleSubmit: handleSubmitStep2,
    values: valuesStep2,
    isValid: isValidStep2,
    dirty: dirtyStep2,
  } = useFormik<SPAContactInfo>({
    initialValues: {
      name: '',
      phoneNumber: '',
      emailAddress: '',
    },
    onSubmit: () => {
      setStep(3);
    },
    validationSchema: SPAContactInfoValidationSchema,
  });

  const {
    setFieldValue: setValueStep1,
    handleBlur: handleBlueStep1,
    handleSubmit: handleSubmitStep1,
    touched: touchedStep1,
    errors: errorsStep1,
    values: valuesStep1,
    isValid: isValidStep1,
    dirty: dirtyStep1,
  } = useFormik<MerchantSmartpayCompanyInfo>({
    initialValues: {
      businessCategory: '',
      companyEmbossName: '',
      companyOrIndividualName: '',
      companyRegDate: '',
      companyType: '',
      companyRegNo: '',
    },
    onSubmit: () => {
      setStep(2);
    },
    validationSchema: SmartpayCompanyValidationSchema,
  });

  const {
    setFieldValue: setValueStep3,
    touched: touchedStep3,
    errors: errorsStep3,
    handleSubmit: handleSubmitStep3,
    values: valuesStep3,
    isValid: isValidStep3,
    dirty: dirtyStep3,
  } = useFormik<SPASubscriptionInfo>({
    initialValues: {
      fleetPlan: '',
      language: '',
      isCreateVirtualAccount: true,
    },
    onSubmit: () => {
      if (isCreateAccount) {
        submitForm();
      } else {
        setShowConfirmSubmitModal(true);
      }
    },
    validationSchema: SPASubscriptionInfoValidationSchema,
  });

  const prepareSubmit = () => {
    if (step === 1) {
      handleSubmitStep1();
    } else if (step === 2) {
      handleSubmitStep2();
    } else if (step === 3) {
      handleSubmitStep3();
    }
  };

  const isDisabledNext = () => {
    if (step === 1) {
      return !isValidStep1 || !dirtyStep1;
    } else if (step === 2) {
      return !isValidStep2 || !dirtyStep2;
    } else if (step === 3) {
      return !isValidStep3 || !dirtyStep3;
    }
  };

  const submitForm = () => {
    setShowConfirmSubmitModal(false);
    createSmartpayAccount(
      {
        createdOrUpdatedBy: props.userEmail,
        contactDetail: {
          name: valuesStep2.name,
          phoneNumber: valuesStep2.phoneNumber || undefined,
          emailAddress: valuesStep2.emailAddress,
        },
        companyOrIndividualInfo: {
          companyOrIndividualName: valuesStep1.companyOrIndividualName,
          companyEmbossName: valuesStep1.companyEmbossName,
          companyRegDate: valuesStep1.companyRegDate,
          companyRegNo: valuesStep1.companyRegNo,
          companyType: valuesStep1.companyType,
          businessCategory: valuesStep1.businessCategory,
        },
        generalInfo: {
          fleetPlan: valuesStep3.fleetPlan,
          language: valuesStep3.language,
          // isCreateVirtualAccount: valuesStep3.isCreateVirtualAccount,
        },
      },
      {
        onSuccess: () => {
          props.onDone();
        },
      },
    );
  };

  return (
    <Modal isOpen onDismiss={props.onDismiss} aria-label={'create-smartpay-account-merchant-modal'}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          prepareSubmit();
        }}>
        <Modal.Header>
          {`Create new SmartPay ${isCreateAccount ? 'account' : 'application'}`}
        </Modal.Header>
        <Modal.Body>
          {!isLoading && createError && (
            <div className={'mb-5'}>
              <QueryErrorAlert error={createError as any} />
            </div>
          )}
          <ProgressStepByStep stepIndex={step} steps={progressSteps} />
          <div className={'mt-12'}>
            {step === 1 && (
              <>
                <FieldContainer
                  layout={'horizontal-responsive'}
                  label={
                    <span>
                      Company type <span className={'text-red-500'}>*</span>
                    </span>
                  }
                  status={touchedStep1.companyType && errorsStep1.companyType ? 'error' : undefined}
                  helpText={
                    touchedStep1.companyType && errorsStep1.companyType
                      ? errorsStep1.companyType
                      : ''
                  }>
                  <DropdownSelect
                    className="w-72 placeholder-gray-400"
                    name={'companyType'}
                    value={valuesStep1.companyType}
                    placeholder={'Please select'}
                    onChangeValue={(v) => setValueStep1('companyType', v)}
                    options={MerchantSmartpayCompanyTypeOptions}
                  />
                </FieldContainer>

                <TextField
                  layout={'horizontal-responsive'}
                  label={
                    <span>
                      Company/individual
                      <br /> name <span className={'text-red-500'}>*</span>
                    </span>
                  }
                  className={'w-72'}
                  onBlur={handleBlueStep1}
                  name={'companyOrIndividualName'}
                  value={valuesStep1.companyOrIndividualName}
                  onChangeValue={(v) => setValueStep1('companyOrIndividualName', v)}
                  status={
                    touchedStep1.companyOrIndividualName && errorsStep1.companyOrIndividualName
                      ? 'error'
                      : undefined
                  }
                  helpText={
                    touchedStep1.companyOrIndividualName && errorsStep1.companyOrIndividualName
                      ? errorsStep1.companyOrIndividualName
                      : ''
                  }
                />
                <TextField
                  layout={'horizontal-responsive'}
                  label={
                    <span>
                      Company
                      <br /> registration number <span className={'text-red-500'}>*</span>
                    </span>
                  }
                  className={'w-72'}
                  name={'companyRegNo'}
                  onBlur={handleBlueStep1}
                  value={valuesStep1.companyRegNo}
                  onChangeValue={(v) => setValueStep1('companyRegNo', v)}
                  status={
                    touchedStep1.companyRegNo && errorsStep1.companyRegNo ? 'error' : undefined
                  }
                  helpText={
                    touchedStep1.companyRegNo && errorsStep1.companyRegNo
                      ? errorsStep1.companyRegNo
                      : ''
                  }
                />
                <FieldContainer
                  layout={'horizontal-responsive'}
                  label={
                    <span>
                      Company
                      <br /> registration date <span className={'text-red-500'}>*</span>
                    </span>
                  }
                  status={
                    touchedStep1.companyRegDate && errorsStep1.companyRegDate ? 'error' : undefined
                  }
                  helpText={
                    touchedStep1.companyRegDate && errorsStep1.companyRegDate
                      ? errorsStep1.companyRegDate
                      : ''
                  }>
                  <DaySelector
                    name={'companyRegDate'}
                    placeholder={'Select date'}
                    showMonthYearDropdown
                    value={
                      valuesStep1.companyRegDate ? new Date(valuesStep1.companyRegDate) : undefined
                    }
                    onChangeValue={(v) => setValueStep1('companyRegDate', v?.toISOString())}
                    className={'w-48'}
                  />
                </FieldContainer>
                <TextField
                  layout={'horizontal-responsive'}
                  label={
                    <span>
                      Company embossed
                      <br /> name <span className={'text-red-500'}>*</span>
                    </span>
                  }
                  className={'w-72'}
                  onBlur={handleBlueStep1}
                  name={'companyEmbossName'}
                  value={valuesStep1.companyEmbossName}
                  onChangeValue={(v) => setValueStep1('companyEmbossName', v)}
                  status={
                    touchedStep1.companyEmbossName && errorsStep1.companyEmbossName
                      ? 'error'
                      : undefined
                  }
                  helpText={
                    touchedStep1.companyEmbossName && errorsStep1.companyEmbossName
                      ? errorsStep1.companyEmbossName
                      : ''
                  }
                />

                <FieldContainer
                  layout={'horizontal-responsive'}
                  label={
                    <span>
                      Business category <span className={'text-red-500'}>*</span>
                    </span>
                  }
                  status={
                    touchedStep1.businessCategory && errorsStep1.businessCategory
                      ? 'error'
                      : undefined
                  }
                  helpText={
                    touchedStep1.businessCategory && errorsStep1.businessCategory
                      ? errorsStep1.businessCategory
                      : ''
                  }>
                  <DropdownSelect
                    className="w-72 placeholder-gray-400"
                    name={'businessCategory'}
                    placeholder={'Please select'}
                    value={valuesStep1.businessCategory}
                    onChangeValue={(v) => setValueStep1('businessCategory', v)}
                    options={MerchantSmartpayBusinessCategoryOptions}
                  />
                </FieldContainer>
                <span className={'text-xs text-mediumgrey'}>
                  <span className={'text-red-500'}>*</span> Required fields
                </span>
              </>
            )}
            {step === 2 && (
              <>
                <TextField
                  layout={'horizontal-responsive'}
                  label={
                    <span>
                      Name <span className={'text-red-500'}>*</span>
                    </span>
                  }
                  className={'w-72'}
                  placeholder={'Enter name'}
                  name={'name'}
                  onBlur={handleBlueStep2}
                  value={valuesStep2.name}
                  onChangeValue={(v) => setValueStep2('name', v)}
                  status={touchedStep2.name && errorsStep2.name ? 'error' : undefined}
                  helpText={touchedStep2.name && errorsStep2.name ? errorsStep2.name : ''}
                />
                <TextField
                  layout={'horizontal-responsive'}
                  label={
                    <span>
                      Phone number <span className={'text-red-500'}>*</span>
                    </span>
                  }
                  className={'w-72'}
                  onBlur={handleBlueStep2}
                  placeholder={'Enter phone number'}
                  name={'phoneNumber'}
                  value={valuesStep2.phoneNumber}
                  onChangeValue={(v) => setValueStep2('phoneNumber', v)}
                  status={touchedStep2.phoneNumber && errorsStep2.phoneNumber ? 'error' : undefined}
                  helpText={
                    touchedStep2.phoneNumber && errorsStep2.phoneNumber
                      ? errorsStep2.phoneNumber
                      : ''
                  }
                />
                <TextField
                  layout={'horizontal-responsive'}
                  label={
                    <span>
                      Email address <span className={'text-red-500'}>*</span>
                    </span>
                  }
                  className={'w-72'}
                  onBlur={handleBlueStep2}
                  placeholder={'Enter email address'}
                  name={'emailAddress'}
                  value={valuesStep2.emailAddress}
                  onChangeValue={(v) => setValueStep2('emailAddress', v)}
                  status={
                    touchedStep2.emailAddress && errorsStep2.emailAddress ? 'error' : undefined
                  }
                  helpText={
                    touchedStep2.emailAddress && errorsStep2.emailAddress
                      ? errorsStep2.emailAddress
                      : ''
                  }
                />
                <span className={'text-xs text-mediumgrey'}>
                  <span className={'text-red-500'}>*</span> Required fields
                </span>
              </>
            )}
            {step === 3 && (
              <>
                <FieldContainer
                  layout={'horizontal-responsive'}
                  label={
                    <span>
                      Fleet plan <span className={'text-red-500'}>*</span>
                    </span>
                  }
                  status={touchedStep3.fleetPlan && errorsStep3.fleetPlan ? 'error' : undefined}
                  helpText={
                    touchedStep3.fleetPlan && errorsStep3.fleetPlan ? errorsStep3.fleetPlan : ''
                  }>
                  <DropdownSelect
                    className="w-72 placeholder-gray-400"
                    name={'fleetPlan'}
                    value={valuesStep3.fleetPlan}
                    onChangeValue={(v) => setValueStep3('fleetPlan', v)}
                    placeholder={'Please select'}
                    options={MerchantSmartpayFleetPlanOption}
                  />
                </FieldContainer>
                <FieldContainer
                  layout={'horizontal-responsive'}
                  label={
                    <span>
                      Language <span className={'text-red-500'}>*</span>
                    </span>
                  }
                  status={touchedStep3.language && errorsStep3.language ? 'error' : undefined}
                  helpText={
                    touchedStep3.language && errorsStep3.language ? errorsStep3.language : ''
                  }>
                  <DropdownSelect
                    className="w-72 placeholder-gray-400"
                    name={'language'}
                    placeholder={'Please select'}
                    value={valuesStep3.language}
                    onChangeValue={(v) => setValueStep3('language', v)}
                    options={[
                      {
                        label: 'Bahasa Malaysia',
                        value: 'bahasa_malaysia',
                      },
                      {
                        label: 'English',
                        value: 'english',
                      },
                    ]}
                  />
                </FieldContainer>
                {/*<FieldContainer layout="horizontal-responsive" label="Virtual account">*/}
                {/*  <Checkbox*/}
                {/*    name="isCreateVirtualAccount"*/}
                {/*    label="Yes"*/}
                {/*    checked={valuesStep3.isCreateVirtualAccount}*/}
                {/*    onChangeValue={(v) => setValueStep3('isCreateVirtualAccount', v)}*/}
                {/*  />*/}
                {/*</FieldContainer>*/}
                <span className={'text-xs text-mediumgrey'}>
                  <span className={'text-red-500'}>*</span> Required fields
                </span>
              </>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className={'text-right space-x-3'}>
          {step === 1 ? (
            <Button variant="outline" onClick={props.onDismiss} minWidth={'none'}>
              CANCEL
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setStep(step - 1)} minWidth={'none'}>
              BACK
            </Button>
          )}
          <Button
            minWidth={'none'}
            variant="primary"
            type="submit"
            isLoading={isLoading}
            disabled={isDisabledNext()}>
            {isCreateAccount && step === 3 ? 'SAVE' : 'NEXT'}
          </Button>
        </Modal.Footer>
        <Modal
          isOpen={showConfirmSubmitModal && !isCreateAccount}
          onDismiss={() => setShowConfirmSubmitModal(false)}
          aria-label={'confirm-create-smartpay-account-merchant-modal'}>
          <React.Fragment>
            <Modal.Header>Submit for approval</Modal.Header>
            <Modal.Body>
              Please ensure all details are correct before submitting this application request.
            </Modal.Body>
          </React.Fragment>
          <Modal.Footer className={'text-right space-x-3'}>
            <Button variant="outline" onClick={() => setShowConfirmSubmitModal(false)}>
              CANCEL
            </Button>
            <Button variant="primary" onClick={() => submitForm()}>
              CONFIRM
            </Button>
          </Modal.Footer>
        </Modal>
      </form>
    </Modal>
  );
};
