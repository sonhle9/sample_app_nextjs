import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import moment from 'moment';
import {ILedgerRole} from '../../../../ledger.interface';
import {IPagination} from '../../../../../../shared/interfaces/core.interface';
import {IDropdownItem} from '../../../../../../shared/components/dropdown/dropdown.interface';
import {ORDER_DATES_FILTER, DATE_FORMAT} from '../../../../../stations/shared/const-var';
import {ReportTypes} from '../../reports.enum';
import {forceUpdate, resetPagination, formatDate} from '../../../../../../shared/helpers/common';
import {serviceHttpErrorHandler} from '../../../../../../shared/helpers/errorHandling';
import {ApiLedgerService} from '../../../../../api-ledger.service';

@Component({
  moduleId: module.id,
  selector: 'app-receivables',
  templateUrl: './receivables.html',
  styleUrls: ['./receivables.scss'],
})
export class ReceivablesComponent implements OnInit, OnDestroy {
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

  allSub: Subject<any> = new Subject<any>();

  selectedType = ReportTypes['RECEIVABLES'];

  dateTypes: IDropdownItem[] = ORDER_DATES_FILTER;

  selectedDate: IDropdownItem = this.dateTypes[0];
  startDate: string;
  endDate: string;

  errorMessage = {
    endDate: '',
  };

  roles: ILedgerRole;

  constructor(private ledgerService: ApiLedgerService) {
    this.reset();
    this.initSessionRoles();
  }

  ngOnInit() {
    this.indexReports();
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  initSessionRoles() {
    this.roles = this.ledgerService.getRolePermissions();
  }

  indexReports(loader = 'full') {
    this.pagination.items = [];
    this.loading[loader] = true;
    this.ledgerService
      .indexReports(
        this.pagination.index,
        this.pagination.page,
        this.selectedType,
        formatDate(this.startDate),
        formatDate(this.endDate),
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
          this.pagination.items = [];
          serviceHttpErrorHandler(err);
          this.loading.stop();
        },
      );
  }

  reset() {
    this.pagination = this._pagination = resetPagination(50);
  }

  filter() {
    this.errorMessage = {endDate: ''};
    const validRanges = moment(this.endDate).isSameOrAfter(this.startDate);

    if (this.endDate && this.startDate && !validRanges) {
      return (this.errorMessage = {
        endDate: 'Invalid Date Range',
      });
    }

    this.reset();
    this.indexReports();
  }

  updateDate() {
    const value = this.selectedDate.value;
    this.endDate = moment().toISOString();
    if (value === 's') {
      return (this.startDate = this.endDate);
    }

    if (value) {
      this.startDate = moment().add(value, 'd').format(DATE_FORMAT);
      return this.filter();
    }

    this.startDate = this.endDate = '';
    return this.filter();
  }

  downloadCsv = () =>
    this.ledgerService.downloadReports(
      this.selectedType,
      formatDate(this.startDate),
      formatDate(this.endDate),
    );

  next() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index++;
    this.indexReports('page');
  }

  prev() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index--;
    this.indexReports('page');
  }
}
