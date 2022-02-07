import * as React from 'react';
import {IEnterprise} from 'src/shared/enums/enterprise.enum';

export interface ILogoAndEnterpriseNameProps {
  enterprise: IEnterprise;
}

export const LogoAndEnterpriseName = (props: ILogoAndEnterpriseNameProps) => {
  return (
    <React.Fragment>
      <img className="h-10" src={props.enterprise.smallIcon} alt={props.enterprise.displayName} />
      <span className="text-base text-left flex-1 px-2">{props.enterprise.displayName}</span>
    </React.Fragment>
  );
};
