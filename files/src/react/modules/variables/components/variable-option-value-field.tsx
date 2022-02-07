import * as React from 'react';
import {FieldInputProps} from 'formik';
import {Textarea, TextInput, titleCase} from '@setel/portal-ui';
import {VariableType} from '../const';

interface IVariableOptionValueFieldProps {
  field: FieldInputProps<any>;
  type: VariableType;
  placeholder?: string;
}

export function VariableOptionValueField({field, type, ...props}: IVariableOptionValueFieldProps) {
  if (type === VariableType.Boolean) {
    return <TextInput {...field} {...props} value={titleCase(field.value.toString())} disabled />;
  } else if (type === VariableType.JSON || type === VariableType.InterfaceComponent) {
    return <JsonInput {...field} {...props} initialValue={field.value} />;
  } else if (type === VariableType.Number) {
    return <NumberInput {...field} {...props} initialValue={field.value} />;
  } else if (type === VariableType.String) {
    return <TextAreaInput {...field} {...props} initialValue={field.value || ''} />;
  }
}

function NumberInput({initialValue, ...props}) {
  const [value, setValue] = React.useState(
    initialValue === undefined ? '' : initialValue.toString(),
  );
  return (
    <TextInput
      {...props}
      value={value}
      onChange={(e) => {
        const newValue = e.target.value;
        setValue(newValue);
        if (newValue && newValue.match(/^-?\d*(\.\d+)?$/)) {
          props.onChange({target: {name: props.name, value: parseFloat(newValue)}});
        } else {
          props.onChange({target: {name: props.name, value: new Error('Invalid number')}});
        }
      }}
    />
  );
}

function JsonInput({initialValue, ...props}) {
  const [value, setValue] = React.useState(
    initialValue === undefined ? '' : JSON.stringify(initialValue),
  );
  return (
    <Textarea
      {...props}
      value={value}
      onChange={(e) => {
        const newValue = e.target.value;
        setValue(newValue);
        try {
          props.onChange({target: {name: props.name, value: JSON.parse(newValue)}});
        } catch {
          props.onChange({target: {name: props.name, value: new Error('Invalid JSON')}});
        }
      }}
    />
  );
}

function TextAreaInput({initialValue, ...props}) {
  const [value, setValue] = React.useState(initialValue === undefined ? '' : initialValue);
  return (
    <Textarea
      {...props}
      value={value}
      onChange={(e) => {
        const newValue = e.target.value;
        setValue(newValue);
        props.onChange({target: {name: props.name, value: newValue}});
      }}
    />
  );
}

export function validateVariableOptionValue(value: any, type: VariableType): boolean {
  if (value === undefined) {
    return false;
  } else if (type === VariableType.String) {
    return value !== '';
  } else {
    return true;
  }
}
