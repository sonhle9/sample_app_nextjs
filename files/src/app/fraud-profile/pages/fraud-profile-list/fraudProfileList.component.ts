import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import * as _ from 'lodash';
import moment from 'moment';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {
  ApiBlacklistService,
  FraudProfilesStatus,
  IFraudProfiles,
  IFraudProfilesFilters,
} from '../../../../app/api-blacklist-service';
import {
  DEFAULT_DROPDOWN_VALUES,
  ORDER_DATES_FILTER,
} from '../../../../app/stations/shared/const-var';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {IDropdownItem} from '../../../../shared/components/dropdown/dropdown.interface';
import {forceUpdate, formatDate, isBlank, resetPagination} from '../../../../shared/helpers/common';
import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import {IPagination} from '../../../../shared/interfaces/core.interface';
import {FraudProfileModalComponent} from '../fraud-profile-modal/fraudProfileModal.component';
import {FraudProfilesStatusPipe} from 'src/shared/pipes/fraud-profiles-status.pipe';
import {IFraudRole} from 'src/shared/interfaces/fraud.interface';

@Component({
  selector: 'app-fraud-profile-list',
  templateUrl: './fraudProfileList.component.html',
  styleUrls: ['./fraudProfileList.component.scss'],
})
export class FraudProfileListComponent implements OnInit, OnDestroy {
  private _pagination: IPagination<IFraudProfiles>;
  pagination: IPagination<IFraudProfiles>;

  // filter name
  searchValue = '';

  // filter status
  statusPipe = new FraudProfilesStatusPipe();
  statusText = _.mapValues(FraudProfilesStatus, (value) => this.statusPipe.transform(value));
  statuses: IDropdownItem[] = DEFAULT_DROPDOWN_VALUES.concat(
    _.entries(this.statusText).map(([value, text]) => ({text, value})),
  );
  selectedStatus = this.statuses[0];

  // filter date
  dateFilters: IDropdownItem[] = ORDER_DATES_FILTER;
  selectedDateFilter: IDropdownItem = this.dateFilters[0];
  startDate: string;
  endDate: string;
  errorMessage = {
    endDate: '',
  };

  // request handler
  allSub: Subject<any> = new Subject<any>();
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

  // edit response message
  message: string;
  messageType: string;
  roles: IFraudRole;

  /** Breadcrumb */
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Risk Controls',
    },
    {
      label: 'Fraud profiles',
    },
  ];
  constructor(
    private readonly apiBlacklistService: ApiBlacklistService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.reset();
    this.initSessionRoles();
    this.index();
  }

  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }

  initSessionRoles() {
    this.roles = this.apiBlacklistService.getRolePermissions();
  }

  index(searchValue: string = '', loader: string = 'full') {
    const params: IFraudProfilesFilters = {};
    if (this.selectedStatus.value) {
      params.status = this.selectedStatus.value;
    }

    if (this.startDate) {
      params.createdAtFrom = formatDate(this.startDate);
    }

    if (this.endDate) {
      params.createdAtTo = formatDate(this.endDate);
    }

    if (!isBlank(searchValue)) {
      params.targetName = searchValue;
    }
    this.loading[loader] = true;
    this.apiBlacklistService
      .listFraudProfiles(params, this.pagination.index, this.pagination.page)
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
    this.reset();
    this.index(this.searchValue);
  }

  reset() {
    this.pagination = this._pagination = resetPagination(50);
  }

  prev() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index--;
    this.index(this.searchValue, 'page');
  }

  next() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index++;
    this.index(this.searchValue, 'page');
  }

  updateDateFilter() {
    const now = moment().set({second: 0, millisecond: 0});

    this.endDate = now.toISOString();

    const value = this.selectedDateFilter.value;

    if (value === 's') {
      return (this.startDate = this.endDate);
    }

    if (value) {
      this.startDate = now.add(value, 'd').toISOString();
      return this.filter();
    }

    this.startDate = this.endDate = '';
    return this.filter();
  }

  filter() {
    this.errorMessage = {endDate: ''};
    const validRanges = moment(this.endDate).isSameOrAfter(this.startDate);

    if (this.endDate && this.startDate && !validRanges) {
      return (this.errorMessage = {
        endDate: 'Invalid Date Range',
      });
    }

    this.index();
  }

  openEditDialog(data: IFraudProfiles) {
    const dialogRef = this.dialog.open(FraudProfileModalComponent, {
      width: '820px',
      height: '470px',
      data,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      if (res.isSuccess) {
        this.messageType = 'success';
        this.message = 'Fraud profile was updated successfully';
        this.index(this.searchValue);
      } else {
        this.messageType = 'error';
        this.message = res.data;
      }
    });
  }
}
