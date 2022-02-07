import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiIamService {
  private apiIamUrl = `${environment.iamApiBaseUrl}/api/iam`;

  constructor(private http: HttpClient) {}

  getPermissions({namespace, userId}: {namespace: string; userId: string}): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiIamUrl}/${namespace}/users/${userId}/permissions`);
  }
}
