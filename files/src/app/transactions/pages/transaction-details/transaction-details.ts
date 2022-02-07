import {Component, OnDestroy} from '@angular/core';
import {Subject, zip} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {ApiTransactionService} from 'src/app/api-transactions.service';
import {ITransaction} from 'src/shared/interfaces/transaction.interface';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {
  TransactionSubType,
  TransactionType,
  TransactionStatus,
} from '../../../stations/shared/const-var';
import {ApiPaymentsService, ICancelPaymentByAdminInput} from '../../../api-payments.service';
import {ApiWalletsService} from '../../../api-wallets.service';
import {ITransaction as IWalletTransaction} from 'src/shared/interfaces/wallet.interface';
import {AuthService} from 'src/app/auth.service';
import {transactionRole} from 'src/shared/helpers/roles.type';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';

@Component({
  moduleId: module.id,
  selector: 'app-transaction-details',
  templateUrl: 'transaction-details.html',
  styleUrls: ['transaction-details.scss'],
})
export class TransactionDetailsComponent implements OnDestroy {
  readonly webDashboardUrl = CURRENT_ENTERPRISE.dashboardUrl;
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: 'Payments',
    },
    {
      to: '/payments/transactions',
      label: 'Transactions',
    },
    {
      label: 'Transaction details',
    },
  ];
  transactionId: string;
  transaction: ITransaction;
  targetService: string;

  allSub: Subject<any> = new Subject<any>();

  isShowVoidButton: boolean;
  isShowVoidModal = false;
  isShowVoidResponseModal = false;
  voidResponseModalContent: string;

  isShowCancelAuthorizedButton: boolean;
  isShowCancelAuthorizedModal = false;
  isShowCancelAuthorizedResponseModal = false;
  cancelAuthorizedResponseModalContent: string;

  isShowWalletTxDetailBtn = false;
  walletTx: IWalletTransaction;
  walletTxDetailUrl: string;
  walletTxDetailPageName: string;

  constructor(
    route: ActivatedRoute,
    private authService: AuthService,
    private apiTransactionService: ApiTransactionService,
    private apiPaymentsService: ApiPaymentsService,
    private apiWalletsService: ApiWalletsService,
  ) {
    zip(route.params, route.queryParams)
      .pipe(takeUntil(this.allSub))
      .subscribe(([param, query]) => {
        this.transactionId = param.id;
        this.targetService = query['target-service'];
        this.initTransaction(param.id);
      });
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  initTransaction(id: string) {
    this.apiTransactionService
      .readTransaction(id)
      .pipe(takeUntil(this.allSub))
      .subscribe((res) => {
        this.transaction = res;
        const isGrantBalanceTransaction =
          (res.subtype === TransactionSubType.rewards ||
            res.subtype === TransactionSubType.redeemLoyaltyPoints) &&
          res.type === TransactionType.topup &&
          (res.status === TransactionStatus.success || res.status === TransactionStatus.incoming);
        const isAuthorizedTransaction =
          res.type === TransactionType.authorize && res.status === TransactionStatus.success;
        const roles = this.authService.getRoles();
        const hasReversePermission = roles.includes(transactionRole.reverse);
        this.isShowVoidButton = isGrantBalanceTransaction && hasReversePermission;
        this.isShowCancelAuthorizedButton = isAuthorizedTransaction && hasReversePermission;
        this.findWalletTx();
      });
  }

  showVoidTransactionModal() {
    this.isShowVoidModal = true;
  }

  hideVoidTransactionModal() {
    this.isShowVoidModal = false;
  }

  showVoidTransactionResponseModal(error?: Error) {
    this.isShowVoidResponseModal = true;
    if (error) {
      this.voidResponseModalContent = error.message;
    } else {
      this.voidResponseModalContent = 'Grant Wallet Balance voided.';
    }
  }

  hideVoidTransactionResponseModal() {
    this.isShowVoidResponseModal = false;
  }

  voidTransaction() {
    this.apiPaymentsService.voidWalletBonus(this.transaction.id, this.transaction.userId).subscribe(
      () => {
        this.hideVoidTransactionModal();
        this.showVoidTransactionResponseModal();
        this.initTransaction(this.transactionId);
      },
      ({error}) => {
        this.hideVoidTransactionModal();
        this.showVoidTransactionResponseModal(error);
      },
    );
  }

  findWalletTx() {
    if (!this.transaction) {
      return;
    }
    this.apiWalletsService
      .findTxsByReferenceId(this.getWalletTxReferenceIdFromTransaction())
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          if (res.items.length > 0) {
            this.walletTx = res.items[0];
          }
          this.updateWalletTxDetailInfo();
        },
        (err) => {
          console.error(err);
        },
      );
  }

  getWalletTxReferenceIdFromTransaction() {
    if (!this.transaction.referenceId) {
      return this.transaction.id;
    }
    if (this.transaction.type === TransactionType.topup) {
      if (this.transaction.subtype === TransactionSubType.rewards) {
        return this.transaction.referenceId;
      } else {
        return this.transaction.id;
      }
    }

    // if payment transaction has type topup refund, then walletTx referenceId should be referenceId + suffix(R)
    // this logic can be changed in the future
    if (this.transaction.type === TransactionType.topup_refund) {
      const topupRefundRefIdSuffix = '(R)';
      return `${this.transaction.referenceId}${topupRefundRefIdSuffix}`;
    }

    return this.transaction.referenceId;
  }

  updateWalletTxDetailInfo() {
    switch (this.transaction.type) {
      case TransactionType.topup:
        this.isShowWalletTxDetailBtn = true;
        if (this.transaction.subtype === TransactionSubType.rewards) {
          if (this.walletTx) {
            this.walletTxDetailUrl = `/payments/transfers/${this.walletTx.transactionUid}`;
          }
          this.walletTxDetailPageName = 'Transfer Transaction Detail';
        } else {
          if (this.walletTx) {
            this.walletTxDetailUrl = `/wallet/topups/${this.walletTx.transactionUid}`;
          }
          this.walletTxDetailPageName = 'Top-up Transaction Detail';
        }
        break;
      case TransactionType.refund:
        // nothing
        break;
      case TransactionType.purchase:
      case TransactionType.authorize:
      case TransactionType.capture:
        this.isShowWalletTxDetailBtn = true;
        if (this.walletTx) {
          this.walletTxDetailUrl = `${this.webDashboardUrl}/payments/transactions?merchantId=${this.walletTx.merchantId}&transactionId=${this.walletTx.transactionUid}&redirect-from=admin`;
        }
        this.walletTxDetailPageName = 'Charge Transaction Detail';
        break;
      case TransactionType.cancel:
        // nothing
        break;
      case TransactionType.topup_refund:
        this.isShowWalletTxDetailBtn = true;
        if (this.walletTx) {
          this.walletTxDetailUrl = `/wallet/topup-refunds/${this.walletTx.transactionUid}`;
        }
        this.walletTxDetailPageName = 'Top-up Refund Transaction Detail';
        break;
      default:
        console.error(`unknown transaction type: ${this.transaction.type}`);
    }

    if (!this.walletTx) {
      this.isShowWalletTxDetailBtn = false;
    }
  }

  gotoWalletTxDetailPage() {
    window.open(this.walletTxDetailUrl, '_blank');
  }

  showCancelAuthorizedTransactionModal() {
    this.isShowCancelAuthorizedModal = true;
  }

  hideCancelAuthorizedTransactionModal() {
    this.isShowCancelAuthorizedModal = false;
  }

  showCancelAuthorizedTransactionResponseModal(error?: Error) {
    this.isShowCancelAuthorizedResponseModal = true;
    if (error) {
      this.cancelAuthorizedResponseModalContent = error.message;
    } else {
      this.cancelAuthorizedResponseModalContent = 'Authorized transaction canceled.';
    }
  }

  hideCancelAuthorizedTransactionResponseModal() {
    this.isShowCancelAuthorizedResponseModal = false;
  }

  cancelAuthorizedTransaction() {
    const params: ICancelPaymentByAdminInput = {
      authorizationId: this.transaction.kipleTransactionId,
      amount: this.transaction.amount,
      orderId: this.transaction.orderId,
      merchantId:
        this.transaction.merchantId ||
        (this.transaction.storecardTransaction && this.transaction.storecardTransaction.merchantId),
      userId: this.transaction.userId,
      posTransactionId: this.transaction.posTransactionId,
      stationName: this.transaction.stationName,
      remark: this.transaction.remark,
      referenceType: this.transaction.referenceType,
    };
    this.apiPaymentsService.cancelAuthorizedTransaction(params).subscribe(
      () => {
        this.hideCancelAuthorizedTransactionModal();
        this.showCancelAuthorizedTransactionResponseModal();
        this.initTransaction(this.transactionId);
      },
      ({error}) => {
        this.hideCancelAuthorizedTransactionModal();
        this.showCancelAuthorizedTransactionResponseModal(error);
      },
    );
  }
}
