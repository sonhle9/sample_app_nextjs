import {environment} from 'src/environments/environment';
import {IExpiryWalletBalance} from 'src/shared/interfaces/expiryBalance.interface';
import {ajax} from '../lib/ajax';

const baseUrl = `${environment.balanceExpiryApiBaseUrl}/api/balance-expiry`;

export const indexExpiringBalance = (userId: string) =>
  ajax.get<IExpiryWalletBalance>(`${baseUrl}/admin/user/${userId}/expiry-balance`);
