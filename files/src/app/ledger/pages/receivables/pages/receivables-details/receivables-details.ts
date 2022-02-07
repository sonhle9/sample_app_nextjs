import {Component, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {IReceivable, ILedgerRole} from '../../../../ledger.interface';
import {ApiLedgerService} from '../../../../../api-ledger.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ReceivablesAdjustModalComponent} from '../../components/receivables-adjust-modal/receivable-adjust-modal';
import {ReceivableTypes} from '../../../../ledger-receivables.enum';
import {
  FeeSettingTransactionTypes,
  TransactionPGVendors,
  TransactionTypes,
} from '../../../../../../react/modules/ledger/ledger-transactions/ledger-transactions.enums';

@Component({
  selector: 'app-receivables-details',
  templateUrl: 'receivables-details.html',
  styleUrls: ['receivables-details.scss'],
})
export class LegacyReceivablesDetailsComponent implements OnDestroy {
  receivableId: string;
  receivable: IReceivable;
  feeSummary: any;
  showAdjust = false;
  showAdjustStatuses = ['ERRORED', 'PENDING', 'ADJUSTED'];

  allSub: Subject<any> = new Subject<any>();
  roles: ILedgerRole;

  constructor(
    route: ActivatedRoute,
    private ledgerService: ApiLedgerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    route.params.pipe(takeUntil(this.allSub)).subscribe((param) => {
      this.receivableId = param.id;
      this.initSessionRoles();
      this.initTransaction(param.id);
    });
  }

  initSessionRoles() {
    this.roles = this.ledgerService.getRolePermissions();
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  initTransaction(id: string) {
    this.ledgerService
      .readReceivable(id)
      .pipe(takeUntil(this.allSub))
      .subscribe((res) => {
        this.receivable = res;
        if (this.showAdjustStatuses.includes(res.status)) {
          this.showAdjust = false;
        }
        this.getFeeSummary();
      });
  }

  getFeeSummary() {
    this.ledgerService
      .getDailySummary(this.receivable.processorName, this.receivable.transactionDate)
      .pipe(takeUntil(this.allSub))
      .subscribe((res) => {
        this.feeSummary = res.filter((val) =>
          this.isMatchingFeeSummary(val, this.receivable.receivableType),
        );
      });
  }

  isMatchingFeeSummary(feeSummary, receivableType: ReceivableTypes) {
    const {paymentGatewayVendor, transactionType} = feeSummary;
    switch (receivableType) {
      case ReceivableTypes.WALLET_SETEL:
        if (paymentGatewayVendor === TransactionPGVendors.IPAY88) {
          if (
            transactionType === TransactionTypes.TOPUP ||
            transactionType === TransactionTypes.TOPUP_REFUND
          ) {
            return true;
          }
        }
        break;
      case ReceivableTypes.PASSTHROUGH_FUEL:
        if (paymentGatewayVendor === TransactionPGVendors.IPAY88) {
          if (
            transactionType === FeeSettingTransactionTypes.PASSTHROUGH_FUEL ||
            transactionType === FeeSettingTransactionTypes.PASSTHROUGH_FUEL_REFUND
          ) {
            return true;
          }
        }
        break;
      case ReceivableTypes.PASSTHROUGH_STORE:
        if (paymentGatewayVendor === TransactionPGVendors.IPAY88) {
          if (
            transactionType === FeeSettingTransactionTypes.PASSTHROUGH_STORE ||
            transactionType === FeeSettingTransactionTypes.PASSTHROUGH_STORE_REFUND
          ) {
            return true;
          }
        }
        break;
      case ReceivableTypes.BOOST:
        if (paymentGatewayVendor === TransactionPGVendors.BOOST) {
          if (
            transactionType === FeeSettingTransactionTypes.CHARGE_BOOST ||
            transactionType === FeeSettingTransactionTypes.REFUND_BOOST
          ) {
            return true;
          }
        }
        break;
      case ReceivableTypes.BOOST_TOPUP:
        if (paymentGatewayVendor === TransactionPGVendors.BOOST) {
          if (
            transactionType === FeeSettingTransactionTypes.TOPUP_BOOST ||
            transactionType === FeeSettingTransactionTypes.TOPUP_REFUND_BOOST
          ) {
            return true;
          }
        }
        break;
      default:
        return false;
    }
  }

  calculateExceptionValues() {
    let totalAmount = 0;
    let totalFeeAmount = 0;
    this.receivable.exceptions.forEach((exception: any) => {
      if (!exception.isResolved) {
        totalAmount += parseFloat(exception.metadata.amount);
        totalFeeAmount += parseFloat(exception.metadata.feeAmount);
      }
    });
    return {
      totalAmount: totalAmount.toFixed(2),
      totalFeeAmount: totalFeeAmount.toFixed(2),
      adjustmentAmount: (totalAmount - totalFeeAmount).toFixed(2),
    };
  }

  openAdjustModal() {
    if (!this.showAdjust) {
      return;
    }
    if (this.roles.hasAdjust) {
      const dialogRef = this.dialog.open(ReceivablesAdjustModalComponent, {
        data: {
          receivableId: this.receivableId,
          ...this.calculateExceptionValues(),
        },
        width: '500px',
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          // result is undefined means dialog dismissed
          if (result.status === 'success') {
            this.snackBar.open('Adjustment successful', 'OK', {duration: 5000});
            this.receivable = result.receivable;
          } else {
            this.snackBar.open(
              `Failed to adjust receivable. Reason: ${result.error.message}`,
              `Dismiss`,
            );
          }
        }
      });
    }
  }
}
