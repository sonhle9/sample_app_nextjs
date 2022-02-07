import * as Yup from 'yup';

export const cashflowsSchema = Yup.object({
  inputMoney: Yup.string()
    .matches(/^-?[0-9]\d*(\.\d{1,2})?$/, 'This field must be numeric')
    .matches(/^(0.+|[^0].*)$/, 'Number must is not equal 0')
    .required('This field is required'),
});
