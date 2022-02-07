import {Component, OnDestroy} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ApiLoyaltyService} from 'src/app/api-loyalty.service';
import {ActivatedRoute} from '@angular/router';
import {ILoyaltyTransaction} from 'src/shared/interfaces/loyalty.interface';

@Component({
  moduleId: module.id,
  selector: 'app-loyalty-transaction-details',
  templateUrl: './loyalty-transaction-details.html',
  styleUrls: ['./loyalty-transaction-details.scss'],
})
export class LoyaltyTransactionDetailsComponent implements OnDestroy {
  transaction$: Observable<ILoyaltyTransaction>;

  allSub: Subject<any> = new Subject<any>();

  constructor(route: ActivatedRoute, private apiLoyaltyService: ApiLoyaltyService) {
    route.params.pipe(takeUntil(this.allSub)).subscribe((param) => {
      this.initLoyaltyTransaction(param.id);
    });
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  initLoyaltyTransaction(id: string) {
    this.transaction$ = this.apiLoyaltyService.readLoyaltyTransaction(id);
  }
}
