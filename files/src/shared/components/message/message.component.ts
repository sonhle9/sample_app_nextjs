import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnChanges {
  @Input() content = '';
  @Input() type = '';

  @Input() hasClose = true;

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  get icon() {
    switch (this.type) {
      case 'error':
        return '';
    }
    return 'assets/images/icons/tick.svg';
  }

  constructor() {}

  ngOnChanges() {}

  _close() {
    this.content = '';
    this.close.emit();
  }
}
