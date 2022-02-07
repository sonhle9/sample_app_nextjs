import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  completeMaintenance,
  getIPay88Banks,
  getSystemState,
  scheduleMaintenance,
  updateAnnouncement,
  updateFeatures,
  updateIPay88Bank,
  updateServices,
  updateVendors,
} from 'src/react/services/api-maintenance.service';
import {
  IServices,
  IUpdateAnnouncementInput,
  IVendors,
} from 'src/shared/interfaces/maintenance.interface';
import {IFeatures, IIPay88Bank} from './contants/outage.contants';

export const useSystemState = () => {
  return useQuery([CACHE_KEYS.SystemState], () => getSystemState());
};

export const useIPay88Banks = () => {
  return useQuery([CACHE_KEYS.IPay88Banks], () => getIPay88Banks(), {
    keepPreviousData: true,
    refetchIntervalInBackground: false,
    refetchInterval: false,
  });
};

export const useUpdateAnnouncement = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    (announcement: IUpdateAnnouncementInput) => updateAnnouncement(id, announcement),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CACHE_KEYS.SystemState);
      },
    },
  );
};

export const useCompleteMaintenance = () => {
  const queryClient = useQueryClient();
  return useMutation((scope: string) => completeMaintenance(scope), {
    onSuccess: () => {
      queryClient.invalidateQueries(CACHE_KEYS.SystemState);
    },
  });
};

export const useScheduleMaintenance = () => {
  const queryClient = useQueryClient();
  return useMutation((scope: string) => scheduleMaintenance(scope), {
    onSuccess: () => {
      queryClient.invalidateQueries(CACHE_KEYS.SystemState);
    },
  });
};

export const useUpdateVendors = () => {
  const queryClient = useQueryClient();
  return useMutation((vendors: IVendors) => updateVendors(vendors), {
    onSuccess: () => {
      queryClient.invalidateQueries(CACHE_KEYS.SystemState);
    },
  });
};

export const useUpdateServices = () => {
  const queryClient = useQueryClient();
  return useMutation((services: IServices) => updateServices(services), {
    onSuccess: () => {
      queryClient.invalidateQueries(CACHE_KEYS.SystemState);
    },
  });
};

export const useUpdateFeatures = () => {
  const queryClient = useQueryClient();
  return useMutation((features: IFeatures) => updateFeatures(features), {
    onSuccess: () => {
      queryClient.invalidateQueries(CACHE_KEYS.SystemState);
    },
  });
};

export const useUpdateIPay88Bank = () => {
  const queryClient = useQueryClient();
  return useMutation((iPay88Bank: IIPay88Bank) => updateIPay88Bank(iPay88Bank), {
    onSuccess: () => {
      queryClient.invalidateQueries(CACHE_KEYS.IPay88Banks);
    },
  });
};

const CACHE_KEYS = {
  SystemState: 'SYSTEM_STATE',
  IPay88Banks: 'IPAY88_BANKS',
};
