import * as React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  DropdownSelectField,
  Button,
  FieldContainer,
  Text,
  InputButton,
  CalendarIcon,
  DateRangePicker,
  formatDate,
  MoneyInput,
  TextField,
  TextareaField,
  Dialog,
  DialogContent,
  DialogFooter,
  titleCase,
} from '@setel/portal-ui';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {BankAccountTypes, BankNames, SecurityDepositTypes} from '../../merchants.type';
import {
  useDeleteSPASecurityDeposit,
  useSecurityDepositDetails,
  useSetSPASecurityDeposit,
} from '../../merchants.queries';
import {QueryErrorAlert} from '../../../../components/query-error-alert';
import {useAuth} from '../../../auth';
import moment from 'moment';

export const SmartpayDetailsSecurityDepositModal = (props: {
  applicationId?: string;
  isEdit?: boolean;
  isMerchant?: boolean;
  depositId?: string;
  onClose?: (string, err?) => void;
}) => {
  const [showValidityPeriodPicker, setShowValidityPeriodPicker] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const cancelRef = React.useRef(null);

  const tzOffset = new Date().getTimezoneOffset() * 60000;
  const {sessionPayload} = useAuth();
  const {data, isLoading} = useSecurityDepositDetails(props.depositId);

  const {
    mutate: setDeposit,
    isLoading: setDepositLoading,
    error: submitError,
  } = useSetSPASecurityDeposit(data?.applicationId || props.applicationId, data);
  const {
    mutate: deleteDeposit,
    isLoading: deleteLoading,
    error: deleteError,
  } = useDeleteSPASecurityDeposit(data?.applicationId || props.applicationId);

  const {values, touched, errors, handleSubmit, setFieldValue, setValues, handleBlur} = useFormik({
    initialValues: {
      securityDepositType: '',
      startDate: undefined,
      endDate: undefined,
      securityDepositAmount: '',
      securityDepositReferenceNumber: '',
      bankAccountType: '',
      bankName: '',
      bankAccountNumber: '',
      sapReferenceNumber: '',
      remarks: '',

      currentStartDate: undefined,
      currentEndDate: undefined,
    },
    validationSchema,
    onSubmit: () => {
      setDeposit(
        {
          ...values,
          startDate:
            values.securityDepositType === SecurityDepositTypes.BANK_GUARANTEE && values.startDate
              ? new Date(values.startDate - tzOffset).toISOString().split('T')[0]
              : undefined,
          endDate:
            values.securityDepositType === SecurityDepositTypes.BANK_GUARANTEE && values.endDate
              ? values.endDate.toISOString().split('T')[0]
              : undefined,
          ...(props.isEdit
            ? {
                updatedBy: sessionPayload?.email,
              }
            : {
                createdBy: sessionPayload?.email,
              }),
          securityDepositAmount: parseFloat(values.securityDepositAmount),
          bankAccountType: values.bankAccountType ? values.bankAccountType : undefined,
          bankName: values.bankName ? values.bankName : undefined,
          bankAccountNumber: !!values.bankAccountNumber ? values.bankAccountNumber : null,
        },
        {
          onSuccess: () => props.onClose('success'),
        },
      );
    },
  });

  React.useEffect(() => {
    if (values.securityDepositType !== SecurityDepositTypes.BANK_GUARANTEE) {
      setValues({
        ...values,
        startDate: undefined,
        endDate: undefined,
      });
    }
  }, [values.securityDepositType]);

  React.useEffect(() => {
    data &&
      setValues({
        ...values,
        securityDepositType: data.securityDepositType || '',
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? moment(data.endDate).endOf('day').toDate() : undefined,
        securityDepositAmount: data.securityDepositAmount.toString() || '',
        securityDepositReferenceNumber: data.securityDepositReferenceNumber || '',
        bankAccountType: data.bankAccountType || '',
        bankName: data.bankName || '',
        bankAccountNumber: data.bankAccountNumber || '',
        sapReferenceNumber: data.sapReferenceNumber || '',
        remarks: data.remarks || '',
      });
  }, [data]);

  const title = props.isEdit ? 'Edit details' : 'Create new security deposit';
  return (
    <React.Fragment>
      <Modal isOpen onDismiss={props.onClose} aria-label={title}>
        <ModalHeader>{title}</ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            {submitError && <QueryErrorAlert className="mb-2" error={submitError as any} />}
            <DropdownSelectField
              label={
                <div>
                  <span>Security deposit type</span>
                  <span className="text-red-500">&nbsp;*</span>
                </div>
              }
              name={'type'}
              value={values?.securityDepositType || ''}
              onChangeValue={(value) => setFieldValue('securityDepositType', value)}
              options={depositTypes}
              onBlur={handleBlur}
              status={
                touched.securityDepositType && errors.securityDepositType ? 'error' : undefined
              }
              helpText={touched.securityDepositType ? errors.securityDepositType : null}
              layout={'horizontal-responsive'}
              placeholder={'Select type'}
              wrapperClass="w-3/4 mt-2"
              className="w-60"
              disabled={isLoading}
            />

            <FieldContainer
              label={
                <div>
                  <span>Validity period</span>
                  {values.securityDepositType === SecurityDepositTypes.BANK_GUARANTEE && (
                    <span className="text-red-500">&nbsp;*</span>
                  )}
                </div>
              }
              status={
                (touched.startDate && errors.startDate) || (touched.endDate && errors.endDate)
                  ? 'error'
                  : null
              }
              helpText={
                touched.startDate && errors.startDate
                  ? errors.startDate
                  : touched.endDate && errors.endDate
                  ? errors.endDate
                  : null
              }
              layout="horizontal-responsive"
              className="w-3/4">
              <div className="flex space-x-2 w-80">
                <InputButton
                  className={`
                    ${!values.startDate && 'text-lightgrey'}
                    ${touched.startDate && errors.startDate && 'border-red-500'}
                    h-10
                  `}
                  onClick={() => {
                    setValues({
                      ...values,
                      currentStartDate: values.startDate,
                      currentEndDate: values.endDate,
                    });
                    setShowValidityPeriodPicker(true);
                  }}
                  disabled={
                    values.securityDepositType !== SecurityDepositTypes.BANK_GUARANTEE || isLoading
                  }>
                  <CalendarIcon className="w-4 mr-2 text-lightgrey" />
                  {(values.startDate && formatDate(values.startDate, {formatType: 'dateOnly'})) ||
                    'Start date'}
                </InputButton>
                <Text>_</Text>
                <InputButton
                  className={`
                    ${!values.endDate && 'text-lightgrey'}
                    ${touched.endDate && errors.endDate && 'border-red-500'}
                    h-10
                  `}
                  onClick={() => {
                    setValues({
                      ...values,
                      currentStartDate: values.startDate,
                      currentEndDate: values.endDate,
                    });
                    setShowValidityPeriodPicker(true);
                  }}
                  disabled={
                    values.securityDepositType !== SecurityDepositTypes.BANK_GUARANTEE || isLoading
                  }>
                  <CalendarIcon className="w-4 mr-2 text-lightgrey" />
                  {(values.endDate && formatDate(values.endDate, {formatType: 'dateOnly'})) ||
                    'End date'}
                </InputButton>
              </div>
            </FieldContainer>

            <FieldContainer
              label={
                <div>
                  <span>Security deposit amount</span>
                  <span className="text-red-500">&nbsp;*</span>
                </div>
              }
              status={
                touched.securityDepositAmount && errors.securityDepositAmount ? 'error' : undefined
              }
              helpText={touched.securityDepositAmount ? errors.securityDepositAmount : null}
              layout="horizontal-responsive"
              className="w-3/4">
              <MoneyInput
                value={values.securityDepositAmount}
                onChangeValue={(value) => setFieldValue('securityDepositAmount', value)}
                onBlur={handleBlur}
                widthClass="w-32"
                disabled={isLoading}
              />
            </FieldContainer>

            <TextField
              label="Security deposit reference number"
              value={values.securityDepositReferenceNumber}
              onChangeValue={(value) => setFieldValue('securityDepositReferenceNumber', value)}
              onBlur={handleBlur}
              status={
                touched.securityDepositReferenceNumber && errors.securityDepositReferenceNumber
                  ? 'error'
                  : undefined
              }
              helpText={
                touched.securityDepositReferenceNumber
                  ? errors.securityDepositReferenceNumber
                  : null
              }
              layout="horizontal-responsive"
              wrapperClass="w-3/4"
              className="w-60"
              disabled={isLoading}
            />

            <DropdownSelectField
              label="Bank account type"
              name={'bankAccountType'}
              value={values.bankAccountType || ''}
              onChangeValue={(value) => setFieldValue('bankAccountType', value)}
              options={bankAccountTypes}
              onBlur={handleBlur}
              status={touched.bankAccountType && errors.bankAccountType ? 'error' : undefined}
              helpText={touched.bankAccountType ? errors.bankAccountType : null}
              layout={'horizontal-responsive'}
              placeholder={'Select type'}
              wrapperClass="w-3/4"
              className="w-60"
              disabled={isLoading}
            />

            <DropdownSelectField
              label="Bank name"
              name={'bankName'}
              value={values.bankName || ''}
              onChangeValue={(value) => setFieldValue('bankName', value)}
              options={bankAccountNames}
              onBlur={handleBlur}
              status={touched.bankName && errors.bankName ? 'error' : undefined}
              helpText={touched.bankName ? errors.bankName : null}
              layout={'horizontal-responsive'}
              placeholder={'Select bank name'}
              wrapperClass="w-3/4"
              className="w-60"
              disabled={isLoading}
            />

            <TextField
              label="Bank account number"
              value={values.bankAccountNumber}
              onChangeValue={(value) => setFieldValue('bankAccountNumber', value)}
              onBlur={handleBlur}
              status={touched.bankAccountNumber && errors.bankAccountNumber ? 'error' : undefined}
              helpText={touched.bankAccountNumber ? errors.bankAccountNumber : null}
              layout="horizontal-responsive"
              wrapperClass="w-3/4"
              className="w-60"
              disabled={isLoading}
            />

            <TextField
              label="SAP reference number"
              value={values.sapReferenceNumber}
              onChangeValue={(value) => setFieldValue('sapReferenceNumber', value)}
              onBlur={handleBlur}
              status={touched.sapReferenceNumber && errors.sapReferenceNumber ? 'error' : undefined}
              helpText={touched.sapReferenceNumber ? errors.sapReferenceNumber : null}
              layout="horizontal-responsive"
              wrapperClass="w-3/4"
              className="w-60"
              disabled={isLoading}
            />

            <TextareaField
              label="Remarks"
              value={values.remarks}
              onChangeValue={(value) => setFieldValue('remarks', value)}
              onBlur={handleBlur}
              status={touched.remarks && errors.remarks ? 'error' : undefined}
              helpText={touched.remarks ? errors.remarks : null}
              layout="horizontal-responsive"
              wrapperClass="w-3/4"
              disabled={isLoading}
            />

            <Text className="text-mediumgrey text-xs mt-2">
              <span className="text-red-500">*</span>
              <span>&nbsp;Required fields</span>
            </Text>
          </ModalBody>
          <ModalFooter>
            <div className="flex items-center justify-between">
              {props.isEdit && !isLoading ? (
                <span
                  className="text-red-500 cursor-pointer font-bold text-xs"
                  onClick={() => setShowDeleteConfirm(true)}>
                  DELETE
                </span>
              ) : (
                <div />
              )}
              <div className="flex items-center">
                <Button variant="outline" onClick={props.onClose}>
                  CANCEL
                </Button>
                <Button
                  className="ml-4"
                  type={'submit'}
                  variant="primary"
                  isLoading={setDepositLoading}
                  disabled={isLoading}>
                  {props.isEdit ? 'SAVE CHANGES' : 'SAVE'}
                </Button>
              </div>
            </div>
          </ModalFooter>
        </form>
      </Modal>

      {showValidityPeriodPicker && (
        <Modal
          size="large"
          isOpen
          onDismiss={() => {
            setValues({
              ...values,
              startDate: values.currentStartDate,
              endDate: values.currentEndDate,
            });
            setShowValidityPeriodPicker(false);
          }}>
          <DateRangePicker
            from={values.startDate}
            onFromChange={(value) => {
              setFieldValue('startDate', value);
            }}
            to={values.endDate}
            onToChange={(value) => {
              setFieldValue('endDate', value);
            }}
            dayOnly
            wrapperClass="pt-6"
          />
          <ModalFooter>
            <div className="flex items-center justify-between">
              {props.isEdit ? (
                <span
                  style={{color: 'red', cursor: 'pointer', fontWeight: 700, fontSize: '.75rem'}}
                  onClick={() => setShowDeleteConfirm(true)}>
                  DELETE
                </span>
              ) : (
                <div />
              )}
              <div className="flex items-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setValues({
                      ...values,
                      startDate: values.currentStartDate,
                      endDate: values.currentEndDate,
                    });
                    setShowValidityPeriodPicker(false);
                  }}>
                  CANCEL
                </Button>
                <Button
                  className="ml-3"
                  variant="primary"
                  onClick={() => setShowValidityPeriodPicker(false)}>
                  APPLY
                </Button>
              </div>
            </div>
          </ModalFooter>
        </Modal>
      )}

      {showDeleteConfirm && (
        <Dialog onDismiss={() => setShowDeleteConfirm(false)} leastDestructiveRef={cancelRef}>
          <DialogContent header="Are you sure to delete security deposit?">
            {deleteError && <QueryErrorAlert className="mb-2" error={deleteError as any} />}
            This action cannot be undone and you will not be able to recover any data.
          </DialogContent>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} ref={cancelRef}>
              CANCEL
            </Button>
            <Button
              variant="error"
              onClick={() => {
                deleteDeposit(data.id, {
                  onSuccess: () => props.onClose('delete_success'),
                });
              }}
              isLoading={deleteLoading}>
              DELETE
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </React.Fragment>
  );
};

const validationSchema = Yup.object({
  securityDepositType: Yup.string().required('This field is required'),
  startDate: Yup.mixed().when('securityDepositType', {
    is: SecurityDepositTypes.BANK_GUARANTEE,
    then: Yup.date().required('This field is required'),
  }),
  endDate: Yup.mixed().when('securityDepositType', {
    is: SecurityDepositTypes.BANK_GUARANTEE,
    then: Yup.date()
      .min(Yup.ref('startDate'), `End date can't be before start date`)
      .required('This field is required'),
  }),
  securityDepositAmount: Yup.number().required('This field is required'),
  securityDepositReferenceNumber: Yup.string(),
  bankAccountType: Yup.string(),
  bankName: Yup.string(),
  bankAccountNumber: Yup.string().test(
    'numberString',
    'This field should have digits only',
    (value) => {
      return !value || !!value?.match(/^\d+$/);
    },
  ),
  sapReferenceNumber: Yup.string(),
  remarks: Yup.string(),
});

export const depositTypes = [
  {
    label: 'Acquired deposit',
    value: SecurityDepositTypes.ACQUIRED_DEPOSIT,
  },
  {
    label: 'Amanah saham',
    value: SecurityDepositTypes.AMANAH_SAHAM,
  },
  {
    label: 'Bumiputera',
    value: SecurityDepositTypes.BUMIPUTERA,
  },
  {
    label: 'Bank guarantee',
    value: SecurityDepositTypes.BANK_GUARANTEE,
  },
  {
    label: 'Cheque deposit',
    value: SecurityDepositTypes.CHEQUE_DEPOSIT,
  },
  {
    label: 'Corporate guarantee',
    value: SecurityDepositTypes.CORPORATE_GUARANTEE,
  },
  {
    label: 'Cash deposit',
    value: SecurityDepositTypes.CASH_DEPOSIT,
  },
  {
    label: 'Letter of credit',
    value: SecurityDepositTypes.LETTER_OF_CREDIT,
  },
  {
    label: 'Others',
    value: SecurityDepositTypes.OTHERS,
  },
  {
    label: 'Director personal guarantee',
    value: SecurityDepositTypes.DIRECTOR_PERSONAL_GUARANTEE,
  },
  {
    label: 'Unsecured',
    value: SecurityDepositTypes.UNSECURED,
  },
];

export const bankAccountTypes = [
  {
    label: '3-in-1 account',
    value: BankAccountTypes.THREE_IN_ONE_ACCOUNT,
  },
  {
    label: 'Current account',
    value: BankAccountTypes.CURRENT_ACCOUNT,
  },
  {
    label: 'Fixed account',
    value: BankAccountTypes.FIXED_ACCOUNT,
  },
  {
    label: 'Savings account',
    value: BankAccountTypes.SAVINGS_ACCOUNT,
  },
];

const titleCaseAfterDash = (str: string) => {
  return str.toLowerCase().replace(/(?:^|[\s-/()])\w/g, function (match) {
    return match.toUpperCase();
  });
};

export const bankAccountNames = Object.keys(BankNames).map((key) => {
  return {
    label: titleCaseAfterDash(
      titleCase(BankNames[key], {
        hasUnderscore: true,
      }),
    ),
    value: BankNames[key],
  };
});
