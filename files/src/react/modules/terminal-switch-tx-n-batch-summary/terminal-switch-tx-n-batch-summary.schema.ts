import * as yup from 'yup';

export const validationTxNBatchListingSchema = yup.object().shape({
  dateRange: yup.array().of(yup.string().required()).min(1),
});
