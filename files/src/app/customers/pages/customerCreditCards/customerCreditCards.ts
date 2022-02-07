import {Component, OnChanges, Input, OnDestroy} from '@angular/core';
import {ApiPaymentsService} from '../../../api-payments.service';
import {Subject} from 'rxjs';
import {ICreditCard} from '../../../../shared/interfaces/creditCards.interface';
import {takeUntil} from 'rxjs/operators';

@Component({
  moduleId: module.id,
  selector: 'app-customer-credit-cards',
  templateUrl: 'customerCreditCards.html',
  styleUrls: ['customerCreditCards.scss'],
})
export class CustomerCreditCardsComponent implements OnChanges, OnDestroy {
  @Input() customerId;

  setelCreditCards: ICreditCard[] = [];
  loadingSetel: boolean;
  showModalUnlinkCard: boolean;
  cardChosen: any;
  messageType: string;
  message: string;

  allSub: Subject<any> = new Subject<any>();

  constructor(private apiPaymentsService: ApiPaymentsService) {}

  ngOnChanges() {
    this.indexSetelCreditCards();
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  indexSetelCreditCards() {
    if (!this.customerId) {
      return;
    }

    this.loadingSetel = true;
    this.apiPaymentsService
      .indexCreditCards(this.customerId)
      .pipe(takeUntil(this.allSub))
      .subscribe((cards) => {
        this.setelCreditCards = cards;
        this.loadingSetel = false;
      });
  }

  unlinkCard(card) {
    this.showModalUnlinkCard = true;
    this.cardChosen = card;
  }

  cancelUnlinkCard() {
    this.showModalUnlinkCard = false;
    this.cardChosen = null;
  }

  submit() {
    if (!this.cardChosen) {
      return this.cancelUnlinkCard();
    }

    this.apiPaymentsService
      .deleteCreditCard(this.cardChosen.id?.toString())
      .pipe(takeUntil(this.allSub))
      .subscribe(
        () => {
          this.messageType = 'success';
          this.message = 'Card unlinked';
          this.indexSetelCreditCards();
          this.cancelUnlinkCard();
        },
        () => {
          this.messageType = 'error';
          this.message = 'Ops! Unable to unlink card';
          this.indexSetelCreditCards();
          this.cancelUnlinkCard();
        },
      );
  }
}
