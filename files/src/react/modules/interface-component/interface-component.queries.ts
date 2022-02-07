import {useMutation, useQuery, useQueryClient} from 'react-query';
import {createOrUpdateAppSettings, getAppSettings} from 'src/react/services/api-variables.service';

const interfaceComponentQueryKeys = {
  details: 'interfaceComponentDetails',
};

export const useInterfaceComponentDetails = () =>
  useQuery([interfaceComponentQueryKeys.details], () => getAppSettings());

export const useCreateOrUpdateInterfaceComponent = () => {
  const queryClient = useQueryClient();
  return useMutation(createOrUpdateAppSettings, {
    onSuccess: () => queryClient.invalidateQueries(interfaceComponentQueryKeys.details),
  });
};
