import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

import * as React from 'react';

if (environment.production) {
  enableProdMode();
}

if (typeof window !== 'undefined') {
  // workaround due to angular treeshake although we have JSX
  (window as any).React = React;
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.log(err));
