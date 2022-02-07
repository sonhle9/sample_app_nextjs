import {Component, OnDestroy} from '@angular/core';
import {ITransaction} from '../../../../shared/interfaces/wallet.interface';
import {Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {ApiWalletsService} from '../../../api-wallets.service';
import {takeUntil} from 'rxjs/operators';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';

@Component({
  selector: 'app-customer-adjustment-details',
  templateUrl: './customer-adjustment-details.component.html',
  styleUrls: ['./customer-adjustment-details.component.scss'],
})
export class CustomerAdjustmentDetailsComponent implements OnDestroy {
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
      label: 'Customer adjustment transaction detail',
    },
  ];
  allSub: Subject<any> = new Subject<any>();

  constructor(route: ActivatedRoute, private walletsService: ApiWalletsService) {
    route.params.pipe(takeUntil(this.allSub)).subscribe((param) => {
      this.transactionUid = param.id;
      this.initTransaction(this.transactionUid);
    });
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  initTransaction(id: string) {
    this.walletsService
      .readTransaction(id)
      .pipe(takeUntil(this.allSub))
      .subscribe((res) => {
        this.transaction = res;
      });
  }
}
