import {Component, OnInit, OnDestroy, ViewChild, TemplateRef} from '@angular/core';
import {Subject, throwError, EMPTY} from 'rxjs';
import {AppFormBuilder, AppFormGroup, AppValidators} from '../../../../shared/helpers/formGroup';
import {Validators} from '@angular/forms';

import {NotificationService} from 'src/app/notification.service';
import {
  VoucherRedeemType,
  IVouchersInfo,
  VoucherStatus,
  ActionType,
  VoucherRuleStatus,
} from '../../../../shared/interfaces/vouchers.interface';
import {ApiVouchersService} from '../../../api-vouchers.service';
import {takeUntil, mergeMap, catchError} from 'rxjs/operators';
import {AuthService} from '../../../auth.service';
import {getRolePermissions} from '../../../../shared/helpers/common';
import {vouchersValidateRole} from '../../../../shared/helpers/roles.type';
import {formatDate} from '@angular/common';
import {ApiCustomersService} from '../../../api-customers.service';

@Component({
  selector: 'app-vouchers-validation',
  templateUrl: './vouchersValidate.html',
  styleUrls: ['./vouchersValidate.scss'],
})
export class VouchersValidateComponent implements OnInit, OnDestroy {
  type: VoucherRedeemType;
  errorMessage;
  form: AppFormGroup;
  voucherInfo: IVouchersInfo;
  columns;
  historyColumns;
  userName;

  @ViewChild('reTriggerColumnTpl', {static: true})
  reTriggerColumnTpl: TemplateRef<any>;

  loading = false;

  allSub: Subject<any> = new Subject<any>();

  constructor(
    private vouchersService: ApiVouchersService,
    private fb: AppFormBuilder,
    private notificationService: NotificationService,
    protected authService: AuthService,
    private customerService: ApiCustomersService,
  ) {
    this.form = this.fb.group({
      code: ['', [Validators.required]],
    });
    this.errorMessage = AppValidators.initErrorMessageObject(this.form);
  }

  ngOnInit() {
    this.columns = [
      {name: 'Name', prop: 'name', flexGrow: 2},
      {name: 'Amount', prop: 'amount', flexGrow: 1},
      {name: 'Tag', prop: 'tag', flexGrow: 1},
      {name: 'Status', prop: 'status', flexGrow: 1},
      {name: 'Expiry Date', prop: 'expiryDate', flexGrow: 1.5},
      {name: 'Created Date', prop: 'createdAt', flexGrow: 1.5},
      {name: 'Action', prop: '_id', flexGrow: 1.5, cellTemplate: this.reTriggerColumnTpl},
    ];

    this.historyColumns = [
      {
        name: 'Status',
        prop: 'type',
        flexGrow: 1,
        pipe: {
          transform: (value) =>
            value && value === ActionType.GRANTED ? ActionType.REDEEMED : value,
        },
      },
      {
        name: 'Date',
        prop: 'createdAt',
        flexGrow: 10,
        pipe: {
          transform: (value) => (value ? formatDate(value, 'dd MMM yyyy - hh:mm a', 'en') : ''),
        },
      },
    ];
  }

  ngOnDestroy() {
    this.allSub.next();
    this.allSub.complete();
  }

  validateVoucher() {
    this.form.markAllAsDirty();
    this.errorMessage = AppValidators.getErrorMessageObject(this.form);

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const {code} = this.form.value;
    this.vouchersService
      .validateVoucher(code)
      .pipe(takeUntil(this.allSub))
      .pipe(
        mergeMap((transaction) => {
          this.loading = false;
          this.voucherInfo = transaction;
          this.addIssuedAction();
          if (!this.voucherInfo.userId) {
            return EMPTY;
          }
          return this.customerService.customer(this.voucherInfo.userId);
        }),
        catchError((response) => {
          this.voucherInfo = null;
          this.loading = false;
          this.notificationService.showMessage({
            title: response.error.message,
            variant: 'error',
          });
          return throwError(response.error.message);
        }),
      )
      .subscribe(
        (user) => {
          this.userName = user.name || null;
        },
        (response) => {
          if (response.error) {
            this.loading = false;
            this.notificationService.showMessage({
              title: response.error.message,
              variant: 'error',
            });
          }
        },
      );
  }

  getBatchName() {
    if (!this.voucherInfo) {
      return;
    }
    return this.voucherInfo.batch[0].name;
  }

  checkForRedeem() {
    return (
      this.voucherInfo &&
      (this.voucherInfo.status === VoucherStatus.REDEEMED ||
        this.voucherInfo.status === VoucherStatus.VOIDED) &&
      this.voucherInfo.actions.some((item) => item.type === ActionType.GRANTED)
    );
  }

  getRedeemDate() {
    if (this.checkForRedeem()) {
      const grantedItem = this.voucherInfo.actions.filter(
        (item) => item.type === ActionType.GRANTED,
      );
      return grantedItem[0].createdAt;
    }
  }

  checkPermissions() {
    return getRolePermissions(this.authService, vouchersValidateRole.validate);
  }

  addIssuedAction() {
    const issuedAction = {
      type: ActionType.ISSUED,
      createdAt: this.voucherInfo.createdAt,
    };
    this.voucherInfo.actions.unshift(issuedAction);
  }

  getVoucherUserName() {
    return this.userName || '';
  }

  checkForVoid() {
    return this.voucherInfo.status !== VoucherStatus.VOIDED;
  }

  voucherVoid() {
    this.vouchersService.voidVoucher(this.voucherInfo.code).subscribe(
      () => {
        this.notificationService.showMessage({
          title: 'Voucher successfully voided',
          variant: 'success',
        });
        this.validateVoucher();
      },
      (err) => {
        this.notificationService.showMessage({
          title: err.error.message,
          variant: 'error',
        });
      },
    );
  }

  reTriggerRule(id) {
    this.vouchersService.reTriggerRule(id).subscribe(
      () => {
        this.notificationService.showMessage({
          title: 'Rule was successfully re-triggered',
          variant: 'success',
        });
        this.validateVoucher();
      },
      (err) => {
        this.notificationService.showMessage({
          title: err.error.message,
          variant: 'error',
        });
      },
    );
  }

  isReTriggerVisible(row) {
    return this.checkForVoid() && row.status === VoucherRuleStatus.FAILED;
  }
}
