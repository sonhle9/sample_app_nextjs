import {Component, OnChanges, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {Subject} from 'rxjs';
import {IDropdownItem} from '../../../../shared/components/dropdown/dropdown.interface';
import {TransactionType} from '../../../stations/shared/const-var';
import {AppFormGroup, AppFormBuilder, AppValidators} from '../../../../shared/helpers/formGroup';
import {Validators} from '@angular/forms';
import {ApiTransactionService} from '../../../api-transactions.service';
import {ICreateTransactionInput} from '../../../../shared/interfaces/transaction.interface';
import {takeUntil} from 'rxjs/operators';

@Component({
  moduleId: module.id,
  selector: 'app-add-top-up-transaction',
  templateUrl: 'addTopupTransaction.html',
  styleUrls: ['addTopupTransaction.scss'],
})
export class AddTopupTransactionComponent implements OnChanges, OnDestroy {
  @Input()
  customerId: string;
  @Output()
  added: EventEmitter<any> = new EventEmitter<any>();

  transactionTypes: IDropdownItem[] = [
    {
      text: 'External top-up',
      value: TransactionType.topup,
    },
    {
      text: 'External top-up refund',
      value: TransactionType.refund,
    },
  ];
  loading = false;

  form: AppFormGroup;
  errorMessage;

  messageContent;
  messageType;

  allSub: Subject<any> = new Subject<any>();

  constructor(private fb: AppFormBuilder, private transactionService: ApiTransactionService) {
    this.form = this.fb.group({
      amount: ['', [Validators.required, AppValidators.decimalOnly]],
      type: ['', [Validators.required]],
      message: [''],
    });
    this.errorMessage = AppValidators.initErrorMessageObject(this.form);
  }

  ngOnChanges() {}

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  saveTransaction() {
    this.messageContent = '';
    this.form.markAllAsDirty();
    this.errorMessage = AppValidators.getErrorMessageObject(this.form);

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const formValue = this.form.value;
    const created: ICreateTransactionInput = {
      amount: +(formValue.amount || 0),
      type: formValue.type.value,
      message: formValue.message,
      createdAt: new Date(),
      userId: this.customerId,
    };

    this.transactionService
      .add(created)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (transaction) => {
          this.loading = false;
          this.messageContent = 'External top-up was successfully added.';
          this.messageType = '';
          this.reset();
          this.added.emit(transaction);
        },
        () => {
          this.loading = false;
          this.messageContent = 'Ops! External top-up unable to add.';
          this.messageType = 'error';
        },
      );
  }

  reset() {
    this.form.patchValue({
      amount: '',
      type: this.transactionTypes[0],
      message: '',
    });
    this.errorMessage = AppValidators.initErrorMessageObject(this.form);
  }
}
