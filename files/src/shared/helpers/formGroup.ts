import {FormBuilder, FormGroup, AbstractControl, FormArray, ValidatorFn} from '@angular/forms';
import {Injectable} from '@angular/core';
import moment from 'moment';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class AppFormBuilder extends FormBuilder {
  group(
    controlsConfig: {
      [key: string]: any;
    },
    extra?: {
      [key: string]: any;
    },
  ): AppFormGroup {
    const form = super.group(controlsConfig, extra) as AppFormGroup;
    form.markAllAsDirty = () => {
      for (const name of Object.keys(form.controls)) {
        const ctrl = form.controls[name];
        ctrl.markAsDirty();
        ctrl.markAsTouched();
      }
    };

    form.markAllAsPristine = () => {
      for (const name of Object.keys(form.controls)) {
        const ctrl = form.controls[name];
        ctrl.markAsPristine();
        ctrl.markAsUntouched();
      }
    };

    return form;
  }
}

export class AppFormGroup extends FormGroup {
  markAllAsDirty: () => void;
  markAllAsPristine: () => void;
}

export class AppValidators {
  static email(control: AbstractControl): {[key: string]: boolean} {
    // eslint-disable-next-line max-len
    const regEx = new RegExp(
      /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
    );

    if (!regEx.test(control.value)) {
      return {invalidEmail: true};
    }
  }

  static strongPassword(control: AbstractControl): {[key: string]: boolean} {
    const regEx = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');

    if (!regEx.test(control.value)) {
      return {weakPassword: true};
    }
  }

  static alphaNumeric(control: AbstractControl): {[key: string]: boolean} {
    if (control.value === undefined || control.value === '') {
      return;
    }

    const regEx = new RegExp(/^[a-z0-9]+$/i);
    if (!regEx.test(control.value)) {
      return {invalidAlphaNumeric: true};
    }
  }

  static numberOnly(control: AbstractControl): {[key: string]: boolean} {
    if (control.value === undefined || control.value === '') {
      return;
    }

    const isNan = Number.isNaN(+control.value);
    if (isNan) {
      return {invalidNumber: true};
    }
  }

  static integerOnly(control: AbstractControl): {[key: string]: boolean} {
    if (control.value === undefined || control.value === '') {
      return;
    }

    if (!_.isInteger(+control.value)) {
      return {invalidInteger: true};
    }
  }

  static arrayMinLength(min: number): ValidatorFn | any {
    return (control: AbstractControl[]) => {
      if (!(control instanceof FormArray)) {
        return;
      }
      return control.length < min ? {minLength: true} : null;
    };
  }

  static decimalOnly(control: AbstractControl): {[key: string]: boolean} {
    if (control.value === undefined || control.value === '') {
      return;
    }

    const regEx = new RegExp(/^[0-9]\d{0,9}(\.\d{1,2})?%?$/g);

    if (!regEx.test(control.value)) {
      return {invalidDecimal: true};
    }
  }

  static isValidNumber(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const numberRegex = new RegExp(/^[-+]?[0-9]*\.?[0-9]+$/);
      const valueStr = control.value.toString();
      const forbidden = valueStr.includes('e') || !valueStr.match(numberRegex);
      return forbidden ? {invalidNumber: {value: control.value}} : null;
    };
  }

  static notEquals(value: any): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const forbidden = value.toString() === control.value.toString();
      return forbidden ? {notEqual: {value}} : null;
    };
  }

  static max(max: number = 0): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      return control.value > max ? {max: {max}} : null;
    };
  }

  static biggerThan(value: number = 0): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      return Number(control.value) <= value ? {biggerThan: {value}} : null;
    };
  }

  static notZero(control: AbstractControl): {[key: string]: boolean} {
    if (Number(control.value) === 0) {
      return {notZero: true};
    }
  }

  static numberDecimal(decimal: number): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const originValue = parseFloat(control.value);
      const cutValue = parseFloat(originValue.toFixed(decimal));

      const forbidden = cutValue - originValue !== 0;
      return forbidden ? {numberDecimal: {decimal}} : null;
    };
  }

  static maxTopupAmount(max: number = 0): ValidatorFn {
    return (control: AbstractControl): {[key: string]: boolean} | null => {
      if (control.value === undefined || control.value === '') {
        return;
      }

      const amount = +control.value;
      if (amount > max) {
        return {[`maxTopupAmount_${max}`]: true};
      }
    };
  }

  static fixedNumber(fix: number = 0): ValidatorFn {
    return (control: AbstractControl): {[key: string]: boolean} | null => {
      if (control.value === undefined || control.value === '') {
        return;
      }

      if (control.value.length !== fix) {
        return {[`invalidfixedNumber_${fix}`]: true};
      }
    };
  }

  static mustSame(control1: AbstractControl, control2: AbstractControl) {
    const diff = control1.value !== control2.value;
    this.setOrAppend(control1, diff);
    this.setOrAppend(control2, diff);
  }

  static greaterThanNowDate(control: AbstractControl): {[key: string]: boolean} | null {
    if (!control.value) {
      return;
    }

    if (Number(control.value) <= Number(new Date())) {
      return {[`greaterThanNowDate`]: true};
    }
  }

  static greaterThanDate(
    control: AbstractControl,
    control2: AbstractControl,
  ): {[key: string]: boolean} | null {
    if (!control.value) {
      return;
    }

    if (Number(control.value) <= Number(control2.value)) {
      const errors = control.errors || {};
      errors['greaterThanDate'] = true;
      const err = Object.keys(errors).length !== 0 ? errors : undefined;
      control.setErrors(err);
    }
  }

  static isNotEmpty(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      return !control.value || control.value.toString().trim() === ''
        ? {isNotEmpty: {value: control.value}}
        : null;
    };
  }

  static checkDuration(endDateControl: AbstractControl) {
    if (!endDateControl.value) {
      return null;
    }
    // @ts-ignore
    // this refer to component where validation called
    if (moment(this.form.get('startDate').value).isBefore(endDateControl.value)) {
      return null;
    }

    return {endDateRange: true};
  }

  static validUrl(control: AbstractControl): {[key: string]: boolean} | null {
    if (!control.value) {
      return;
    }

    const regEx = new RegExp(
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/i,
    );
    if (!regEx.test(control.value)) {
      return {invalidUrl: true};
    }
  }

  private static setOrAppend(control: AbstractControl, diff: boolean) {
    const errors = control.errors || {};
    if (diff) {
      errors['notSamePassword'] = true;
    } else {
      delete errors['notSamePassword'];
    }
    const err = Object.keys(errors).length !== 0 ? errors : undefined;
    control.setErrors(err);
  }

  static initErrorMessageObject(form: FormGroup) {
    const obj = {};
    for (const ctrl of Object.keys(form.controls)) {
      obj[ctrl] = '';
    }

    return obj;
  }

  static initArrayErrorMessageObject(array: FormArray) {
    const obj = {};
    for (let i = 0, iLen = array.controls.length; i < iLen; i++) {
      const ctrl = array.controls[i];
      const local = AppValidators.initErrorMessageObject(ctrl as FormGroup);
      const value = Object.keys(local).reduce((map, loc) => {
        map[`${loc}_${i}`] = local[loc];
        return map;
      }, {});
      Object.assign(obj, value);
    }
    return obj;
  }

  static getErrorMessageObject(form: FormGroup) {
    if (form.valid) {
      return '';
    }

    const obj = {};
    for (const ctrl of Object.keys(form.controls)) {
      obj[ctrl] = '';
      const errors = this.getErrorKeys(form.controls[ctrl]);
      if (errors.length === 0) {
        continue;
      }
      const errorDetails = form.controls[ctrl].errors[errors[0]];
      obj[ctrl] = this.getErrorMessage(errors[0], errorDetails);
    }

    return obj;
  }

  static getArrayErrorMessageObject(array: FormArray) {
    const err = {};
    for (let i = 0, iLen = array.controls.length; i < iLen; i++) {
      const ctrl = array.controls[i];
      const local = AppValidators.getErrorMessageObject(ctrl as FormGroup);
      const value = Object.keys(local).reduce((map, obj) => {
        map[`${obj}_${i}`] = local[obj];
        return map;
      }, {});
      Object.assign(err, value);
    }
    return err;
  }

  static getFirstMessage(form: FormGroup): string {
    if (form.valid) {
      return '';
    }

    for (const ctrl of Object.keys(form.controls)) {
      const errors = this.getErrorKeys(form.controls[ctrl]);
      if (errors.length === 0) {
        continue;
      }
      return this.getErrorMessage(errors[0]);
    }
    return '';
  }

  private static getErrorMessage(key: string, errorDetails?: any) {
    key = key || '';

    if (key.startsWith('invalidfixedNumber_')) {
      return `This field must be ${key.split('_').pop()} characters long`;
    } else if (key.startsWith('maxTopupAmount_')) {
      return `Grant Wallet Balance Amount must be below RM${key.split('_').pop()}`;
    }

    switch (key) {
      case 'required':
        return `This field is required`;

      case 'invalidEmail':
        return `Email address is invalid`;

      case 'invalidDecimal':
      case 'invalidNumber':
        return `This field must be numeric`;
      case 'invalidInteger':
        return `This field must be integer`;
      case 'invalidAlphaNumeric':
        return `This field must be alhpa numeric`;

      case 'weakPassword':
        return `Need stronger password`;

      case 'notSamePassword':
        return `Both password must be the same`;

      case 'min':
        return `Number must be greater than ${errorDetails.min}`;

      case 'max':
        return `Number must be smaller than ${errorDetails.max}`;

      case 'biggerThan':
        return `Number must be bigger than ${errorDetails.value}`;

      case 'notZero':
        return `Number cannot be 0`;

      case 'greaterThanNowDate':
        return `This Date must be greater than now date`;

      case 'greaterThanDate':
        return `This Date must be greater than start date`;

      case 'invalidUrl':
        return `URL is invalid`;

      case 'tagError':
        return `Tag must contain only a-z, 0-9, -, _`;

      case 'lengthError':
        return `Tag length must be less or equal 25 characters`;

      case 'notEqual':
        return `Number must be not equal to ${errorDetails.value}`;

      case 'numberDecimal':
        return `Max decimal ${errorDetails.decimal}`;

      default:
        return 'Error';
    }
  }

  private static getErrorKeys(control: AbstractControl): string[] {
    if (!control.dirty) {
      return [];
    }

    return Object.keys(control.errors || {});
  }

  static tagValidatorForInput(control: AbstractControl): {[key: string]: boolean} | null {
    if (!control.value) {
      return null;
    }

    const tags = control.value.split(',');

    const checks = [];

    tags.forEach((item) => {
      if (item.length > 25) {
        checks.push({lengthError: true});
      }
      if (!/^[a-z0-9_\-]+$/.test(item)) {
        checks.push({tagError: true});
      }
    });

    return checks.find(Boolean) || null;
  }
}
