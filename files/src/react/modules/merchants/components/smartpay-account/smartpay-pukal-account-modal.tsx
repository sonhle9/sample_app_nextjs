import {
  Button,
  Modal,
  FieldContainer,
  DropdownSelect,
  TextInput,
  DaySelector,
  SearchableDropdown,
  Radio,
  DropdownMultiSelect,
  Text,
  classes,
} from '@setel/portal-ui';
import {useNotification} from 'src/react/hooks/use-notification';
import * as React from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {
  AG_OBJECT_CODE,
  PUKAL_AG_CODE,
  PUKAL_ST_CODE,
  PUKAL_TYPE,
} from 'src/react/modules/pukal-payment/billing-pukal-payment.constants';
import {
  useClearPukalAccount,
  useCreatePukalAccount,
  useUpdatePukalAccount,
} from 'src/react/modules/pukal-payment/billing-pukal-account.queries';
import {IPukalAccount} from 'src/react/modules/pukal-payment/billing-pukal-payment.types';

interface BillingPukalPaymentProps {
  showEditModal: boolean;
  setShowEditModal: Function;
  pukalDetail: IPukalAccount;
  merchantId: string;
  merchantName: string;
}

export const SmartpayPukalAccountModal = ({
  showEditModal,
  setShowEditModal,
  pukalDetail,
  merchantId,
  merchantName,
}: BillingPukalPaymentProps) => {
  const {mutate: pukalAccountCreate} = useCreatePukalAccount();
  const {mutate: pukalAccountUpdate} = useUpdatePukalAccount();
  const {mutate: pukalAccountClear} = useClearPukalAccount();
  const setNotify = useNotification();
  const [cancelVisibleModal, setVisibleCancelModal] = React.useState(false);
  const alphanumericRegex = new RegExp(/^[A-Za-z0-9-]{0,10}$/);
  const validationSchema = Yup.object({
    pukalType: Yup.string().required('This field is required'),
    agCode: Yup.string().when('pukalType', {
      is: (exist) => exist,
      then: Yup.string().required('This field is required'),
    }),
    activationDate: Yup.date().nullable().required('This field is required'),
    terminationFlag: Yup.boolean().nullable().required('This field is required'),
    checkDigitIndicator: Yup.string().nullable().required('This field is required'),
    warrantDepartment: Yup.string().nullable().required('This field is required'),
    warrantPTJ: Yup.string().nullable().required('This field is required'),
    voteCode: Yup.string().nullable().required('This field is required'),
    chargeDepartment: Yup.string().nullable().required('This field is required'),
    chargePTJ: Yup.string().nullable().required('This field is required'),
    prgActAmanah: Yup.string().nullable().required('This field is required'),
    agObjectCode: Yup.array().nullable().required('This field is required'),
    isAgObjectCode: Yup.boolean().nullable().typeError('Please select one option in the dropdown'),
  });

  const {values, errors, touched, setFieldValue, handleSubmit, setErrors, setTouched} = useFormik({
    initialValues: {
      pukalType: PUKAL_TYPE[pukalDetail?.pukalType] || undefined,
      agCode: pukalDetail?.agCode?.replace(/(^\d+)(.+$)/i, '$1') || undefined,
      projectSetia: pukalDetail?.projectSetia || '',
      activationDate: pukalDetail?.activationDate
        ? new Date(pukalDetail?.activationDate)
        : undefined,
      terminationFlag:
        pukalDetail?.terminationFlag != undefined ? pukalDetail?.terminationFlag : false,
      checkDigitIndicator:
        pukalDetail?.checkDigitIndicator != undefined ? pukalDetail?.checkDigitIndicator : true,
      warrantDepartment: pukalDetail?.warrantDepartment,
      warrantPTJ: pukalDetail?.warrantPTJ,
      voteCode: pukalDetail?.voteCode,
      chargeDepartment: pukalDetail?.chargeDepartment,
      chargePTJ: pukalDetail?.chargePTJ,
      prgActAmanah: pukalDetail?.prgActAmanah,
      sortKey: pukalDetail?.sortKey,
      isAgObjectCode: true,
      agObjectCode: pukalDetail?.agObjectCode?.split(',') || undefined,
    },
    enableReinitialize: pukalDetail != undefined,
    validationSchema,
    onSubmit: (value) => {
      let result: any = {
        merchantId: merchantId,
        merchantName: merchantName,
        agCode: value.agCode,
        pukalType: Object.keys(PUKAL_TYPE).find((key) => PUKAL_TYPE[key] === value.pukalType),
        projectSetia: value.projectSetia,
        activationDate: value.activationDate,
        terminationFlag: value.terminationFlag,
        checkDigitIndicator: value.checkDigitIndicator,
        warrantDepartment: value.warrantDepartment,
        warrantPTJ: value.warrantPTJ,
        voteCode: value.voteCode,
        chargeDepartment: value.chargeDepartment,
        chargePTJ: value.chargePTJ,
        prgActAmanah: value.prgActAmanah,
        sortKey: value.sortKey,
        agObjectCode: value.agObjectCode?.join(','),
      };
      if (pukalDetail?.createdAt) {
        onUpdateSubmit(result);
      } else {
        onCreateSubmit(result);
      }
    },
  });

  const onCreateSubmit = (data) => {
    pukalAccountCreate(data, {
      onSuccess() {
        setShowEditModal(false);
        setNotify({
          title: 'Successful!',
          variant: 'success',
          description: 'You have successfully updated the Pukal account details.',
        });
      },
      onError() {
        setShowEditModal(false);
        setNotify({
          title: 'Error!',
          variant: 'error',
          description: 'You have failed updated the Pukal account details.',
        });
      },
    });
  };

  const onUpdateSubmit = (data) => {
    pukalAccountUpdate(data, {
      onSuccess() {
        setShowEditModal(false);
        setNotify({
          title: 'Successful!',
          variant: 'success',
          description: 'You have successfully updated the Pukal account details.',
        });
      },
      onError() {
        setShowEditModal(false);
        setNotify({
          title: 'Error!',
          variant: 'error',
          description: 'You have failed updated the Pukal account details.',
        });
      },
    });
  };

  const clearSubmit = () => {
    onDismiss();
    pukalAccountClear(merchantId, {
      onSuccess() {
        setShowEditModal(false);
        setNotify({
          title: 'Successful!',
          variant: 'success',
          description: 'You have successfully cleared the Pukal account.',
        });
      },
      onError() {
        setShowEditModal(false);
        setNotify({
          title: 'Error!',
          variant: 'error',
          description: 'You have failed cleared the Pukal account details.',
        });
      },
    });
  };

  const onDismiss = () => {
    setShowEditModal(false);
    setFieldValue('pukalType', PUKAL_TYPE[pukalDetail?.pukalType] || undefined);
    setFieldValue('agCode', pukalDetail?.agCode?.replace(/(^\d+)(.+$)/i, '$1') || undefined);
    setFieldValue('projectSetia', pukalDetail?.projectSetia || '');
    setFieldValue(
      'activationDate',
      pukalDetail?.activationDate ? new Date(pukalDetail?.activationDate) : undefined,
    );
    setFieldValue(
      'terminationFlag',
      pukalDetail?.terminationFlag != undefined ? pukalDetail?.terminationFlag : false,
    );
    setFieldValue(
      'checkDigitIndicator',
      pukalDetail?.checkDigitIndicator != undefined ? pukalDetail?.checkDigitIndicator : true,
    );
    setFieldValue('warrantDepartment', pukalDetail?.warrantDepartment);
    setFieldValue('warrantPTJ', pukalDetail?.warrantPTJ);
    setFieldValue('voteCode', pukalDetail?.voteCode);
    setFieldValue('chargeDepartment', pukalDetail?.chargeDepartment);
    setFieldValue('chargePTJ', pukalDetail?.chargePTJ);
    setFieldValue('prgActAmanah', pukalDetail?.prgActAmanah);
    setFieldValue('sortKey', pukalDetail?.sortKey);
    setFieldValue('agObjectCode', pukalDetail?.agObjectCode?.split(',') || undefined);
    setErrors({});
    setTouched({});
  };
  return (
    <>
      <Modal isOpen={showEditModal} onDismiss={() => onDismiss()} header="Edit details">
        <Modal.Body>
          <FieldContainer
            status={errors.pukalType && touched.pukalType ? 'error' : undefined}
            helpText={errors.pukalType && touched.pukalType ? errors.pukalType : undefined}
            label={
              <>
                <span>Pukal type</span>
                <br />
                <span>(Required)</span>
              </>
            }
            layout="horizontal-responsive">
            <DropdownSelect
              value={values?.pukalType || PUKAL_TYPE[pukalDetail?.pukalType]}
              options={Object.values(PUKAL_TYPE)}
              placeholder="Please select"
              className={'w-60'}
              onChangeValue={(value) => {
                setFieldValue('pukalType', value);
                setFieldValue('agCode', '');
              }}
            />
          </FieldContainer>
          <FieldContainer
            status={errors.agCode && touched.agCode ? 'error' : undefined}
            helpText={errors.agCode && touched.agCode ? errors.agCode : undefined}
            label={
              <>
                <span>Pukal code</span>
                <br />
                <span>(Required)</span>
              </>
            }
            layout="horizontal-responsive">
            <SearchableDropdown
              value={
                values?.agCode != undefined
                  ? values?.agCode
                  : pukalDetail?.agCode
                  ? pukalDetail?.agCode?.replace(/(^\d+)(.+$)/i, '$1')
                  : ''
              }
              options={
                Object.keys(PUKAL_TYPE).find((key) => PUKAL_TYPE[key] === values?.pukalType) ==
                  'AG' ||
                (Object.keys(PUKAL_TYPE).find(
                  (key) => PUKAL_TYPE[key] === pukalDetail?.pukalType,
                ) == 'AG' &&
                  values?.pukalType === undefined)
                  ? PUKAL_AG_CODE
                  : PUKAL_ST_CODE
              }
              disabled={values?.pukalType == undefined && !pukalDetail?.pukalType}
              placeholder="Search Pukal code"
              className={'w-96'}
              onChangeValue={(value) => {
                setFieldValue('agCode', value);
              }}
            />
          </FieldContainer>
          <FieldContainer
            status={errors.projectSetia && touched.projectSetia ? 'error' : undefined}
            helpText={errors.projectSetia && touched.projectSetia ? errors.projectSetia : undefined}
            label="Project/Setia "
            layout="horizontal-responsive">
            <TextInput
              value={values?.projectSetia}
              placeholder="Enter Project/Setia"
              className={'w-60'}
              onChangeValue={(value) => {
                if (alphanumericRegex.test(value) === true) {
                  setFieldValue('projectSetia', value);
                }
              }}
            />
          </FieldContainer>
          <FieldContainer
            status={errors.activationDate && touched.activationDate ? 'error' : undefined}
            helpText={
              errors.activationDate && touched.activationDate ? errors.activationDate : undefined
            }
            label="Activation date"
            layout="horizontal-responsive">
            <DaySelector
              className="w-48"
              placeholder="Select date"
              value={
                values?.activationDate
                  ? values?.activationDate
                  : pukalDetail?.activationDate
                  ? new Date(pukalDetail?.activationDate)
                  : undefined
              }
              onChangeValue={(value) => {
                setFieldValue('activationDate', value);
              }}
            />
          </FieldContainer>
          <FieldContainer
            status={errors.terminationFlag && touched.terminationFlag ? 'error' : undefined}
            helpText={
              errors.terminationFlag && touched.terminationFlag ? errors.terminationFlag : undefined
            }
            labelAlign="start"
            label="Termination flag"
            layout="horizontal-responsive">
            <Radio
              name="terminationFlag"
              value="terminationFlag"
              onChangeValue={() => {
                setFieldValue('terminationFlag', true);
              }}
              checked={
                values?.terminationFlag !== undefined
                  ? values?.terminationFlag
                  : pukalDetail?.terminationFlag !== undefined
                  ? pukalDetail?.terminationFlag
                  : false
              }>
              Yes
            </Radio>
            <Radio
              name="terminationFlag"
              value="terminationFlag"
              onChangeValue={() => {
                setFieldValue('terminationFlag', false);
              }}
              checked={
                values?.terminationFlag !== undefined
                  ? !values?.terminationFlag
                  : pukalDetail?.terminationFlag !== undefined
                  ? !pukalDetail?.terminationFlag
                  : true
              }>
              No
            </Radio>
          </FieldContainer>
          <FieldContainer
            status={errors.checkDigitIndicator && touched.checkDigitIndicator ? 'error' : undefined}
            helpText={
              errors.checkDigitIndicator && touched.checkDigitIndicator
                ? errors.checkDigitIndicator
                : undefined
            }
            label="Check digit indicator"
            labelAlign="start"
            layout="horizontal-responsive">
            <Radio
              name="checkDigitIndicator"
              value="checkDigitIndicator"
              onChangeValue={() => {
                setFieldValue('checkDigitIndicator', true);
              }}
              checked={
                values?.checkDigitIndicator !== undefined
                  ? values?.checkDigitIndicator
                  : pukalDetail?.checkDigitIndicator !== undefined
                  ? pukalDetail?.checkDigitIndicator
                  : true
              }>
              Yes
            </Radio>
            <Radio
              name="checkDigitIndicator"
              value="checkDigitIndicator"
              onChangeValue={() => {
                setFieldValue('checkDigitIndicator', false);
              }}
              checked={
                values?.checkDigitIndicator !== undefined
                  ? !values?.checkDigitIndicator
                  : pukalDetail?.checkDigitIndicator !== undefined
                  ? !pukalDetail?.checkDigitIndicator
                  : false
              }>
              No
            </Radio>
          </FieldContainer>
          <FieldContainer
            status={errors.warrantDepartment && touched.warrantDepartment ? 'error' : undefined}
            helpText={
              errors.warrantDepartment && touched.warrantDepartment
                ? errors.warrantDepartment
                : undefined
            }
            label="Warrant department"
            layout="horizontal-responsive">
            <TextInput
              value={values?.warrantDepartment}
              className={'w-60'}
              placeholder="Enter warrant department"
              onChangeValue={(value) => {
                if (alphanumericRegex.test(value)) {
                  setFieldValue('warrantDepartment', value);
                }
              }}
              maxLength={40}
            />
          </FieldContainer>
          <FieldContainer
            status={errors.warrantPTJ && touched.warrantPTJ ? 'error' : undefined}
            helpText={errors.warrantPTJ && touched.warrantPTJ ? errors.warrantPTJ : undefined}
            label="Warrant PTJ"
            layout="horizontal-responsive">
            <TextInput
              value={values?.warrantPTJ}
              className={'w-60'}
              placeholder="Enter warrant PTJ"
              onChangeValue={(value) => {
                if (alphanumericRegex.test(value)) {
                  setFieldValue('warrantPTJ', value);
                }
              }}
              maxLength={40}
            />
          </FieldContainer>
          <FieldContainer
            status={errors.voteCode && touched.voteCode ? 'error' : undefined}
            helpText={errors.voteCode && touched.voteCode ? errors.voteCode : undefined}
            label="Vote code"
            layout="horizontal-responsive">
            <TextInput
              value={values?.voteCode}
              className={'w-60'}
              placeholder="Enter vote code"
              onChangeValue={(value) => {
                if (alphanumericRegex.test(value)) {
                  setFieldValue('voteCode', value);
                }
              }}
              maxLength={40}
            />
          </FieldContainer>
          <FieldContainer
            status={errors.chargeDepartment && touched.chargeDepartment ? 'error' : undefined}
            helpText={
              errors.chargeDepartment && touched.chargeDepartment
                ? errors.chargeDepartment
                : undefined
            }
            label="Charge department"
            layout="horizontal-responsive">
            <TextInput
              placeholder="Enter charge department"
              value={values?.chargeDepartment}
              className={'w-60'}
              onChangeValue={(value) => {
                if (alphanumericRegex.test(value)) {
                  setFieldValue('chargeDepartment', value);
                }
              }}
              maxLength={40}
            />
          </FieldContainer>
          <FieldContainer
            status={errors.chargePTJ && touched.chargePTJ ? 'error' : undefined}
            helpText={errors.chargePTJ && touched.chargePTJ ? errors.chargePTJ : undefined}
            label="Charge PTJ"
            layout="horizontal-responsive">
            <TextInput
              placeholder="Enter charge PTJ"
              value={values?.chargePTJ}
              className={'w-60'}
              onChangeValue={(value) => {
                if (alphanumericRegex.test(value)) {
                  setFieldValue('chargePTJ', value);
                }
              }}
              maxLength={40}
            />
          </FieldContainer>
          <FieldContainer
            status={errors.prgActAmanah && touched.prgActAmanah ? 'error' : undefined}
            helpText={errors.prgActAmanah && touched.prgActAmanah ? errors.prgActAmanah : undefined}
            label="Prg/Act/Amanah"
            layout="horizontal-responsive">
            <TextInput
              placeholder="Enter Prg/Act/Amanah"
              value={values?.prgActAmanah}
              className={'w-60'}
              onChangeValue={(value) => {
                if (alphanumericRegex.test(value)) {
                  setFieldValue('prgActAmanah', value);
                }
              }}
              maxLength={40}
            />
          </FieldContainer>
          <FieldContainer
            status={errors.sortKey && touched.sortKey ? 'error' : undefined}
            helpText={errors.sortKey && touched.sortKey ? errors.sortKey : undefined}
            label="Sort key"
            layout="horizontal-responsive">
            <TextInput
              placeholder="Enter sort key"
              value={values?.sortKey}
              className={'w-60'}
              onChangeValue={(value) => {
                if (alphanumericRegex.test(value)) {
                  setFieldValue('sortKey', value);
                }
              }}
              maxLength={40}
            />
          </FieldContainer>
          <FieldContainer
            status={
              errors.isAgObjectCode && touched.isAgObjectCode
                ? 'error'
                : errors.agObjectCode && touched.agObjectCode
                ? 'error'
                : undefined
            }
            helpText={
              errors.isAgObjectCode && touched.isAgObjectCode
                ? errors.isAgObjectCode
                : errors.agObjectCode && touched.agObjectCode
                ? errors.agObjectCode
                : undefined
            }
            label="AG object code"
            layout="horizontal-responsive">
            <DropdownMultiSelect
              values={
                values?.agObjectCode
                  ? values?.agObjectCode
                  : pukalDetail?.agObjectCode
                  ? pukalDetail?.agObjectCode?.split(',')
                  : []
              }
              onChangeValues={(value) => {
                if (value && Array.isArray(value)) {
                  setFieldValue('agObjectCode', value);
                } else {
                  setFieldValue('agObjectCode', null);
                }
                if (
                  value.find((v) => AG_OBJECT_CODE.includes(v)) ||
                  value == [] ||
                  !value ||
                  value.length == 0
                ) {
                  setFieldValue('isAgObjectCode', true);
                } else {
                  setFieldValue('isAgObjectCode', 'fals1e');
                }
              }}
              onInputValueChange={(value) => {
                if (AG_OBJECT_CODE.includes(value) || !value) {
                  setFieldValue('isAgObjectCode', true);
                } else {
                  setFieldValue('isAgObjectCode', 'fal1se');
                }
              }}
              options={AG_OBJECT_CODE.map((agObjectCode) => {
                return {
                  label: agObjectCode,
                  value: agObjectCode,
                };
              })}
              allowSelectAll
              className="w-96"
            />
          </FieldContainer>
        </Modal.Body>
        <Modal.Footer>
          <div className=" inline-flex">
            <Button
              onClick={() => setVisibleCancelModal(true)}
              variant="error-outline"
              disabled={!pukalDetail}
              className=" uppercase border-0 shadow-none -ml-4">
              Clear Pukal account
            </Button>
          </div>
          <div className="text-right space-x-3 inline-flex float-right">
            <Button onClick={() => onDismiss()} variant="outline">
              CANCEL
            </Button>
            <Button onClick={() => handleSubmit()} variant="primary">
              SAVE CHANGES
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal
        isOpen={cancelVisibleModal}
        size="small"
        showCloseBtn={false}
        onDismiss={() => {}}
        aria-label="confirm-cancel"
        data-testid="confirm-remove-merchant-modal">
        <Modal.Body>
          <Text className={classes.h2}>Are you sure you want to clear this Pukal account?</Text>
          <Text className="mt-4">
            This action cannot be undone and you will not be able to recover any data.
          </Text>
        </Modal.Body>
        <Modal.Footer className="text-right">
          <Button
            className="mr-3"
            minWidth="small"
            variant="outline"
            onClick={() => setVisibleCancelModal(false)}>
            CANCEL
          </Button>
          <Button
            variant="error"
            minWidth="small"
            onClick={() => {
              clearSubmit();
              setVisibleCancelModal(false);
            }}>
            CLEAR
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
