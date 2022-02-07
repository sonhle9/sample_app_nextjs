import {
  Button,
  DropdownSelect,
  FieldContainer,
  FileItem,
  FileSelector,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  SearchableDropdown,
  TextField,
  titleCase,
  Toggle,
} from '@setel/portal-ui';
import {useFormik} from 'formik';
import * as React from 'react';
import {
  CustomFieldRulesRenderer,
  ICustomFieldRule,
  useCustomFieldRules,
  useCustomFieldRulesState,
} from 'src/react/modules/custom-field-rules';
import {
  MerchantTypeCodes,
  SettlementScheduleDelayDayType,
  SettlementScheduleInterval,
} from 'src/shared/enums/merchant.enum';
import * as Yup from 'yup';
import {CURRENT_ENTERPRISE} from '../../../../shared/const/enterprise.const';
import {EnterpriseNameEnum} from '../../../../shared/enums/enterprise.enum';
import {QueryErrorAlert} from '../../../components/query-error-alert';
import {IMerchantType} from '../../merchant-types/merchant-types.type';
import {
  businessRegistrationNumberTypeOpts,
  BusinessRegistrationType,
  categoryCodeOptions,
  countryOptions,
  timezoneOptions,
} from '../merchant.const';
import {useCreateMerchant, useListMerchantTypes} from '../merchants.queries';

export interface MerchantCreateModalProps {
  onDismiss: () => void;
  onDone: () => void;
  defaultType?: IMerchantType;
  userEmail?: string;
}

export const MerchantCreateModal = (props: MerchantCreateModalProps) => {
  const {data: merchantTypes} = useListMerchantTypes();
  const {
    mutate: createMerchant,
    isLoading: isCreating,
    error: createMerchantError,
  } = useCreateMerchant(props.defaultType?.code || '');
  const merchantTypesOptions = React.useMemo(
    () =>
      merchantTypes &&
      merchantTypes.map((type) => ({
        label: type.name,
        value: type.id,
      })),
    [merchantTypes],
  );

  const initStatusOptions = [{label: 'Active', value: 'active'}];
  const [statusOptions, setStatusOptions] =
    React.useState<
      {
        label: string;
        value: string;
      }[]
    >(initStatusOptions);

  const {values, touched, errors, setFieldValue, handleBlur, handleSubmit, submitCount} =
    useFormik<MerchantValues>({
      initialValues: {...initialValues, typeId: props.defaultType?.id || ''},
      validationSchema,
      onSubmit: (merchantValues) => {
        if (!merchantValues.typeId || customFieldState.isValid) {
          const selectedMerchantTypes =
            merchantValues.typeId &&
            merchantTypes.find((type) => type.id === merchantValues.typeId);
          createMerchant(
            {
              ...merchantValues,
              createdOrUpdatedBy: props.userEmail,
              typeId: selectedMerchantTypes ? selectedMerchantTypes.id : undefined,
              merchantId: merchantValues.merchantId || undefined,
              status: merchantValues.status || undefined,
              settlementsSchedule: {
                delayDays: 0,
                delayDayType: SettlementScheduleDelayDayType.business,
                interval: SettlementScheduleInterval.daily,
              },
              logo: merchantLogo || undefined,
              productOfferings: selectedMerchantTypes ? selectedMerchantTypes.products : undefined,
              userIds: [],
              customFields:
                merchantValues.typeId && customFields.length > 0
                  ? customFields.map((field) => ({
                      ...field,
                      value: customFieldState.values[field.id],
                    }))
                  : undefined,
              ...(isDisableSetting && {
                paymentsEnabled: false,
                settlementsEnabled: false,
                payoutEnabled: false,
              }),
              merchantCategoryCode: merchantValues.merchantCategoryCode || undefined,
              businessRegistrationType: merchantValues.businessRegistrationType || undefined,
              businessRegistrationNo: merchantValues.businessRegistrationNo || undefined,
            },
            {
              onSuccess: props.onDone,
            },
          );
        }
      },
    });

  const [customFields, setCustomFields] = React.useState<Array<ICustomFieldRule>>([]);
  const customFieldState = useCustomFieldRulesState(customFields);
  useCustomFieldRules(
    {
      page: 1,
      perPage: 1000,
      entityName: 'merchant',
      isEnabled: true,
      entityCategorisationId: values.typeId,
    },
    {
      keepPreviousData: false,
      enabled: !!values.typeId,
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        setCustomFields(res.items);
        customFieldState.reinitialize(res.items);
      },
    },
  );

  const hasSubmitted = submitCount > 0;

  const title = 'Create merchant';

  const isPDB = CURRENT_ENTERPRISE.name === EnterpriseNameEnum.PDB;
  const [merchantLogo, setMerchantLogo] = React.useState<File | undefined>(undefined);
  const [fileError, setFileError] = React.useState('');
  const removeSelectedLogo = () => {
    setMerchantLogo(undefined);
  };

  React.useEffect(() => {
    if (!values.typeId) {
      setStatusOptions(initStatusOptions);
      setFieldValue('status', 'active');
      return;
    }
    const selectedType = merchantTypes?.find((type) => type.id === values.typeId);
    const statusOptions = selectedType?.statusValues?.map((status) => {
      return {
        label: titleCase(status),
        value: status,
      };
    });
    setStatusOptions(statusOptions && statusOptions.length > 0 ? statusOptions : initStatusOptions);
    setFieldValue('status', selectedType?.statusDefaultValue || 'active');
  }, [values.typeId, merchantTypes]);

  React.useEffect(() => {
    setFieldValue('showMerchantIdField', isPDB);
  }, [isPDB]);

  // disable & auto-gen merchantId for giftCardClient merchants
  const [disableMerchantId, setDisableMerchantId] = React.useState<boolean>(false);
  const [isDisableSetting, setIsDisableSetting] = React.useState<boolean>(false);
  const disableSettingFunc = (merchantType: IMerchantType) => {
    if (
      [MerchantTypeCodes.GIFT_CARD_CLIENT, MerchantTypeCodes.SMART_PAY_ACCOUNT].includes(
        merchantType?.code as MerchantTypeCodes,
      )
    ) {
      setIsDisableSetting(true);
    } else {
      setIsDisableSetting(false);
    }
  };

  React.useEffect(() => {
    if (isPDB && props.defaultType?.code === MerchantTypeCodes.GIFT_CARD_CLIENT) {
      setDisableMerchantId(true);
    }
    disableSettingFunc(props.defaultType);
  }, []);

  const onTypeChange = (value) => {
    const selectedType = merchantTypes.find((type) => type.id === value);
    if (isPDB) {
      if (selectedType?.code === MerchantTypeCodes.GIFT_CARD_CLIENT) {
        setFieldValue('merchantId', '');
        setDisableMerchantId(true);
      } else {
        setDisableMerchantId(false);
      }
    }

    disableSettingFunc(selectedType);

    setFieldValue('typeId', value);
  };

  const isStationDealerType = () => {
    if (merchantTypes && values.typeId) {
      const selectedType = merchantTypes.find((type) => type.id === values.typeId);
      return selectedType?.code === MerchantTypeCodes.STATION_DEALER;
    }
    return false;
  };
  // disable & auto-gen merchantId for giftCardClient merchants

  return (
    <Modal isOpen onDismiss={props.onDismiss} aria-label={title}>
      <ModalHeader>{title}</ModalHeader>
      <form onSubmit={handleSubmit}>
        <ModalBody>
          {createMerchantError && (
            <QueryErrorAlert className={'mb-2'} error={createMerchantError as any} />
          )}
          <FieldContainer
            label="Merchant logo"
            labelAlign={'start'}
            layout="horizontal-responsive"
            status={fileError ? 'error' : undefined}
            helpText={fileError}>
            {merchantLogo ? (
              <div className="space-y-2 py-2">
                <FileItem file={merchantLogo} onRemove={removeSelectedLogo} />
              </div>
            ) : (
              <FileSelector
                className={'pt-3'}
                onFilesSelected={(files) => {
                  const file = files[0];
                  setFileError('');
                  if (file) {
                    if (file.size > 1024 * 1024) {
                      setFileError('File size exceeds 1MB. Please select another file.');
                    } else {
                      setMerchantLogo(file);
                    }
                  }
                }}
                description="Supported format: png or svg"
                accept=".png,.svg"
              />
            )}
          </FieldContainer>
          {isPDB && (
            <TextField
              label="Merchant ID"
              name="merchantId"
              className={'w-80'}
              placeholder={'Enter merchant ID'}
              value={values.merchantId}
              onChangeValue={(v) => setFieldValue('merchantId', v)}
              onBlur={handleBlur}
              helpText={hasSubmitted || touched.merchantId ? errors.merchantId : null}
              status={
                (hasSubmitted || touched.merchantId) && errors.merchantId ? 'error' : undefined
              }
              disabled={isCreating || disableMerchantId}
              layout="horizontal-responsive"
            />
          )}
          <TextField
            label="Name"
            name="name"
            placeholder={'Enter merchant name'}
            className={'w-80'}
            value={values.name}
            onChangeValue={(v) => setFieldValue('name', v)}
            onBlur={handleBlur}
            helpText={hasSubmitted || touched.name ? errors.name : null}
            status={(hasSubmitted || touched.name) && errors.name ? 'error' : undefined}
            disabled={isCreating}
            layout="horizontal-responsive"
          />
          <TextField
            label="Legal name"
            name="legalName"
            className={'w-80'}
            placeholder={'Enter business legal name'}
            value={values.legalName}
            onChangeValue={(v) => setFieldValue('legalName', v)}
            onBlur={handleBlur}
            helpText={hasSubmitted || touched.legalName ? errors.legalName : null}
            status={(hasSubmitted || touched.legalName) && errors.legalName ? 'error' : undefined}
            disabled={isCreating}
            layout="horizontal-responsive"
          />
          <FieldContainer
            label={props.defaultType ? 'Type' : 'Type (optional)'}
            layout="horizontal-responsive">
            <SearchableDropdown
              wrapperClass={'w-80'}
              value={values.typeId}
              onChangeValue={(v) => onTypeChange(v)}
              name="typeId"
              placeholder={'Select type (optional)'}
              onBlur={handleBlur}
              options={merchantTypesOptions}
              disabled={isCreating || !!props.defaultType}
            />
          </FieldContainer>

          <FieldContainer
            helpText={hasSubmitted || touched.status ? errors.status : null}
            status={(hasSubmitted || touched.status) && errors.status ? 'error' : undefined}
            layout="horizontal-responsive"
            label={'Status'}>
            <DropdownSelect
              value={values.status}
              className={'w-80'}
              onChangeValue={(v) => setFieldValue('status', v)}
              name="status"
              placeholder={'Select status'}
              onBlur={handleBlur}
              options={statusOptions}
              disabled={isCreating}
            />
          </FieldContainer>
          {values.typeId && customFieldState.rules && customFieldState.rules.length > 0 && (
            <CustomFieldRulesRenderer
              fieldClassName={'w-80'}
              customFields={customFieldState}
              showError={hasSubmitted}
              disabled={isCreating}
            />
          )}
          <FieldContainer
            label="Merchant category code"
            helpText={
              hasSubmitted || touched.merchantCategoryCode ? errors.merchantCategoryCode : null
            }
            status={
              (hasSubmitted || touched.merchantCategoryCode) && errors.merchantCategoryCode
                ? 'error'
                : undefined
            }
            layout="horizontal-responsive">
            <SearchableDropdown
              placeholder={'Select merchant category code'}
              value={values.merchantCategoryCode}
              wrapperClass={'w-80'}
              onChangeValue={(v) => setFieldValue('merchantCategoryCode', v)}
              name="merchantCategoryCode"
              onBlur={handleBlur}
              options={categoryCodeOptions}
              disabled={isCreating}
            />
          </FieldContainer>
          <FieldContainer
            helpText={
              hasSubmitted || touched.businessRegistrationType
                ? errors.businessRegistrationType
                : null
            }
            status={
              (hasSubmitted || touched.businessRegistrationType) && errors.businessRegistrationType
                ? 'error'
                : undefined
            }
            layout="horizontal-responsive"
            label={'Business registration number format'}>
            <DropdownSelect
              value={values.businessRegistrationType}
              className={'w-80'}
              onChangeValue={(v) => {
                setFieldValue('businessRegistrationNo', '');
                setFieldValue('businessRegistrationType', v);
              }}
              name="businessRegistrationType"
              placeholder={'Please select'}
              onBlur={handleBlur}
              options={businessRegistrationNumberTypeOpts}
              disabled={isCreating}
            />
          </FieldContainer>
          {values.businessRegistrationType && (
            <TextField
              label="Business registration number"
              name="businessRegistrationNo"
              placeholder={
                values.businessRegistrationType === BusinessRegistrationType.OLD
                  ? 'Enter business registration number'
                  : 'e.g.: 123456789101'
              }
              className={'w-80'}
              value={values.businessRegistrationNo}
              onChangeValue={(v) => setFieldValue('businessRegistrationNo', v)}
              onBlur={handleBlur}
              helpText={
                hasSubmitted || touched.businessRegistrationNo
                  ? errors.businessRegistrationNo
                  : null
              }
              status={
                (hasSubmitted || touched.businessRegistrationNo) && errors.businessRegistrationNo
                  ? 'error'
                  : undefined
              }
              disabled={isCreating}
              layout="horizontal-responsive"
            />
          )}
          {(!props.defaultType || isStationDealerType()) && (
            <TextField
              label="Site name ID"
              name="siteNameId"
              className={'w-80'}
              placeholder={'Enter site name ID'}
              value={values.siteNameId}
              onChangeValue={(v) => setFieldValue('siteNameId', v)}
              onBlur={handleBlur}
              disabled={isCreating || !isStationDealerType()}
              layout="horizontal-responsive"
            />
          )}
          <FieldContainer
            label="Country"
            helpText={hasSubmitted || touched.countryCode ? errors.countryCode : null}
            status={
              (hasSubmitted || touched.countryCode) && errors.countryCode ? 'error' : undefined
            }
            layout="horizontal-responsive">
            <SearchableDropdown
              placeholder={'Select country'}
              wrapperClass={'w-80'}
              value={values.countryCode}
              onChangeValue={(v) => setFieldValue('countryCode', v)}
              name="countryCode"
              onBlur={handleBlur}
              options={countryOptions}
              disabled={isCreating}
            />
          </FieldContainer>
          <FieldContainer
            label="Timezone"
            layout="horizontal-responsive"
            helpText={hasSubmitted || touched.timezone ? errors.timezone : null}
            status={(hasSubmitted || touched.timezone) && errors.timezone ? 'error' : undefined}>
            <SearchableDropdown
              wrapperClass={'w-80'}
              value={values.timezone}
              onChangeValue={(v) => setFieldValue('timezone', v)}
              name="timezone"
              placeholder={'Select timezone'}
              onBlur={handleBlur}
              options={timezoneOptions}
              disabled={isCreating}
            />
          </FieldContainer>
          {!isDisableSetting && (
            <>
              <FieldContainer label="Payments enabled" layout="horizontal-responsive">
                <Toggle
                  on={values.paymentsEnabled}
                  onChangeValue={(c) => setFieldValue('paymentsEnabled', c)}
                  disabled={isCreating}
                />
              </FieldContainer>
              <FieldContainer label="Settlement enabled" layout="horizontal-responsive">
                <Toggle
                  on={values.settlementsEnabled}
                  onChangeValue={(c) => setFieldValue('settlementsEnabled', c)}
                  disabled={isCreating}
                />
              </FieldContainer>
              <FieldContainer
                className={'mb-0'}
                label="Payout enabled"
                layout="horizontal-responsive">
                <Toggle
                  on={values.payoutEnabled}
                  onChangeValue={(c) => setFieldValue('payoutEnabled', c)}
                  disabled={isCreating}
                />
              </FieldContainer>
            </>
          )}
        </ModalBody>
        <ModalFooter className="text-right space-x-3">
          <Button variant="outline" onClick={props.onDismiss} disabled={isCreating}>
            CANCEL
          </Button>
          <Button variant="primary" type="submit" isLoading={isCreating}>
            SAVE
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

interface MerchantValues {
  name: string;
  merchantId: string;
  status: string;
  legalName: string;
  typeId: string;
  siteNameId: string;
  merchantCategoryCode: string;
  businessRegistrationType: string;
  businessRegistrationNo: string;
  countryCode: string;
  timezone: string;
  paymentsEnabled: boolean;
  settlementsEnabled: boolean;
  payoutEnabled: boolean;
  showMerchantIdField: boolean;
}

const initialValues: MerchantValues = {
  name: '',
  legalName: '',
  typeId: '',
  siteNameId: '',
  merchantId: '',
  showMerchantIdField: false,
  status: 'active',
  merchantCategoryCode: '',
  businessRegistrationType: '',
  businessRegistrationNo: '',
  countryCode: 'MY',
  timezone: 'Asia/Kuala_Lumpur',
  paymentsEnabled: true,
  payoutEnabled: true,
  settlementsEnabled: false,
};

const validationSchema = Yup.object().shape(
  {
    name: Yup.string()
      .required('This field is required.')
      .max(100, 'Max length should be 100 characters.'),
    legalName: Yup.string().required('This field is required.'),
    typeId: Yup.string(),
    status: Yup.string().required('This field is required.'),
    merchantId: Yup.string().when('merchantId', {
      is: (merchantId) => !!merchantId,
      then: Yup.string().max(100, 'Max length should be 100 characters.'),
    }),
    merchantCategoryCode: Yup.string(),
    businessRegistrationType: Yup.string(),
    businessRegistrationNo: Yup.string()
      .when('businessRegistrationType', {
        is: BusinessRegistrationType.OLD,
        then: Yup.string().required('This field is required.'),
      })
      .when('businessRegistrationType', {
        is: BusinessRegistrationType.NEW,
        then: Yup.string()
          .required('Please use the correct format e.g.: 123456789101')
          .matches(/^\d{12}$/, 'Please use the correct format e.g.: 123456789101'),
      }),
    countryCode: Yup.string().required('This field is required.'),
    timezone: Yup.string().required('This field is required.'),
    siteNameId: Yup.string(),
  },
  [
    ['merchantId', 'merchantId'],
    ['businessRegistrationType', 'businessRegistrationNo'],
  ],
);
