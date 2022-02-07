import * as React from 'react';
import {useCustomFieldRuleDetails} from '../custom-field-rules.queries';
import {
  Badge,
  Button,
  classes,
  Card,
  CardContent,
  EditIcon,
  Field,
  Label,
  titleCase,
} from '@setel/portal-ui';
import {CustomFieldRuleDetailsModal} from './custom-field-rules-details-modal';
import {
  ICustomFieldRule,
  ENTITY_NAME,
  ENTITY_CATEGORISATION_TYPE,
  FIELD_VALUE_TYPE,
  VALIDATION_TYPE,
} from '../custom-field-rules.type';
import {QueryErrorAlert} from '../../../components/query-error-alert';
interface CustomFieldRuleDetailsProps {
  id: string;
}

export const CustomFieldRuleDetails = (props: CustomFieldRuleDetailsProps) => {
  const [visibleModal, setVisibleModal] = React.useState(false);
  const {data: customField, error: customFieldError} = useCustomFieldRuleDetails(props.id);

  const displayValidations = (customFieldRule: ICustomFieldRule) => {
    const validations: string[] = customFieldRule?.validations || [];
    return customFieldRule?.fieldValueType === 'textbox' && validations.length ? (
      <span className="mt-1 pt-2 sm:mt-0 sm:col-span-4">
        {validations.map((validation) => {
          return (
            <Badge className="mr-1" key={'validation-' + validation} color="offwhite">
              {getValidationDisplayName(validation)}
            </Badge>
          );
        })}
      </span>
    ) : (
      <span className="mt-1 pt-2 sm:mt-0 sm:col-span-4">-</span>
    );
  };

  const getValidationDisplayName = (validationName: string) => {
    switch (validationName) {
      case VALIDATION_TYPE.ALPHA_NUMERIC:
        return 'Alphanumeric';
      case VALIDATION_TYPE.ONLY_NUMERIC:
        return 'Only number';
      default:
        return '';
    }
  };

  const renderRuleStatus = (status: boolean) => {
    return status ? (
      <Badge className="uppercase" color="success" rounded="rounded">
        Active
      </Badge>
    ) : (
      <Badge className="uppercase" color="offwhite" rounded="rounded">
        Disabled
      </Badge>
    );
  };

  const renderEntityName = (entityName: string) => {
    switch (entityName) {
      case ENTITY_NAME.MERCHANT:
        return 'Merchant';
      case ENTITY_NAME.ATTRIBUTION_RULE:
        return 'Attribution rule';
      case ENTITY_NAME.SITE:
        return 'Site';
      case ENTITY_NAME.CUSTOMER:
        return 'Customer';
      case ENTITY_NAME.ITEM:
        return 'Item';
      default:
        return '-';
    }
  };

  const renderEntityCatType = (entityCatType: string) => {
    switch (entityCatType) {
      case ENTITY_CATEGORISATION_TYPE.MERCHANT_TYPE:
        return 'Merchant type';
      case ENTITY_CATEGORISATION_TYPE.CUSTOMER_CATEGORY:
        return 'Customer category';
      case ENTITY_CATEGORISATION_TYPE.MERCHANT:
        return 'Merchant';
      case ENTITY_CATEGORISATION_TYPE.COMPANY:
        return 'Company';
      default:
        return '-';
    }
  };

  const displayValueOptions = (customFieldRule: ICustomFieldRule) => {
    return (customFieldRule?.valueOptions || []).length ? (
      <span className="mt-1 pt-2 sm:mt-0 sm:col-span-4">
        {(customFieldRule?.valueOptions || []).map((value, idx) => {
          return (
            <Badge
              className="mr-3 sm:mr-2 text-mediumgrey"
              key={'valueOptions-' + idx}
              color="grey">
              {value}
            </Badge>
          );
        })}
      </span>
    ) : (
      <span className="mt-1 pt-2 sm:mt-0 sm:col-span-4">-</span>
    );
  };

  const displayInputType = (value: ICustomFieldRule): string => {
    switch (value?.fieldValueType) {
      case FIELD_VALUE_TYPE.TEXTBOX:
        return 'Textbox';
      case FIELD_VALUE_TYPE.CHECKBOX:
        return 'Checkbox';
      case FIELD_VALUE_TYPE.DROPDOWN:
        return 'Dropdown';
      default:
        return titleCase(value?.fieldValueType || '');
    }
  };

  return (
    <>
      <div className="grid gap-4 pt-4 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between">
          <h1 className={classes.h1}>Custom field rule details</h1>
        </div>
        <Card>
          {customFieldError && <QueryErrorAlert error={customFieldError as any} />}
          <div className="px-4 md:px-6 lg:px-8 text-darkgrey border-b border-gray-200 text-xl font-medium leading-7 pt-5 py-4 flex justify-between">
            <div className="flex items-center">
              <h2>{customField?.fieldName}</h2>
            </div>
            <Button variant="outline" onClick={() => setVisibleModal(true)} leftIcon={<EditIcon />}>
              EDIT DETAILS
            </Button>
          </div>
          <CardContent>
            <Field className="sm:grid sm:grid-cols-5 sm:grap-4 sm:items-start">
              <Label className="pt-2">Name</Label>
              <span className="mt-1 pt-2 sm:mt-0 sm:col-span-4">{customField?.fieldName}</span>
            </Field>
            <Field className="sm:grid sm:grid-cols-5 sm:grap-4 sm:items-start">
              <Label className="pt-2">Display name</Label>
              <span className="mt-1 pt-2 sm:mt-0 sm:col-span-4">{customField?.fieldLabel}</span>
            </Field>
            <Field className="sm:grid sm:grid-cols-5 sm:grap-4 sm:items-start">
              <Label className="pt-2">Input type</Label>
              <span className="mt-1 pt-2 sm:mt-0 sm:col-span-4">
                {displayInputType(customField)}
              </span>
            </Field>
            <Field className="sm:grid sm:grid-cols-5 sm:grap-4 sm:items-start">
              <Label className="pt-2">Validation</Label>
              {displayValidations(customField)}
            </Field>

            <Field className="sm:grid sm:grid-cols-5 sm:grap-4 sm:items-start">
              <Label className="pt-2">Value options</Label>
              {displayValueOptions(customField)}
            </Field>
            <Field className="sm:grid sm:grid-cols-5 sm:grap-4 sm:items-start">
              <Label className="pt-2">Default value</Label>
              <span className="mt-1 pt-2 sm:mt-0 sm:col-span-4">
                {customField?.fieldValueDefault || '-'}
              </span>
            </Field>
            <Field className="sm:grid sm:grid-cols-5 sm:grap-4 sm:items-start">
              <Label className="pt-2">Entity type</Label>
              <span className="mt-1 pt-2 sm:mt-0 sm:col-span-4">
                {renderEntityName(customField?.entityName)}
              </span>
            </Field>
            <Field className="sm:grid sm:grid-cols-5 sm:grap-4 sm:items-start">
              <Label className="pt-2">Entity categorisation type</Label>
              <span className="mt-1 pt-2 sm:mt-0 sm:col-span-4">
                {renderEntityCatType(customField?.entityCategorisationType)}
              </span>
            </Field>
            <Field className="sm:grid sm:grid-cols-5 sm:grap-4 sm:items-start">
              <Label className="pt-2">Entity categorisation ID</Label>
              <span className="mt-1 pt-2 sm:mt-0 sm:col-span-4">
                {customField?.entityCategorisationName || '-'}
              </span>
            </Field>

            <Field className="sm:grid sm:grid-cols-5 sm:grap-4 sm:items-start">
              <Label className="pt-2">Enabled</Label>
              <span className="mt-1 pt-2 sm:mt-0 sm:col-span-4">
                {renderRuleStatus(customField?.isEnabled)}
              </span>
            </Field>
          </CardContent>
        </Card>
      </div>
      {visibleModal && (
        <CustomFieldRuleDetailsModal
          visible={visibleModal}
          onClose={() => setVisibleModal(false)}
          customField={customField}
        />
      )}
    </>
  );
};
