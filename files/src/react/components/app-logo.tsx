import cx from 'classnames';
import * as React from 'react';

export const AppLogo = (props: React.ComponentProps<'img'>) => (
  <img
    {...props}
    src="/assets/images/app-logo.svg"
    alt="Setel Logo"
    className={cx('w-16', props.className)}
  />
);
