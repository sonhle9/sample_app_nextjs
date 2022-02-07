import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {uuidv4} from '../../helpers/common';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CheckboxComponent), multi: true},
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input()
  value: any;
  @Input()
  name = '';
  @Input()
  type = '';
  @Input()
  disabled = false;

  get cssClass() {
    return `${this.disabled ? 'disabled' : ''} ${this.type}`;
  }

  private _value = [];
  private _onChangeCallback: (_: any) => unknown;

  get checked(): any {
    return (this._value || []).indexOf(this.value) !== -1;
  }

  id = uuidv4();

  constructor() {}

  writeValue(value) {
    this._value = value || [];
  }

  registerOnChange(fn: any) {
    this._onChangeCallback = fn;
  }

  registerOnTouched() {}

  change(event) {
    if (this.disabled) {
      return;
    }

    this.manageValues(event);
    this._onChangeCallback(this._value || []);
  }

  manageValues(event) {
    this._value = Array.isArray(this._value) ? this._value || [] : [this._value];
    const index = this._value.indexOf(this.value);
    const checked = event.target.checked;

    if ((index !== -1 && checked) || (index === -1 && !checked)) {
      return;
    }

    if (checked) {
      this._value.push(this.value);
    } else {
      this._value.splice(index, 1);
    }
  }
}
