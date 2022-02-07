import {Component, OnInit, Input, forwardRef} from '@angular/core';
import {uuidv4} from '../../helpers/common';
import {IDropdownItem} from './dropdown.interface';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DropdownComponent), multi: true},
  ],
})
export class DropdownComponent implements OnInit, ControlValueAccessor {
  @Input()
  label = '';
  @Input()
  items: IDropdownItem[] = [];
  @Input()
  type = '';
  @Input()
  errorMessage = '';
  @Input()
  placeholder = '';
  @Input()
  helper = '';
  @Input()
  pluckValue = false;

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

  ngOnInit() {}

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
