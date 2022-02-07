import * as React from 'react';

import {
  TextField,
  DropdownSelectField,
  DropdownSelectFieldProps,
  TextFieldProps,
  Dialog,
  DialogContent,
  DialogFooter,
  Button,
} from '@setel/portal-ui';

import {FormikProps} from 'formik';
import {IAttributionRule} from '../types';

interface IFormikFieldProps {
  formik: FormikProps<IAttributionRule>;
  name: keyof IAttributionRule | string;
}
export function FormikDropdownField<Value extends string | number>({
  formik,
  name,
  ...props
}: Omit<DropdownSelectFieldProps<Value>, 'value'> & IFormikFieldProps) {
  const error = formik.getFieldMeta(name).touched && formik.getFieldMeta(name).error;
  const value = formik.getFieldMeta(name).value as string;
  return (
    <DropdownSelectField
      {...(props as any)}
      name={name}
      status={error ? 'error' : undefined}
      helpText={error}
      value={value}
      onChangeValue={(newVal) => formik.setFieldValue(name, newVal)}
      layout="horizontal"
      className="max-w-xs"
    />
  );
}
export function FormikTextField({formik, name, ...props}: TextFieldProps & IFormikFieldProps) {
  const error = formik.getFieldMeta(name).touched && formik.getFieldMeta(name).error;
  const value = formik.getFieldMeta(name).value as string;
  return (
    <TextField
      {...props}
      name={name}
      status={error ? 'error' : undefined}
      helpText={error}
      value={value}
      onChange={formik.handleChange}
      layout="horizontal"
      className="max-w-xs"
    />
  );
}

interface ConfirmDialogProps {
  children: React.ReactNode;
  header: React.ReactNode;
  confirmLabel?: React.ReactNode;
  confirmElement?: React.ReactNode;
  open: boolean;
  toggleOpen: (open?: boolean) => void;
  onConfirm?: () => void;
}
export function ConfirmDialog(props: ConfirmDialogProps) {
  const dialogRef = React.useRef(null);
  const {children, header, confirmLabel, confirmElement, onConfirm, open, toggleOpen} = props;

  return open ? (
    <Dialog onDismiss={() => toggleOpen()} leastDestructiveRef={dialogRef} style={{marginTop: 200}}>
      <DialogContent header={header}>{children}</DialogContent>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => {
            toggleOpen();
          }}
          ref={dialogRef}>
          CANCEL
        </Button>
        {confirmElement || (
          <Button
            variant="primary"
            onClick={() => {
              toggleOpen();
              onConfirm();
            }}>
            {confirmLabel}
          </Button>
        )}
      </DialogFooter>
    </Dialog>
  ) : null;
}
