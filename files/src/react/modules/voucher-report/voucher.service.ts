import {environment} from 'src/environments/environment';
import {apiClient, fetchPaginatedData, getData, IPaginationParam} from 'src/react/lib/ajax';
import {formatParameters} from 'src/shared/helpers/common';
import {IExtVoucher, IVoucher} from './shared/voucher.constants';
import {VouchersBatchStatus, VoucherRedeemType} from 'src/shared/interfaces/vouchers.interface';

const BASE_URL = `${environment.vouchersApiBaseUrl}/api/vouchers`;

export const getVouchersBatchesReport = (pagination: IPaginationParam & {name: string}) =>
  fetchPaginatedData<IVoucher>(`${BASE_URL}/admin/vouchers-batch/report`, pagination);

export const getExtVouchersReport = (
  pagination: IPaginationParam & {
    match: string;
    startDate: string;
    endDate: string;
  },
) =>
  fetchPaginatedData<IExtVoucher>(
    `${BASE_URL}/admin/ext-vouchers-report`,
    formatParameters(pagination),
  );

export const getExtVouchersReportCSV = (
  pagination: IPaginationParam & {
    match: string;
    startDate: string;
    endDate: string;
  },
) =>
  getData<string>(`${environment.vouchersApiBaseUrl}/api/ops/reports/ext-vouchers`, {
    responseType: 'blob' as 'json',
    headers: {
      accept: 'text/csv',
    },
    params: pagination,
  });

export const getVoucherBatches = (batchId: string) =>
  getData<string>(`${environment.vouchersApiBaseUrl}/api/ops/reports/vouchers-batch/${batchId}`, {
    responseType: 'blob' as 'json',
    headers: {
      accept: 'text/csv',
    },
  });

export const getVoucherBatchDetails = (batchId: string) => {
  return getData<IVoucher>(`${BASE_URL}/admin/vouchers-batch/${batchId}`);
};

export const getVouchersBatch = (
  params: IPaginationParam & {
    status: VouchersBatchStatus;
    type: VoucherRedeemType;
    name?: string;
    ids?: string[];
  },
) => fetchPaginatedData<IVoucher>(`${BASE_URL}/admin/vouchers-batch`, params);

export const voidVoucher = async (code: string) => {
  return apiClient
    .post<IVoucher>(`${BASE_URL}/admin/vouchers/void/${code}`, {
      observe: 'response',
    })
    .then((res) => res.data);
};
