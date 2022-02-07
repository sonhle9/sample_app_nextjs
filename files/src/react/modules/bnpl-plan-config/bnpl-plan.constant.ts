import {BadgeProps, OptionsOrGroups, titleCase} from '@setel/portal-ui';
import {
  PlanType,
  Country,
  Currency,
  PlanStatus,
  PlanStructure,
} from 'src/react/modules/bnpl-plan-config/bnpl.enum';

export const INSTRUCTION_QUANTITES_OPTIONS: OptionsOrGroups<string> = [
  {
    label: '2',
    value: '2',
  },
  {
    label: '3',
    value: '3',
  },
  {
    label: '4',
    value: '4',
  },
];

export const planTypeOptions = Object.values(PlanType).map((value) => ({
  value,
  label: titleCase(value),
}));

export const currencyOptions = Object.values(Currency).map((value) => ({
  value,
  label: value,
}));

export const countryOptions = Object.values(Country).map((value) => ({
  value,
  label: titleCase(Object.keys(Country)[Object.values(Country).indexOf(value)]),
}));

export const statusOptions = Object.values(PlanStatus).map((value) => ({
  value,
  label: titleCase(value),
}));

export const planStructureOptions = Object.values(PlanStructure).map((value) => ({
  value,
  label: titleCase(value),
}));

export const amountOptions = [
  {
    label: 'RM0 to RM1000',
    value: '0,1000',
  },
  {
    label: 'RM1001 to RM3000',
    value: '1001,3000',
  },
  {
    label: 'RM3001 to RM5000',
    value: '3001,5000',
  },
];

export const planStructureOptionsDetailModal = [
  {
    label: titleCase(PlanStructure.INSTRUCTION),
    value: PlanStructure.INSTRUCTION,
    disabled: false,
  },
  {
    label: titleCase(PlanStructure.POSTPAID),
    value: PlanStructure.POSTPAID,
    disabled: true,
  },
];

export const statusColor: Record<PlanStatus, BadgeProps['color']> = {
  [PlanStatus.ACTIVE]: 'success',
  [PlanStatus.INACTIVE]: 'error',
};
