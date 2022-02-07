import moment from 'moment';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {ApiLedgerService} from '../../../api-ledger.service';
import {takeUntil} from 'rxjs/operators';
import {
  PlatformAccounts,
  AccountBalanceTypes,
  AccountGroupBalanceTypes,
  AggregatesAccounts,
  AccountsGroup,
} from '../../ledger-accounts.enum';
import {IPlatformAccounts, IAccount} from '../../ledger-accounts.interface';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ILedgerRole} from '../../ledger.interface';
import {LedgerAdjustModalComponent} from '../ledger-adjust-modal/ledger-adjust-modal.component';
import {LedgerTransferModalComponent} from '../ledger-transfer-modal/ledger-transfer-modal.component';
import {ApiProcessorService} from '../../../api-processor.service';

@Component({
  selector: 'app-cashflows',
  templateUrl: './cashflows.component.html',
  styleUrls: ['./cashflows.component.scss'],
})
export class CashflowsComponent implements OnInit, OnDestroy {
  platformAccounts: IPlatformAccounts = {
    collection: null,
    trust1: null,
    operating: null,
    operatingCollection: null,
  };
  todayDate = moment().format('DD MMM YYYY');
  todaySummary = null;
  aggregatesAccounts = [
    {
      account: AggregatesAccounts.customer,
      label: 'Total customer prepayments',
      balanceType: 'availableBalance',
    },
    {
      account: AggregatesAccounts.merchant,
      label: 'Total merchant payables',
      balanceType: 'availableBalance',
    },
    {
      account: AggregatesAccounts.merchant,
      label: 'Total merchant prepaid',
      balanceType: 'prepaidBalance',
    },
    {
      account: AggregatesAccounts.buffer,
      label: 'Buffer',
      balanceType: 'availableBalance',
      editable: true,
    },
    {account: AggregatesAccounts.mdr, label: 'MDR', balanceType: 'availableBalance'},
  ] as any[];
  operatingCollectionAggregatesAccounts: Array<{
    account: AggregatesAccounts;
    label: string;
    balanceType: 'availableBalance';
    details?: IAccount;
  }> = [
    {
      account: AggregatesAccounts.merchantOperating,
      label: 'Total merchant payables',
      balanceType: 'availableBalance',
    },
    {
      account: AggregatesAccounts.mdrOperating,
      label: 'MDR',
      balanceType: 'availableBalance',
    },
  ];
  allSub: Subject<any> = new Subject<any>();
  roles: ILedgerRole;
  constructor(
    private readonly apiLedgerService: ApiLedgerService,
    private readonly apiProcessorService: ApiProcessorService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.initSessionRoles();
    this.getPlatformBalances();
    this.getAggregatesBalances();
    this.getDailyMerchantPayout();
    this.getOperatingCollectionBalances();
  }

  initSessionRoles() {
    this.roles = this.apiLedgerService.getRolePermissions();
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  adjustPlatformAccount(accountName, balanceType) {
    let balanceLabel;
    let groupBalanceType;
    switch (balanceType) {
      case AccountBalanceTypes.PREPAID:
        break;
      case AccountBalanceTypes.PENDING:
        balanceLabel = 'pending balance';
        groupBalanceType = AccountGroupBalanceTypes.PLATFORM_PENDING;
        break;
      default:
        balanceLabel = 'available balance';
        groupBalanceType = AccountGroupBalanceTypes.PLATFORM_AVAILABLE;
    }
    if (this.roles.hasAdjust) {
      const dialogRef = this.dialog.open(LedgerAdjustModalComponent, {
        data: {
          name: accountName,
          account: this.platformAccounts[accountName].userId,
          accountGroup: AccountsGroup.PLATFORM,
          groupBalanceType,
          balanceLabel,
        },
        width: '500px',
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'success') {
          this.getPlatformBalances();
          this.snackBar.open(`${accountName} account updated successfully`, 'OK', {duration: 5000});
        } else {
          this.snackBar.open(
            `Failed to update ${accountName} account balance. Reason: ${result.error.message}`,
            `Dismiss`,
          );
        }
      });
    }
  }

  adjustAggregatesAccount(accountName, balanceType) {
    let balanceLabel;
    let groupBalanceType;
    switch (balanceType) {
      case AccountBalanceTypes.PREPAID:
        balanceLabel = 'prepaid balance';
        groupBalanceType = AccountGroupBalanceTypes.AGGREGATES_PREPAID;
        break;
      case AccountBalanceTypes.PENDING:
        balanceLabel = 'pending balance';
        groupBalanceType = AccountGroupBalanceTypes.AGGREGATES_PENDING;
        break;
      default:
        balanceLabel = 'available balance';
        groupBalanceType = AccountGroupBalanceTypes.AGGREGATES_AVAILABLE;
    }

    if (this.roles.hasAdjust) {
      const dialogRef = this.dialog.open(LedgerAdjustModalComponent, {
        data: {
          name: accountName,
          account: this.aggregatesAccounts.find(
            (item) => item.account.userId === AggregatesAccounts[accountName.toLowerCase()],
          ).account.userId,
          accountGroup: AccountsGroup.AGGREGATES,
          groupBalanceType,
          balanceLabel,
        },
        width: '500px',
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'success') {
          this.getAggregatesBalances();
          this.snackBar.open(`${accountName} account updated successfully`, 'OK', {duration: 5000});
        } else {
          this.snackBar.open(
            `Failed to update ${accountName} account balance. Reason: ${result.error.message}`,
            `Dismiss`,
          );
        }
      });
    }
  }

  transferToOperating() {
    if (this.roles.hasTransfer) {
      const dialogRef = this.dialog.open(LedgerTransferModalComponent, {
        data: {
          max: this.platformAccounts.trust1.availableBalance.amount,
        },
        width: '500px',
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'success') {
          this.getPlatformBalances();
          this.getAggregatesBalances();
          this.snackBar.open(`Operating account updated successfully`, 'OK', {duration: 5000});
        } else {
          this.snackBar.open(
            `Failed to update operating account balance. Reason: ${result.error.message}`,
            `Dismiss`,
          );
        }
      });
    }
  }

  getPlatformBalances() {
    this.apiLedgerService
      .getPlatformBalances()
      .pipe(takeUntil(this.allSub))
      .subscribe((platformAccounts) => {
        platformAccounts.forEach((account) => {
          Object.keys(PlatformAccounts).forEach((key) => {
            if (account.userId === PlatformAccounts[key]) {
              this.platformAccounts[key] = account;
            }
          });
        });
      });
  }

  getAggregatesBalances() {
    this.apiLedgerService
      .getAggregatesBalances()
      .pipe(takeUntil(this.allSub))
      .subscribe((aggregatesAccounts) => {
        aggregatesAccounts.forEach((account) => {
          this.aggregatesAccounts.forEach((value, index) => {
            if (value.account === account.userId || value.account.userId === account.userId) {
              this.aggregatesAccounts[index].account = account;
            }
          });
        });
      });
  }

  getOperatingCollectionBalances() {
    this.apiLedgerService
      .getAggregatesBalances()
      .pipe(takeUntil(this.allSub))
      .subscribe((aggregatesAccounts) => {
        aggregatesAccounts.forEach((account) => {
          this.operatingCollectionAggregatesAccounts.forEach((value, index) => {
            if (value.account === account.userId) {
              this.operatingCollectionAggregatesAccounts[index].details = account;
            }
          });
        });
      });
  }

  getDailyMerchantPayout() {
    this.apiProcessorService
      .readTodaySummary()
      .pipe(takeUntil(this.allSub))
      .subscribe((todaySummary) => {
        this.todaySummary = todaySummary;
      });
  }
}
