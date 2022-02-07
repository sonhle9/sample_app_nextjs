import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {ApiPaymentsService} from '../../../api-payments.service';
import {takeUntil} from 'rxjs/operators';
import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import {numberWithCommas} from '../../../../shared/helpers/common';
import {ActivatedRoute} from '@angular/router';
import {ILedgerRole} from '../../../ledger/ledger.interface';
import {ApiLedgerService} from '../../../api-ledger.service';
import {PrefundingBalanceFundsModalComponent} from '../prefunding-balance-funds-modal/prefundingBalanceFundsModal';
import {AggregatesAccounts} from '../../../ledger/ledger-accounts.enum';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {IMerchantRole} from '../../../../shared/interfaces/merchant.interface';
import {ApiMerchantsService} from '../../../api-merchants.service';

@Component({
  selector: 'app-prefunding-balance',
  templateUrl: './prefundingBalance.html',
  styleUrls: ['./prefundingBalance.scss'],
})
export class PrefundingBalanceComponent implements OnInit, OnDestroy {
  allSub: Subject<any> = new Subject<any>();
  targetService;
  totalBalance;
  allowAddFunds = false;
  ledgerRoles: ILedgerRole;
  merchantRoles: IMerchantRole;
  platformAccounts: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private paymentsService: ApiPaymentsService,
    private apiLedgerService: ApiLedgerService,
    private apiMerchantsService: ApiMerchantsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.ledgerRoles = this.apiLedgerService.getRolePermissions();
    this.merchantRoles = this.apiMerchantsService.getRolePermissions();
    if (this.ledgerRoles.hasTransfer && this.merchantRoles.hasAdjust) {
      this.allowAddFunds = true;
    }
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.targetService = params['target-service'];
      this.fetchBalance();
    });
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  fetchBalance() {
    this.paymentsService
      .fetchTotalPrefundingBalance()
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          this.totalBalance = numberWithCommas(res);
        },
        (err) => serviceHttpErrorHandler(err),
      );
  }

  addFundFromBuffer() {
    if (this.allowAddFunds) {
      this.apiLedgerService.getAggregatesBalances().subscribe((aggregatesAccounts) => {
        aggregatesAccounts.forEach((account) => {
          if (account.userId === AggregatesAccounts.buffer) {
            const dialogRef = this.dialog.open(PrefundingBalanceFundsModalComponent, {
              data: {
                max: account.availableBalance.amount,
              },
              width: '500px',
            });

            dialogRef.afterClosed().subscribe((result) => {
              if (result === 'success') {
                this.fetchBalance();
                this.snackBar.open(`Prepaid balance updated successfully`, 'OK', {duration: 5000});
              }
              if (result && result.error) {
                this.snackBar.open(
                  `Failed to update prepaid balance. Reason: ${result.error.message}`,
                  `Dismiss`,
                );
              }
            });
          }
        });
      });
    }
  }
  getPlatformBalances() {
    throw new Error('Method not implemented.');
  }
}
