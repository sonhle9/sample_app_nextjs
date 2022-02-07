import {omit} from '@setel/portal-ui';
import {ajax} from 'src/react/lib/ajax';
import {IAppSettings} from 'src/shared/interfaces/variables.interface';
import {environment} from 'src/environments/environment';

const baseUrl = `${environment.variablesBaseUrl}/api/variables`;

export const getAppSettings = () =>
  ajax.get<IAppSettings>(`${baseUrl}/admin/app-settings`, {
    select: (res) => omit(res.data, ['_id', 'isGlobal', '__v', 'createdAt', 'updatedAt']),
  });

export const createOrUpdateAppSettings = (data: IAppSettings) =>
  ajax
    .put(`${baseUrl}/admin/app-settings`, data)
    .catch(() => ajax.post(`${baseUrl}/admin/app-settings`, data));
