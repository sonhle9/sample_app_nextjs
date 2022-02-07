import {Component, OnInit, Input, forwardRef} from '@angular/core';
import {uuidv4} from '../../helpers/common';
import {IComboBoxItem} from './combo-box.interface';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';

@Component({
  selector: 'app-combo-box',
  templateUrl: './combo-box.component.html',
  styleUrls: ['./combo-box.component.scss'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ComboBoxComponent), multi: true},
  ],
})
export class ComboBoxComponent implements OnInit, ControlValueAccessor {
  @Input()
  label = '';
  @Input()
  items: IComboBoxItem[] = [];
  @Input()
  type = '';
  @Input()
  errorMessage = '';
  @Input()
  helper = '';

  id = uuidv4();
  dataListId = uuidv4();

  private _backup: IComboBoxItem;
  private _value: IComboBoxItem;
  private _onChangeCallback: (_: any) => unknown;

  get value(): any {
    return this._value ? this._value.text : '';
  }
  @Input()
  set value(value: any) {
    if (!value) {
      this._onChangeCallback((this._value = undefined));
      return;
    }

    if (this._value && this._value.text === value) {
      return;
    }

    const items = this.items || [];
    const found = items.find((s) => s.text === value);
    if (!found) {
      return;
    }

    this._value = found;
    this._onChangeCallback(found);
  }

  get hasError(): boolean {
    return !!this.errorMessage;
  }

  searchValue: string;

  constructor() {}

  ngOnInit() {}

  writeValue(value: any) {
    this._value = value;
  }

  registerOnChange(fn: any) {
    this._onChangeCallback = fn;
  }

  registerOnTouched() {}

  clearInput() {
    this._backup = this._value;
    this._value = null;
  }

  undoInput() {
    this._value = this._backup;
  }
}
