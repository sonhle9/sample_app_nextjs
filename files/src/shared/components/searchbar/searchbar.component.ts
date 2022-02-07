import {Component, OnInit, Input, Output, EventEmitter, forwardRef} from '@angular/core';
import {uuidv4} from '../../helpers/common';
import {NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SearchbarComponent), multi: true},
  ],
})
export class SearchbarComponent implements OnInit {
  @Input()
  label;
  @Input()
  placeholder = '';
  @Input()
  formClass = '';
  @Input()
  buttonClass = '';
  @Input()
  maxlength;
  @Input()
  readonly = '';

  @Output()
  search$ = new EventEmitter<any>();

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

  constructor() {}

  ngOnInit() {}

  innerSearch() {
    this.search$.emit();
  }

  writeValue(value: any) {
    this._value = value;
  }

  registerOnChange(fn: any) {
    this._onChangeCallback = fn;
  }

  registerOnTouched() {}
}
