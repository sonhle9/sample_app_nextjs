import {Component, Inject} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {IDevice} from '../../../../shared/interfaces/devices';

interface IConfirmData {
  title: string;
  device: IDevice;
  withRemark: boolean;
}

@Component({
  selector: 'app-device-confirm-modal',
  templateUrl: './deviceConfirmModal.component.html',
  styleUrls: ['./deviceConfirmModal.component.scss'],
})
export class DeviceConfirmModalComponent {
  remarkForm = this.formBuilder.group({
    remark: ['', [Validators.required, Validators.maxLength(400)]],
  });

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: IConfirmData,
  ) {}
}
