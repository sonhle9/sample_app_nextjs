import {IamNamespaces} from '../enums/enterprise.enum';

export interface ILoginResponse {
  require2Fa: false;
  accessToken: string;
  expiresIn: number;
  refreshToken: number;
  authenticityToken?: string;
  resetPasswordToken?: string;
  passwordExpiresIn?: number;
}

export interface I2FALoginResponse {
  require2Fa?: true;
  authenticityToken?: string;
  resetPasswordToken?: string;
  passwordExpiresIn?: number;
}

export interface I2FALoginInput {
  authenticityToken: string;
  otp: string;
  identifier: string;
}

export interface ISession {
  email: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  preferred_username?: string;
  username: string;
}

export interface IAccessRoles {
  roles: string[];
}

export interface IResourceAccess {
  'setel-ops': IAccessRoles;
}

export interface ISessionData {
  resource_access: IResourceAccess;
  preferred_username: string;
  name: string;
  email: string;
  sub: string;
  namespace: IamNamespaces;
  issuer: string;
  iat: number;
  exp: number;
}
