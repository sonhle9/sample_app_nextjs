import * as React from 'react';
import {ISession, ISessionData} from 'src/shared/interfaces/auth.interface';

export type AuthState = {
  permissions: string[];
  roles: string[];
  session: ISessionData | null;
  sessionPayload: ISession | null;
};

export const AuthContext = React.createContext<AuthState>({
  permissions: [],
  roles: [],
  session: null,
  sessionPayload: null,
});
AuthContext.displayName = 'AuthContext';

export const useAuth = () => React.useContext(AuthContext);
