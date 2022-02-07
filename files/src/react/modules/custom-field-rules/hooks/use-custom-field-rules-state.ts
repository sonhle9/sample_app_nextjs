import {isDefined} from '@setel/portal-ui';
import * as React from 'react';
import {FIELD_VALUE_TYPE, ICustomFieldRule, VALIDATION_TYPE} from '../custom-field-rules.type';

export const useCustomFieldRulesState = (rules: Array<ICustomFieldRule> = []) => {
  const [state, dispatch] = React.useReducer(customFieldRulesReducer, rules, (initialRules) =>
    customFieldRulesReducer(baseState, {
      type: 'init',
      rules: initialRules,
    }),
  );

  const setFieldValue = React.useCallback(
    (fieldId: string, value: string | Array<string>) =>
      dispatch({
        type: 'setValue',
        fieldId,
        value,
      }),
    [],
  );

  return {
    rules,
    values: state.values,
    reinitialize: (newRules: Array<ICustomFieldRule>) =>
      dispatch({
        type: 'init',
        rules: newRules,
      }),
    get errors() {
      return computeErrors(state, rules);
    },
    get isValid() {
      return Object.keys(computeErrors(state, rules)).length === 0;
    },
    setFieldValue,
    setFieldValueCurry: (fieldId: string) => (value: string | Array<string>) =>
      setFieldValue(fieldId, value),
  };
};

export interface CustomFieldRulesState {
  values: {[fieldId: string]: string | Array<string>};
}

const baseState: CustomFieldRulesState = {
  values: {},
};

type CustomFieldRulesAction =
  | {
      type: 'init';
      rules: Array<ICustomFieldRule>;
    }
  | {
      type: 'setValue';
      fieldId: string;
      value: string | Array<string>;
    };

const computeErrors = (
  state: CustomFieldRulesState,
  rules: Array<ICustomFieldRule>,
): {[fieldId: string]: string | undefined} => {
  const result: {[fieldId: string]: string | undefined} = {};

  rules.forEach((rule) => {
    if (rule.validations && rule.validations.length > 0) {
      const value = state.values[rule.id];
      for (const validation of rule.validations) {
        if (validation === VALIDATION_TYPE.ONLY_NUMERIC) {
          if (!/^(\d)*$/.test(value as string)) {
            result[rule.id] = 'Allow only numeric';
            break;
          }
        } else if (validation === VALIDATION_TYPE.ALPHA_NUMERIC) {
          if (!/^[a-z0-9]*$/.test(value as string)) {
            result[rule.id] = 'Allow only alphanumeric';
            break;
          }
        }
      }
    }
  });

  return result;
};

const customFieldRulesReducer = (
  state: CustomFieldRulesState,
  action: CustomFieldRulesAction,
): CustomFieldRulesState => {
  switch (action.type) {
    case 'init':
      return {
        ...state,
        values: action.rules.reduce<CustomFieldRulesState['values']>((result, rule) => {
          const currentValue = state.values[rule.id];
          if (isDefined(currentValue)) {
            return {
              ...result,
              [rule.id]: currentValue,
            };
          }

          return {
            ...result,
            [rule.id]: (function getDefaultValue() {
              if (rule.fieldValueType === FIELD_VALUE_TYPE.CHECKBOX) {
                if (
                  !rule.fieldValueDefault ||
                  rule.fieldValueDefault === '-' ||
                  !rule.valueOptions?.includes(rule.fieldValueDefault)
                ) {
                  return [];
                }
                return [rule.fieldValueDefault];
              }

              if (
                !rule.fieldValueDefault ||
                rule.fieldValueDefault === '-' ||
                (rule.fieldValueType === FIELD_VALUE_TYPE.DROPDOWN &&
                  !rule.valueOptions?.includes(rule.fieldValueDefault))
              ) {
                return '';
              }
              return rule.fieldValueDefault;
            })(),
          };
        }, {}),
      };

    case 'setValue':
      return {
        ...state,
        values: {
          ...state.values,
          [action.fieldId]: action.value,
        },
      };

    default:
      return state;
  }
};
