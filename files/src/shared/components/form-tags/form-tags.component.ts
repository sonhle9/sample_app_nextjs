import {
  Component,
  Input,
  forwardRef,
  OnInit,
  AfterViewInit,
  Renderer2,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import {FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import {AppValidators} from '../../../shared/helpers/formGroup';
import {uuidv4} from '../../helpers/common';

@Component({
  selector: 'app-form-tags',
  templateUrl: './form-tags.component.html',
  styleUrls: ['./form-tags.component.scss'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FormTagsComponent), multi: true},
  ],
})
export class FormTagsComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  @Input()
  errorMessage = '';
  errorState = false;

  @ViewChild('textInput', {static: false})
  textInput: ElementRef;

  tagsContainer = [];
  id = uuidv4();

  tagForm = this.fb.group(
    {
      tag: ['', AppValidators.tagValidatorForInput],
    },
    {updateOn: 'change'},
  );

  private _value: any = '';
  _onChangeCallback: (_: any) => unknown;
  _onTouchedCallback: (_: any) => unknown;
  focused: boolean;

  public get value(): any {
    return this._value;
  }
  @Input()
  public set value(value: any) {
    if (value !== this._value) {
      this._value = value;
      this._onChangeCallback(value);
      this.tagsContainer = value.split(',');
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

  get hasError(): boolean {
    return !!this.errorMessage;
  }

  hasControlErrors(): boolean {
    if (this.tagForm.controls.tag.errors) {
      return Object.keys(this.tagForm.controls.tag.errors).length > 0;
    }

    return false;
  }

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initInputState();
  }

  initInputState() {
    if (this._value) {
      this.tagsContainer = this._value.split(',');
      this.cd.detectChanges();
    }

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

  getTags() {
    return this.tagsContainer;
  }

  onRemoveTag(tag: string) {
    this.tagsContainer = this.tagsContainer.filter((item) => item !== tag);
    this._value = this.tagsContainer.join(',');
    this._onChangeCallback(this._value);
  }

  onSubmitTag() {
    this.tagsContainer.push(this.tagForm.value.tag);
    this._value = this.tagsContainer.join(',');
    this.tagForm.reset();
    this._onChangeCallback(this._value);
  }
}
