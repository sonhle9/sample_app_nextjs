import * as React from 'react';
import {FieldInputProps} from 'formik';
import {IDistribution} from '../types';
import {Dropdown} from './dropdown';

interface IVariableTargetingOnVariationProps {
  field: FieldInputProps<IDistribution[]>;
  variantKeys: string[];
  setFieldValue?: (name: string, newValue: any) => void;
}

export function VariableTargetingOnVariationField({
  field,
  variantKeys,
  setFieldValue,
  ...props
}: IVariableTargetingOnVariationProps & {[x: string]: any}) {
  return (
    <Dropdown
      {...props}
      options={getOnVariationOptions(variantKeys)}
      value={getOnVariationId(field.value)}
      onChangeValue={async (newValue, label) => {
        if (setFieldValue) {
          await setFieldValue('offVariation', variantKeys[0]);
        }
        field.onChange({
          target: {
            name: field.name,
            value:
              newValue === 'multiple'
                ? variantKeys.map((variantKey) => ({
                    variantKey,
                    percent: 0,
                  }))
                : [{variantKey: label, percent: 100}],
          },
        });
      }}
    />
  );
}

function getOnVariationOptions(variantKeys: string[]): {value: string; label: string}[] {
  return [
    ...(variantKeys.length > 1 ? [{value: 'multiple', label: 'Percentage rollout'}] : []),
    ...variantKeys.map((variantKey) => ({value: `single:${variantKey}`, label: variantKey})),
  ];
}

function getOnVariationId(onVariation: IDistribution[]): string {
  if (!onVariation || onVariation.length === 0) {
    return null;
  } else if (onVariation.length === 1) {
    return `single:${onVariation[0].variantKey}`;
  } else {
    return 'multiple';
  }
}

export function getOnVariationLabel(onVariation: IDistribution[]): string {
  if (!onVariation || onVariation.length === 0) {
    return '';
  } else if (onVariation.length === 1) {
    return onVariation[0].variantKey;
  } else {
    return 'Percentage rollout';
  }
}
