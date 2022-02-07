import * as React from 'react';
import {
  FieldContainer,
  MultiInput,
  TextInput as RsTextInput,
  InputProps,
  FieldStatus,
} from '@setel/portal-ui';
import {Field, FormikProps} from 'formik';
import {getVariable} from '../variables.service';
import {ITag} from '../types';
import {VariableType, variableTypeDisplayNames, variableGroupDisplayNames} from '../const';
import {Dropdown} from './dropdown';

export interface IVariableEditorFormValues {
  key?: string;
  name?: string;
  description?: string;
  type?: VariableType;
  tags?: ITag[];
  group?: string;
  comment?: string;
}

interface IVariableEditorProps {
  isExisting: boolean;
  formikProps: FormikProps<IVariableEditorFormValues>;
}

export function VariableEditor({
  isExisting,
  formikProps: {values, errors, touched},
}: IVariableEditorProps) {
  const getHelpProps = (name: string) =>
    errors[name]
      ? {
          status: touched[name] ? ('error' as FieldStatus) : null,
          helpText: errors[name],
        }
      : {helpText: ' '};

  return (
    <>
      <FieldContainer label="Group" layout="horizontal" {...getHelpProps('group')}>
        {isExisting ? (
          <TextInput disabled value={variableGroupDisplayNames.get(values.group) || values.group} />
        ) : (
          <Field
            name="group"
            validate={(value: string) => {
              if (!value) {
                return 'Required';
              }
            }}>
            {({field: {name, value, onChange}}) => (
              <Dropdown
                placeholder="Select group"
                options={Array.from(variableGroupDisplayNames.entries()).map(([k, v]) => ({
                  value: k.toString(),
                  label: v,
                }))}
                value={value}
                onChangeValue={(newValue) => onChange({target: {name, value: newValue}})}
                data-testid="input-group"
              />
            )}
          </Field>
        )}
      </FieldContainer>
      <FieldContainer label="Variable key" layout="horizontal" {...getHelpProps('key')}>
        <Field
          as={TextInput}
          name="key"
          placeholder="Enter variable key"
          disabled={isExisting}
          validate={async (value: string) => {
            if (isExisting) {
              return;
            }
            if (!value) {
              return 'Required';
            }
            if (/[`!@#$%^&*()+\-=\[\]{};':"\\|,. <>\/?~]/.test(value)) {
              return 'No special characters or spaces are allowed except underscore "_"';
            }
            try {
              await getVariable(values.key);
              return 'The variable key already exists. Please delete that key to create a new variable with the same key.';
            } catch (e) {}
          }}
        />
      </FieldContainer>
      <FieldContainer label="Variable name" layout="horizontal" {...getHelpProps('name')}>
        <Field
          as={TextInput}
          name="name"
          placeholder="Enter variable name"
          validate={(value: string) => {
            if (!value) {
              return 'Required';
            }
          }}
        />
      </FieldContainer>
      <FieldContainer
        label="Variable description"
        layout="horizontal"
        {...getHelpProps('description')}>
        <Field
          as={TextInput}
          name="description"
          placeholder="Enter variable description (optional)"
        />
      </FieldContainer>
      <FieldContainer label="Type" layout="horizontal" {...getHelpProps('type')}>
        {isExisting ? (
          <TextInput disabled value={variableTypeDisplayNames.get(values.type) || values.type} />
        ) : (
          <Field
            name="type"
            validate={(value: string) => {
              if (!value) {
                return 'Required';
              }
            }}>
            {({field: {name, value, onChange}}) => (
              <Dropdown
                placeholder="Select type"
                options={Array.from(variableTypeDisplayNames.entries()).map(([k, v]) => ({
                  value: k.toString(),
                  label: v,
                }))}
                value={value}
                onChangeValue={(newValue) => onChange({target: {name, value: newValue}})}
                data-testid="input-type"
              />
            )}
          </Field>
        )}
      </FieldContainer>
      <FieldContainer label="Tags" layout="horizontal" {...getHelpProps('tags')}>
        <Field name="tags">
          {({field: {name, value, onChange}}) => (
            <MultiInput
              includeDraft
              badgeColor="grey"
              name={name}
              placeholder="Enter variable tags (optional)"
              values={(value || []).map((tag: ITag) => tag.value)}
              onChangeValues={(newValue) => {
                onChange({target: {name, value: newValue.map((key) => ({key, value: key}))}});
              }}
            />
          )}
        </Field>
      </FieldContainer>
    </>
  );
}

const TextInput = React.forwardRef<HTMLInputElement, InputProps>(function ForceControlledInput(
  {value = '', ...props},
  ref,
) {
  return <RsTextInput {...props} value={value} ref={ref} />;
});
