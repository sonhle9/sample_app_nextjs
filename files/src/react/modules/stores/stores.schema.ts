import * as Yup from 'yup';
import {StoresStatusesEnum} from './stores.types';
import _memoize from 'lodash/memoize';

export const MIDNIGHT_MINUTES = 24 * 60 - 1;

export const PRODUCT_SCHEMA = Yup.object().shape({
  barcode: Yup.string()
    .matches(/^[a-zA-Z0-9\s]+$/, 'Special characters are not allowed.')
    .required('This field is required.'),
  image: Yup.string().required('This field is required.'),
  name: Yup.string()
    .required('This field is required.')
    .matches(
      /^[a-zA-Z0-9\.\,\(\)\[\]\s\&\-]+$/,
      'Special characters other than .,-[]()& are not allowed.',
    ),
  price: Yup.number()
    .max(999.99, 'Price must be less than RM1000')
    .required('This field is required.'),
  isAvailable: Yup.boolean().required('This field is required.'),
  rank: Yup.number().max(999, 'Rank must be less than 1000').required('This field is required.'),
  maxQuantity: Yup.number()
    .max(99, 'Max quantity must be less than 100')
    .positive('Max quantity must be a positive number')
    .integer('Max quantity cannot have a decimal value')
    .required('This field is required.'),
});

export const OPERATING_HOURS_SCHEMA = Yup.array(
  Yup.object().shape({
    day: Yup.number().min(0).max(6).integer(),
    timeSlots: Yup.array(
      Yup.object().shape({
        from: Yup.number()
          .typeError('Invalid time')
          .min(0)
          .max(MIDNIGHT_MINUTES + 1)
          .required("'From' time must be set"),
        to: Yup.number()
          .typeError('Invalid time')
          .min(0)
          .max(MIDNIGHT_MINUTES + 1)
          .moreThan(Yup.ref('from'), "'To' time must be after 'From' time")
          .required("'To' time must be set"),
      }),
    ),
  }),
);

export const STATION_SCHEMA = Yup.object().shape(
  {
    name: Yup.string()
      .required()
      .max(100)
      .matches(
        /^[a-zA-Z0-9\.\,\(\)\[\]\s\&\-]+$/,
        'Special characters other than .,-[]()& are not allowed.',
      ),
    stationId: Yup.string().required(),
    merchantId: Yup.string().when(['pdbMerchantId', 'isMesra'], {
      is: (pdbMerchantId, isMesra) =>
        isMesra ? !pdbMerchantId || pdbMerchantId.length === 0 : true,
      then: Yup.string().when('isMesra', {
        is: true,
        then: Yup.string().required('merchantId or pdbMerchantId is a required field'),
        otherwise: Yup.string().required(),
      }),
      otherwise: Yup.string(),
    }),
    pdbMerchantId: Yup.string().when('merchantId', {
      is: (merchantId) => !merchantId || merchantId.length === 0,
      then: Yup.string().required('merchantId or pdbMerchantId is a required field'),
      otherwise: Yup.string(),
    }),
    status: Yup.string().required().oneOf(Object.values(StoresStatusesEnum)),
  },
  [['merchantId', 'pdbMerchantId']],
);
