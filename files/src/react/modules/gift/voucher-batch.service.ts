import {environment} from 'src/environments/environment';
import {apiClient, fetchPaginatedData, getData, IPaginationParam} from 'src/react/lib/ajax';
import {formatParameters} from 'src/shared/helpers/common';
import {Pagination} from 'src/shared/interfaces/pagination.interface';
import {
  IVoidVouchers,
  IVoucher,
  IVoucherParameters,
  VoucherBatchGenerationType,
} from './shared/gift-voucher.constant';
const BASE_URL = `${environment.ledgerApiBaseUrl}/api/vouchers/admin`;

export const getVouchersBatches = (
  pagination: IPaginationParam & {
    startDateTo?: string;
    startDateFrom?: string;
    expiryDateFrom?: string;
    expiryDateTo?: string;
  },
) => fetchPaginatedData<IVoucher>(`${BASE_URL}/vouchers-batch`, formatParameters(pagination));

export const editVoucher = async (voucherDetails: IVoucherParameters) => {
  const {batchId, ...data} = voucherDetails;
  return apiClient
    .put<IVoucherParameters>(`${BASE_URL}/vouchers-batch/${voucherDetails.batchId}`, data)
    .then((res) => res.data);
};

export const addVoucher = async (voucherDetails: IVoucherParameters) => {
  const voucherParams: any = {...voucherDetails};
  if (voucherParams.redeemExpiry) {
    voucherParams.redeemExpiry = formatParameters(voucherParams.redeemExpiry);
    if (Object.entries(voucherParams.redeemExpiry)) {
      delete voucherParams.redeemExpiry;
    }
  }
  delete voucherParams.batchId;

  const data = {
    ...formatParameters(voucherParams),
    content: {
      title: {
        en: voucherParams.name,
      },
      ...(voucherParams.description && {
        description: {
          en: voucherParams.description,
        },
      }),
    },
  };

  return apiClient.post<IVoucher>(`${BASE_URL}/vouchers-batch`, data).then((res) => {
    if (
      VoucherBatchGenerationType[voucherParams.generationType] === VoucherBatchGenerationType.upload
    ) {
      return uploadVouchersCodes(res.data._id, voucherParams.codes);
    }
    return res.data;
  });
};

export const validateVoucher = async (code: string) => {
  return apiClient.get<IVoucher>(`${BASE_URL}/vouchers/${code}`);
};

export const voidVoucher = async (code: string) => {
  return apiClient
    .post<IVoucher>(`${BASE_URL}/vouchers/void/${code}`, {
      observe: 'response',
    })
    .then((res) => res.data);
};

export const voidVouchers = async (codes: string[]) => {
  return apiClient
    .post<IVoidVouchers[]>(`${BASE_URL}/vouchers/void`, codes)
    .then((res) => res.data);
};

export const getVouchersBatchesReport = (pagination: Pagination & {name: string}) =>
  fetchPaginatedData<IVoucher>(`${BASE_URL}/vouchers-batch/report`, pagination);

export const uploadVouchersCodes = async (batchId: string, codes: string[]) => {
  return apiClient
    .put<IVoucher>(`${BASE_URL}/vouchers-batch/${batchId}/codes`, codes)
    .then((res) => res.data);
};

export const getVoucherBatchDetails = (batchId: string) =>
  getData<IVoucher>(`${BASE_URL}/vouchers-batch/${batchId}`, {params: {withDetails: true}});

export const getVoucherBatchCSV = (batchId: string) =>
  getData<string>(`${environment.vouchersApiBaseUrl}/api/ops/reports/vouchers-batch/${batchId}`, {
    responseType: 'blob' as 'json',
    headers: {
      accept: 'text/csv',
    },
  });
