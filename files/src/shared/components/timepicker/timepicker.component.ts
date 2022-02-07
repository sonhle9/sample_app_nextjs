import {Component, forwardRef, Input} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import {uuidv4} from '../../helpers/common';

@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TimepickerComponent), multi: true},
  ],
})
export class TimepickerComponent implements ControlValueAccessor {
  @Input()
  label = '';
  @Input()
  enabled = true;
  @Input()
  errorMessage = '';
  @Input()
  helper = '';

  id = uuidv4();

  private _value: any = '';
  _onChangeCallback: (_: any) => unknown;
  _onTouchedCallback: (_: any) => unknown;

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
    this._value = value;
  }

  registerOnChange(fn: any) {
    this._onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this._onTouchedCallback = fn;
  }
}
