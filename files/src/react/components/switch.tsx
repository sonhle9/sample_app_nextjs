import {Field, Label, Toggle, ToggleProps} from '@setel/portal-ui';
import cx from 'classnames';
import * as React from 'react';

export type SwitchProps = ToggleProps & {
  label: React.ReactNode;
  wrapperClass?: string;
};

export const Switch = ({wrapperClass, label, ...props}: SwitchProps) => {
  return (
    <Field className={cx('flex items-center justify-between py-2', wrapperClass)}>
      <Label size="normal" className="mb-0">
        {label}
      </Label>
      <Toggle {...props} />
    </Field>
  );
};
