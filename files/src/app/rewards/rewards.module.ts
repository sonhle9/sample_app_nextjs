import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {MomentModule} from 'ngx-moment';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {MaterialModule} from '../../shared/material/material.module';
import {routes} from './routes';
import {RewardCampaignListingComponent} from 'src/app/rewards/pages/reward-campaign-listing.component';
import {RewardCampaignDetailsComponent} from 'src/app/rewards/pages/reward-campaign-details.component';
import {ComponentsModule} from 'src/shared/components/components.module';
import {ReliabilityListingComponent} from './pages/reliability-listing.component';
import {PipesModule} from 'src/shared/pipes/pipes.module';
import {LeaderboardComponent} from './pages/leaderboard/leaderboard-listing';

@NgModule({
  imports: [
    PipesModule,
    RouterModule.forChild(routes),
    NgxJsonViewerModule,
    ComponentsModule,
    NgxDatatableModule,
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    NgxJsonViewerModule,
    MomentModule,
  ],
  providers: [],
  declarations: [
    LeaderboardComponent,
    RewardCampaignListingComponent,
    RewardCampaignDetailsComponent,
    ReliabilityListingComponent,
    LeaderboardComponent,
  ],
  exports: [RouterModule],
})
export class RewardsModule {}
