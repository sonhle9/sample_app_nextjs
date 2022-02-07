import {
  IAdminUser,
  IAdminUserApiResponse,
  IAdminUsersRequest,
  IMutationAdminUser,
  IUserGroup,
} from './admin-users.type';
import {apiClient} from '../../lib/ajax';
import {environment} from '../../../environments/environment';

export const getAdminUsers = (req: IAdminUsersRequest = {}) => {
  return apiClient
    .get<IAdminUserApiResponse>(
      `${environment.opsApiBaseUrl}/api/ops/admin/admin-users?perPage=${req.perPage || 15}&page=${
        req.page || 1
      }&sortDate=${req.sortDate || 'desc'}`,
    )
    .then((res) => {
      if (res && res.data && res.headers) {
        const {total: totalDocs, perPage, page} = res.data.pagination;
        const totalPages = Math.ceil(Math.floor(totalDocs / perPage));

        return {
          users: (res.data.data || []).map((u) => ({
            ...u,
            name: u.fullName || '',
            accessNames: u.accesses?.join(', '),
          })),
          totalDocs,
          totalPages,
          perPage,
          page,
        };
      }
      return null;
    });
};

export const getAdminUserDetail = (userId: string): Promise<IAdminUser> => {
  return apiClient
    .get<IAdminUser>(`${environment.opsApiBaseUrl}/api/ops/admin/admin-users/${userId}`)
    .then((res) => {
      return {
        ...res.data,
        name: res.data?.fullName || '',
        accessNames: res.data?.accesses?.map((access) => access.name).join(', '),
      };
    });
};

export const createAdminUser = (adminUser: IMutationAdminUser) => {
  return apiClient
    .post<IMutationAdminUser>(`${environment.opsApiBaseUrl}/api/ops/admin/admin-users`, {
      email: adminUser.email,
      fullName: adminUser.name,
      password: adminUser.password,
      accessIds: adminUser.accessIds,
    })
    .then((res) => res.data);
};

export const updateAdminUser = (adminUser: IMutationAdminUser) => {
  return apiClient
    .put<IMutationAdminUser>(
      `${environment.opsApiBaseUrl}/api/ops/admin/admin-users/${adminUser.id}`,
      {
        method: 'PUT',
        fullName: adminUser.name,
        accessIds: adminUser.accessIds,
      },
    )
    .then((res) => res.data);
};

export const getAdminUserGroups = () => {
  return apiClient
    .get<IUserGroup[]>(`${environment.opsApiBaseUrl}/api/ops/admin/groups`)
    .then((res) => {
      return res.data.map((group) => ({
        label: group.name,
        value: group.id,
      }));
    });
};

export const deleteAdminUser = (userId: string): Promise<IAdminUser> => {
  return apiClient
    .delete<IAdminUser>(`${environment.opsApiBaseUrl}/api/ops/admin/admin-users/${userId}`)
    .then((res) => res.data);
};

export const MIN_PASSWORD_LENGTH = 14;

export function validatePassword(str: string): boolean {
  const isContainUpperCase = /[A-Z]/.test(str);
  const isContainsLowerCase = /[a-z]/.test(str);
  const isContainsNumber = /[0-9]/.test(str);
  const isContainsSpecialCharacter = /[!#$%&'()*+,-./:;<=>?@[\]^_{|}~]/.test(str);

  const isValidString = str?.length >= MIN_PASSWORD_LENGTH;

  return (
    isValidString &&
    isContainUpperCase &&
    isContainsLowerCase &&
    isContainsNumber &&
    isContainsSpecialCharacter
  );
}
