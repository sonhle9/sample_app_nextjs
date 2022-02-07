import * as React from 'react';
import classNames from 'classnames';

export function TextBtn(props: React.ComponentProps<'button'>) {
  const {className, disabled, ...btnProps} = props;
  return (
    <button
      {...btnProps}
      className={classNames(
        className,
        'font-bold bg-transparent text-xs tracking-wider focus:outline-none',
        disabled ? 'text-offwhite' : 'text-brand-500',
      )}
      disabled={disabled}
    />
  );
}
