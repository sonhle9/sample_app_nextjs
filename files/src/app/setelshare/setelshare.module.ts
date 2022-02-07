import {NgModule} from '@angular/core';
import {ComponentsModule} from '../../shared/components/components.module';
import {SetelShareDetailsComponent} from './pages/setelshare-details.component';
import {SetelShareRoutingModule} from './setelshare-routing.module';

@NgModule({
  declarations: [SetelShareDetailsComponent],
  imports: [ComponentsModule, SetelShareRoutingModule],
  exports: [],
  entryComponents: [],
})
export class SetelShareModule {}
