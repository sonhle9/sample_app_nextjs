import * as yup from 'yup';

export const validationForceCloseSchema = yup.object().shape({
  remark: yup.string().required('Remarks is required'),
});
