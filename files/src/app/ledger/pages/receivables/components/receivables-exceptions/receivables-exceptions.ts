import {Component, Input, OnChanges, OnDestroy} from '@angular/core';
import {IPagination} from '../../../../../../shared/interfaces/core.interface';
import {forceUpdate, resetPagination} from '../../../../../../shared/helpers/common';
import {ILedgerRole} from '../../../../ledger.interface';
import {ApiLedgerService} from '../../../../../api-ledger.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {serviceHttpErrorHandler} from '../../../../../../shared/helpers/errorHandling';

@Component({
  selector: 'app-receivables-exceptions',
  templateUrl: 'receivables-exceptions.html',
  styleUrls: ['receivables-exceptions.scss'],
})
export class ReceivablesExceptionsComponent implements OnChanges, OnDestroy {
  @Input()
  receivableId: string;
  private _pagination: IPagination<any>;
  pagination: IPagination<any>;
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
    this.indexExceptions();
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  private initSessionRoles() {
    this.roles = this.ledgerService.getRolePermissions();
  }

  indexExceptions() {
    this.pagination.items = [];
    this.loading.page = true;
    this.ledgerService
      .indexReceivableExceptions(this.receivableId, this.pagination.index, this.pagination.page)
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

  reset() {
    this.pagination = this._pagination = resetPagination(5);
  }

  resolveException(exception) {
    if (exception.isResolved) {
      return;
    }
    this.ledgerService.resolveReceivableException(this.receivableId, exception).subscribe(() => {
      this.indexExceptions();
    });
  }

  next() {
    this.pagination.index++;
    this.indexExceptions();
  }

  prev() {
    this.pagination.index--;
    this.indexExceptions();
  }
}
