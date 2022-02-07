import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ComponentsModule} from 'src/shared/components/components.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {CoreRoutingModule} from './core-routing.module';
import {CoreComponent} from './pages/core/core';
import {UnauthorizedComponent} from './pages/unauthorized/unauthorized';

@NgModule({
  imports: [ComponentsModule, CommonModule, CoreRoutingModule, DirectivesModule],
  declarations: [CoreComponent, UnauthorizedComponent],
})
export class CoreModule {}
