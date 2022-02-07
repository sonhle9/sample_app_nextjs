import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {customFieldRuleRole} from '../../shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {CustomFieldRulesDetailsComponent} from './pages/custom-field-rules-details.component';
import {CustomFieldRulesListingComponent} from './pages/custom-field-rules-listing.component';
import {CustomFieldRulesComponent} from './pages/custom-field-rules.component';

const routes: Routes = [
  {
    path: '',
    component: CustomFieldRulesComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [customFieldRuleRole.view],
    },
    children: [
      {
        path: '',
        component: CustomFieldRulesListingComponent,
        data: {
          roles: [customFieldRuleRole.view],
        },
      },
      {
        path: ':id',
        component: CustomFieldRulesDetailsComponent,
        data: {
          roles: [customFieldRuleRole.view],
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomFieldRulesRoutingModule {}
