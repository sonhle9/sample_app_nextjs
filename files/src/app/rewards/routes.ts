import {Routes} from '@angular/router';
import {RewardCampaignListingComponent} from 'src/app/rewards/pages/reward-campaign-listing.component';
import {RewardCampaignDetailsComponent} from 'src/app/rewards/pages/reward-campaign-details.component';
import {rewardsRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {ReliabilityListingComponent} from './pages/reliability-listing.component';
import {LeaderboardComponent} from './pages/leaderboard/leaderboard-listing';

export const routes: Routes = [
  {
    path: 'rewards-referral-leaderboard',
    component: LeaderboardComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [rewardsRole.admin_rewards_campaign_view],
    },
  },
  {
    path: 'rewards-campaigns',
    component: RewardCampaignListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [rewardsRole.admin_rewards_campaign_view],
    },
  },
  {
    path: 'rewards-campaigns/:id',
    component: RewardCampaignDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [rewardsRole.admin_rewards_campaign_view],
    },
  },
  {
    path: 'rewards-reliability',
    component: ReliabilityListingComponent,
  },
];
