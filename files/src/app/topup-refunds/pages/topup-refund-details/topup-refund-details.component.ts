import {Component, OnDestroy} from '@angular/core';
import {ITransaction} from '../../../../shared/interfaces/wallet.interface';
import {Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {ApiWalletsService} from '../../../api-wallets.service';
import {takeUntil} from 'rxjs/operators';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';

@Component({
  selector: 'app-topup-refund-details',
  templateUrl: './topup-refund-details.component.html',
  styleUrls: ['./topup-refund-details.component.scss'],
})
export class TopupRefundDetailsComponent implements OnDestroy {
  transactionUid: string;
  transaction: ITransaction;

  allSub: Subject<any> = new Subject<any>();
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: 'Wallet',
    },
    {
      to: '/wallet/topup-refunds',
      label: 'Top-up refunds',
    },
    {
      label: 'Top-up refund details',
    },
  ];
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
