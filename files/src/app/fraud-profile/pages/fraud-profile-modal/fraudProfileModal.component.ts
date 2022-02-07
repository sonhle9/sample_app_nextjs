import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormArray, FormControl, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {
  ApiBlacklistService,
  FraudProfilesRestrictionType,
  FraudProfilesStatus,
  IFraudProfiles,
  FraudProfilesRestrictionValue,
} from 'src/app/api-blacklist-service';
import {AppFormBuilder, AppFormGroup} from 'src/shared/helpers/formGroup';

@Component({
  selector: 'app-fraud-profile-modal',
  templateUrl: './fraudProfileModal.component.html',
  styleUrls: ['./fraudProfileModal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FraudProfileModalComponent implements OnInit {
  loading = true;

  form: AppFormGroup;

  data: IFraudProfiles;

  remarks = '';

  statusList = Object.keys(FraudProfilesStatus);
  restrictionList = Object.keys(FraudProfilesRestrictionType).map((type) => ({
    type,
    checked: true,
  }));

  isShowRestrictionsInput = false;

  constructor(
    private dialogRef: MatDialogRef<FraudProfileModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    fb: AppFormBuilder,
    private readonly apiBlacklistService: ApiBlacklistService,
  ) {
    this.data = data;
    const registationFlatten: string[] = this.data.restrictions
      ? this.data.restrictions.map((e) => e.type)
      : [];

    this.restrictionList.forEach((item) => (item.checked = registationFlatten.includes(item.type)));
    const registations = this.data.restrictions
      ? registationFlatten.map((type) => new FormControl(type))
      : [];
    this.form = fb.group({
      status: [this.data.status, [Validators.required]],
      restrictions: fb.array(registations, []),
      remarks: [this.data.remarks],
    });
  }

  ngOnInit(): void {
    this.loading = false;
    this.updateIsShowRestrictionsInput(this.data.status);
  }

  onRestrictionsChanged(e) {
    const restrictions: FormArray = this.form.get('restrictions') as FormArray;

    if (e.target.checked) {
      restrictions.push(new FormControl(e.target.value));
    } else {
      const index = restrictions.controls.findIndex((x) => x.value === e.target.value);
      restrictions.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const fraudProfile = {
      ...this.data,
      status: this.form.value.status,
      restrictions: this.form.value.restrictions.map((e) => ({
        type: e,
        value: FraudProfilesRestrictionValue.BLOCK,
      })),
      remarks: this.form.value.remarks == null ? '' : this.form.value.remarks,
    };

    this.apiBlacklistService.createOrUpdateFraudProfile(fraudProfile).subscribe(
      (res) => {
        this.loading = false;
        this.dialogRef.close({isSuccess: true, data: res});
      },
      (err) => {
        this.loading = false;
        console.log(err);
        this.dialogRef.close({
          isSuccess: false,
          data: err.error.message
            ? err.error.message.toString()
            : 'Some error was occurred, please try again',
        });
      },
    );
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onStatusChange($event) {
    this.updateIsShowRestrictionsInput($event.value);
  }

  updateIsShowRestrictionsInput(status: FraudProfilesStatus) {
    this.isShowRestrictionsInput = status !== FraudProfilesStatus.CLEARED;
  }
}
