import {
  IBadgeGroupInDetails,
  IBadgeGroupInList,
  IBadgeGroupSearchRequest,
  IUserBadgesSearchRequest,
  IBadgeListSearchRequest,
  IUserBadge,
  IBadge,
  IUpdateBadgePayload,
  ICreateBadgePayload,
  IBadgeGalleryIcon,
  IBadgeIconGalleryPayload,
} from './badge-campaigns.type';
import {ajax, getData, IPaginationResult, filterEmptyString} from 'src/react/lib/ajax';
import {environment} from 'src/environments/environment';

export async function getUserBadges({userId, page, perPage}: IUserBadgesSearchRequest) {
  return ajax<IPaginationResult<IUserBadge>>({
    url: `${environment.apiBaseUrl}/api/rewards/admin/user-badges/${userId}`,
    params: {page, perPage},
    select: ({data: {items = [], headers}}) => ({
      items,
      isEmpty: items.length === 0,
      page: +headers['x-page'] || 0,
      perPage: +headers['x-per-page'] || 0,
      pageCount: +headers['x-pages-count'] || 0,
      total: +headers['x-total-count'] || 0,
    }),
  });
}

export async function getBadges(params: IBadgeListSearchRequest) {
  return ajax<IPaginationResult<IBadge>>({
    url: `${environment.apiBaseUrl}/api/rewards/admin/badges`,
    params,
    select: ({data: {items = [], headers}}) => ({
      items,
      isEmpty: items.length === 0,
      page: +headers['x-page'] || 0,
      perPage: +headers['x-per-page'] || 0,
      pageCount: +headers['x-pages-count'] || 0,
      total: +headers['x-total-count'] || 0,
    }),
  });
}

export async function getBadgeGroups({name, ...filters}: IBadgeGroupSearchRequest) {
  const url = `${environment.apiBaseUrl}/api/rewards/badges-groups`;
  const searchParams = name ? {name} : {};
  const pagination = {...filters, ...searchParams};
  const options = {params: {sortBy: 'score'}};

  return ajax<IPaginationResult<IBadgeGroupInList>>({
    url,
    ...options,
    params: filterEmptyString({...pagination, ...options.params}),
    select: ({data: {items = [], headers}}) => ({
      items,
      isEmpty: items.length === 0,
      page: +headers['x-page'] || 0,
      perPage: +headers['x-per-page'] || 0,
      pageCount: +headers['x-pages-count'] || 0,
      total: +headers['x-total-count'] || 0,
    }),
  });
}

export async function getBadgeGroupBadges({
  id,
  ...params
}: {
  id: string;
  perPage?: number;
  page?: number;
}) {
  return ajax<IPaginationResult<IBadge>>({
    url: `${environment.apiBaseUrl}/api/rewards/badges-groups/${id}/badges`,
    params,
    select: ({data: {items = [], headers}}) => ({
      items,
      isEmpty: items.length === 0,
      page: +headers['x-page'] || 0,
      perPage: +headers['x-per-page'] || 0,
      pageCount: +headers['x-pages-count'] || 0,
      total: +headers['x-total-count'] || 0,
    }),
  });
}

export async function createBadgeGroup(data: IBadgeGroupInDetails) {
  return ajax({
    url: `${environment.apiBaseUrl}/api/rewards/badges-groups`,
    method: 'POST',
    data,
  });
}

export async function updateBadgeGroup({_id, ...data}: IBadgeGroupInDetails) {
  return ajax({
    url: `${environment.apiBaseUrl}/api/rewards/badges-groups/${_id}`,
    method: 'PUT',
    data,
  });
}

export async function deleteBadgeGroup(id: string) {
  return ajax({
    url: `${environment.apiBaseUrl}/api/rewards/badges-groups/${id}`,
    method: 'DELETE',
  });
}

export const getBadgeGroupById = (id: string) =>
  getData<IBadgeGroupInDetails>(`${environment.apiBaseUrl}/api/rewards/badges-groups/${id}`);

export const getBadgeDetailsById = (id: string) =>
  getData<IBadge>(`${environment.apiBaseUrl}/api/rewards/admin/badges/${id}`);

export const reorderBadgeGroups = (arrangement: Array<{id: string; score: number}>) =>
  ajax({
    url: `${environment.apiBaseUrl}/api/rewards/badges-groups/scores`,
    method: 'PUT',
    data: {arrangement},
  });

export async function createBadge(data: ICreateBadgePayload): Promise<IBadge> {
  return ajax<IBadge>({
    url: `${environment.apiBaseUrl}/api/rewards/admin/badges`,
    method: 'POST',
    data,
  });
}

export async function updateBadge({id, ...data}: IUpdateBadgePayload): Promise<IBadge> {
  return ajax<IBadge>({
    url: `${environment.apiBaseUrl}/api/rewards/admin/badges/${id}`,
    method: 'PUT',
    data,
  });
}

export const getBadgeIconGallery = (params: IBadgeIconGalleryPayload) =>
  ajax<IBadgeGalleryIcon[]>({
    url: `${environment.apiBaseUrl}/api/rewards/admin/badges/icon/gallery`,
    params: filterEmptyString(params),
  });
