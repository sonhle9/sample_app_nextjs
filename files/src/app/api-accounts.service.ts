import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';
import {IDevice, IDeviceWithUsers} from '../shared/interfaces/devices';
import {IamNamespaces} from '../shared/enums/enterprise.enum';
import {IPaginatedResult} from '../shared/interfaces/core.interface';
import {
  ILoginResponse,
  I2FALoginResponse,
  I2FALoginInput,
} from 'src/shared/interfaces/auth.interface';

export interface IListDevicesParams {
  page: number;
  perPage?: number;
  userId?: string;
  filters?: {
    deviceId?: string;
    createdAtGte?: string;
    createdAtLte?: string;
    isBlocked?: string;
  };
}

export interface IUpdateDeviceParams {
  id: string;
  payload: {
    isBlocked: boolean;
    remark?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ApiAccountsService {
  private apiOpsUrl = '/api/ops';

  private apiAccountsUrl = `${environment.accountsApiBaseUrl}/api/idp`;

  private adminUsername: string;

  constructor(private http: HttpClient) {}

  login(email: string, password: string, namespace: IamNamespaces) {
    const url: string = this.apiOpsUrl + '/auth/login';

    return this.http.post<ILoginResponse | I2FALoginResponse>(
      url,
      {email, password},
      {
        headers: {namespace},
      },
    );
  }

  login2FA(input: I2FALoginInput, namespace: IamNamespaces) {
    return this.http.post<ILoginResponse>(`${this.apiOpsUrl}/auth/2fa/login`, input, {
      headers: {namespace},
    });
  }

  logout(): Observable<any> {
    const url: string = this.apiOpsUrl + '/auth/logout';

    return this.http.delete(url);
  }

  refreshToken(refreshToken, namespace: IamNamespaces): Observable<any> {
    const url: string = this.apiOpsUrl + '/auth/refresh';
    const options = {
      headers: new HttpHeaders().set('refresh-token', refreshToken).set('namespace', namespace),
    };

    return this.http.put(url, {}, options);
  }

  createOtp(phone): Observable<any> {
    const url: string = this.apiOpsUrl + '/passwords/reset/otp';

    return this.http.post(url, {phone});
  }

  resetPassword(phone, otp, newPassword): Observable<any> {
    const url: string = this.apiOpsUrl + '/passwords/reset';

    return this.http.put(url, {phone, otp, newPassword});
  }

  listDevices({page, perPage = 50, userId, filters}: IListDevicesParams) {
    const url = this.apiAccountsUrl + (userId ? `/accounts/${userId}/devices` : `/devices`);
    const query = new HttpParams().set('page', String(page)).set('perPage', String(perPage));
    const queryWithFilters = Object.entries(filters || {}).reduce(
      (acc, [key, value]) => acc.set(key, value),
      query,
    );

    return this.http.get<IPaginatedResult<IDevice[]>>(url, {
      params: queryWithFilters,
    });
  }

  getDeviceWithUsers({id}: {id: string}) {
    return this.http.get<IDeviceWithUsers>(`${this.apiAccountsUrl}/devices/${id}`);
  }

  unlinkDevice({id}: {id: string}) {
    return this.http.delete(
      `${this.apiAccountsUrl}/accounts/devices/${id}?adminUsername=${this.adminUsername}`,
    );
  }

  updateDevice({id, payload}: IUpdateDeviceParams) {
    return this.http.put(`${this.apiAccountsUrl}/devices/${id}`, {
      adminUsername: this.adminUsername,
      ...payload,
    });
  }

  setAdminUsername(name: string) {
    return (this.adminUsername = name);
  }
}
