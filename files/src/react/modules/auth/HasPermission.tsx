import * as React from 'react';
import {AuthContext} from './auth.context';

export const useHasPermission = (accessWith: string[]) => {
  const {permissions} = React.useContext(AuthContext);
  return accessWith.some((requiredAccess) => permissions?.includes(requiredAccess));
};

export const HasPermission: React.FC<{accessWith: string[]}> = ({accessWith, children}) => {
  const hasPermission = useHasPermission(accessWith);
  if (!hasPermission) {
    return null;
  }
  return <>{children}</>;
};
