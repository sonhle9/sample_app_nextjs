import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss'],
})
export class ModalConfirmComponent implements OnInit {
  @Input()
  title: string;
  @Input()
  description: string;
  @Input()
  submitBtnText: string;
  @Input()
  cancelBtnText: string;
  @Input()
  isModalShown: boolean;
  @Input()
  hideCancelButton: boolean;
  @Input()
  alignTextCenter: boolean;
  @Input()
  showLoader: boolean;

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output()
  submit: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  cancel: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  getTitle(): string {
    return this.title;
  }

  getDescription(): string {
    return this.description;
  }

  getCancelBtnText(): string {
    return this.cancelBtnText;
  }

  getSubmitBtnText(): string {
    return this.submitBtnText;
  }

  isModalShow(): boolean {
    return this.isModalShown;
  }

  cancelMethod(): void {
    this.cancel.emit(true);
  }

  submitMethod(): void {
    this.submit.emit(true);
  }
}
