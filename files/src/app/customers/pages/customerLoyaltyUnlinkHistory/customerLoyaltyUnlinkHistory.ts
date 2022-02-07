import {Component, Input, OnDestroy, OnChanges} from '@angular/core';
import {Subject} from 'rxjs';
import {ApiLoyaltyService} from 'src/app/api-loyalty.service';
import {ILoyaltyCard} from 'src/shared/interfaces/loyaltyCard.interface';

@Component({
  moduleId: module.id,
  selector: 'app-customer-loyalty-unlink-history',
  templateUrl: 'customerLoyaltyUnlinkHistory.html',
  styleUrls: ['customerLoyaltyUnlinkHistory.scss'],
})
export class CustomerLoyaltyUnlinkHistoryComponent implements OnChanges, OnDestroy {
  @Input()
  customerId: string;

  loading: boolean;

  unlinkedCards: ILoyaltyCard[];

  allSub: Subject<any> = new Subject<any>();

  constructor(private apiLoyaltyService: ApiLoyaltyService) {}

  ngOnChanges() {
    this.loadUnlinkCardHistory();
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  loadUnlinkCardHistory() {
    this.apiLoyaltyService.readUnlinkedLoyalCard(this.customerId).subscribe((data) => {
      this.unlinkedCards = data;
    });
  }
}
