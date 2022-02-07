import cx from 'classnames';
import * as React from 'react';
import {TextInput} from '@setel/portal-ui';

export function PercentInput({
  initialValue,
  onChangeValue,
  ...props
}: {initialValue: number; onChangeValue: (newValue: number) => void} & {[x: string]: any}) {
  const [value, setValue] = React.useState(initialValue === undefined ? 0 : initialValue);
  return (
    <StaticPercentInput
      {...props}
      value={value}
      onChangeValue={(newValue) => {
        setValue(newValue);
        if (newValue && newValue.match(/^\d*$/)) {
          onChangeValue(parseInt(newValue, 10));
        } else {
          onChangeValue(NaN);
        }
      }}
    />
  );
}

export function StaticPercentInput({
  value,
  className,
  ...props
}: {value: number; className?: string} & {[x: string]: any}) {
  return (
    <div className={cx('relative', className)}>
      <TextInput
        {...props}
        className="pr-9"
        value={Number.isNaN(value) ? 'N/A' : value.toString()}
      />
      <div className="absolute inset-y-0 right-0 flex items-center px-3">%</div>
    </div>
  );
}
