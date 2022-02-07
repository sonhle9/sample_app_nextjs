import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthResolver} from './auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./core/core.module').then((m) => m.CoreModule),
    resolve: {session: AuthResolver},
  },
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'})],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
