import * as yup from 'yup';
import {TerminalType} from './terminals.constant';

export const TerminalSchema = yup.object().shape({
  terminalId: yup.string().required(),
  status: yup.string().required(),
  type: yup.string().oneOf(TerminalType).required(),
  serialNumber: yup.string().required(),
  modelTerminal: yup.string().required(),
  merchantId: yup.string().required(),
  remarks: yup.string(),
  deploymentDate: yup.date().required(),
});

export const ReplacementSchema = yup.object().shape({
  oldTerminalId: yup.string().required(),
  replacedTerminalId: yup.string().required(),
  merchantId: yup.string().required(),
  replacementDate: yup.date().required(),
  reason: yup.string().required(),
});

export const AcquirerSchema = yup.object().shape({
  tid: yup
    .string()
    .required('Tid is required')
    .max(8, 'TID only contains maximum 8 characters')
    .matches(/^[a-zA-Z0-9]+$/, 'TID only contains alphanumeric character'),
  mid: yup
    .string()
    .required('Mid is required')
    .max(15, 'MID only contains maximum 15 characters')
    .matches(/^[a-zA-Z0-9]+$/, 'MID only contains alphanumeric characters'),
  acquirerType: yup.string().required('Acquirer Type is required'),
  cardBrands: yup.array().required('Card Brand is required').min(1),
});
