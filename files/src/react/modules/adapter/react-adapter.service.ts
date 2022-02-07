import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from 'src/app/auth.service';
import {NewRelicErrorHandler} from 'src/app/new-relic.error-handler';

@Injectable({
  providedIn: 'root',
})
export class ReactAdapterService {
  constructor(
    public readonly router: Router,
    public readonly authService: AuthService,
    public readonly newRelicErrorHandler: NewRelicErrorHandler,
  ) {}
}
