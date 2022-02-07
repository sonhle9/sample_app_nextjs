import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate} from '@angular/router';
import {throwError} from 'rxjs';
import {AppEmitter} from './emitter.service';
import {PermissionDeniedError} from 'src/shared/helpers/permissionDenied.error';
import {ApiMerchantsService} from './api-merchants.service';
import {IEnterpriseProduct} from '../shared/interfaces/merchant.interface';
import {CURRENT_ENTERPRISE} from '../shared/const/enterprise.const';

@Injectable()
export class EnterpriseProductsResolver implements CanActivate {
  constructor(private merchantsService: ApiMerchantsService) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const enterprises = await this.merchantsService.indexEnterpriseProducts().toPromise();
    const currentEnterprise = enterprises[CURRENT_ENTERPRISE.name];
    const hasPermission = this.validatePermission(currentEnterprise, route.data.productKey);

    if (!hasPermission) {
      AppEmitter.get(AppEmitter.PermissionDenied).emit();
      throwError(new PermissionDeniedError());
      return false;
    }

    return true;
  }

  validatePermission(enterprise: IEnterpriseProduct, productKey: string): boolean {
    return !!enterprise.products[productKey];
  }
}
