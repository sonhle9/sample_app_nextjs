import {NgModule} from '@angular/core';
import {ReactComponentDirective} from './react-component.directive';

@NgModule({
  declarations: [ReactComponentDirective],
  exports: [ReactComponentDirective],
})
export class DirectivesModule {}
