import {DEFAULT_COUNTRY} from 'src/app/api-maintenance.service';
import {environment} from 'src/environments/environment';
import {ajax, IPaginationParam} from 'src/react/lib/ajax';
import {
  IFeatures,
  IIPay88Bank,
  IMalaysiaSystemState,
  IServices,
  IUpdateAnnouncementInput,
  IVendors,
} from 'src/shared/interfaces/maintenance.interface';
import {IMobileVersion, IMobileVersionPayload} from 'src/shared/interfaces/version.interface';

const apiBaseUrl = `${environment.maintenanceApiBaseUrl}/api/maintenance`;

export const getSystemState = () =>
  ajax.get<IMalaysiaSystemState>(`${apiBaseUrl}/maintenance/system-state`, {
    select: (res) => res.data.malaysia,
  });

export const getIPay88Banks = () =>
  ajax.get<IIPay88Bank[]>(`${environment.maintenanceApiBaseUrl}/api/wallets/admin/ipay88_banks`, {
    select: (res) => res.data,
  });

export const updateAnnouncement = (id: string, data: IUpdateAnnouncementInput) => {
  const urlExtension = data.announcementText && id ? `/future-maintenance-periods/${id}` : '';
  return id
    ? ajax.put<IUpdateAnnouncementInput>(`${apiBaseUrl}/maintenance${urlExtension}`, data)
    : ajax.post<IUpdateAnnouncementInput>(`${apiBaseUrl}/maintenance`, data);
};

export const scheduleMaintenance = (scope: string) => {
  return ajax.post<IUpdateAnnouncementInput>(`${apiBaseUrl}/maintenance`, {
    scope,
    country: DEFAULT_COUNTRY,
  });
};

export const completeMaintenance = (scope: string) => {
  return ajax.put<IUpdateAnnouncementInput>(`${apiBaseUrl}/maintenance`, {
    scope,
    country: DEFAULT_COUNTRY,
  });
};

export const updateVendors = (vendors: IVendors) => {
  return ajax.post<IUpdateAnnouncementInput>(`${apiBaseUrl}/maintenance/vendors/malaysia`, vendors);
};

export const updateServices = (services: IServices) => {
  return ajax.post<IUpdateAnnouncementInput>(
    `${apiBaseUrl}/maintenance/services/malaysia`,
    services,
  );
};

export const updateFeatures = (features: IFeatures) => {
  return ajax.post<IUpdateAnnouncementInput>(
    `${apiBaseUrl}/maintenance/features/malaysia`,
    features,
  );
};

export const updateIPay88Bank = (iPay88Bank: IIPay88Bank) => {
  return ajax.put<IIPay88Bank>(
    `${environment.maintenanceApiBaseUrl}/api/wallets/admin/ipay88_banks/${iPay88Bank.paymentId}`,
    iPay88Bank,
  );
};

export const listMobileVersion = (params: IPaginationParam) =>
  ajax.get<{data: Array<IMobileVersion>; pagination: {total: number}}>(
    `${apiBaseUrl}/mobile-versions`,
    {params},
  );

export const createMobileVersion = (data: IMobileVersionPayload) =>
  ajax.post<IMobileVersion>(`${apiBaseUrl}/mobile-versions`, data);

export const updateMobileVersion = (id: string, data: IMobileVersionPayload) =>
  ajax.put<IMobileVersion>(`${apiBaseUrl}/mobile-versions/${id}`, data);

export const getMobileVersion = (id: string) =>
  ajax.get<IMobileVersion>(`${apiBaseUrl}/mobile-versions/${id}`);

export const deleteMobileVersion = (id: string) =>
  ajax.delete(`${apiBaseUrl}/mobile-versions/${id}`);
