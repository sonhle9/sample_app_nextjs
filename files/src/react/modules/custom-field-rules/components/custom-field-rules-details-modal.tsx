import {
  Alert,
  AlertMessages,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogFooter,
  DropdownMultiSelect,
  DropdownSelect,
  FieldContainer,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  MultiInput,
  TextField,
  useDebounce,
} from '@setel/portal-ui';
import * as React from 'react';
import {useListMerchantTypes} from 'src/react/modules/merchants';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {EnterpriseNameEnum} from '../../../../shared/enums/enterprise.enum';
import {useRouter} from '../../../routing/routing.context';
import {
  useCompanies,
  useDeleteCustomFieldRule,
  useListCustomerCategories,
  useMerchants,
  useSetCustomFieldRule,
} from '../custom-field-rules.queries';
import {
  ENTITY_CATEGORISATION_TYPE,
  ENTITY_NAME,
  FIELD_VALUE_TYPE,
  ICustomFieldRule,
  ValidateMessage,
  VALIDATION_TYPE,
} from '../custom-field-rules.type';

const validationOpts = [
  {
    label: 'Only number',
    value: VALIDATION_TYPE.ONLY_NUMERIC,
  },
  {
    label: 'Alphanumeric',
    value: VALIDATION_TYPE.ALPHA_NUMERIC,
  },
];
const inputTypeOpts = [
  {
    label: 'Textbox',
    value: FIELD_VALUE_TYPE.TEXTBOX,
  },
  {
    label: 'Dropdown',
    value: FIELD_VALUE_TYPE.DROPDOWN,
  },
  {
    label: 'Checkbox',
    value: FIELD_VALUE_TYPE.CHECKBOX,
  },
];

const entityOptions = [
  {
    label: 'Merchant',
    value: ENTITY_NAME.MERCHANT,
  },
  {
    label: 'Site',
    value: ENTITY_NAME.SITE,
  },
  {
    label: 'Attribution rule',
    value: ENTITY_NAME.ATTRIBUTION_RULE,
  },
  {
    label: 'Item',
    value: ENTITY_NAME.ITEM,
  },
];
if (CURRENT_ENTERPRISE.name === EnterpriseNameEnum.PDB) {
  entityOptions.push({
    label: 'Customer',
    value: ENTITY_NAME.CUSTOMER,
  });
}
const allEntityCatTypeOpts = [
  {
    label: 'Merchant type',
    value: ENTITY_CATEGORISATION_TYPE.MERCHANT_TYPE,
  },
  {
    label: 'Customer category',
    value: ENTITY_CATEGORISATION_TYPE.CUSTOMER_CATEGORY,
  },
  {
    label: 'Merchant',
    value: ENTITY_CATEGORISATION_TYPE.MERCHANT,
  },
  {
    label: 'Company',
    value: ENTITY_CATEGORISATION_TYPE.COMPANY,
  },
];
let entityCatTypeOpts = allEntityCatTypeOpts;
interface ICustomFieldRuleDetailsModal {
  visible: boolean;
  customField?: ICustomFieldRule;
  onClose?: () => void;
}

export const CustomFieldRuleDetailsModal = (props: ICustomFieldRuleDetailsModal) => {
  const [searchMerchants, setSearchMerchants] = React.useState(
    props?.customField?.entityCategorisationName || '',
  );
  const [searchCompanies, setSearchCompanies] = React.useState(
    props?.customField?.entityCategorisationName || '',
  );
  const debounceSearchMerchants = useDebounce(searchMerchants, 500);
  const debounceSearchCompanies = useDebounce(searchCompanies, 500);
  const {customField} = props;
  const {data: merchantTypes} = useListMerchantTypes();
  const {data: customerCategories} = useListCustomerCategories();
  const {data: merchants} = useMerchants({name: debounceSearchMerchants, perPage: 50});
  const {data: companies} = useCompanies({name: debounceSearchCompanies, perPage: 50});
  const [fieldName, setFieldName] = React.useState(customField?.fieldName || '');
  const [fieldLabel, setFieldLabel] = React.useState(customField?.fieldLabel || '');
  const [fieldValueType, setFieldValueType] = React.useState(customField?.fieldValueType || '');
  const [valueOptions, setValueOptions] = React.useState(customField?.valueOptions || []);
  const [fieldValueDefault, setFieldValueDefault] = React.useState(
    customField?.fieldValueDefault || '',
  );
  const [validations, setValidations] = React.useState(customField?.validations || []);
  const [entityName, setEntityName] = React.useState(customField?.entityName || '');
  const [entityCategorisationType, setEntityCategorisationType] = React.useState(
    customField?.entityCategorisationType || '',
  );
  const [entityCategorisationId, setEntityCategorisationId] = React.useState(
    customField?.entityCategorisationId || '',
  );
  const [entityCategorisationIds, setEntityCategorisationIds] = React.useState([]);

  const [disabledValueOptions, setDisabledValueOptions] = React.useState(
    customField?.fieldValueType === FIELD_VALUE_TYPE.TEXTBOX,
  );

  const [disabledValidation, setDisabledValidation] = React.useState(
    customField?.fieldValueType !== FIELD_VALUE_TYPE.TEXTBOX,
  );

  const disabledEntityName: boolean = !!(customField && customField.id);

  const [disabledEntCatType, setDisabledEntCatType] = React.useState(
    customField && customField.id
      ? true
      : customField?.entityName !== ENTITY_NAME.MERCHANT &&
          customField?.entityName !== ENTITY_NAME.CUSTOMER,
  );

  const [disabledEntCatValue, setDisabledEntCatValue] = React.useState(
    customField && customField.id
      ? true
      : customField?.entityCategorisationType !== ENTITY_CATEGORISATION_TYPE.MERCHANT_TYPE &&
          customField?.entityCategorisationType !== ENTITY_CATEGORISATION_TYPE.CUSTOMER_CATEGORY,
  );

  const [isEnabled, setIsEnabled] = React.useState(customField?.isEnabled);

  const isRequiredValueOptions = (inputType: string) => {
    return inputType === FIELD_VALUE_TYPE.DROPDOWN || inputType === FIELD_VALUE_TYPE.CHECKBOX;
  };

  const isRequiredValidation = (inputType: string) => {
    return inputType === FIELD_VALUE_TYPE.TEXTBOX;
  };

  const isRequiredEntityCatType = (entityApplied: string) => {
    return entityApplied === ENTITY_NAME.MERCHANT || entityApplied === ENTITY_NAME.CUSTOMER;
  };

  const isValidFieldValueDefault = (defaultValue: string) => {
    if (!defaultValue) {
      return true;
    }

    if (fieldValueType === FIELD_VALUE_TYPE.TEXTBOX) {
      if (validations[0] === VALIDATION_TYPE.ALPHA_NUMERIC) {
        return /^[a-z0-9]*$/.test(defaultValue);
      } else if (validations[0] === VALIDATION_TYPE.ONLY_NUMERIC) {
        return /^(\d)*$/.test(defaultValue);
      }
    } else {
      return valueOptions && valueOptions.length > 0 && valueOptions.includes(defaultValue);
    }
    return true;
  };

  const isRequiredEntityCategorisationIds = (entityCatType: string) => {
    return (
      entityCatType === ENTITY_CATEGORISATION_TYPE.MERCHANT_TYPE ||
      entityCatType === ENTITY_CATEGORISATION_TYPE.CUSTOMER_CATEGORY ||
      entityCatType === ENTITY_CATEGORISATION_TYPE.MERCHANT ||
      entityCatType === ENTITY_CATEGORISATION_TYPE.COMPANY
    );
  };

  const [errorMsg, setErrorMsg] = React.useState({
    fieldName: '',
    fieldLabel: '',
    fieldValueType: '',
    fieldValueDefault: '',
    valueOptions: '',
    validations: '',
    entityName: '',
    entityCategorisationType: '',
    entityCategorisationId: '',
    entityCategorisationIds: '',
  });

  const [apiErrorMsg, setApiErrorMsg] = React.useState([]);
  const [visibleDeleteConfirm, setVisibleDeleteConfirm] = React.useState(false);

  const cancelRef = React.useRef(null);
  const router = useRouter();

  const {mutate: setCustomField} = useSetCustomFieldRule(customField);
  const {mutate: deleteCustomField} = useDeleteCustomFieldRule();
  const [entityCatValueOpts, setEntityCatValueOpts] = React.useState([]);

  const initEntityCatValuesOpts = (entityCatType: string): any[] => {
    let opts: any[] = [];
    if (
      Array.isArray(merchantTypes) &&
      entityCatType === ENTITY_CATEGORISATION_TYPE.MERCHANT_TYPE
    ) {
      opts = merchantTypes.map((merchantType) => {
        return {
          label: merchantType?.name,
          value: merchantType?.id,
          icon: <Checkbox value={merchantType?.id} />,
          key: merchantType?.id,
        };
      });
    } else if (
      entityCatType === ENTITY_CATEGORISATION_TYPE.CUSTOMER_CATEGORY &&
      Array.isArray(customerCategories)
    ) {
      opts = customerCategories.map((cat) => {
        return {
          label: cat?.name,
          value: cat?.id || cat?._id,
          icon: <Checkbox value={cat?.id || cat?._id} />,
          key: cat?.id || cat?._id,
        };
      });
    } else if (entityCatType === ENTITY_CATEGORISATION_TYPE.MERCHANT && Array.isArray(merchants)) {
      opts = merchants.map((merchant) => {
        return {
          label: merchant?.name,
          value: merchant?.id || merchant?._id,
          icon: <Checkbox value={merchant?.id || merchant?._id} />,
          key: merchant?.id || merchant?._id,
        };
      });
    } else if (entityCatType === ENTITY_CATEGORISATION_TYPE.COMPANY && Array.isArray(companies)) {
      opts = companies.map((company) => {
        return {
          label: company?.name,
          value: company?.id || company?._id,
          icon: <Checkbox value={company?.id || company?._id} />,
          key: company?.id || company?._id,
        };
      });
    }

    return opts;
  };

  const onChangeFieldLabel = (inputName: string) => {
    setFieldLabel(inputName);
    const errorMessage = !!inputName ? '' : ValidateMessage.fieldLabel;
    setErrorMsg((prevState) => ({
      ...prevState,
      fieldLabel: errorMessage,
    }));
  };

  const onChangeFieldValueDefault = (inputName: string) => {
    setFieldValueDefault(inputName);
    // validate default value is valid
    const errorMessage = !!isValidFieldValueDefault(inputName)
      ? ''
      : ValidateMessage.fieldValueDefault;
    setErrorMsg((prevState) => ({
      ...prevState,
      fieldValueDefault: errorMessage,
    }));
  };

  const onChangeFieldName = (inputName: string) => {
    setFieldName(inputName);
    let errorMessage = '';
    if (!inputName) {
      errorMessage = ValidateMessage.fieldName;
    } else if (!/^[a-zA-Z0-9_]+$/.test(inputName)) {
      errorMessage = ValidateMessage.fieldNameInvalid;
    }
    setErrorMsg((prevState) => ({
      ...prevState,
      fieldName: errorMessage,
    }));
  };

  const onChangeFieldValueType = (inputType: string) => {
    setFieldValueType(inputType);
    if (!isRequiredValueOptions(inputType)) {
      setValueOptions([]);
      setDisabledValueOptions(true);
    } else {
      setDisabledValueOptions(false);
    }
    if (!isRequiredValidation(inputType)) {
      setValidations([]);
      setDisabledValidation(true);
    } else {
      setDisabledValidation(false);
    }
    const errorMessage = !!inputType ? '' : ValidateMessage.fieldValueType;
    const valueOptionErrMsg =
      isRequiredValueOptions(inputType) && (!valueOptions || !valueOptions?.length)
        ? ValidateMessage.valueOptions
        : '';
    const errValidationMsg =
      isRequiredValidation(inputType) && !validations.length ? ValidateMessage.validations : '';
    setErrorMsg((prevState) => ({
      ...prevState,
      validations: errValidationMsg,
      fieldValueType: errorMessage,
      valueOptions: valueOptionErrMsg,
    }));
  };

  const onChangeEntityName = (entityApplied: string) => {
    setEntityName(entityApplied);
    setEntityCategorisationType('');
    setEntityCategorisationIds([]);
    setEntityCategorisationId('');

    setErrorMsg((prevState) => ({
      ...prevState,
      entityName: !!entityApplied ? '' : ValidateMessage.entityName,
    }));
    if (entityApplied) {
      if (entityApplied === ENTITY_NAME.MERCHANT) {
        setDisabledEntCatType(false);
        setDisabledEntCatValue(false);
        entityCatTypeOpts = allEntityCatTypeOpts.filter((opt) => {
          return opt.value === ENTITY_CATEGORISATION_TYPE.MERCHANT_TYPE;
        });
      } else if (entityApplied === ENTITY_NAME.CUSTOMER) {
        setDisabledEntCatType(false);
        setDisabledEntCatValue(false);
        entityCatTypeOpts = allEntityCatTypeOpts.filter((opt) => {
          return opt.value === ENTITY_CATEGORISATION_TYPE.CUSTOMER_CATEGORY;
        });
      } else if (entityApplied === ENTITY_NAME.ITEM) {
        setDisabledEntCatType(false);
        setDisabledEntCatValue(false);
        entityCatTypeOpts = allEntityCatTypeOpts.filter((opt) => {
          return (
            opt.value === ENTITY_CATEGORISATION_TYPE.MERCHANT ||
            opt.value === ENTITY_CATEGORISATION_TYPE.COMPANY
          );
        });
      } else {
        setDisabledEntCatType(true);
        setDisabledEntCatValue(true);
        entityCatTypeOpts = allEntityCatTypeOpts;
      }
      const entityCatTypeErr =
        isRequiredEntityCatType(entityApplied) && !entityCategorisationType
          ? ValidateMessage.entityCategorisationType
          : '';
      const entityIdsError =
        !customField &&
        !customField?.id &&
        isRequiredEntityCategorisationIds('') &&
        !entityCategorisationIds?.length
          ? ValidateMessage.entityCategorisationIds
          : '';
      const entityCatIdErr =
        customField &&
        customField?.id &&
        isRequiredEntityCategorisationIds('') &&
        !entityCategorisationId
          ? ValidateMessage.entityCategorisationId
          : '';
      setErrorMsg((prevState) => ({
        ...prevState,
        entityCategorisationType: entityCatTypeErr,
        entityCategorisationIds: entityIdsError,
        entityCategorisationId: entityCatIdErr,
      }));
    }
  };

  const onChangeValidations = (validationValue: string) => {
    if (fieldValueType === FIELD_VALUE_TYPE.TEXTBOX) {
      setValidations([validationValue]);
      const errMsg = validationValue ? '' : ValidateMessage.validations;
      setErrorMsg((prevState) => ({
        ...prevState,
        validations: errMsg,
      }));
    } else {
      setValidations([]);
      setErrorMsg((prevState) => ({
        ...prevState,
        validations: '',
      }));
    }
  };

  const onChangeEntityCategorisationType = (entityCatType: string) => {
    setEntityCategorisationType(entityCatType);
    setEntityCategorisationIds([]);
    setEntityCategorisationId('');
    if (
      entityCategorisationType !== entityCatType &&
      (entityCatType === ENTITY_CATEGORISATION_TYPE.MERCHANT_TYPE ||
        entityCatType === ENTITY_CATEGORISATION_TYPE.CUSTOMER_CATEGORY ||
        entityCatType === ENTITY_CATEGORISATION_TYPE.MERCHANT ||
        entityCatType === ENTITY_CATEGORISATION_TYPE.COMPANY)
    ) {
      setEntityCatValueOpts(initEntityCatValuesOpts(entityCatType));
    }

    if (isRequiredEntityCategorisationIds(entityCatType)) {
      setDisabledEntCatValue(false);
    } else {
      setDisabledEntCatValue(true);
    }
    const errMsg =
      isRequiredEntityCatType(entityName) && !entityCatType
        ? ValidateMessage.entityCategorisationType
        : '';
    const entityIdsError =
      !customField &&
      !customField?.id &&
      isRequiredEntityCategorisationIds(entityCatType) &&
      !entityCategorisationIds?.length
        ? ValidateMessage.entityCategorisationIds
        : '';
    const entityCatIdErr =
      customField &&
      customField?.id &&
      isRequiredEntityCategorisationIds(entityCatType) &&
      !entityCategorisationId
        ? ValidateMessage.entityCategorisationId
        : '';

    setErrorMsg((prevState) => ({
      ...prevState,
      entityCategorisationType: errMsg,
      entityCategorisationIds: entityIdsError,
      entityCategorisationId: entityCatIdErr,
    }));
  };

  const onChangeEntityCategorisationIds = (entityCatIds: string[]) => {
    if (entityCatIds && Array.isArray(entityCatIds)) {
      setEntityCategorisationIds(entityCatIds);
      const errMsg =
        isRequiredEntityCategorisationIds(entityCategorisationType) && !entityCatIds?.length
          ? ValidateMessage.entityCategorisationIds
          : '';
      setErrorMsg((prevState) => ({
        ...prevState,
        entityCategorisationIds: errMsg,
      }));
    }
  };

  const handleInputEntityCategorisationIdsChange = (inputValue: string) => {
    if (entityCategorisationType === ENTITY_CATEGORISATION_TYPE.COMPANY) {
      setSearchCompanies(inputValue);
      initEntityCatValuesOpts(ENTITY_CATEGORISATION_TYPE.COMPANY);
    }
    if (entityCategorisationType === ENTITY_CATEGORISATION_TYPE.MERCHANT) {
      setSearchMerchants(inputValue);
      initEntityCatValuesOpts(ENTITY_CATEGORISATION_TYPE.MERCHANT);
    }
  };

  const onChangeValueOptions = (values: string[]) => {
    if (isRequiredValueOptions(fieldValueType)) {
      setValueOptions(values);
      const errMsg = values && values.length ? '' : ValidateMessage.valueOptions;
      setErrorMsg((prevState) => ({
        ...prevState,
        valueOptions: errMsg,
      }));
    } else {
      setValueOptions([]);
      setErrorMsg((prevState) => ({
        ...prevState,
        valueOptions: '',
      }));
    }
  };

  const validateInputData = () => {
    const errFieldNameMsg = errorMsg.fieldName || (!fieldName ? ValidateMessage.fieldName : '');
    const errFieldLabelMsg = !fieldLabel ? ValidateMessage.fieldLabel : '';
    const errFieldValueTypeMsg = !fieldValueType ? ValidateMessage.fieldValueType : '';
    const errValueOptsMsg =
      isRequiredValueOptions(fieldValueType) && !valueOptions.length
        ? ValidateMessage.valueOptions
        : '';
    const errFieldValueDefault = !isValidFieldValueDefault(fieldValueDefault)
      ? ValidateMessage.fieldValueDefault
      : '';
    const errEntityNameMsg = !entityName ? ValidateMessage.entityName : '';
    const errEntCatTypeMsg =
      isRequiredEntityCatType(entityName) && !entityCategorisationType
        ? ValidateMessage.entityCategorisationType
        : '';
    const errEntCatIdsMsg =
      isRequiredEntityCategorisationIds(entityCategorisationType) && !entityCategorisationIds
        ? ValidateMessage.entityCategorisationIds
        : '';

    const errEntCatIdMsg =
      isRequiredEntityCategorisationIds(entityCategorisationType) && !entityCategorisationId
        ? ValidateMessage.entityCategorisationIds
        : '';

    setErrorMsg((prevState) => ({
      ...prevState,
      fieldName: errFieldNameMsg,
      fieldLabel: errFieldLabelMsg,
      fieldValueType: errFieldValueTypeMsg,
      valueOptions: errValueOptsMsg,
      fieldValueDefault: errFieldValueDefault,
      entityName: errEntityNameMsg,
      entityCategorisationType: errEntCatTypeMsg,
      entityCategorisationId: errEntCatIdMsg,
      entityCategorisationIds: errEntCatIdsMsg,
    }));

    return {
      fieldName: errFieldNameMsg,
      fieldLabel: errFieldLabelMsg,
      fieldValueType: errFieldValueTypeMsg,
      valueOptions: errValueOptsMsg,
      fieldValueDefault: errFieldValueDefault,
      entityName: errEntityNameMsg,
      entityCategorisationType: errEntCatTypeMsg,
      entityCategorisationId: customField ? errEntCatIdMsg : '',
      entityCategorisationIds: customField ? '' : errEntCatIdsMsg,
    };
  };

  const isValidInputData = (errs) => {
    let isValid = true;
    if (!errs) {
      errs = errorMsg;
    }

    for (const field of Object.values(errs)) {
      if (field) {
        isValid = false;
        break;
      }
    }

    return isValid;
  };

  const onSubmitCustomFieldRule = async () => {
    const errMg = validateInputData();
    if (!isValidInputData(errMg)) {
      return;
    } else {
      setCustomField(
        {
          id: props?.customField?.id || undefined,
          fieldName,
          fieldLabel,
          fieldValueType,
          fieldValueDefault,
          valueOptions,
          validations,
          entityName,
          entityCategorisationType:
            entityCategorisationType && entityCategorisationType !== ''
              ? entityCategorisationType
              : undefined,
          entityCategorisationId:
            entityCategorisationId && entityCategorisationId !== ''
              ? entityCategorisationId
              : undefined,
          entityCategorisationIds: customField?.id ? undefined : entityCategorisationIds,
          isEnabled,
        },
        {
          onSuccess: () => {
            close();
          },
          onError: async (err: any) => {
            const response = await (err.response && err.response.data);
            if (response && response.statusCode === 400) {
              if (Array.isArray(response.message) && response.message.length) {
                setApiErrorMsg(response.message);
              } else {
                setApiErrorMsg([response.message]);
              }
              return;
            }
          },
        },
      );
    }
  };

  const onDeleteAdminUser = (userId: string) => {
    deleteCustomField(userId, {
      onSuccess: () => {
        setVisibleDeleteConfirm(false);
        close();
        router.navigateByUrl('/custom-field-rules');
      },
      onError: (err) => {
        console.error(err);
      },
    });
  };

  const close = () => {
    setErrorMsg({
      ...ValidateMessage,
    });
    setFieldName('');
    setFieldLabel('');
    setFieldValueType(null);
    setApiErrorMsg([]);
    props.onClose();
  };

  React.useMemo(() => {
    if (!!entityCategorisationType) {
      if (
        (!!merchantTypes && merchantTypes.length > 0) ||
        (!!customerCategories && customerCategories.length > 0) ||
        (!!merchants && merchants?.length > 0) ||
        (!!companies && companies?.length > 0)
      ) {
        setEntityCatValueOpts(initEntityCatValuesOpts(entityCategorisationType));
      }
    }
  }, [merchantTypes, customerCategories, merchants, companies]);

  const title = props.customField ? 'Edit custom field rule' : 'Create Custom field rule';

  const getEntityCategorisationValue = (id: string): string => {
    if (entityCatValueOpts.find((option) => option.value === id)) {
      return id;
    }
    return '';
  };

  return (
    <>
      <Modal
        isOpen={props.visible}
        onDismiss={close}
        aria-label={title}
        aria-labelledby="createOrUpdateCustomField"
        aria-describedby="createOrUpdateCustomField">
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <TextField
            value={fieldName}
            label="Name"
            className="pt-3"
            layout="horizontal-responsive"
            onChangeValue={onChangeFieldName}
            maxLength={128}
            status={!!errorMsg.fieldName ? 'error' : null}
            helpText={errorMsg.fieldName}
            placeholder={`Enter field name`}
          />

          <TextField
            label="Display name"
            layout="horizontal-responsive"
            value={fieldLabel}
            onChangeValue={onChangeFieldLabel}
            status={!!errorMsg.fieldLabel ? 'error' : null}
            helpText={errorMsg.fieldLabel}
            placeholder={`Enter field display name`}
          />

          <FieldContainer
            label="Input type"
            status={!!errorMsg?.fieldValueType ? 'error' : undefined}
            helpText={errorMsg?.fieldValueType}
            layout="horizontal-responsive">
            <DropdownSelect
              className="w-60"
              options={inputTypeOpts}
              value={fieldValueType}
              onChangeValue={onChangeFieldValueType}
              placeholder={'Please select a type'}
            />
          </FieldContainer>

          <FieldContainer
            label="Validation"
            status={!!errorMsg.validations ? 'error' : undefined}
            helpText={errorMsg.validations}
            layout="horizontal-responsive">
            <DropdownSelect
              className="w-60"
              disabled={disabledValidation}
              options={validationOpts}
              value={validations[0]}
              onChangeValue={onChangeValidations}
              placeholder={'Select a validation'}
            />
          </FieldContainer>

          <FieldContainer
            label="Value options"
            layout="horizontal-responsive"
            status={!!errorMsg?.valueOptions ? 'error' : undefined}
            helpText={errorMsg?.valueOptions}>
            <MultiInput
              values={valueOptions}
              placeholder="Type comma(,) or press Enter or press Tab to add a value"
              onChangeValues={onChangeValueOptions}
              disabled={disabledValueOptions}
            />
          </FieldContainer>

          <TextField
            label="Default value"
            layout="horizontal-responsive"
            value={fieldValueDefault}
            onChangeValue={onChangeFieldValueDefault}
            status={!!errorMsg.fieldValueDefault ? 'error' : null}
            helpText={errorMsg.fieldValueDefault}
            placeholder={`Enter field display name`}
          />

          <FieldContainer
            label="Entity applied"
            status={!!errorMsg.entityName ? 'error' : undefined}
            helpText={errorMsg?.entityName}
            layout="horizontal-responsive">
            <DropdownSelect
              className="w-60"
              placeholder="Please select"
              options={entityOptions}
              value={entityName}
              disabled={disabledEntityName}
              onChangeValue={onChangeEntityName}
            />
          </FieldContainer>

          <FieldContainer
            label="Entity categorisation"
            status={!!errorMsg.entityCategorisationType ? 'error' : undefined}
            helpText={errorMsg.entityCategorisationType}
            layout="horizontal-responsive">
            <DropdownSelect
              className="w-60"
              placeholder="Please select"
              options={entityCatTypeOpts}
              value={entityCategorisationType}
              onChangeValue={onChangeEntityCategorisationType}
              disabled={disabledEntCatType}
            />
          </FieldContainer>
          {customField && customField?.id ? (
            <FieldContainer
              label="Entity categorisation value"
              layout="horizontal-responsive"
              status={!!errorMsg.entityCategorisationId ? 'error' : undefined}
              helpText={errorMsg.entityCategorisationId}>
              <DropdownSelect
                className="w-60"
                placeholder="Please select"
                value={getEntityCategorisationValue(entityCategorisationId)}
                options={entityCatValueOpts}
                disabled={disabledEntCatValue}
              />
            </FieldContainer>
          ) : (
            <FieldContainer
              label="Entity categorisation value"
              layout="horizontal-responsive"
              status={!!errorMsg.entityCategorisationIds ? 'error' : undefined}
              helpText={errorMsg.entityCategorisationIds}>
              <DropdownMultiSelect
                className="w-60"
                placeholder="Please select"
                allowSelectAll={true}
                values={entityCategorisationIds}
                onChangeValues={onChangeEntityCategorisationIds}
                onInputValueChange={handleInputEntityCategorisationIdsChange}
                options={entityCatValueOpts}
                disabled={disabledEntCatValue}
              />
            </FieldContainer>
          )}

          <FieldContainer label="Enabled" layout="horizontal-responsive">
            <Checkbox checked={isEnabled} onChangeValue={setIsEnabled} />
          </FieldContainer>

          {apiErrorMsg.length > 0 && (
            <div className="p-2">
              <Alert variant="error" description="Something is wrong">
                <AlertMessages messages={apiErrorMsg} />
              </Alert>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center justify-between">
            {!!props.customField ? (
              <span
                style={{color: 'red', cursor: 'pointer'}}
                onClick={() => setVisibleDeleteConfirm(true)}>
                DELETE
              </span>
            ) : (
              <div />
            )}
            <div className="flex items-center">
              <Button variant="outline" onClick={close}>
                CANCEL
              </Button>
              <div style={{width: 12}} />
              <Button variant="primary" onClick={onSubmitCustomFieldRule}>
                SAVE
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
      {visibleDeleteConfirm && (
        <Dialog onDismiss={() => setVisibleDeleteConfirm(false)} leastDestructiveRef={cancelRef}>
          <DialogContent header="Delete custom field rule">
            Are you sure you would like to delete this custom field rule? The action cannot be
            undone.
          </DialogContent>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setVisibleDeleteConfirm(false)}
              ref={cancelRef}>
              CANCEL
            </Button>
            <Button variant="error" onClick={() => onDeleteAdminUser(props.customField?.id)}>
              DELETE
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
};
