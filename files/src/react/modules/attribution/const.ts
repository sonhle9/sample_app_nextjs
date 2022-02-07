import * as Yup from 'yup';
import _keyBy from 'lodash/keyBy';
import {
  AttributionRuleMetadata,
  AttributionRuleReferenceSource,
  AttributionRuleType,
  IAttributionRule,
} from './types';

export const ATTR_RULE_TYPE_LABELS: Record<AttributionRuleType, string> = {
  [AttributionRuleType.ACCOUNT_REGISTRATION]: 'Account registration',
};

export const ATTR_RULE_SOURCE_LABELS: Record<AttributionRuleReferenceSource, string> = {
  [AttributionRuleReferenceSource.REFERRER_CODE]: 'Referrer code',
  [AttributionRuleReferenceSource.REWARD_CAMPAIGN]: 'Reward campaign',
  [AttributionRuleReferenceSource.VOUCHER_BATCH]: 'Voucher batch',
};

export const ATTR_RULE_METADATA_LABELS: Record<AttributionRuleMetadata, string> = {
  [AttributionRuleMetadata.NETWORK]: 'attribution network',
  [AttributionRuleMetadata.CHANNEL]: 'attribution channel',
  [AttributionRuleMetadata.CAMPAIGN]: 'attribution campaign',
};

export const ATTR_RULE_INIT_VALUE: IAttributionRule = {
  type: '',
  referenceSource: '',
  referenceId: '',
  metadata: [
    {
      key: AttributionRuleMetadata.NETWORK,
      value: '',
    },
    {
      key: AttributionRuleMetadata.CHANNEL,
      value: '',
    },
    {
      key: AttributionRuleMetadata.CAMPAIGN,
      value: '',
    },
  ],
};

export function findLabel(value: string, key: 'type' | 'referenceSource' | string): string {
  let result = '';
  switch (key) {
    case 'type':
      result = ATTR_RULE_TYPE_LABELS[value];
      break;
    case 'referenceSource':
      result = ATTR_RULE_SOURCE_LABELS[value];
      break;
    default:
      break;
  }
  if (!result) {
    result = value;
  }
  return result;
}

export const ATTR_RULE_SCHEMA = Yup.object().shape({
  type: Yup.string().required('This field is required.'),
  referenceSource: Yup.string().required('This field is required.'),
  referenceName: Yup.string(),
  referenceId: Yup.string().required('This field is required.'),
  metadata: Yup.array().of(
    Yup.object().shape({
      key: Yup.string().required(),
      value: Yup.string().required('This field is required.'),
    }),
  ),
});
