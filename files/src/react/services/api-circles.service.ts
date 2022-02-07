import {
  ICircle,
  ICircleMember,
  ICircleTransaction,
  ICircleTransactionFilter,
} from '../../shared/interfaces/circles.interface';
import {environment} from '../../environments/environment';
import {ajax, fetchPaginatedData} from '../lib/ajax';

const BASE_URL = `${environment.circleBaseUrl}/api/circles`;

export const getCircleById = (circleId: string) =>
  ajax.get<ICircle>(`${BASE_URL}/admin/circles/${circleId}`).then((res) => res);

export const adminUpdateCircleMemberInfo = (circleId: string, memberId: string) =>
  ajax
    .delete<ICircleMember>(`${BASE_URL}/admin/circles/${circleId}/members/${memberId}`)
    .then((res) => res);

export const getCircleTransactionsById = (circleId: string, pagination: ICircleTransactionFilter) =>
  fetchPaginatedData<ICircleTransaction>(`${BASE_URL}/admin/circles/${circleId}/transactions`, {
    perPage: pagination.perPage,
    page: pagination.page,
  });
