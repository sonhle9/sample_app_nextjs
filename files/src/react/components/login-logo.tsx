import cx from 'classnames';
import * as React from 'react';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';

const {LogoComponent, displayName} = CURRENT_ENTERPRISE;
export const LoginLogo = (props: {className?: string}) => {
  return (
    <React.Fragment>
      <LogoComponent className={cx('w-16', props.className)} />
      <h1 className="text-mediumgrey text-2xl font-bold text-center my-4">{displayName}</h1>
    </React.Fragment>
  );
};
