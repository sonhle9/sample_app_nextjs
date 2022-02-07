import {Component, Input, Output, EventEmitter} from '@angular/core';
import {mapValues} from 'lodash/fp';
import {
  VENDOR_POS_ALL,
  VENDOR_POS_SAPURA,
  VENDOR_POS_SENTINEL,
  VENDOR_POS_SETEL,
} from '../../shared/helpers';

@Component({
  selector: 'app-outage-override',
  templateUrl: './outage-override.component.html',
  styleUrls: ['./outage-override.component.scss'],
})
export class OutageOverrideComponent {
  @Input()
  label: string;
  @Input()
  show: boolean;
  @Input()
  errorMessage: string;
  @Input()
  fields: Record<
    string,
    {
      value: boolean;
      label: string;
    }
  >;
  @Input()
  hasUpdatePermissions: boolean;
  @Output()
  save = new EventEmitter<Record<string, boolean>>();
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output()
  open = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output()
  close = new EventEmitter();
  toggles: Record<string, boolean[]> = {};

  onEdit() {
    this.toggles = mapValues(({value}) => (value ? [value] : []), this.fields);
    this.open.emit();
  }

  onCancel() {
    this.toggles = {};
    this.close.emit();
  }

  onChange(entity) {
    if (
      entity[0] === VENDOR_POS_ALL &&
      this.toggles[entity[0]] &&
      this.toggles[entity[0]][0] === true
    ) {
      this.toggles[VENDOR_POS_SAPURA] = [];
      this.toggles[VENDOR_POS_SENTINEL] = [];
      this.toggles[VENDOR_POS_SETEL] = [];
    } else if (
      [VENDOR_POS_SAPURA, VENDOR_POS_SENTINEL, VENDOR_POS_SETEL].indexOf(entity[0]) !== -1 &&
      this.toggles[entity[0]] &&
      this.toggles[entity[0]][0] === true
    ) {
      this.toggles[VENDOR_POS_ALL] = [];
    }
  }

  onSave() {
    this.save.emit(mapValues(([checked]) => !!checked, this.toggles));
  }
}
