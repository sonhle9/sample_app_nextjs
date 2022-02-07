import {Injectable} from '@angular/core';
import {AxiosError, AxiosRequestConfig} from 'axios';
import {ISession} from 'src/shared/interfaces/auth.interface';
import {publicEndpoints} from 'src/shared/const/public-api.const';
import {apiClient} from '../react/lib/ajax';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReactFetchInterceptorService {
  constructor(private authService: AuthService) {}

  // refresh token promise is declared here instead of AuthService
  // because AuthService is more RxJS-y but we want to do Promise-style here.
  private refreshTokenPromise: Promise<ISession> = null;

  startInterceptions() {
    apiClient.interceptors.response.use(
      (res) => res,
      (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
          if (!this.refreshTokenPromise) {
            this.refreshTokenPromise = this.authService.refreshToken().toPromise();
          }

          return this.refreshTokenPromise
            .then(() => {
              this.applyAccessToken(error.config);
              return apiClient.request(error.config);
            })
            .finally(() => {
              this.refreshTokenPromise = null;
            });
        }

        throw error;
      },
    );

    apiClient.interceptors.request.use(async (requestConfig) => {
      const isPublicCall = publicEndpoints.some(
        (endpoint) =>
          requestConfig.method === endpoint.method && requestConfig.url.includes(endpoint.url),
      );
      if (!isPublicCall) {
        if (this.refreshTokenPromise) {
          await this.refreshTokenPromise;
        }
        this.applyAccessToken(requestConfig);
      }
      return requestConfig;
    });
  }

  private applyAccessToken = (requestConfig: AxiosRequestConfig) => {
    const session = this.authService.getSession();
    requestConfig.headers['access-token'] = session.accessToken;
  };
}
