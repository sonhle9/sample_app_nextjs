import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AppValidators} from '../../../../shared/helpers/formGroup';
import {IDropdownItem} from '../../../../shared/components/dropdown/dropdown.interface';
import {ApiVouchersService} from '../../../api-vouchers.service';

@Component({
  selector: 'app-vouchers-batch-rules',
  templateUrl: './vouchersBatchRules.html',
  styleUrls: ['./vouchersBatchRules.scss'],
})
export class VouchersBatchRulesComponent implements OnInit {
  @Input() rulesForm: FormGroup;
  @Input() index: number;
  @Input() rulesCount: number;

  @Output() removeRule: EventEmitter<any> = new EventEmitter<number>();

  expiryType = [true];
  errorMessage;
  ruleTypesEnum: IDropdownItem[] = [
    {
      text: 'Topup-regular',
      value: 'topup-regular',
    },
    {
      text: 'Topup-bonus',
      value: 'topup-bonus',
    },
  ];

  constructor(private apiVouchersService: ApiVouchersService) {}

  markAllControlsAsDirty = (form: FormGroup) => {
    for (const name of Object.keys(form.controls)) {
      const ctrl = form.controls[name];
      ctrl.markAsDirty();
      ctrl.markAsTouched();
    }
  };

  ngOnInit() {
    this.errorMessage = AppValidators.initErrorMessageObject(this.rulesForm);

    this.apiVouchersService.validationForm.subscribe(() => {
      this.markAllControlsAsDirty(this.rulesForm);
      this.errorMessage = AppValidators.getErrorMessageObject(this.rulesForm);
    });

    this.apiVouchersService.resetForm.subscribe(() => {
      this.rulesForm.reset();
      this.errorMessage = [];
    });

    const ruleValue = this.rulesForm.controls.type.value;
    if (ruleValue) {
      const rule = this.ruleTypesEnum.find((type) => type.value === ruleValue);
      this.rulesForm.controls.type.setValue(rule);
    }
    if (this.rulesForm.controls.daysToExpire.value) {
      this.expiryType = [];
    }
  }

  removeRuleEntity() {
    this.removeRule.emit(this.index);
  }

  isRemoveBtnVisible(): boolean {
    return this.rulesCount > 1;
  }

  changeExpiryType() {
    this.rulesForm.controls.expiryDate.reset();
    delete this.errorMessage.expiryDate;
    this.rulesForm.controls.daysToExpire.reset();
    delete this.errorMessage.daysToExpire;
  }
}
