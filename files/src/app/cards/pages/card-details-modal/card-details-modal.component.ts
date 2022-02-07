import {Component, Inject, OnInit, OnDestroy, ViewEncapsulation} from '@angular/core';
import {Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as _ from 'lodash';
// import { filter, tap, takeUntil, debounceTime, map, concatAll} from 'rxjs/operators';
import {AppFormBuilder, AppFormGroup} from 'src/shared/helpers/formGroup';
import {
  RoutingsCriteriaParam,
  RoutingsCriteriaParamDependencies,
} from '../../../routings/shared/const-var';
import {ApiCardService} from 'src/app/api-cards.service';
import {Subject} from 'rxjs';
import {convertEnumToObject} from '../../shared/common';
import {Statuses, Reason, Types, FormFactor, PhysicalType, Subtype} from '../../shared/enums';
import {ApiCardGroupService} from 'src/app/api-card-groups.service';

@Component({
  selector: 'app-card-details-modal',
  templateUrl: './card-details-modal.component.html',
  styleUrls: ['./card-details-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CarddetailsModalComponent implements OnInit, OnDestroy {
  loading = true;

  form: AppFormGroup;
  fb: AppFormBuilder;

  data: any;

  statuses: any = [];

  reasons: any[] = convertEnumToObject(Reason, true);

  types: any[] = convertEnumToObject(Types, true);

  formFactors: any[] = convertEnumToObject(FormFactor, true);

  physicalTypes: any[] = convertEnumToObject(PhysicalType, true);

  subtypes: any[] = convertEnumToObject(Subtype, true);

  objStatus: any = [];

  cardGroups: any[];

  _onDestroy = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<CarddetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    fb: AppFormBuilder,
    private readonly apiCardsService: ApiCardService,
    private readonly apiCardGroupService: ApiCardGroupService,
  ) {
    this.data = data;
    this.fb = fb;
    this.form = fb.group({
      status: [this.data.status, [Validators.required]],
      reason: [this.data.reason],
      remark: [this.data.remark],
      type: [this.data.type, [Validators.required]],
      formFactor: [this.data.formFactor, [Validators.required]],
      physicalType: [this.data.physicalType],
      subtype: [this.data.subtype],
      cardGroup: [this.data.cardGroup?.id, [Validators.required]],
    });
    switch (this.data.status) {
      case 'active':
        convertEnumToObject(Statuses, true).forEach(
          (item) =>
            item.name !== 'pending' &&
            this.statuses.push({
              text: item.id,
              value: item.name,
            }),
        );
        break;
      case 'pending':
        convertEnumToObject(Statuses, true).forEach(
          (item) =>
            item.name !== 'frozen' &&
            this.statuses.push({
              text: item.id,
              value: item.name,
            }),
        );
        break;
      case 'frozen':
        convertEnumToObject(Statuses, true).forEach(
          (item) =>
            item.name !== 'pending' &&
            item.name !== 'closed' &&
            this.statuses.push({
              text: item.id,
              value: item.name,
            }),
        );
        break;
      case 'closed':
        convertEnumToObject(Statuses, true).forEach(
          (item) =>
            item.name === 'closed' &&
            this.statuses.push({
              text: item.id,
              value: item.name,
            }),
        );
        break;
    }
    this.fetchCardGroups();
  }

  getCriteria(data) {
    const form = {
      type: [data.type, [Validators.required]],
      value: [data.value, [Validators.required]],
    };
    return this.fb.group(form);
  }

  getAvailableTypes() {
    const checkingParams = Object.keys(RoutingsCriteriaParamDependencies);

    const passedParams = [];
    for (let i = 0, len = checkingParams.length; i < len; i++) {
      if (this.form.value.paymentMethod === RoutingsCriteriaParamDependencies[checkingParams[i]]) {
        passedParams.push(checkingParams[i]);
      }
    }

    return _.difference(
      Object.values(RoutingsCriteriaParam),
      _.difference(checkingParams, passedParams),
    );
  }

  ngOnInit(): void {
    this.loading = false;
  }

  fetchCardGroups() {
    this.apiCardGroupService.indexCardGroups(0, 100).subscribe((value) => {
      this.cardGroups = value.items;
    });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  selectStatus(e) {
    if (e === Statuses.FROZEN || e === Statuses.CLOSED) {
      this.form.controls['reason'].setValidators([Validators.required]);
    } else {
      this.form.controls['reason'].setValidators([]);
    }
    this.form.controls['reason'].updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    if (this.loading) {
      return;
    }
    this.loading = true;

    const input = {
      status: this.form.value.status,
      // reason: this.form.value.reason,
      ...(this.form.value.reason !== 'none' && {reason: this.form.value.reason}),
      remark: this.form.value.remark,
      type: this.form.value.type,
      formFactor: this.form.value.formFactor,
      physicalType: this.form.value.physicalType,
      subtype: this.form.value.subtype,
      ...(this.form.value.cardGroup && {cardGroup: this.form.value.cardGroup}),
    };
    this.apiCardsService.updateCard(this.data.id, input).subscribe(
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
}
