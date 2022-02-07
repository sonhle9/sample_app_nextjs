import {IDistribution, ITarget, IVariable, IVariant, OperatorValueType} from './types';
import * as _ from 'lodash';

export enum VariableType {
  Number = 'number',
  Boolean = 'boolean',
  String = 'string',
  JSON = 'json',
  InterfaceComponent = 'interfaceComponent',
}

export enum VariableState {
  Created = 'created',
  Ready = 'ready',
}

export enum ConstraintOperator {
  In = 'in',
  Equal = 'equal',
  SemVerEqual = 'equal',
  SemVerIn = 'semVerIn',
  SemVerNotIn = 'semVerNotIn',
  SemVerGreaterThan = 'semVerGreaterThan',
  SemVerGreaterThanEqual = 'semVerGreaterThanEqual',
  SemVerLessThan = 'semVerLessThan',
  SemVerLessThanEqual = 'semVerLessThanEqual',
  IsOneOf = 'isOneOf',
  IsNotOneOf = 'isNotOneOf',
  Contains = 'contains',
  DoesNotContains = 'doesNotContains',
}

export const variableTypeDisplayNames: Map<VariableType, string> = new Map([
  [VariableType.Number, 'Number'],
  [VariableType.Boolean, 'Boolean'],
  [VariableType.String, 'String'],
  [VariableType.JSON, 'JSON'],
  // [VariableType.InterfaceComponent, 'Interface component'],
]);

export const variableGroupDisplayNames: Map<string, string> = new Map([
  ['app', 'Setel App: App'],
  ['lite', 'Setel App: Lite App'],
  ['platform', 'Setel App: Platform'],
  ['web', 'Setel Web App: Web App'],
  ['mhelp', 'Setel Help Centre: Web App'],
]);

export function getTargetedUsersByVariant(
  variable: IVariable,
): {variantKey: string; userIds: string[]}[] {
  const userTargets: Map<string, Set<string>> = new Map(
    Object.keys(variable.variants || {}).map((variantKey) => [variantKey, new Set()]),
  );

  (variable.targets || []).forEach((target) => {
    const {variantKey} = target.distributions[0];
    getTargetedUsers(target).forEach((userId) => userTargets.get(variantKey).add(userId));
  });

  return Array.from(userTargets).map(([variantKey, userIds]) => ({
    variantKey,
    userIds: Array.from(userIds),
  }));
}

function getTargetedUsers(target: ITarget): Set<string> {
  const userIds: string[] = [];

  target.constraints.forEach((constraint) => {
    if (constraint.property === 'userId') {
      if (constraint.operator === ConstraintOperator.Equal) {
        userIds.push(constraint.value);
      } else if (constraint.operator === ConstraintOperator.In) {
        userIds.push(...Object.keys(constraint.value));
      }
    }
  });

  return new Set(userIds);
}

export function replaceVariant(
  variable: IVariable,
  variantKey: string,
  newVariant: IVariant,
): Partial<IVariable> {
  return {
    variants: Object.fromEntries([
      ...Object.entries(variable.variants).filter(
        ([variantKey2, _variant]) => variantKey2 !== variantKey,
      ),
      [newVariant.key, newVariant],
    ]),
    onVariation: (variable.onVariation || []).map((distribution) => ({
      ...distribution,
      variantKey: distribution.variantKey === variantKey ? newVariant.key : distribution.variantKey,
    })),
    offVariation: variable.offVariation === variantKey ? newVariant.key : variable.offVariation,
    targets: (variable.targets || []).map((target) => ({
      ...target,
      distributions: target.distributions.map((distribution) => ({
        ...distribution,
        variantKey:
          distribution.variantKey === variantKey ? newVariant.key : distribution.variantKey,
      })),
    })),
  };
}

export function removeVariant(variable: IVariable, variantKey: string): Partial<IVariable> {
  return {
    variants: Object.fromEntries(
      Object.entries(variable.variants).filter(
        ([variantKey2, _variant]) => variantKey2 !== variantKey,
      ),
    ),
    onVariation: variable.onVariation ? removeVariantKey(variable.onVariation, variantKey) : null,
    targets: (variable.targets || []).map((target) => ({
      ...target,
      distributions: removeVariantKey(target.distributions, variantKey),
    })),
  };
}

function removeVariantKey(distributions: IDistribution[], variantKey: string) {
  return distributions.filter((distribution) => distribution.variantKey !== variantKey);
}

export function canRemoveVariant(variable: IVariable, variantKey: string): boolean {
  return (
    variable.offVariation !== variantKey &&
    (!variable.onVariation || canRemoveVariantKey(variable.onVariation, variantKey)) &&
    (!variable.targets ||
      variable.targets.every((target) => canRemoveVariantKey(target.distributions, variantKey)))
  );
}

function canRemoveVariantKey(distributions: IDistribution[], variantKey: string) {
  return (
    distributions.length === 0 ||
    _.sum([
      0,
      ...removeVariantKey(distributions, variantKey).map((distribution) => distribution.percent),
    ]) === 100
  );
}

export const variableTargetingDisplayNames: Map<boolean, string> = new Map([
  [false, 'All users'],
  [true, 'Specific users'],
]);

export function getFullDistributions(distributions: IDistribution[], variantKeys): IDistribution[] {
  return variantKeys.map(
    (variantKey) =>
      distributions.find((distribution) => distribution.variantKey === variantKey) || {
        variantKey,
        percent: 0,
      },
  );
}

export function generateMockVariable(params?: Partial<IVariable>): IVariable {
  return {
    key: 'test',
    version: 1,
    isArchived: false,
    name: 'test',
    type: VariableType.String,
    createdAt: 1572355719,
    updatedAt: 1603260224,
    group: 'app',
    isToggled: false,
    createdBy: 'test',
    updatedBy: 'test',
    state: VariableState.Created,
    ...(params || {}),
  };
}

export function getConstraintValues(
  value: string | Record<string, unknown>,
  type: OperatorValueType,
): string[] {
  if (type === 'string') {
    return [value.toString()];
  }

  return Object.keys(value);
}

export function getDefaultValue(valueType: OperatorValueType) {
  if (valueType === 'string') {
    return '';
  }

  return {};
}

export function convertConstraintValue(value, valueType: OperatorValueType) {
  if (valueType === 'string') {
    return value.toString();
  }

  return value.reduce((obj, val) => {
    obj[val] = true;
    return obj;
  }, {});
}

export const defaultOptionTooltip = () => {
  return `Serving default variable option for users
  who didn't match the defined rules, if any`;
};

export const getDefaultOnVariation = (variable: IVariable): IDistribution[] => {
  const variantKey = Object.keys(variable.variants)[0];
  return [{percent: 100, variantKey}];
};
