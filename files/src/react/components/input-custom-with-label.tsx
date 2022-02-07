import * as React from 'react';
import {TextInput} from '@setel/portal-ui';
import cx from 'classnames';

export enum LabelPosition {
  LEFT,
  RIGHT,
}

interface MoneyInputCustomProps {
  label?: string;
  value?: string;
  type?: string;
  disabled?: boolean;
  onChangeValue: (newValue: string) => void;
  labelPosition?: LabelPosition;
}

export function InputCustomWithLabel(props: MoneyInputCustomProps) {
  const isLeftLabelPosition = props.labelPosition === LabelPosition.LEFT;
  return (
    <div className="relative w-32">
      <div
        className={cx(
          'absolute inset-y-0 text-mediumgrey inline-flex items-center',
          isLeftLabelPosition ? 'left-0 pl-3' : 'right-0 pr-3',
        )}>
        {props.label}
      </div>
      <TextInput
        className={cx(isLeftLabelPosition ? 'text-right pl-11' : 'pr-11 text-left')}
        value={props.value}
        onChangeValue={props.onChangeValue}
        maxLength={16}
        type={props.type}
        disabled={props.disabled}
      />
    </div>
  );
}

export const formatMoneyCustom = (val) => {
  const negative = val[0] === '-' ? '-' : '';
  val = val.replaceAll(/[^0-9.]/g, '');
  let arrVal = val.split('.');
  const arrValLength = arrVal.length;
  let newVal;
  if (arrValLength === 1) {
    newVal = arrVal[0];
  } else {
    arrVal = arrVal.slice(0, 2);
    arrVal[1] = arrVal[1].slice(0, 2);
    newVal = `${arrVal[0]}.${arrVal[1]}`;
  }
  return `${negative}${newVal.toString()}`;
};
