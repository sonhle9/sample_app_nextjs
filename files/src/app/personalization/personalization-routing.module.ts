import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthResolver} from '../auth.guard';
import {experienceAppSettingsRoles, variablesRoles} from 'src/shared/helpers/roles.type';
import {GlobalVariablesComponent} from './pages/globalVariables/global-variables.component';
import {VariablesListComponent} from './pages/variables/variables-list.component';
import {VariableDetailsComponent} from './pages/variables/variable-details.component';
import {EnterpriseProductsResolver} from '../enterprise-product-offering.guard';
import {EnterpriseProducts} from '../../shared/enums/enterprise.enum';
import {InterfaceComponentComponent} from './pages/interface-component.component';

const routes: Routes = [
  {
    path: 'interface-components',
    component: GlobalVariablesComponent,
    canActivate: [AuthResolver, EnterpriseProductsResolver],
    data: {
      roles: [experienceAppSettingsRoles.menu],
      productKey: EnterpriseProducts.EXPERIENCE,
    },
  },
  {
    path: 'interface-components/new',
    component: InterfaceComponentComponent,
    canActivate: [AuthResolver, EnterpriseProductsResolver],
    data: {
      roles: [experienceAppSettingsRoles.menu],
      productKey: EnterpriseProducts.EXPERIENCE,
    },
  },
  {
    path: 'variables',
    component: VariablesListComponent,
    canActivate: [AuthResolver, EnterpriseProductsResolver],
    data: {
      roles: [variablesRoles.view],
      productKey: EnterpriseProducts.EXPERIENCE,
    },
  },
  {
    path: 'variables/:id',
    component: VariableDetailsComponent,
    canActivate: [AuthResolver, EnterpriseProductsResolver],
    data: {
      roles: [variablesRoles.view],
      productKey: EnterpriseProducts.EXPERIENCE,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonalizationRoutingModule {}
