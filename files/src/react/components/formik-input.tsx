import {TextField, TextFieldProps} from '@setel/portal-ui';
import * as React from 'react';

interface ValidationTextFieldProps extends TextFieldProps {
  value: string | number;
  error: string;
}

export const ValidationTextField = ({value, error, ...props}: ValidationTextFieldProps) => {
  return (
    <TextField
      value={value ?? ''}
      status={error ? 'error' : undefined}
      helpText={error || ''}
      {...props}
    />
  );
};
