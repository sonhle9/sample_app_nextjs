import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {uuidv4} from '../../helpers/common';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => RadioComponent), multi: true},
  ],
})
export class RadioComponent implements ControlValueAccessor {
  @Input()
  value = '';
  @Input()
  name = '';

  private _value: any;
  private _onChangeCallback: (_: any) => unknown;

  get checked(): boolean {
    return this._value === this.value;
  }

  id = uuidv4();

  constructor() {}

  writeValue(value: any) {
    this._value = value;
  }

  registerOnChange(fn: any) {
    this._onChangeCallback = fn;
  }

  registerOnTouched() {}

  change() {
    this._onChangeCallback(this.value);
  }
}
