import {Component, forwardRef, Input} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import {uuidv4} from '../../helpers/common';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatepickerComponent), multi: true},
  ],
})
export class DatepickerComponent implements ControlValueAccessor {
  @Input()
  label = '';
  @Input()
  enabled = true;
  @Input()
  errorMessage = '';
  @Input()
  helper = '';
  @Input()
  pickerType: string;
  @Input()
  allowClearing = false;

  id = uuidv4();

  private _value: any = '';
  private _onChangeCallback: (_: any) => unknown;

  get value(): any {
    return this._value;
  }
  @Input()
  set value(value: any) {
    if (value !== this._value) {
      this._value = value;
      this._onChangeCallback(value);
    }
  }

  get hasError(): boolean {
    return !!this.errorMessage;
  }

  constructor() {}

  writeValue(value: any) {
    this._value = !value || value instanceof Date ? value : new Date(value);
  }

  registerOnChange(fn: any) {
    this._onChangeCallback = fn;
  }

  registerOnTouched() {}

  disableTyping(event: Event) {
    event.preventDefault();
  }

  clear() {
    if (this.allowClearing) {
      this.value = '';
    }
  }
}
