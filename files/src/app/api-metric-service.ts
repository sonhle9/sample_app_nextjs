import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IMetricRport} from 'src/shared/interfaces/metric.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiMetricService {
  private apiBaseUrl = '/api/ops';

  constructor(private http: HttpClient) {}

  metric(): Observable<IMetricRport> {
    const url: string = this.apiBaseUrl + '/metrics';

    return this.http.get<IMetricRport>(url);
  }
}
