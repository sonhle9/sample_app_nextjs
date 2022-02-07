import {Pagination} from '../../../shared/interfaces/pagination.interface';
import {MIN_PASSWORD_LENGTH} from './admin-users.service';

interface IRequest {
  perPage?: number;
  page?: number;
  sortDate?: 'asc' | 'desc';
}

export interface IAdminUsersRequest extends IRequest {
  keyWord?: string;
}

export interface IUserGroup {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  default?: boolean;
}

export interface IUserGroupApiResponse {
  data: IUserGroup[];
}

export interface IMutationAdminUser {
  id?: string;
  email: string;
  name: string;
  password?: string;
  accessIds?: string[];
}

export interface IAdminUser {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  name?: string;
  groups?: IUserGroup[];
  disabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
  accesses?: IUserGroup[];
  accessNames?: string;
  fullName?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAdminUserPagination extends Pagination {}

export interface IAdminUserApiResponse {
  pagination: IAdminUserPagination;
  data: IAdminUser[];
}

export enum RegexEnum {
  password = '((?=.*[0-9])(?=.*[A-Z])(?!.*[~`<>()|+#{}?!@$%^&*-]).{8,32})',
}

export const ValidateMessage = {
  name: 'Name cannot be empty',
  email: 'Email cannot be empty',
  password: `Password must be at least ${MIN_PASSWORD_LENGTH} characters, contain uppercase letters, lowercase letters, numbers and special characters.`,
  access: 'Access cannot be empty',
};
