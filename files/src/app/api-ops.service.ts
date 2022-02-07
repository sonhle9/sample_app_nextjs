import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

import {IAdminRole} from 'src/shared/interfaces/opsUser.interface';
import {AuthService} from './auth.service';
import {adminRole} from 'src/shared/helpers/roles.type';
import {formatParameters, getRolePermissions} from 'src/shared/helpers/common';
@Injectable({
  providedIn: 'root',
})
export class ApiOpsService {
  private apiBaseUrl = '/api/ops';

  constructor(protected http: HttpClient, protected authService: AuthService) {}

  getRolePermissions(): IAdminRole {
    return getRolePermissions<IAdminRole>(this.authService, adminRole);
  }

  getAdjustmentTransactions(userId: string, page: number, perPage: number): Observable<any> {
    const url = `${this.apiBaseUrl}/wallet/${userId}/adjustment-transactions`;
    return this.http.get<any>(url, {
      params: formatParameters({
        page,
        perPage,
      }),
      observe: 'response',
    });
  }

  adjustCustomerBalance(data): Observable<any> {
    const url = `${this.apiBaseUrl}/wallet/adjust-customer-balance`;
    return this.http.post<any>(url, data);
  }
}
