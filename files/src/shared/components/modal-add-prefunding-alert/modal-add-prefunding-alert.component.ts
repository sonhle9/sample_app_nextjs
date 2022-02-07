import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {PrefundingBalanceAlertTypes} from '../../interfaces/prefundingBalance.interface';
import {ApiPaymentsService} from '../../../app/api-payments.service';
import {serviceHttpErrorHandler} from '../../helpers/errorHandling';
import {IDropdownItem} from '../dropdown/dropdown.interface';

@Component({
  selector: 'app-modal-add-prefunding-alert',
  templateUrl: './modal-add-prefunding-alert.component.html',
  styleUrls: ['./modal-add-prefunding-alert.component.scss'],
})
export class ModalAddPrefundingAlertComponent implements OnInit {
  @Input()
  isShowModal: boolean;

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output()
  success: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  cancel: EventEmitter<any> = new EventEmitter<any>();

  type: IDropdownItem;
  text: string;
  limit: number;

  typeOptions;

  textError?;
  limitError?;

  constructor(private paymentsService: ApiPaymentsService) {
    this.typeOptions = Object.keys(PrefundingBalanceAlertTypes).map((key: string) => ({
      text: key,
      value: PrefundingBalanceAlertTypes[key],
    }));
    this.type = this.typeOptions[0];
  }

  ngOnInit() {}

  setText(event) {
    this.textError = null;
    this.text = event.target.value;
  }

  setLimit(event) {
    this.limitError = null;
    this.limit = Number.parseInt(event.target.value, 10);
  }

  cancelMethod(): void {
    this.cancel.emit(true);
  }

  submitMethod() {
    if (!this.text) {
      this.textError = 'Alert message is required';
      return;
    }

    if (!this.limit) {
      this.limitError = 'Limit value is required';
      return;
    }

    this.paymentsService
      .addPrefundingBalanceAlert({
        type: this.type.value,
        text: this.text,
        limit: this.limit,
      })
      .subscribe(
        () => this.success.emit(true),
        (err) => serviceHttpErrorHandler(err),
      );
  }
}
