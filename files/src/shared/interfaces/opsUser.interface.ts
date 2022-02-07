export interface IOpsUser {
  id?: string;
  email?: string;
  emailVerified?: boolean;
  disabled?: boolean;
  firstName?: string;
  lastName?: string;
  username?: string;
  groups?: string[];
  attributes?: any;
  credentials?: any[];
  access?: any;
  disableableCredentialTypes?: any;
  createdTimestamp?: number;
  notBefore?: number;
  requiredActions?: any;
  totp?: boolean;
}

export interface ICredentialRepresentation {
  value?: string;
  type?: string;
  temporary?: boolean;
}

export interface IAdminRole {
  hasUserMenu: boolean;
  hasUserRead: boolean;
  hasUserIndex: boolean;
  hasUserSearch: boolean;
  hasUserAdd: boolean;
  hasUserEdit: boolean;
}

export interface IOpsGroups {
  id?: string;
  name?: string;
  path?: string;
  subGroups?: any[];
}

export interface IUserRepresentation {
  id?: string;
  createdTimestamp?: number;
  username?: string;
  enabled?: boolean;
  totp?: boolean;
  emailVerified?: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
  disableableCredentialTypes?: any;
  requiredActions?: any;
  notBefore?: number;
}

export interface IPermission {
  id: string;
  name: string;
  role: string;
  service?: string;
}
