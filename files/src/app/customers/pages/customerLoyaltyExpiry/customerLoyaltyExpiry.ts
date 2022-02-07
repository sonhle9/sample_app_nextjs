import {Component, Input, OnDestroy, OnChanges} from '@angular/core';
import {Subject} from 'rxjs';
import {ILoyaltyCard} from '../../../../shared/interfaces/loyaltyCard.interface';
import {takeUntil} from 'rxjs/operators';
import {ApiLoyaltyService} from 'src/app/api-loyalty.service';
import {AppFormGroup, AppFormBuilder, AppValidators} from 'src/shared/helpers/formGroup';
import {Validators} from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'app-customer-loyalty-expiry',
  templateUrl: 'customerLoyaltyExpiry.html',
  styleUrls: ['customerLoyaltyExpiry.scss'],
})
export class CustomerLoyaltyExpiryComponent implements OnChanges, OnDestroy {
  @Input()
  customerId: string;

  @Input()
  customerName: string;

  errorMessage: any;
  updateErrorMessage: any;

  form: AppFormGroup;
  updateForm: AppFormGroup;

  loyaltyCard: ILoyaltyCard;
  loading: boolean;
  modalLoading: boolean;

  messageType: string;
  message: string;

  hasUnlinkModal: boolean;
  hasAddModal: boolean;
  hasUpdateModal: boolean;

  allSub: Subject<any> = new Subject<any>();

  constructor(private apiLoyaltyService: ApiLoyaltyService, private fb: AppFormBuilder) {
    this.form = this.fb.group({
      cardNumber: [
        '',
        [Validators.required, AppValidators.numberOnly, AppValidators.fixedNumber(17)],
      ],
    });
    this.errorMessage = AppValidators.initErrorMessageObject(this.form);

    this.updateForm = this.fb.group({
      cardNumber: [''],
      cardStatus: [''],
      freezeReason: [''],
    });
    this.updateErrorMessage = AppValidators.initErrorMessageObject(this.form);
  }

  ngOnChanges() {
    this.indexLoyaltyCards();
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  indexLoyaltyCards() {
    if (!this.customerId) {
      return;
    }

    this.loading = true;
    this.apiLoyaltyService
      .indexUserLoyaltyCards(this.customerId)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (card) => {
          this.loyaltyCard = card;
          this.loading = false;
        },
        () => {
          this.loyaltyCard = null;
          this.loading = false;
        },
      );
  }

  addNumbersComma(num) {
    let totalNum = num.toString();
    const pattern = /(-?\d+)(\d{3})/;

    while (pattern.test(totalNum)) {
      totalNum = totalNum.replace(pattern, '$1,$2');
    }

    return totalNum;
  }

  convertDate(objDate) {
    const newDate = new Date(objDate.substring(0, 10));
    return newDate;
  }
}
