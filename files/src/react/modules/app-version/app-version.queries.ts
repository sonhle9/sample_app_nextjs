import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  createMobileVersion,
  deleteMobileVersion,
  getMobileVersion,
  updateMobileVersion,
} from 'src/react/services/api-maintenance.service';
import {IMobileVersion, IMobileVersionPayload} from 'src/shared/interfaces/version.interface';

export const appVersionQueryKeys = {
  list: 'listAppVersions',
  details: 'appVersionDetails',
};

export const useAppVersionDetails = (id: string) => {
  const queryClient = useQueryClient();
  return useQuery([appVersionQueryKeys.details, id], () => getMobileVersion(id), {
    placeholderData: () =>
      queryClient
        .getQueryData<{
          data: Array<IMobileVersion>;
        }>([appVersionQueryKeys.list], {
          exact: false,
        })
        ?.data.find((version) => version.id === id),
  });
};

export const useCreateAppVersion = () => {
  const queryClient = useQueryClient();

  return useMutation(createMobileVersion, {
    onSuccess: () => queryClient.invalidateQueries(appVersionQueryKeys.list),
  });
};

export const useUpdateAppVersion = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation((payload: IMobileVersionPayload) => updateMobileVersion(id, payload), {
    onSuccess: (result) => {
      queryClient.setQueryData([appVersionQueryKeys.details, id], result);
      queryClient.invalidateQueries(appVersionQueryKeys.list);
    },
  });
};

export const useDeleteAppVersion = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation(() => deleteMobileVersion(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(appVersionQueryKeys.list);
    },
  });
};
