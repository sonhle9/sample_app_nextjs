import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DropdownSelectField,
  FieldContainer,
  FileSelector,
  ImageViewer,
  Modal,
  SearchableDropdownField,
  TextField,
  titleCase,
} from '@setel/portal-ui';
import {useFormik} from 'formik';
import * as React from 'react';
import * as Yup from 'yup';
import {CURRENT_ENTERPRISE} from '../../../../shared/const/enterprise.const';
import {EnterpriseNameEnum} from '../../../../shared/enums/enterprise.enum';
import {EnableTransactionValues, MerchantTypeCodes} from '../../../../shared/enums/merchant.enum';
import {QueryErrorAlert} from '../../../components/query-error-alert';
import {CustomFieldRulesRenderer, useCustomFieldRulesState} from '../../custom-field-rules';
import {FIELD_VALUE_TYPE} from '../../custom-field-rules/custom-field-rules.type';
import {useMerchantTypes} from '../../merchant-types/merchant-types.queries';
import {useGetSalesTerritories} from '../../sales-territories/sales-territories.queries';
import {
  businessRegistrationNumberTypeOpts,
  BusinessRegistrationType,
  categoryCodeOptions,
  changeStatusReasonOptions,
  countryOptions,
  MerchantStatus,
  timezoneOptions,
  UpdateMerchantMessage,
} from '../merchant.const';
import {useUpdateMerchantDetails} from '../merchants.queries';
import {Merchant} from '../merchants.type';
import {MERCHANT_TYPES_UPDATED_STORAGE_KEY} from '../../merchant-types/merchant-types.service';

export const UpdateMerchantDetailsForm = (props: {
  merchantId: string;
  onDone: (string?) => void;
  onCancel: () => void;
  userEmail?: string;
  merchant: Merchant;
}) => {
  const {merchant} = props;
  const {mutate: updateMerchant, error, isLoading} = useUpdateMerchantDetails(props.merchantId);
  const {data: merchantTypes} = useMerchantTypes();
  const [logo, setLogo] = React.useState<File | string>(merchant.logoUrl || '');
  const {data: salesTerritories} = useGetSalesTerritories({
    page: 1,
    perPage: 300,
    merchantTypeId: merchant.typeId,
    sortBy: 'name',
  });
  const [fileError, setFileError] = React.useState('');

  const isPDB = CURRENT_ENTERPRISE.name === EnterpriseNameEnum.PDB;

  const validationSchema = Yup.object().shape(
    {
      status: Yup.string().required('This field is required.'),
      reason: Yup.string(),
      remark: Yup.string(),
      name: Yup.string()
        .required('This field is required.')
        .max(100, 'Max length should be 100 characters.'),
      legalName: Yup.string().required('This field is required.'),
      typeId: Yup.string(),
      siteNameId: Yup.string(),
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
      salesTerritoryId: Yup.string(),
      countryCode: Yup.string().required('This field is required.'),
      timezone: Yup.string().required('This field is required.'),
    },
    [['businessRegistrationType', 'businessRegistrationNo']],
  );

  const {values, touched, errors, setFieldValue, handleBlur, handleSubmit, submitCount} =
    useFormik<UpdateMerchantValues>({
      initialValues: {
        typeId: merchant.typeId || '',
        siteNameId: merchant.siteNameId || '',
        merchantCategoryCode: merchant.merchantCategoryCode || '',
        countryCode: merchant.countryCode || '',
        reason: merchant.reason || '',
        status: merchant.status || MerchantStatus.ACTIVE,
        businessRegistrationType: merchant.businessRegistrationType || undefined,
        businessRegistrationNo: merchant.businessRegistrationNo || undefined,
        salesTerritoryId: merchant.saleTerritory?.id || '',
        legalName: merchant.legalName || '',
        name: merchant.name || '',
        remark: merchant.remark || '',
        timezone: merchant.timezone || '',
      },
      validationSchema,
      onSubmit: (payload) => {
        if (!customFieldState.isValid) {
          return;
        }
        const typeId = merchant.typeId ? undefined : payload.typeId || null;
        updateMerchant(
          {
            logo: typeof logo === 'string' ? undefined : logo || null,
            createdOrUpdatedBy: props.userEmail,
            status: payload.status,
            reason: payload.reason || null,
            remark: payload.remark || null,
            name: payload.name,
            legalName: payload.legalName,
            typeId,
            siteNameId: payload.siteNameId || null,
            merchantCategoryCode: payload.merchantCategoryCode || null,
            businessRegistrationNo: !payload.businessRegistrationType
              ? null
              : payload.businessRegistrationNo,
            businessRegistrationType: payload.businessRegistrationType || (null as any),
            salesTerritoryId: payload.salesTerritoryId,
            countryCode: payload.countryCode,
            timezone: payload.timezone,

            customFields:
              customFields.length > 0
                ? customFields.map((field) => ({
                    ...field,
                    value: customFieldState.values[field.id],
                  }))
                : undefined,
          },
          {
            onSuccess: (newMerchant) => {
              values.status === MerchantStatus.DELETED
                ? props.onDone(UpdateMerchantMessage.DELETED)
                : props.onDone(UpdateMerchantMessage.SUCCESS);
              if (newMerchant.status === MerchantStatus.DELETED) {
                localStorage.setItem(MERCHANT_TYPES_UPDATED_STORAGE_KEY, 'Y');
                dispatchEvent(new Event('storage'));
              }
            },
          },
        );
      },
    });

  const merchantTypesOptions = React.useMemo(
    () =>
      merchantTypes &&
      merchantTypes.map((type) => ({
        label: type.name,
        value: type.id,
      })),
    [merchantTypes],
  );

  const salesTerritoriesOptions = React.useMemo(
    () =>
      salesTerritories?.items.length &&
      salesTerritories?.items.map((territory) => ({
        label: territory.name,
        value: territory.id,
      })),
    [salesTerritories],
  );

  const initStatusOptions = [
    {label: 'Active', value: MerchantStatus.ACTIVE},
    {label: 'Deleted', value: MerchantStatus.DELETED},
  ];
  const [statusOptions, setStatusOptions] =
    React.useState<
      {
        label: string;
        value: string;
      }[]
    >(initStatusOptions);
  React.useEffect(() => {
    if (!values.typeId) {
      setStatusOptions(initStatusOptions);
      setFieldValue('status', MerchantStatus.ACTIVE);
      return;
    }

    let selectedType;
    if (values.typeId === merchant.typeId) {
      selectedType = merchant.merchantType;
    } else {
      selectedType = merchantTypes?.find((type) => type.id === values.typeId);
    }

    const statusOptions = selectedType?.statusValues?.map((status) => {
      return {
        label: titleCase(status),
        value: status,
      };
    });
    setStatusOptions(
      statusOptions && statusOptions.length > 0
        ? statusOptions.concat({
            label: 'Deleted',
            value: MerchantStatus.DELETED,
          })
        : initStatusOptions,
    );
    if (values.typeId === merchant.typeId) {
      setFieldValue('status', merchant.status || MerchantStatus.ACTIVE);
    } else {
      setFieldValue('status', selectedType?.statusDefaultValue || MerchantStatus.ACTIVE);
    }
  }, [values.typeId, merchantTypes]);

  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const cancelRef = React.useRef(null);

  const customFields = merchant.customFields || [];
  const customFieldState = useCustomFieldRulesState(customFields);

  React.useEffect(() => {
    customFields.forEach((field) => {
      customFieldState?.setFieldValue(
        field.id,
        field.value ? field.value : field.fieldValueType === FIELD_VALUE_TYPE.CHECKBOX ? [] : '',
      );
    });
  }, []);

  const disableStatus =
    merchant.merchantType?.code === MerchantTypeCodes.GIFT_CARD_CLIENT &&
    merchant.status === EnableTransactionValues.CLOSED;

  const disabledTypeChange = isLoading || !!merchant.typeId;

  const isStationDealerType = () => {
    if (merchantTypes && values.typeId) {
      const selectedType = merchantTypes.find((type) => type.id === values.typeId);
      return selectedType?.code === MerchantTypeCodes.STATION_DEALER;
    }
    return false;
  };

  return (
    <form onSubmit={handleSubmit} data-testid={'edit-merchant-details'}>
      <Modal.Body>
        {error && <QueryErrorAlert error={error as any} />}
        <FieldContainer
          label="Merchant logo"
          labelAlign={'start'}
          layout="horizontal-responsive"
          status={fileError ? 'error' : undefined}
          helpText={fileError}>
          {logo ? (
            <div className="p-1">
              <div className="p-4 rounded-lg bg-gray-200 text-center">
                {typeof logo === 'string' ? (
                  <ImageViewer
                    src={logo}
                    className="h-40 w-auto"
                    onDismiss={() => setLogo(undefined)}
                  />
                ) : (
                  <ImageViewer
                    file={logo}
                    className="h-40 w-auto"
                    onDismiss={() => setLogo(undefined)}
                  />
                )}
              </div>
            </div>
          ) : (
            <FileSelector
              onFilesSelected={(files) => {
                const file = files[0];
                setFileError('');
                if (file) {
                  if (file.size > 1024 * 1024) {
                    setFileError('File size exceeds 1MB. Please select another file.');
                  } else {
                    setLogo(file);
                  }
                }
              }}
              description="Supported format: png or svg"
              accept=".png,.svg"
            />
          )}
        </FieldContainer>
        <DropdownSelectField
          label={'Status'}
          onBlur={handleBlur}
          disabled={isLoading || disableStatus}
          layout={'horizontal-responsive'}
          options={statusOptions}
          name={'status'}
          value={values.status}
          status={touched.status && errors.status ? 'error' : undefined}
          helpText={touched.status && errors.status ? errors.status : null}
          onChangeValue={(v) => setFieldValue('status', v)}
        />

        <SearchableDropdownField
          onBlur={handleBlur}
          disabled={isLoading}
          layout={'horizontal-responsive'}
          label={'Reason code'}
          name={'reason'}
          onChangeValue={(v) => setFieldValue('reason', v)}
          value={values.reason}
          options={changeStatusReasonOptions}
        />
        <TextField
          onBlur={handleBlur}
          disabled={isLoading}
          layout={'horizontal-responsive'}
          label={'Remark'}
          name={'remark'}
          onChangeValue={(v) => setFieldValue('remark', v)}
          value={values.remark}
        />
        <TextField
          onBlur={handleBlur}
          layout={'horizontal-responsive'}
          label={'Name'}
          name={'name'}
          autoComplete={'new-password'}
          onChangeValue={(v) => setFieldValue('name', v)}
          value={values.name}
          status={touched.name && errors.name ? 'error' : undefined}
          helpText={touched.name && errors.name ? errors.name : null}
          disabled={isLoading}
        />
        <TextField
          onBlur={handleBlur}
          layout={'horizontal-responsive'}
          label={'Legal name'}
          name={'legalName'}
          onChangeValue={(v) => setFieldValue('legalName', v)}
          value={values.legalName}
          status={touched.legalName && errors.legalName ? 'error' : undefined}
          helpText={touched.legalName && errors.legalName ? errors.legalName : null}
          disabled={isLoading}
        />
        {isPDB && (
          <TextField layout={'horizontal-responsive'} label={'ID'} value={merchant.id} disabled />
        )}
        <SearchableDropdownField
          label={'Type'}
          onBlur={handleBlur}
          layout={'horizontal-responsive'}
          options={merchantTypesOptions}
          name={'typeId'}
          value={merchant.typeId ? merchant.merchantType?.name : values.typeId}
          placeholder={'Select type (optional)'}
          status={touched.typeId && errors.typeId ? 'error' : undefined}
          helpText={touched.typeId && errors.typeId ? errors.typeId : null}
          onChangeValue={(v) => setFieldValue('typeId', v)}
          disabled={disabledTypeChange}
        />

        {customFieldState.rules && customFieldState.rules.length > 0 && (
          <CustomFieldRulesRenderer
            fieldClassName={'w-80'}
            customFields={customFieldState}
            showError={submitCount > 0}
            disabled={isLoading}
          />
        )}

        <SearchableDropdownField
          onBlur={handleBlur}
          label="Merchant category code"
          name={'merchantCategoryCode'}
          layout="horizontal-responsive"
          value={values.merchantCategoryCode}
          onChangeValue={(v) => setFieldValue('merchantCategoryCode', v)}
          options={categoryCodeOptions}
          status={touched.merchantCategoryCode && errors.merchantCategoryCode ? 'error' : undefined}
          helpText={
            touched.merchantCategoryCode && errors.merchantCategoryCode
              ? errors.merchantCategoryCode
              : null
          }
          disabled={isLoading}
        />
        {isStationDealerType() && (
          <TextField
            label="Site name ID"
            name="siteNameId"
            placeholder={'Enter site name ID'}
            value={values.siteNameId}
            onChangeValue={(v) => setFieldValue('siteNameId', v)}
            onBlur={handleBlur}
            disabled={isLoading}
            layout="horizontal-responsive"
          />
        )}
        <DropdownSelectField
          label={'Business registration number format'}
          onBlur={handleBlur}
          disabled={isLoading}
          layout={'horizontal-responsive'}
          options={businessRegistrationNumberTypeOpts}
          name={'businessRegistrationType'}
          value={values.businessRegistrationType}
          placeholder={'Please select'}
          status={
            touched.businessRegistrationType && errors.businessRegistrationType
              ? 'error'
              : undefined
          }
          helpText={
            touched.businessRegistrationType && errors.businessRegistrationType
              ? errors.businessRegistrationType
              : null
          }
          onChangeValue={(v) => {
            setFieldValue('businessRegistrationNo', '');
            setFieldValue('businessRegistrationType', v);
          }}
        />
        {values.businessRegistrationType && (
          <TextField
            onBlur={handleBlur}
            disabled={isLoading}
            layout={'horizontal-responsive'}
            autoComplete={'new-password'}
            label={'Business registration number'}
            name={'businessRegistrationNo'}
            placeholder={
              values.businessRegistrationType === BusinessRegistrationType.OLD
                ? 'Enter business registration number'
                : 'e.g.: 123456789101'
            }
            onChangeValue={(v) => setFieldValue('businessRegistrationNo', v)}
            value={values.businessRegistrationNo}
            helpText={touched.businessRegistrationNo ? errors.businessRegistrationNo : null}
            status={
              touched.businessRegistrationNo && errors.businessRegistrationNo ? 'error' : undefined
            }
          />
        )}
        <DropdownSelectField
          onBlur={handleBlur}
          disabled={isLoading}
          layout={'horizontal-responsive'}
          label="Sales territory"
          name={'salesTerritoryId'}
          value={values.salesTerritoryId}
          options={salesTerritoriesOptions || []}
          onChangeValue={(v) => setFieldValue('salesTerritoryId', v)}
        />
        <SearchableDropdownField
          onBlur={handleBlur}
          label="Country"
          name={'countryCode'}
          layout="horizontal-responsive"
          value={values.countryCode}
          onChangeValue={(v) => setFieldValue('countryCode', v)}
          status={touched.countryCode && errors.countryCode ? 'error' : undefined}
          helpText={touched.countryCode && errors.countryCode ? errors.countryCode : null}
          options={countryOptions}
          disabled={isLoading}
        />
        <SearchableDropdownField
          onBlur={handleBlur}
          label="Timezone"
          layout="horizontal-responsive"
          name={'timezone'}
          value={values.timezone}
          onChangeValue={(v) => setFieldValue('timezone', v)}
          options={timezoneOptions}
          status={touched.timezone && errors.timezone ? 'error' : undefined}
          helpText={touched.timezone && errors.timezone ? errors.timezone : null}
          disabled={isLoading}
        />
      </Modal.Body>
      <Modal.Footer className="text-right">
        <Button onClick={props.onCancel} variant="outline" className="mr-2">
          CANCEL
        </Button>
        <Button
          variant="primary"
          isLoading={isLoading}
          onClick={() => {
            values.status === MerchantStatus.DELETED ? setShowDeleteConfirm(true) : handleSubmit();
          }}>
          SAVE CHANGES
        </Button>
      </Modal.Footer>
      {showDeleteConfirm && (
        <Dialog onDismiss={() => setShowDeleteConfirm(false)} leastDestructiveRef={cancelRef}>
          <DialogContent header="Delete merchant">
            Merchant with status Deleted will not be able to interact with any other entity in the
            system. Are you sure to continue?
          </DialogContent>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} ref={cancelRef}>
              CANCEL
            </Button>
            <Button variant="error" onClick={() => handleSubmit()}>
              CONFIRM
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </form>
  );
};

interface UpdateMerchantValues {
  status: string;
  reason: string;
  remark: string;
  name: string;
  legalName: string;
  typeId: string;
  siteNameId: string;
  merchantCategoryCode: string;
  businessRegistrationType: string;
  businessRegistrationNo: string;
  salesTerritoryId: string;
  countryCode: string;
  timezone: string;
}
