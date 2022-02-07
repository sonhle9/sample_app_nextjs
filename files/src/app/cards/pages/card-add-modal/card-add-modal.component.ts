import {Component, OnInit, OnDestroy} from '@angular/core';
import {Validators, FormControl} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import * as _ from 'lodash';
import {AppFormBuilder, AppFormGroup} from 'src/shared/helpers/formGroup';
import {ApiCardService} from 'src/app/api-cards.service';
import {ReplaySubject, Subject} from 'rxjs';
import {IMerchant} from 'src/shared/interfaces/merchant.interface';
import {EType, EPhysicalType, ESubtype, EFormFactor} from '../../../../shared/enums/card.enum';
import {ApiMerchantsService} from 'src/app/api-merchants.service';
import {ApiCardGroupService} from 'src/app/api-card-groups.service';
import {ApiCardRangeService} from 'src/app/api-card-range.service';

@Component({
  selector: 'app-card-add-modal',
  templateUrl: './card-add-modal.component.html',
  styleUrls: ['./card-add-modal.component.scss'],
})
export class CardAddModalComponent implements OnInit, OnDestroy {
  resourceName: string;
  loading = true;
  form: AppFormGroup;
  fb: AppFormBuilder;

  types: any[];
  formFactors: any[];
  physicalTypes: any[];
  physicalTypesContainScratch: any[];
  physicalTypesNotScratch: any[];
  subtypes: any[];
  cardRanges: any[];
  merchants: any[];
  cardGroups: any[];
  hintCardGroupIfTypeFleet = false;

  isSearchingMerchant = false;
  filteredServerSideMerchants: ReplaySubject<IMerchant[]> = new ReplaySubject<IMerchant[]>(1);
  _onDestroy = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<CardAddModalComponent>,
    fb: AppFormBuilder,
    private readonly apiCardsService: ApiCardService,
    private readonly apiMerchantsService: ApiMerchantsService,
    private readonly apiCardGroupService: ApiCardGroupService,
    private readonly apiCardRangeService: ApiCardRangeService,
  ) {
    this.resourceName = 'Routing';

    this.fb = fb;
    this.form = fb.group({
      type: ['', [Validators.required]],
      formFactor: ['', [Validators.required]],
      physicalType: ['', [Validators.required]],
      subtype: ['', [Validators.required]],
      cardRange: ['', [Validators.required]],
      cardGroup: ['', [Validators.required]],
      merchant: [''],
      isExpiry: [''],
      cardholderName: ['', [Validators.required]],
      displayName: ['', [Validators.maxLength(26)]],
      pinRequired: [false],
      mileageReading: [false],
      vehicle: [''],
      numberOfCards: [1, [Validators.min(1)]],
      searchMerchant: [''],
      preload: null,
    });
    this.types = Object.values(EType);
    this.physicalTypes = Object.values(EPhysicalType);
    this.physicalTypesContainScratch = Object.values(EPhysicalType);
    this.physicalTypesNotScratch = Object.values(EPhysicalType).filter((e) => e !== 'scratch');
    this.subtypes = Object.values(ESubtype);
    this.formFactors = Object.values(EFormFactor);
    this.merchants = [];
  }

  ngOnInit(): void {
    this.loading = false;
    this.fetchCardRanges();
    this.fetchCardGroups();
    this.onFormChange();
    this.fetchMerchants();
    this.form.controls['preload'].disable();
  }

  fetchMerchants() {
    const searchValue = this.form.controls.searchMerchant.value || '';
    this.apiMerchantsService
      .indexMerchants(0, 25, searchValue && {searchValue})
      .subscribe((value) => {
        this.merchants = value.items;
        if (!value.items.map((item) => item.merchantId).includes(this.merchant.value)) {
          this.merchant.setValue('');
          if (this.type.value === EType.FLEET) {
            this.cardGroup.setValue('');
            this.cardGroup.disable();
            this.hintCardGroupIfTypeFleet = true;
          } else {
            this.cardGroup.enable();
            this.hintCardGroupIfTypeFleet = false;
          }
          this.merchant.updateValueAndValidity();
          this.cardGroup.updateValueAndValidity();
        }
      });
  }

  fetchCardRanges() {
    this.apiCardRangeService
      .indexCardRange(0, 100, {...(this.type.value && {type: this.type.value})})
      .subscribe((value) => {
        this.cardRanges = value.items.filter((cardRange) => {
          if (!cardRange.currentNumber) {
            return cardRange;
          } else if (Number(cardRange.endNumber) - Number(cardRange.currentNumber) > 0) {
            return cardRange;
          }
        });
      });
  }

  fetchCardGroups() {
    this.apiCardGroupService
      .indexCardGroups(0, 100, {
        cardType: this.type.value || null,
        merchantId: this.merchant.value || null,
      })
      .subscribe((value) => {
        this.cardGroups = value.items;
      });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    if (!this.cardGroup.value) {
      this.cardGroup.setErrors({required: true});
      return;
    }

    if (this.loading) {
      return;
    }
    this.loading = true;

    const data: any = _.pickBy(this.form.value, _.identity);
    data.physicalType = data.physicalType || this.physicalType.value;
    data.numberOfCards = this.numberOfCards.value;
    data.merchantId = data.merchant;
    if (data.vehicle) {
      delete data.vehicle;
    }
    this.apiCardsService.createCardBulk(data).subscribe(
      (res) => {
        this.loading = false;
        this.dialogRef.close({isSuccess: true, data: res});
      },
      (err) => {
        this.loading = false;
        console.log(err);
        this.dialogRef.close({
          isSuccess: false,
          data: err.console.error.message
            ? err.error.message.toString()
            : 'Some error was occurred, please try again',
        });
      },
    );
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onFormChange(controlName?: string) {
    if (this.type.value === EType.GIFT) {
      this.form.controls['preload'].enable();
      this.form.controls['preload'].setValidators(Validators.required);
    } else {
      this.form.controls['preload'].disable();
      this.form.controls['preload'].setValidators(null);
    }

    if (this.formFactor.value === EFormFactor.PHYSICAL) {
      this.physicalType.enable();
      this.physicalType.setValidators(Validators.required);
      if (this.type.value === EType.FLEET) {
        if (controlName === 'type') {
          this.physicalType.setValue(EPhysicalType.CHIP);
        }
        this.physicalTypes = this.physicalTypesNotScratch;
      } else if (this.type.value === EType.LOYALTY) {
        if (controlName === 'type') {
          this.physicalType.setValue(EPhysicalType.MAGSTRIPE);
        }
        this.physicalTypes = this.physicalTypesNotScratch;
      } else if (this.type.value === EType.GIFT) {
        this.physicalTypes = this.physicalTypesContainScratch;
      } else {
        this.physicalTypes = this.physicalTypesContainScratch;
      }
    } else {
      this.physicalType.setValue('');
      this.physicalType.disable();
      this.physicalType.clearValidators();
    }

    if (this.type.value === EType.FLEET) {
      this.subtype.enable();
      this.subtype.setValidators(Validators.required);
    } else {
      this.subtype.setValue('');
      this.subtype.disable();
      this.subtype.clearValidators();
    }

    if (this.type.dirty) {
      this.cardRange.setValue('');
      this.cardGroup.setValue('');
      this.fetchCardGroups();
      this.fetchCardRanges();
    }

    if (this.type.value === EType.FLEET && !this.merchant.value) {
      this.cardGroup.setValue('');
      this.cardGroup.disable();
      this.hintCardGroupIfTypeFleet = true;
    } else {
      this.cardGroup.enable();
      this.hintCardGroupIfTypeFleet = false;
    }

    if (this.type.value === EType.FLEET || this.type.value === EType.GIFT) {
      this.merchant.enable();
    } else {
      this.merchant.setValue('');
      this.merchant.disable();
    }
    if (this.type.value === EType.FLEET) {
      this.merchant.setValidators(Validators.required);
    } else {
      this.merchant.clearValidators();
    }

    if (
      this.type.value === EType.FLEET &&
      (this.subtype.value === ESubtype.DRIVER || this.subtype.value === ESubtype.STANDALONE)
    ) {
      this.cardholderName.enable();
      this.cardholderName.setValidators(Validators.required);
      this.displayName.enable();
    } else if (this.type.value === EType.LOYALTY || this.type.value === EType.GIFT) {
      this.cardholderName.enable();
      this.cardholderName.clearValidators();
      this.displayName.enable();
    } else {
      this.cardholderName.setValue('');
      this.cardholderName.disable();
      this.displayName.disable();
    }

    if (
      this.type.value === EType.FLEET &&
      (this.subtype.value === ESubtype.DRIVER || this.subtype.value === ESubtype.STANDALONE)
    ) {
      this.pinRequired.enable();
    } else {
      this.pinRequired.setValue(false);
      this.pinRequired.disable();
    }

    if (
      this.type.value === EType.FLEET &&
      (this.subtype.value === ESubtype.VEHICLE || this.subtype.value === ESubtype.STANDALONE)
    ) {
      this.mileageReading.enable();
    } else {
      this.mileageReading.setValue(false);
      this.mileageReading.disable();
    }

    if (
      this.type.value === EType.FLEET &&
      (this.subtype.value === ESubtype.VEHICLE || this.subtype.value === ESubtype.STANDALONE)
    ) {
      this.vehicle.enable();
      if (this.subtype.value === ESubtype.VEHICLE) {
        this.vehicle.setValidators(Validators.required);
      } else {
        this.vehicle.clearValidators();
      }
    } else {
      this.vehicle.setValue('');
      this.vehicle.clearValidators();
      this.vehicle.disable();
    }

    if (this.type.value === EType.FLEET) {
      this.numberOfCards.setValue(1);
      this.numberOfCards.disable();
    } else {
      this.numberOfCards.enable();
      if (!this.numberOfCards.value) {
        this.numberOfCards.setValue(1);
      }
    }

    this.physicalType.updateValueAndValidity();
    this.subtype.updateValueAndValidity();
    this.cardRange.updateValueAndValidity();
    this.merchant.updateValueAndValidity();
    this.cardGroup.updateValueAndValidity();
    this.pinRequired.updateValueAndValidity();
    this.mileageReading.updateValueAndValidity();
    this.numberOfCards.updateValueAndValidity();
    this.cardholderName.updateValueAndValidity();
    this.displayName.updateValueAndValidity();
    this.form.controls['preload'].updateValueAndValidity();
  }

  get formFactor() {
    return this.form.get('formFactor') as FormControl;
  }

  get type() {
    return this.form.get('type') as FormControl;
  }

  get physicalType() {
    return this.form.get('physicalType') as FormControl;
  }

  get subtype() {
    return this.form.get('subtype') as FormControl;
  }

  get cardRange() {
    return this.form.get('cardRange') as FormControl;
  }

  get merchant() {
    return this.form.get('merchant') as FormControl;
  }

  get cardGroup() {
    return this.form.get('cardGroup') as FormControl;
  }

  get cardholderName() {
    return this.form.get('cardholderName') as FormControl;
  }

  get displayName() {
    return this.form.get('displayName') as FormControl;
  }

  get pinRequired() {
    return this.form.get('pinRequired') as FormControl;
  }

  get mileageReading() {
    return this.form.get('mileageReading') as FormControl;
  }

  get vehicle() {
    return this.form.get('vehicle') as FormControl;
  }

  get numberOfCards() {
    return this.form.get('numberOfCards') as FormControl;
  }

  get searchMerchant() {
    return this.form.get('searchMerchant') as FormControl;
  }

  onKeyPress(e: KeyboardEvent) {
    // eslint-disable-next-line  import/no-deprecated
    if (e.charCode < 48 || e.charCode > 57) {
      e.preventDefault();
    }
  }
}
