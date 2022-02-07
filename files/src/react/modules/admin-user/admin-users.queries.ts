import {
  createAdminUser,
  deleteAdminUser,
  getAdminUserDetail,
  getAdminUserGroups,
  getAdminUsers,
  updateAdminUser,
} from './admin-users.service';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {IAdminUser, IMutationAdminUser} from './admin-users.type';

const ADMIN_USERS = 'users';
const ADMIN_USER_DETAILS = 'user_details';
const ADMIN_USER_GROUPS = 'admin_user_groups';

export const useAdminUsers = (filter: Parameters<typeof getAdminUsers>[0]) => {
  return useQuery([ADMIN_USERS, filter], () => getAdminUsers(filter), {
    keepPreviousData: true,
  });
};

export const useAdminUserGroup = () => {
  return useQuery([ADMIN_USER_GROUPS], () => getAdminUserGroups());
};

export const useAdminUserDetails = (userId: string) =>
  useQuery([ADMIN_USERS, userId], () => getAdminUserDetail(userId));

export const useSetAdminUser = (currentAdminUser?: IAdminUser) => {
  const queryClient = useQueryClient();
  return useMutation(
    (adminUser: IMutationAdminUser) =>
      currentAdminUser ? updateAdminUser(adminUser) : createAdminUser(adminUser),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([ADMIN_USERS]);
        if (currentAdminUser) {
          queryClient.invalidateQueries([ADMIN_USER_DETAILS, currentAdminUser.id]);
        }
      },
    },
  );
};

export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation((userId: string) => deleteAdminUser(userId), {
    onSuccess: () => queryClient.invalidateQueries([ADMIN_USERS]),
  });
};
