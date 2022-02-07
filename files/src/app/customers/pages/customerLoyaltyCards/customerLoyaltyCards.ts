import {Component, Input, OnDestroy, OnChanges} from '@angular/core';
import {Subject} from 'rxjs';
import {
  ILoyaltyCard,
  IUpdateLoyaltyCardInput,
} from '../../../../shared/interfaces/loyaltyCard.interface';
import {takeUntil} from 'rxjs/operators';
import {ApiLoyaltyService} from 'src/app/api-loyalty.service';
import {AppFormGroup, AppFormBuilder, AppValidators} from 'src/shared/helpers/formGroup';
import {Validators} from '@angular/forms';
import {LoyaltyCardStatusesEnum, LoyaltyCardFreezeReasonsEnum} from 'src/shared/enums/loyalty.enum';

const CARD_STATUS = {
  active: 0,
  frozen: 1,
  temporarilyFrozen: 2,
};

const CARD_STATUS_TEXT = {
  active: 'Active or Issued',
  frozen: 'Frozen',
  temporarilyFrozen: 'Temporarily Frozen',
};

const FREEZE_REASON = {
  cardClosed: 'cardClosed',
  customerContactVendor: 'customerContactVendor',
  suspectedFraud: 'suspectedFraud',
};

const FREEZE_REASON_TEXT = {
  cardClosed: 'Card is closed',
  customerContactVendor: 'Need to contact vendor',
  suspectedFraud: 'Suspected fraud',
};

@Component({
  moduleId: module.id,
  selector: 'app-customer-loyalty-cards',
  templateUrl: 'customerLoyaltyCards.html',
  styleUrls: ['customerLoyaltyCards.scss'],
})
export class CustomerLoyaltyCardsComponent implements OnChanges, OnDestroy {
  @Input()
  customerId: string;

  @Input()
  customerName: string;

  cardStatuses = Object.keys(CARD_STATUS_TEXT).map((key) => ({
    text: CARD_STATUS_TEXT[key],
    value: CARD_STATUS[key],
  }));

  freezeReasons = Object.keys(FREEZE_REASON_TEXT).map((key) => ({
    text: FREEZE_REASON_TEXT[key],
    value: FREEZE_REASON[key],
  }));

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

  get haFreezeReason() {
    const form = this.updateForm;
    if (!form) {
      return false;
    }

    const cardStatus = form.value && form.value.cardStatus && form.value.cardStatus.value;
    return cardStatus === CARD_STATUS.frozen;
  }

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

  getFormCardStatus(status: string) {
    switch (status) {
      case LoyaltyCardStatusesEnum.active:
      case LoyaltyCardStatusesEnum.issued:
        return CARD_STATUS.active;

      case LoyaltyCardStatusesEnum.frozen:
        return CARD_STATUS.frozen;

      case LoyaltyCardStatusesEnum.temporarilyFrozen:
        return CARD_STATUS.temporarilyFrozen;
    }

    return this.cardStatuses[0].value;
  }

  getFormCardFreezeReason(reason: string) {
    switch (reason) {
      case LoyaltyCardFreezeReasonsEnum.suspectedFraud:
      case LoyaltyCardFreezeReasonsEnum.underReview:
        return FREEZE_REASON.suspectedFraud;

      case LoyaltyCardFreezeReasonsEnum.cardClosed:
        return FREEZE_REASON.cardClosed;

      case LoyaltyCardFreezeReasonsEnum.customerContactVendor:
        return FREEZE_REASON.customerContactVendor;
    }

    return this.freezeReasons[0].value;
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

          const status = this.getFormCardStatus(card.status);
          const reason = this.getFormCardFreezeReason(card.freezeReason);

          this.updateForm.patchValue({
            cardNumber: card.cardNumber,
            cardStatus: this.cardStatuses.find((s) => s.value === status),
            freezeReason: this.freezeReasons.find((s) => s.value === reason),
          });
        },
        () => {
          this.loyaltyCard = null;
          this.loading = false;
        },
      );
  }

  submit() {
    if (!this.loyaltyCard) {
      return;
    }

    this.messageType = this.message = '';
    this.modalLoading = true;
    this.apiLoyaltyService
      .deleteUserLoyaltyCard(this.customerId, this.loyaltyCard.cardNumber)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        () => {
          this.message = 'Card unlinked';
          this.modalLoading = false;
          this.indexLoyaltyCards();
          this.cancelUnlinkCard();
        },
        () => {
          this.message = 'Ops! Unable to unlink card';
          this.messageType = 'error';
          this.modalLoading = false;
          this.cancelUnlinkCard();
        },
      );
  }

  submitAdd() {
    const cardNumber = this.form.value.cardNumber.replace(/ /g, '');
    this.form.patchValue({cardNumber});

    this.form.markAllAsDirty();
    this.errorMessage = AppValidators.getErrorMessageObject(this.form);

    if (this.form.invalid) {
      return;
    }

    this.messageType = this.message = '';
    this.modalLoading = true;
    this.apiLoyaltyService
      .addUserLoyaltyCard(this.customerId, this.form.value.cardNumber)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        () => {
          this.message = 'Card added';
          this.modalLoading = false;
          this.indexLoyaltyCards();
          this.cancelAddCard();
        },
        () => {
          this.message = 'Ops! Unable to add card';
          this.messageType = 'error';
          this.modalLoading = false;
          this.cancelAddCard();
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

  submitUpdate() {
    this.updateForm.markAllAsDirty();
    this.updateErrorMessage = AppValidators.getErrorMessageObject(this.form);

    if (this.updateForm.invalid) {
      return;
    }

    const input = this.sanitizeUpdateForm();
    this.messageType = this.message = '';
    this.modalLoading = true;
    this.apiLoyaltyService
      .updateUserLoyaltyCard(this.customerId, this.updateForm.value.cardNumber, input)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        () => {
          this.message = 'Card updated';
          this.modalLoading = false;
          this.indexLoyaltyCards();
          this.cancelUpdateCard();
        },
        () => {
          this.message = 'Ops! Unable to update card';
          this.messageType = 'error';
          this.modalLoading = false;
          this.cancelUpdateCard();
        },
      );
  }

  sanitizeUpdateForm(): IUpdateLoyaltyCardInput {
    const value = this.updateForm.value;
    let body: IUpdateLoyaltyCardInput = {};

    switch (value.cardStatus.value) {
      case CARD_STATUS.frozen:
        body = {
          freezeReason: value.freezeReason.value,
          overriddenToFrozen: true,
          overriddenToTemporarilyFrozen: false,
        };
        break;

      case CARD_STATUS.temporarilyFrozen:
        body = {
          overriddenToFrozen: false,
          overriddenToTemporarilyFrozen: true,
        };
        break;

      default:
        body = {
          overriddenToFrozen: false,
          overriddenToTemporarilyFrozen: false,
        };
    }
    return body;
  }

  unlinkCard() {
    this.hasUnlinkModal = true;
  }

  cancelUnlinkCard() {
    this.hasUnlinkModal = false;
  }

  updateCard() {
    this.hasUpdateModal = true;
  }

  cancelUpdateCard() {
    this.hasUpdateModal = false;
  }

  addCard() {
    this.hasAddModal = true;
  }

  cancelAddCard() {
    this.hasAddModal = false;
  }
}
