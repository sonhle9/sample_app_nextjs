import React from 'react';
import {CheckInCircleIcon} from '@setel/portal-ui';
import cx from 'classnames';

type Step = {
  label: string;
};

export const ProgressStepByStep = (props: {stepIndex: number; steps: Step[]}) => {
  const stepIndex = props.stepIndex - 1;
  return (
    <div>
      <div className={'relative flex gap-x-2'}>
        {props.steps.map((step, index) => {
          return (
            <div
              className={cx(
                'flex-1 border-b-4 py-3',
                index > stepIndex
                  ? ''
                  : index < stepIndex
                  ? 'border-brand-500'
                  : 'border-brand-100',
              )}
              key={index}>
              <p
                style={stepIndex === index ? {} : {color: '#8E98A5'}}
                className={cx(
                  'text-xs font-bold leading-5',
                  stepIndex === index ? 'text-mediumgrey' : '',
                )}>
                STEP {index + 1}
              </p>
              <p>
                <span
                  className={cx(
                    index < stepIndex
                      ? 'text-mediumgrey font-medium'
                      : index > stepIndex
                      ? 'text-lightgrey font-medium'
                      : 'text-black font-medium',
                  )}>
                  {step.label}
                </span>
                {index < stepIndex && (
                  <CheckInCircleIcon className={'w-5 h-5 float-right text-brand-500'} />
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
