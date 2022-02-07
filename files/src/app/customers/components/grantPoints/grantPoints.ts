import {AppFormBuilder, AppFormGroup, AppValidators} from '../../../../shared/helpers/formGroup';
import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {Validators} from '@angular/forms';
import {GrantPointsModalComponent} from '../../pages/grant-points-modal/grant-points-modal.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  moduleId: module.id,
  selector: 'app-grant-points',
  templateUrl: 'grantPoints.html',
  styleUrls: ['grantPoints.scss'],
})
export class GrantPointsComponent implements OnChanges, OnDestroy {
  @Input()
  customerId: string;
  @Output()
  added: EventEmitter<any> = new EventEmitter<any>();

  isAdd = false;
  loading = false;

  form: AppFormGroup;
  errorMessage;

  messageContent;
  messageType;

  allSub: Subject<any> = new Subject<any>();

  constructor(private fb: AppFormBuilder, public dialog: MatDialog) {
    this.form = this.fb.group({
      amount: ['', [Validators.required, AppValidators.decimalOnly]],
      title: [''],
    });
    this.errorMessage = AppValidators.initErrorMessageObject(this.form);
  }

  ngOnChanges() {}

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  proceedAdd() {
    this.isAdd = true;
  }

  openGrantPointsModal() {
    this.form.markAllAsDirty();
    this.errorMessage = AppValidators.getErrorMessageObject(this.form);

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const {amount} = this.form.value;

    const dialogRef = this.dialog.open(GrantPointsModalComponent, {
      width: '500px',
      data: {userId: this.customerId, grandTotal: amount},
    });

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result && result.status === 'success') {
          this.loading = this.isAdd = false;
          this.messageContent = 'Loyalty points was successfully granted.';
          this.messageType = '';
          this.reset();
          this.added.emit(result.data);
        }

        this.loading = false;
      },
      () => {
        this.loading = false;
        this.messageContent = 'Oops! Unable to grant Loyalty points.';
        this.messageType = 'error';
      },
    );
  }

  reset() {
    this.form.patchValue({
      amount: '',
    });
    this.errorMessage = AppValidators.initErrorMessageObject(this.form);
  }
}
