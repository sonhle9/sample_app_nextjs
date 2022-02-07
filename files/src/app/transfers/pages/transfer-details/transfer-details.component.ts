import {Component, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {ApiMerchantsService} from '../../../api-merchants.service';
import {ITransaction} from '../../../../shared/interfaces/merchant.interface';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';

@Component({
  selector: 'app-transfer-details',
  templateUrl: './transfer-details.component.html',
  styleUrls: ['./transfer-details.component.scss'],
})
export class TransferDetailsComponent implements OnDestroy {
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
      to: '/payments/transfers',
      label: 'Transfers',
    },
    {
      label: 'Transaction Details',
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
