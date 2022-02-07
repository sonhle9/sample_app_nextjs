import {useMutation} from 'react-query';
import {putUserPassword} from './change-password.service';

export interface IUpdatePasswordInput {
  userId: string;
  oldPassword: string;
  newPassword: string;
}
export const useUpdateUserPassword = (onSuccess: () => void) =>
  useMutation((data: IUpdatePasswordInput) => putUserPassword(data), {onSuccess});
