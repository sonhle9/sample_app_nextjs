import * as React from 'react';
import {FieldContainer, FieldStatus} from '@setel/portal-ui';
import {Field, FieldProps} from 'formik';
import {IDistribution} from '../types';
import {getFullDistributions} from '../const';
import {PercentInput, StaticPercentInput} from './percent-input';
import * as lodash from 'lodash';

interface IVariableTargetingOnVariationProps {
  variantKeys: string[];
  errors: any;
  touched: any;
}

export function VariablePercentageRollout({
  variantKeys,
  errors,
  touched,
  ...props
}: IVariableTargetingOnVariationProps & {[x: string]: any}) {
  return (
    <>
      <Field {...props}>
        {({field}: FieldProps<IDistribution[]>) => {
          const distributions = getFullDistributions(field.value, variantKeys);
          const getHelpProps = (name: string) => {
            return errors[name] ? {helpText: errors[name]} : {helpText: ' '};
          };
          const getStatusProps = (name: string) => {
            // To support simple and array fields
            const n = name.split('.')[0];
            return errors[name] ? {status: touched[n] ? ('error' as FieldStatus) : null} : {};
          };
          return (
            <>
              {distributions.map((distribution, i) => (
                <div key={i} className="grid grid-cols-2 mb-5">
                  <div className="my-auto">
                    <p className="text-gray-600 text-sm">{distribution.variantKey}</p>
                  </div>
                  <div>
                    <PercentInput
                      initialValue={distribution.percent}
                      onBlur={() => field.onBlur({target: {name: field.name}})}
                      onChangeValue={(newValue) => {
                        field.onChange({
                          target: {
                            name: field.name,
                            value: [
                              ...distributions.slice(0, i),
                              {...distribution, percent: newValue},
                              ...distributions.slice(i + 1),
                            ],
                          },
                        });
                      }}
                      data-testid={`input-onVariation-${i}`}
                    />
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-2">
                <div className="mt-3">
                  <p className="text-gray-600 text-sm">Total</p>
                </div>
                <div className="-mb-5">
                  <FieldContainer {...getHelpProps(props.name)} {...getStatusProps(props.name)}>
                    <StaticPercentInput
                      disabled
                      value={lodash.sum(field.value.map((distribution) => distribution.percent))}
                    />
                  </FieldContainer>
                </div>
              </div>
            </>
          );
        }}
      </Field>
    </>
  );
}
