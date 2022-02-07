import {ITransaction} from '../../../../shared/interfaces/wallet.interface';
import {ApiWalletsService} from '../../../api-wallets.service';
import {Observable, Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {Component, OnDestroy} from '@angular/core';
import {TransactionStatus, TransactionSubType} from '../../../../shared/enums/wallet.enum';
import {ApiPaymentsService} from '../../../api-payments.service';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';

@Component({
  selector: 'app-topup-details',
  templateUrl: './topup-details.component.html',
  styleUrls: ['./topup-details.component.scss'],
})
export class TopupDetailsComponent implements OnDestroy {
  transactionUid: string;
  transaction: ITransaction;

  message: string;
  messageType: string;

  isConfirmRefundDialogShown = false;
  isConfirmRefundDialogLoading = false;

  allSub: Subject<any> = new Subject<any>();
  dataTopups: ITransaction[] = [];
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: 'Wallet',
    },
    {
      to: '/wallet/topups',
      label: 'Top-ups',
    },
    {
      label: 'Top-up details',
    },
  ];
  constructor(
    route: ActivatedRoute,
    private walletsService: ApiWalletsService,
    private paymentsService: ApiPaymentsService,
  ) {
    route.params.pipe(takeUntil(this.allSub)).subscribe((param) => {
      this.transactionUid = param.id;
      this.initTransaction(this.transactionUid);
    });
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  initTransaction(id: string) {
    this.walletsService
      .readTransaction(id, {
        includeRefundStatus: true,
      })
      .pipe(takeUntil(this.allSub))
      .subscribe((res) => {
        this.transaction = res;
      });
  }

  get isTransactionRefundable() {
    return (
      this.transaction &&
      [
        TransactionSubType.TOPUP_BANK_ACCOUNT,
        TransactionSubType.TOPUP_CREDIT_CARD,
        TransactionSubType.TOPUP_DIGITAL_WALLET,
      ].includes(this.transaction.subType) &&
      this.transaction.status === TransactionStatus.SUCCEEDED &&
      this.transaction.isRefundProcessing === false
    );
  }

  openConfirmRefundDialog() {
    this.isConfirmRefundDialogShown = true;
  }

  onConfirmRefundDialogSubmit() {
    this.isConfirmRefundDialogLoading = true;
    const handleRefundResult = (refundResult: Observable<any>) => {
      refundResult.pipe(takeUntil(this.allSub)).subscribe(
        () => {
          this.messageType = 'success';
          this.message = 'Top-up refund is being processed';

          this.isConfirmRefundDialogLoading = false;
          this.isConfirmRefundDialogShown = false;

          this.initTransaction(this.transactionUid);
        },
        (err) => {
          let message = err.toString();
          if (err.message) {
            message = err.message;
          }

          if (err.error && err.error.message) {
            message = err.error.message;
          }

          this.messageType = 'error';
          this.message = `Failed to create top-up refund transaction: ${message}`;

          this.isConfirmRefundDialogLoading = false;
          this.isConfirmRefundDialogShown = false;
        },
      );
    };

    if (
      this.transaction.subType === TransactionSubType.TOPUP_BANK_ACCOUNT ||
      this.transaction.subType === TransactionSubType.TOPUP_CREDIT_CARD
    ) {
      handleRefundResult(this.walletsService.refundTransaction(this.transaction.referenceId));
    } else {
      handleRefundResult(this.paymentsService.refundTopupWallet(this.transaction.referenceId));
    }
  }

  onConfirmRefundDialogCancel() {
    this.isConfirmRefundDialogShown = false;
  }
}
