import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  getAccountDeviceDetails,
  IDeviceBodyUpdate,
  unLinkDevice,
  updateDevice,
} from './account-device.services';

export const useUnlinkDevice = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({deviceId, adminUsername}: {deviceId: string; adminUsername: string}) =>
      unLinkDevice(deviceId, adminUsername),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CACHE_KEYS.UnlinkDevice]);
      },
      onSettled: () => {
        queryClient.invalidateQueries(CACHE_KEYS.DeviceListing);
      },
    },
  );
};

export const useUpdateDevice = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({deviceId, deviceRemark}: {deviceId: string; deviceRemark: IDeviceBodyUpdate}) =>
      updateDevice(deviceId, deviceRemark),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CACHE_KEYS.DeviceListing);
      },
    },
  );
};

export const useAccountDeviceDetails = (id: string) => {
  return useQuery([CACHE_KEYS.DeviceDetails, id], () => getAccountDeviceDetails(id));
};

export const CACHE_KEYS = {
  UnlinkDevice: 'UNLINK_DEVICE',
  DeviceListing: 'DEVICE_LISTING',
  DeviceDetails: 'DEVICE_DETAILS',
};
