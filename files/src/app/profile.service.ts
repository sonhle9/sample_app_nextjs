import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {throwError, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {environment} from '../environments/environment';

export interface IWithUserId {
  userId: string;
}

export interface IUpdateTagsParams {
  userId: string;
  tag: string;
}

export interface IProfile {
  id: string;
  tags: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({providedIn: 'root'})
export class ProfileService {
  private apiBaseUrl = `${environment.accountsApiBaseUrl}/api/idp`;

  profiles: Record<
    string,
    {
      data: IProfile;
      exists: boolean;
    }
  > = {};

  constructor(protected http: HttpClient) {}

  loadProfile({userId}: IWithUserId) {
    return this.http.get<IProfile | null>(`${this.apiBaseUrl}/profiles/${userId}`).pipe(
      tap((profile) => {
        this.profiles[userId] = {
          data: profile,
          exists: true,
        };
      }),
      catchError((errorResponse) => {
        if (errorResponse.error.statusCode === 404) {
          this.profiles[userId] = {
            data: null,
            exists: false,
          };

          return of(null);
        }

        return throwError(errorResponse);
      }),
    );
  }

  addTag({userId, tag}: IUpdateTagsParams) {
    const {exists = false} = this.profiles[userId] || {};
    const payload = {
      userId,
      tags: !exists ? [tag] : this.profiles[userId].data.tags.concat([tag]),
    };

    return (
      exists
        ? this.http.put<IProfile>(`${this.apiBaseUrl}/profiles/${userId}`, payload)
        : this.http.post<IProfile>(`${this.apiBaseUrl}/profiles`, payload)
    ).pipe(
      tap(({tags}) => {
        this.profiles[userId] = {
          exists: true,
          data: {
            ...this.profiles[userId].data,
            tags,
          },
        };
      }),
    );
  }

  removeTag({userId, tag: toRemove}: IUpdateTagsParams) {
    return this.http
      .put<IProfile>(`${this.apiBaseUrl}/profiles/${userId}`, {
        userId,
        tags: this.profiles[userId].data.tags.filter((tag) => tag !== toRemove),
      })
      .pipe(
        tap(({tags}) => {
          this.profiles[userId] = {
            exists: true,
            data: {
              ...this.profiles[userId].data,
              tags,
            },
          };
        }),
      );
  }

  clearProfile({userId}: IWithUserId) {
    delete this.profiles[userId];
  }
}
