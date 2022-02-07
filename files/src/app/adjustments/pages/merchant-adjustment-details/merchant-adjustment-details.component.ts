import {Component, OnDestroy} from '@angular/core';
import {ITransaction} from '../../../../shared/interfaces/merchant.interface';
import {Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {ApiMerchantsService} from '../../../api-merchants.service';
import {takeUntil} from 'rxjs/operators';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';

@Component({
  selector: 'app-merchant-adjustment-details',
  templateUrl: './merchant-adjustment-details.component.html',
  styleUrls: ['./merchant-adjustment-details.component.scss'],
})
export class MerchantAdjustmentDetailsComponent implements OnDestroy {
  transactionUid: string;
  transaction: ITransaction;
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: 'Payments',
    },
    {
      label: 'Adjustments',
    },
    {
      label: 'Merchant adjustment transaction detail',
    },
  ];
  allSub: Subject<any> = new Subject<any>();

  constructor(route: ActivatedRoute, private merchantsService: ApiMerchantsService) {
    route.params.pipe(takeUntil(this.allSub)).subscribe((param) => {
      this.transactionUid = param.id;
      this.initTransaction(this.transactionUid);
    });
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  initTransaction(id: string) {
    this.merchantsService
      .readTransaction(id)
      .pipe(takeUntil(this.allSub))
      .subscribe((res) => {
        this.transaction = res;
      });
  }
}
