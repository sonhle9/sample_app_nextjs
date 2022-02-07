import {FormikProps} from 'formik';
import * as RS from '@setel/portal-ui';

export type GetFormFieldPropsInput<T = any> = {
  name: string;
  form: FormikProps<T>;
  valueProp?: string;
  onChangeProp?: string;
  omitHelperText?: boolean;
};

export const getFormFieldProps = ({
  name,
  form,
  valueProp,
  onChangeProp,
  omitHelperText,
}: GetFormFieldPropsInput): any => {
  const {value, onChange, ...props} = form.getFieldProps(name);
  const {error, touched} = form.getFieldMeta(name);

  return {
    ...props,
    ...(valueProp ? {[valueProp]: value} : {value}),
    ...(onChangeProp
      ? {[onChangeProp]: (val: any) => form.setFieldValue(name, val, true)}
      : {onChange}),
    ...(!omitHelperText &&
      touched &&
      error && {
        status: 'error' as RS.FieldStatus,
        helpText: error,
      }),
  };
};
