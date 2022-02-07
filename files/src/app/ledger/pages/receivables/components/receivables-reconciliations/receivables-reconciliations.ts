import {Component, OnChanges, Input, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ApiLedgerService} from '../../../../../api-ledger.service';
import {ILedgerRole} from '../../../../ledger.interface';
import {resetPagination, forceUpdate} from '../../../../../../shared/helpers/common';
import {serviceHttpErrorHandler} from '../../../../../../shared/helpers/errorHandling';
import {IPagination} from '../../../../../../shared/interfaces/core.interface';
import {ITransaction} from '../../../../../../shared/interfaces/transaction.interface';
import {IDropdownItem} from '../../../../../../shared/components/dropdown/dropdown.interface';
import {DEFAULT_DROPDOWN_VALUES} from '../../../../../stations/shared/const-var';

@Component({
  moduleId: module.id,
  selector: 'app-receivables-reconciliations',
  templateUrl: 'receivables-reconciliations.html',
  styleUrls: ['receivables-reconciliations.scss'],
})
export class ReceivablesReconciliationsComponent implements OnChanges, OnDestroy {
  @Input()
  receivableId;

  private _pagination: IPagination<ITransaction>;
  pagination: IPagination<ITransaction>;

  statusFilter: IDropdownItem[] = DEFAULT_DROPDOWN_VALUES.concat([
    {
      text: 'PENDING',
      value: false,
    },
    {
      text: 'RECONCILED',
      value: true,
    },
  ]);
  selectedStatus = this.statusFilter[0];

  loading = {
    full: false,
    page: false,

    get any() {
      return this.full || this.page;
    },

    stop() {
      this.full = this.page = false;
    },
  };

  roles: ILedgerRole;
  allSub: Subject<any> = new Subject<any>();

  constructor(private ledgerService: ApiLedgerService) {
    this.reset();
    this.initSessionRoles();
  }

  ngOnChanges() {
    this.indexTransactions();
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  private initSessionRoles() {
    this.roles = this.ledgerService.getRolePermissions();
  }

  indexTransactions() {
    if (!this.receivableId) {
      return;
    }

    this.pagination.items = [];
    this.loading.page = true;
    this.ledgerService
      .indexReceivableTransactions(
        this.receivableId,
        this.selectedStatus.value,
        this.pagination.index,
        this.pagination.page,
      )
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          this.pagination.max = this._pagination.max = res.max;
          this.pagination.items = this._pagination.items = res.items;
          this.pagination = forceUpdate(this.pagination);
          this.loading.stop();
        },
        (err) => {
          serviceHttpErrorHandler(err);
          this.reset();
          this.loading.stop();
        },
      );
  }

  next() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index++;
    this.indexTransactions();
  }

  prev() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index--;
    this.indexTransactions();
  }

  reset() {
    this.pagination = this._pagination = resetPagination(20);
  }

  afterAddedTransaction() {
    this.reset();
    this.indexTransactions();
  }

  filter() {
    this.reset();
    this.indexTransactions();
  }

  downloadCsv = () =>
    this.ledgerService.downloadReceivablesTransactions(
      this.receivableId,
      this.selectedStatus.value,
    );
}
