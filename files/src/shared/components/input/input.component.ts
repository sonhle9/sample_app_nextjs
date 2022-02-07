import {
  Component,
  forwardRef,
  Input,
  Renderer2,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {uuidv4} from '../../helpers/common';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputComponent), multi: true},
  ],
})
export class InputComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  @Input()
  label = '';
  @Input()
  placeholder = '';
  @Input()
  type = 'text';
  @Input()
  errorMessage = '';
  @Input()
  maxlength;
  @Input()
  readonly = false;
  @Input()
  icon = '';
  @Input()
  helper = '';
  @Input()
  active = false;
  @Input()
  disableIcon = false;

  @Input()
  prefix = '';

  @ViewChild('textInput', {static: false})
  textInput: ElementRef;

  id = uuidv4();

  showPassword: boolean;
  focused: boolean;

  _type = this.type;
  _disabled;

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

  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  get empty(): boolean {
    if (!this.textInput) {
      return true;
    }

    const input = this.textInput.nativeElement;
    if (!input) {
      return true;
    }

    return !input.value;
  }

  get textarea() {
    return this._type === 'textarea';
  }

  get password() {
    return this._type === 'password';
  }

  get passwordIcon() {
    if (!this.password) {
      return '';
    }

    return this.showPassword
      ? `assets/images/icons/visibility.svg`
      : `assets/images/icons/visibility-off.svg`;
  }

  get hasError(): boolean {
    return !!this.errorMessage;
  }

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this._type = this.type;
  }

  ngAfterViewInit() {
    this.initInputState();
  }

  setDisabledState(isDisabled: boolean) {
    this._disabled = isDisabled;
  }

  initInputState() {
    const input = this.textInput.nativeElement;
    if (!input) {
      return;
    }

    this.renderer.listen(input, 'focus', () => {
      this.focusChanged(true);
    });

    this.renderer.listen(input, 'blur', () => {
      this.focusChanged(false);
    });
  }

  private focusChanged(isFocused: boolean) {
    this.focused = isFocused;
  }

  writeValue(value: any) {
    this._value = value;
  }

  registerOnChange(fn: any) {
    this._onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this._onTouchedCallback = fn;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
    this.type = this.showPassword ? 'text' : 'password';
  }
}
