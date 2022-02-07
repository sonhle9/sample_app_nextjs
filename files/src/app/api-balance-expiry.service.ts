import {Injectable, EventEmitter} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {formatParameters} from '../shared/helpers/common';
import {environment} from '../environments/environment';
import {IExpiryWalletBalance} from '../shared/interfaces/expiryBalance.interface';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiBalanceExpiryService {
  private balanceExpiryApiBaseUrl = `${environment.balanceExpiryApiBaseUrl}/api/balance-expiry`;
  validationForm = new EventEmitter<any>();
  resetForm = new EventEmitter<any>();

  constructor(private http: HttpClient) {}

  indexExpiringBalance(userId: string, periodDays?: number): Observable<IExpiryWalletBalance> {
    return this.http.get<IExpiryWalletBalance>(
      `${this.balanceExpiryApiBaseUrl}/admin/user/${userId}/expiry-balance`,
      {
        params: formatParameters({periodDays}),
        observe: 'body',
      },
    );
  }
}
