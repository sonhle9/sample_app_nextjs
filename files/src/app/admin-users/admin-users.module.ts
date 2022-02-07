import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {SharedModule} from '../../shared/shared-module.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MomentModule} from 'ngx-moment';
import {AdminsUserListingComponent} from './pages/admin-users-listing.component';
import {AdminUsersComponent} from './pages/admin-users.component';
import {AdminUsersRoutingModule} from './admin-users-routing.module';
import {AdminUserDetailsComponent} from './pages/admin-user-details.component';

@NgModule({
  declarations: [AdminsUserListingComponent, AdminUsersComponent, AdminUserDetailsComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    AdminUsersRoutingModule,
    NgxJsonViewerModule,
    SharedModule,
    FlexLayoutModule,
    MomentModule,
  ],
})
export class AdminUsersModule {}
