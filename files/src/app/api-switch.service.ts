import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IPagination} from 'src/shared/interfaces/core.interface';
import {environment} from '../environments/environment';

export enum AcquirersType {
  PLATFORM = 'PLATFORM',
  MERCHANT = 'MERCHANT',
}

export enum AcquirersStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  DORMANT = 'DORMANT',
}

export enum AcquirersSecurityProtocol {
  TWO_D = '2D',
  THREE_D = '3D',
}

export enum AcquirersPaymentProcessor {
  IPAY88 = 'IPAY88',
  BOOST = 'BOOST',
  SETEL_LOYALTY = 'SETEL_LOYALTY',
}

export interface IBankInfo {
  id: string;
  name: string;
}

export interface IAcquirersCredentialsBoost {
  merchantId: string;
  apiKey: string;
  apiSecretKey: string;
}

export interface IAcquirersCredentialsIpay88 {
  merchantCode: string;
  merchantKey: string;
  aesKey: string;
}

export interface IAcquirersCredentials {
  boost?: IAcquirersCredentialsBoost;
  ipay88?: IAcquirersCredentialsIpay88;
}

export interface IAcquirersFilters {
  paymentProcessor?: AcquirersPaymentProcessor;
  type?: AcquirersType;
  merchantId?: string;
  name?: string;
  combinedName?: string;
  bank?: string;
  bankName?: string;
  securityProtocol?: AcquirersSecurityProtocol;
  credentialsIdentifier?: string;
  status?: AcquirersStatus;
  createdAtFrom?: string;
  createdAtTo?: string;
}

export interface IAcquirersCreateInput {
  name: string;
  combinedName: string;
  type: AcquirersType;
  merchantIds: string[];
  bank: string;
  paymentProcessor: AcquirersPaymentProcessor;
  securityProtocol: AcquirersSecurityProtocol;
  credentials: IAcquirersCredentials;
  status: AcquirersStatus;
}

export interface IAcquirers extends IAcquirersCreateInput {
  id: string;
}

export interface IAcquirersUpdateInput extends Partial<IAcquirersCreateInput> {}

export interface IAcquirersRole {
  hasMenu: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ApiSwitchService {
  private apiSwitchUrl = `${environment.switchApiBaseUrl}/api/switch`;

  constructor(private http: HttpClient) {}

  createOrUpdateAcquirer(data: IAcquirers): Observable<IAcquirers> {
    if (data.id) {
      return this.updateAcquirer(data.id, data);
    } else {
      return this.createAcquirer(data);
    }
  }

  createAcquirer(data: IAcquirersCreateInput): Observable<IAcquirers> {
    const url: string = this.apiSwitchUrl + '/admin/acquirers';
    return this.http.post<IAcquirers>(url, data);
  }

  updateAcquirer(id: string, data: IAcquirersUpdateInput): Observable<IAcquirers> {
    const url: string = this.apiSwitchUrl + `/admin/acquirers/${id}`;
    return this.http.put<IAcquirers>(url, data);
  }

  getAcquirerById(id: string): Observable<IAcquirers> {
    return this.http.get<IAcquirers>(`${this.apiSwitchUrl}/admin/acquirers/${id}`);
  }

  listAcquirers(
    filters: IAcquirersFilters,
    page = 1,
    perPage = 50,
  ): Observable<IPagination<IAcquirers>> {
    const url: string = this.apiSwitchUrl + '/admin/acquirers';
    const query = new HttpParams().set('page', String(page)).set('perPage', String(perPage));
    const queryWithFilters = Object.entries(filters || {}).reduce(
      (acc, [key, value]) => acc.set(key, Array.isArray(value) ? value.join(',') : value),
      query,
    );
    return this.http
      .get<IAcquirers[]>(url, {
        params: queryWithFilters,
        observe: 'response',
      })
      .pipe(
        map((res) => ({
          max: +(res.headers.get('x-total-count') || 0),
          index: +(res.headers.get('x-next-page') || 0),
          page: +(res.headers.get('x-per-page') || 20),
          items: res.body,
        })),
      );
  }
}
