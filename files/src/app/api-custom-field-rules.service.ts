import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';
import {IPaginatedResult} from '../shared/interfaces/core.interface';
import {formatParameters} from '../shared/helpers/common';
import {ICustomFieldRule} from '../react/modules/custom-field-rules/custom-field-rules.type';

@Injectable({
  providedIn: 'root',
})
export class ApiCustomFieldRulesService {
  private apiAccountsUrl = `${environment.accountsApiBaseUrl}/api/custom-field-rules`;

  constructor(private http: HttpClient) {}

  getCustomFieldByMerchantType(merchantTypeId): Observable<any> {
    const url: string = this.apiAccountsUrl + '/custom-field-rules';

    return this.http.get<IPaginatedResult<ICustomFieldRule[]>>(url, {
      params: formatParameters({
        page: 1,
        perPage: 1000,
        entityName: 'merchant',
        isEnabled: true,
        entityCategorisationId: merchantTypeId,
      }),
    });
  }
}
