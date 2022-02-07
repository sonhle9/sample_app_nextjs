import {apiClient} from 'src/react/lib/ajax';
import {environment} from 'src/environments/environment';
import {IEntity} from 'src/shared/interfaces/entity.interface';

const attributesApiBaseUrl = `${environment.attributesApiBaseUrl}/api/attributes/`;

export const getCustomerAttributes = (customerId: string) => {
  const url = `${attributesApiBaseUrl}admin/entity?entityType=users&entityId=${customerId}`;
  return apiClient.get<IEntity>(url).then((res) => {
    return res.data;
  });
};
