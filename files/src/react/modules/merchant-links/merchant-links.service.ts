import {ajax, fetchPaginatedData} from '../../lib/ajax';
import {environment} from '../../../environments/environment';
import {MerchantLink, MerchantLinkDto, MerchantLinkListingFilter} from './merchant-links.type';

const baseUrl = `${environment.merchantsApiBaseUrl}/api/merchants`;

export const getMerchantLinks = (options: MerchantLinkListingFilter = {}) =>
  fetchPaginatedData<MerchantLink>(`${baseUrl}/admin/merchant-links`, options);
export const createMerchantLink = (data: MerchantLinkDto) =>
  ajax<MerchantLink>({
    url: `${baseUrl}/admin/merchant-links`,
    method: 'POST',
    data,
  });

export const updateMerchantLink = (linkId: string, data: MerchantLinkDto) =>
  ajax<MerchantLink>({
    url: `${baseUrl}/admin/merchant-links/${linkId}`,
    method: 'PUT',
    data,
  });

export const deleteMerchantLink = (linkId: string) =>
  ajax<MerchantLink>({
    url: `${baseUrl}/admin/merchant-links/${linkId}`,
    method: 'DELETE',
  });

export const getMerchantLinkDetails = (id: string) =>
  ajax<MerchantLink>({
    url: `${baseUrl}/admin/merchant-links/${id}`,
    method: 'GET',
  });
