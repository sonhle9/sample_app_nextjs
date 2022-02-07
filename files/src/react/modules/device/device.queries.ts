import {pick} from '@setel/portal-ui';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  createMerchantDevice,
  getMerchantDevice,
  updateMerchantDevice,
  UpdateMerchantDeviceInput,
} from 'src/react/services/api-merchants.service';

export const deviceCacheKeys = {
  listDevices: 'listMerchantDevices',
  deviceDetails: 'merchantDeviceDetails',
};

export const useDeviceDetails = (id: string) =>
  useQuery([deviceCacheKeys.deviceDetails, id], () => getMerchantDevice(id));

export const useCreateDeviceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(createMerchantDevice, {
    onSuccess: () => queryClient.invalidateQueries(deviceCacheKeys.listDevices),
  });
};

export const useUpdateDeviceMutation = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    (input: Omit<UpdateMerchantDeviceInput, 'id'>) =>
      updateMerchantDevice({
        ...pick(input, ['merchantMerchantIds', 'modelDevice', 'serialNo', 'status']),
        id,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(deviceCacheKeys.listDevices);
        queryClient.invalidateQueries([deviceCacheKeys.deviceDetails, id]);
      },
    },
  );
};
