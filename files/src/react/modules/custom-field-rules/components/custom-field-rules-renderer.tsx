import {
  Checkbox,
  CheckboxGroup,
  DropdownSelectField,
  FieldContainer,
  FieldContainerProps,
  TextField,
} from '@setel/portal-ui';
import * as React from 'react';
import {FIELD_VALUE_TYPE} from '../custom-field-rules.type';
import type {useCustomFieldRulesState} from '../hooks/use-custom-field-rules-state';

export interface CustomFieldRulesRendererProps {
  customFields: ReturnType<typeof useCustomFieldRulesState>;
  fieldLayout?: FieldContainerProps['layout'];
  fieldClassName?: string;
  showError?: boolean;
  disabled?: boolean;
}

export const CustomFieldRulesRenderer = ({
  customFields,
  fieldLayout = 'horizontal-responsive',
  showError,
  disabled,
  fieldClassName,
}: CustomFieldRulesRendererProps) => {
  const errors = showError ? customFields.errors : {};

  return (
    <>
      {customFields.rules.map((rule) => {
        switch (rule.fieldValueType) {
          case FIELD_VALUE_TYPE.TEXTBOX:
            return (
              <TextField
                className={fieldClassName}
                label={rule.fieldLabel}
                value={customFields.values[rule.id]}
                onChangeValue={customFields.setFieldValueCurry(rule.id)}
                name={rule.fieldName}
                layout={fieldLayout}
                status={errors[rule.id] ? 'error' : undefined}
                helpText={errors[rule.id]}
                disabled={disabled}
                id={rule.id}
                key={rule.id}
              />
            );

          case FIELD_VALUE_TYPE.DROPDOWN:
            return (
              <DropdownSelectField
                className={fieldClassName}
                label={rule.fieldLabel}
                value={customFields.values[rule.id]}
                onChangeValue={customFields.setFieldValueCurry(rule.id)}
                options={rule.valueOptions}
                name={rule.fieldName}
                layout={fieldLayout}
                status={errors[rule.id] ? 'error' : undefined}
                helpText={errors[rule.id]}
                id={rule.id}
                disabled={disabled}
                key={rule.id}
              />
            );

          case FIELD_VALUE_TYPE.CHECKBOX:
            return (
              <FieldContainer
                label={rule.fieldLabel}
                layout={fieldLayout}
                labelAlign="start"
                status={showError && customFields.errors[rule.id] ? 'error' : undefined}
                helpText={errors[rule.id]}
                key={rule.id}>
                <CheckboxGroup
                  name={rule.fieldName}
                  value={(customFields.values[rule.id] as string[]) || []}
                  onChangeValue={customFields.setFieldValueCurry(rule.id)}>
                  {rule.valueOptions?.map((option, index) => (
                    <Checkbox value={option} label={option} disabled={disabled} key={index} />
                  ))}
                </CheckboxGroup>
              </FieldContainer>
            );

          default: {
            console.error(`Not implemented ${rule.fieldValueType}`, rule);
            return null;
          }
        }
      })}
    </>
  );
};
