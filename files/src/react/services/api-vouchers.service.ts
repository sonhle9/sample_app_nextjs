import {PaginationParams} from '@setel/portal-ui';
import {environment} from 'src/environments/environment';
import {
  IVouchersInfo,
  VoucherRedeemType,
  VoucherStatus,
} from 'src/shared/interfaces/vouchers.interface';
import {ajax, fetchPaginatedData} from '../lib/ajax';

const BASE_URL = `${environment.vouchersApiBaseUrl}/api/vouchers/admin`;

export interface IVoucher {
  _id: string;
  batchName: string;
  batchId: string;
  code: string;
  expiryDate: Date;
  active: boolean;
  status: VoucherStatus;
  startDate: Date;
  redeemType: VoucherRedeemType;
  createdAt?: string;
  updatedAt?: string;
  rules: VoucherRule[];
}
export interface VoucherRule {
  _id: string;
  amount: number;
  createdAt: string;
  name: string;
  expiryDate?: string;
}

export const indexVouchersByUserId = (userId: string, pagination: PaginationParams) =>
  fetchPaginatedData<IVoucher>(`${BASE_URL}/vouchers/user/${userId}`, pagination);

export const voidVoucherByCodeOrId = (codeOrId: string) =>
  ajax.post(`${BASE_URL}/vouchers/void/${codeOrId}`);

export const validateVoucher = (code: string) =>
  ajax.get<IVouchersInfo>(`${BASE_URL}/vouchers/${code}`);
