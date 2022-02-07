import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {DirectivesModule} from 'src/shared/directives/directives.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {GamificationRoutingModule} from './gamification-routing.module';
import {BadgeCampaignsComponent} from './pages/badge-campaigns/badge-campaigns.component';
import {BadgeDetailsComponent} from './pages/badge-details/badge-details.component';

@NgModule({
  declarations: [BadgeCampaignsComponent, BadgeDetailsComponent],
  imports: [CommonModule, DirectivesModule, ComponentsModule, GamificationRoutingModule],
})
export class GamificationModule {}
