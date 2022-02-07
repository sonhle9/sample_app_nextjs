import {NgModule} from '@angular/core';
import {ComponentsModule} from '../../shared/components/components.module';
import {UserRoutingModule} from './user-routing.module';
import {ProfileComponent} from './pages/profile/profile.component';
@NgModule({
  declarations: [ProfileComponent],
  imports: [ComponentsModule, UserRoutingModule],
  exports: [],
})
export class UserModule {}
