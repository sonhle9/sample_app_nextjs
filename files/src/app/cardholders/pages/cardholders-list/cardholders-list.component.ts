import {Component, OnDestroy, OnInit} from '@angular/core';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {IPagination} from '../../../../shared/interfaces/core.interface';
import {Subject} from 'rxjs';
import {ApiCardholderService} from '../../../api-cardholders.service';
import {takeUntil} from 'rxjs/operators';
import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import {forceUpdate, formatDate, resetPagination, isBlank} from '../../../../shared/helpers/common';
import {ICardholder, ICardholderRole} from '../../../../shared/interfaces/cardholder.interface';
import * as _ from 'lodash';
import {IDropdownItem} from '../../../../shared/components/dropdown/dropdown.interface';
import {DATE_FORMAT} from '../../../stations/shared/const-var';
import {ORDER_DATES_FILTER_CARDHOLDER} from '../../shared/enum';
import moment from 'moment';
import {IMerchant} from '../../../../shared/interfaces/merchant.interface';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';

@Component({
  selector: 'app-cardholders-list',
  templateUrl: './cardholders-list.component.html',
  styleUrls: ['./cardholders-list.component.scss'],
})
export class CardholdersListComponent implements OnInit, OnDestroy {
  private _pagination: IPagination<ICardholder>;
  pagination: IPagination<ICardholder>;
  message: string;
  messageType: string;
  searchValue = '';
  roles: ICardholderRole;
  allSub: Subject<any> = new Subject<any>();
  dashboardUrl: string = CURRENT_ENTERPRISE.dashboardUrl;
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

  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Card issuing',
    },
    {
      label: 'Cardholders',
    },
  ];

  // filter
  dateFilters: IDropdownItem[] = ORDER_DATES_FILTER_CARDHOLDER;
  selectedDateFilter: IDropdownItem = this.dateFilters[0];
  startDate: string;
  endDate: string;
  errorMessage = {
    endDate: '',
  };

  constructor(
    private readonly apiCardholdersService: ApiCardholderService, // private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.reset();
    this.initSessionRoles();
    this.indexCardholders();
  }

  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }

  initSessionRoles() {
    this.roles = this.apiCardholdersService.getRolePermissions();
  }

  indexCardholders(searchValue: string = '', loader: string = 'full') {
    const params: any = {};

    if (this.startDate) {
      params.dateFrom = formatDate(this.startDate);
    }

    if (this.endDate) {
      params.dateTo = formatDate(this.endDate);
    }

    if (!isBlank(searchValue)) {
      params.search = searchValue.trim();
    }
    this.loading[loader] = true;
    this.apiCardholdersService
      .indexCardholders(this.pagination.index, this.pagination.page, params)
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

  search() {
    const validRanges = moment(this.endDate).isSameOrAfter(this.startDate);
    if (!validRanges) {
      return;
    }
    this.reset();
    this.indexCardholders(this.searchValue);
  }

  reset() {
    this.pagination = this._pagination = resetPagination(50);
  }

  prev() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index--;
    this.indexCardholders(this.searchValue, 'page');
  }

  next() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index++;
    this.indexCardholders(this.searchValue, 'page');
  }

  openAddDialog() {}

  openEditDialog() {}

  updateDateFilter() {
    const value = this.selectedDateFilter.value;
    this.endDate = moment().toISOString();
    if (value === 's') {
      this.startDate = this.endDate;
      return this.filter();
    }

    if (value) {
      this.startDate = moment().add(value, 'd').format(DATE_FORMAT);
      return this.filter();
    }

    this.startDate = this.endDate = '';
    return this.filter();
  }

  filter() {
    this.reset();
    this.errorMessage = {endDate: ''};
    const validRanges = moment(this.endDate).isSameOrAfter(this.startDate);

    if (this.endDate && this.startDate && !validRanges) {
      return (this.errorMessage = {
        endDate: 'Invalid Date Range',
      });
    }

    this.indexCardholders(this.searchValue);
  }

  redirectMerchantSettings(item: IMerchant) {
    window.open(
      `${CURRENT_ENTERPRISE.dashboardUrl}/settings?merchantId=${item.merchantId}&redirect-from=admin`,
      '_blank',
    );
  }
}
