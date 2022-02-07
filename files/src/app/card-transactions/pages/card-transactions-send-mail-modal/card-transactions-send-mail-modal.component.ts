import {Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AppFormGroup, AppFormBuilder, AppValidators} from '../../../../shared/helpers/formGroup';
import {ISessionData} from '../../../../shared/interfaces/auth.interface';
import {AuthService} from '../../../auth.service';
import {FormArray} from '@angular/forms';
import {ApiCardTransactionsService} from 'src/app/api-card-transactions.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {
  EmailTransactionInput,
  ICardTransactionIndexParams,
} from 'src/shared/interfaces/card-transaction.interface';

@Component({
  selector: 'app-card-transactions-send-mail-modal',
  templateUrl: './card-transactions-send-mail-modal.component.html',
  styleUrls: ['./card-transactions-send-mail-modal.component.scss'],
})
export class CardTransactionsSendMailModalComponent implements OnInit, OnDestroy {
  loading = true;
  form: AppFormGroup;
  sessionData: ISessionData;
  toEmails: string[];
  allSub: Subject<any> = new Subject<any>();
  transactionId: string;
  emailTransactionInput: EmailTransactionInput;
  filter: ICardTransactionIndexParams;

  constructor(
    private dialogRef: MatDialogRef<CardTransactionsSendMailModalComponent>,
    private fb: AppFormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any,
    private readonly apiCardTransactionsService: ApiCardTransactionsService,
    private authService: AuthService,
  ) {
    const session = this.authService.getSession();
    this.toEmails = [session.email];
    this.form = this.fb.group({
      to: [session.email],
      toEmails: this.fb.array([]),
    });
    this.transactionId = data.transactionId;
    this.filter = data.filter;
    this.sessionData = this.authService.getSessionData();
  }

  get toEmailsFields() {
    return this.form.controls.toEmails as FormArray;
  }

  ngOnInit(): void {
    this.loading = false;
    this.updateToEmailsValidation();
    this.form.controls.to.valueChanges.subscribe((value) => {
      this.toEmails = value.split(',');
      this.toEmailsFields.clear();
      this.updateToEmailsValidation();
    });
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  updateToEmailsValidation() {
    this.toEmails.forEach((value) => {
      this.toEmailsFields.push(this.fb.control(value.trim(), AppValidators.email));
    });
  }

  getErrorMessages() {
    this.form.markAllAsDirty();
    return AppValidators.getErrorMessageObject(this.form);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    if (this.loading) {
      return;
    }
    if (!this.sessionData && !this.sessionData.sub) {
      this.closeWithError('User does not exist');
    }
    const sendMailData: EmailTransactionInput = {
      toEmails: this.form.value.toEmails,
      ...(this.transactionId && {transactionId: this.transactionId}),
    };
    this.loading = true;
    this.apiCardTransactionsService
      .sendEmail(sendMailData, this.filter)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        () => {
          this.loading = false;
          this.dialogRef.close('success');
        },
        (err) => {
          this.loading = false;
          this.dialogRef.close(err);
        },
      );
  }

  onClose(): void {
    this.dialogRef.close();
  }

  closeWithError(message: string) {
    this.dialogRef.close(message);
  }
}
