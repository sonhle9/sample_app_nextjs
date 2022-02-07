import {environment} from '../../../environments/environment';
import {apiClientWithoutAuth} from '../../lib/ajax';

export enum PasswordFormReasonEnum {
  POOR_PASSWORD = 'pp',
  USER_RESET_PASSWORD = 'urp',
  SETEL_ADMIN_RESET_PASSWORD = 'sarp',
  PASSWORD_ALMOST_EXPIRED = 'pae',
  PASSWORD_EXPIRED = 'pe',
}

export const forgotPassword = (email: string, resetPasswordUrl: string, namespace: string) => {
  return apiClientWithoutAuth.post(`${environment.opsApiBaseUrl}/api/ops/auth/forgot-password`, {
    email,
    url: resetPasswordUrl,
    namespace,
  });
};
export const resetPassword = (token: string, password: string, namespace: string) => {
  return apiClientWithoutAuth.post(`${environment.opsApiBaseUrl}/api/ops/auth/reset-password`, {
    token,
    password,
    namespace,
  });
};
