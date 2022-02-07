import {HttpClientModule} from '@angular/common/http';
import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {NotificationComponent} from '../shared/components/notification/notification.component';
import {DirectivesModule} from '../shared/directives/directives.module';
import {httpInterceptorProviders} from '../shared/interceptors';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthResolver} from './auth.guard';
import {AuthService} from './auth.service';
import {AuthModule} from './auth/auth.module';
import {EnterpriseProductsResolver} from './enterprise-product-offering.guard';
import {NewRelicErrorHandler} from './new-relic.error-handler';

@NgModule({
  declarations: [AppComponent, NotificationComponent],
  imports: [
    HttpClientModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    DirectivesModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.enableServiceWorker}),
  ],
  providers: [
    AuthResolver,
    EnterpriseProductsResolver,
    httpInterceptorProviders,
    {provide: 'JwtDecode', useValue: window['jwt_decode']},
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AuthService],
      useFactory: (authService: AuthService) => async () => {
        if (environment.enableApiIamRoles) {
          await authService.setRoles().catch(() => {});
        }
      },
    },
    {
      provide: ErrorHandler,
      useClass: NewRelicErrorHandler,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
