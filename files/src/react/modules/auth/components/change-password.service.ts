import {ajax} from '../../../lib/ajax';
import {environment} from '../../../../environments/environment';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {IUpdatePasswordInput} from './change-password.queries';

export function putUserPassword({
  userId,
  oldPassword,
  newPassword,
}: IUpdatePasswordInput): Promise<void> {
  const options = {
    headers: {namespace: CURRENT_ENTERPRISE.adminNamespace},
    'Content-Type': 'application/json',
  };
  return ajax
    .put(
      `${environment.iamApiBaseUrl}/api/ops/users/${userId}/password`,
      {oldPassword, newPassword},
      options,
    )
    .catch((e) => {
      throw new Error(e.response?.data.message);
    });
}
