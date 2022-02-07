import {Component, Inject, OnInit} from '@angular/core';
import {Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {combineLatest, Observable, of} from 'rxjs';
import {map, shareReplay, startWith, switchMapTo} from 'rxjs/operators';
import {
  AppFormBuilder,
  AppFormGroup,
  AppValidators,
} from '../../../../../../../shared/helpers/formGroup';
import {ApiProcessorService} from '../../../../../../api-processor.service';
import {IDialogData} from '../payout-projection.type';

@Component({
  selector: 'app-calculate-projection-modal',
  templateUrl: './calculate-projection-modal.component.html',
  styleUrls: ['./calculate-projection-modal.component.scss'],
})
export class CalculateProjectionModalComponent implements OnInit {
  form: AppFormGroup;
  maxPayout$: Observable<number>;
  data: IDialogData;
  projectedAmount$: Observable<number>;

  loaded$: Observable<boolean>;

  constructor(
    private dialogRef: MatDialogRef<CalculateProjectionModalComponent>,
    private fb: AppFormBuilder,
    @Inject(MAT_DIALOG_DATA) data: IDialogData,
    private readonly service: ApiProcessorService,
  ) {
    this.form = this.fb.group({
      bufferDays: [2, [Validators.required, Validators.min(0), AppValidators.integerOnly]],
      discretionaryBuffer: [
        '',
        [Validators.required, Validators.min(0), AppValidators.integerOnly],
      ],
    });
    this.data = data;
  }

  ngOnInit(): void {
    this.maxPayout$ = this.service.getPayoutMax(this.data.referenceDate).pipe(
      map((value) => Number(value.totalAmount) || 0),
      shareReplay(1),
    );
    this.loaded$ = this.maxPayout$.pipe(switchMapTo(of(true)));

    const formValues$ = this.form.valueChanges.pipe(startWith(this.form.value));
    // eslint-disable-next-line import/no-deprecated
    this.projectedAmount$ = combineLatest(this.maxPayout$, formValues$).pipe(
      map(
        ([maxPayout, formValues]) =>
          (this.data.numOfHolidayOrWeekend + 1 + formValues.bufferDays) *
          maxPayout *
          (1 + formValues.discretionaryBuffer / 100),
      ),
    );
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
