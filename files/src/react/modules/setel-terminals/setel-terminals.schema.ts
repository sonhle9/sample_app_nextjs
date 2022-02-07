import * as yup from 'yup';
import {
  EditTerminalStatus,
  SetelTerminalErrorMessage,
  TerminalStatus,
} from './setel-terminals.const';

export const SetelTerminalSchema = yup.object().shape({
  serialNum: yup.string().required(),
  merchantId: yup.string().required(),
  remarks: yup.string(),
});

export const TerminalSerialNumbersSchema = yup.object().shape({
  serialNum: yup.array().of(yup.string().required()).min(1),
});

export const IsAlphanumericSchema = yup
  .string()
  .matches(/^[a-zA-Z0-9\.]*$/, SetelTerminalErrorMessage.SERIAL_NUM_ALPHANUMERIC);

export const editTerminalSerialNumberSchema = yup
  .string()
  .required('Serial number is required.')
  .concat(IsAlphanumericSchema);

export const EditTerminalSchema = yup.object().shape({
  status: yup.mixed().oneOf(Object.values(TerminalStatus)),
  remarks: yup.string(),
  reason: yup.string().when('status', {
    is: (status) => EditTerminalStatus.includes(status),
    then: yup.string().required(),
    otherwise: yup.string(),
  }),
});

export const PasscodeSchema = yup
  .string()
  .required('Required field')
  .matches(/^[0-9]+$/, 'Passcode must be only digits')
  .min(6, 'Passcode must be 6 digits')
  .max(6, 'Passcode must be 6 digits');

export const EditPasscodeManagementSchema = yup.object().shape({
  merchantPass: yup.object().shape({
    isEnabled: yup.boolean().required(),
    value: PasscodeSchema,
  }),
  adminPass: PasscodeSchema,
});

export const validationAddHostSchema = yup.object().shape({
  acquirerType: yup.string().required('Acquirer type is required'),
  cardBrand: yup.array().required('Card brand is required'),
  merchantId: yup
    .string()
    .required('MID is required')
    .matches(/^[A-Za-z0-9]+$/, 'MID must be alphanumeric')
    .max(15, 'MID must be less than or equal to 15 digits'),
  terminalId: yup
    .string()
    .required('TID is required')
    .matches(/^[A-Za-z0-9]+$/, 'TID must be alphanumeric')
    .max(8, 'TID must be less than or equal to 8 digits'),
});

export const validationEditHostSchema = yup.object().shape({
  cardBrand: yup.array().required('Card brand is required'),
  merchantId: yup
    .string()
    .required('MID is required')
    .matches(/^[A-Za-z0-9]+$/, 'MID must be alphanumeric')
    .max(15, 'MID must be less than or equal to 15 digits'),
  terminalId: yup
    .string()
    .required('TID is required')
    .matches(/^[A-Za-z0-9]+$/, 'TID must be alphanumeric')
    .max(8, 'TID must be less than or equal to 8 digits'),
  isEnabled: yup.boolean(),
});
