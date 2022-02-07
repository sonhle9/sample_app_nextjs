import {Injectable, NgZone} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from 'src/environments/environment';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TestHelperService {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly ngZone: NgZone,
  ) {}

  attachHelperInTestingEnv() {
    if (environment.isE2eTesting) {
      import('msw').then(({rest}) =>
        import('../react/services/mocks/mock-worker').then(({worker}) =>
          worker.start().then(() => {
            (window as any).__setelHelper = {
              ...((window as any).__setelHelper || {}),
              login: (email: string, password: string) =>
                this.authService
                  .login(email, password)
                  .toPromise()
                  .then(() => this.ngZone.run(() => this.router.navigateByUrl('/'))),
              mockWorker: worker,
              rest,
              navigate: (url: string) => this.ngZone.run(() => this.router.navigateByUrl(url)),
            };
          }),
        ),
      );
    }
  }
}
