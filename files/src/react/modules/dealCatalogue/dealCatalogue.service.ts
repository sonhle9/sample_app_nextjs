import {environment} from 'src/environments/environment';
import {DomainError} from 'src/react/errors';
import {apiClient} from 'src/react/lib/ajax';
import {getCurrentDealPrice} from '../deal/deals.service';
import {PaginationTokenParams, PaginationTokenResponse} from '../tokenPagination';
import {
  CatalogueDeal,
  DealCatalogue,
  DealCatalogueAction,
  GeneralDealCataloguePayload,
  UploadedFile,
} from './dealCatalogue.type';

export const listCatalogues = (
  params: PaginationTokenParams & {
    allStatuses?: boolean;
    withActiveDealsCount?: boolean;
    withTotal?: boolean;
  },
): Promise<PaginationTokenResponse<DealCatalogue>> =>
  apiClient
    .get(`${environment.dealsBaseUrl}/catalogues`, {
      params,
    })
    .then(({data}) => data);

export const updateCatalogueScores = ({
  changes,
}: {
  changes: {catalogueId: string; score: number}[];
}) => apiClient.put(`${environment.dealsBaseUrl}/catalogues/scores`, {changes});

export const findDealCatalogue = ({
  catalogueId,
  ...params
}: {
  catalogueId: string;
  raw?: boolean;
  allStatuses?: boolean;
}): Promise<DealCatalogue> =>
  apiClient
    .get(`${environment.dealsBaseUrl}/catalogues/${catalogueId}`, {params})
    .then(({data}) => data);

export const findDealCatalogueDeals = ({
  catalogueId,
  ...params
}: PaginationTokenParams & {
  catalogueId: string;
}): Promise<PaginationTokenResponse<CatalogueDeal>> =>
  apiClient
    .get(`${environment.dealsBaseUrl}/catalogues/${catalogueId}/admin/deals`, {params})
    .then(({data}) => ({
      ...data,
      data: data.data.map((deal) => ({...deal, price: getCurrentDealPrice(deal.price)})),
    }));

export const updateCatalogueDealRelations = ({
  catalogueId,
  changes,
}: {
  catalogueId: string;
  changes: {dealId: string; type: DealCatalogueAction; score?: number}[];
}) => apiClient.put(`${environment.dealsBaseUrl}/catalogues/${catalogueId}/admin/deals`, {changes});

export const saveDealCatalogueOrder = () => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new DomainError({message: 'Not implemented yet'}));
    }, 1000);
  });
};

export const createDealCatalogue = async (payload: GeneralDealCataloguePayload) => {
  const [{url}] = await uploadImages([payload.icon.file]);
  return apiClient
    .post(`${environment.dealsBaseUrl}/catalogues`, {
      ...payload,
      icon: {url},
    })
    .then(({data}) => data);
};

export const updateDealCatalogue = async (catalogueId: string, payload: Partial<DealCatalogue>) => {
  if (payload?.icon?.file) {
    const [{url}] = await uploadImages([payload.icon.file]);
    payload.icon = {url};
  }

  return apiClient
    .put(`${environment.dealsBaseUrl}/catalogues/${catalogueId}`, payload)
    .then(({data}) => data);
};

export const deleteDealCatalogue = (catalogueId: string) =>
  apiClient.delete(`${environment.dealsBaseUrl}/catalogues/${catalogueId}`);

export const uploadImages = (files: File[]) => {
  const fd = new FormData();
  files.forEach((file) => fd.append('files', file));

  return apiClient
    .post<UploadedFile[]>(`${environment.dealsBaseUrl}/uploads`, fd)
    .then(({data}) => data);
};
