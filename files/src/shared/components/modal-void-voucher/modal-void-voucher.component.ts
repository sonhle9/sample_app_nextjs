import {Component, Input, Output, EventEmitter} from '@angular/core';

import {serviceHttpErrorHandler} from '../../helpers/errorHandling';
import {ApiVouchersService} from '../../../app/api-vouchers.service';

@Component({
  selector: 'app-modal-void-voucher',
  templateUrl: './modal-void-voucher.component.html',
  styleUrls: ['./modal-void-voucher.component.scss'],
})
export class ModalVoidVoucherComponent {
  @Input()
  isShowModal: boolean;

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output()
  success: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  cancel: EventEmitter<any> = new EventEmitter<any>();

  code: string;
  codeError?;

  constructor(private vouchersService: ApiVouchersService) {}

  setCode(event) {
    this.codeError = null;
    this.code = event.target.value;
  }

  cancelMethod(): void {
    this.cancel.emit(true);
  }

  submitMethod() {
    if (!this.code) {
      this.codeError = 'Code is required';
      return;
    }

    this.vouchersService.voidVoucher(this.code).subscribe(
      () => this.success.emit(true),
      (err) => {
        this.codeError = (err.error && err.error.message) || err.message;
        serviceHttpErrorHandler(err);
      },
    );
  }
}
