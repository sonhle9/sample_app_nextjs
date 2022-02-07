import {Component, OnDestroy, OnInit} from '@angular/core';
import {IPagination} from '../../../../shared/interfaces/core.interface';
import {Subject} from 'rxjs';
import {ApiMerchantsService} from '../../../api-merchants.service';
import {takeUntil} from 'rxjs/operators';
import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import {forceUpdate, formatDate, isBlank, resetPagination} from '../../../../shared/helpers/common';
import {
  IMerchantRole,
  IDevice,
  IDeviceIndexParams,
} from '../../../../shared/interfaces/merchant.interface';
import {MatDialog} from '@angular/material/dialog';
import {EditDeviceModalComponent} from '../edit-device-modal/edit-device-modal.component';
import {EditDeviceModalData} from '../../shared/models';
import {EditMode, DevicesStatus} from '../../shared/enums';
import * as _ from 'lodash';
import {IDropdownItem} from '../../../../shared/components/dropdown/dropdown.interface';
import {
  DATE_FORMAT,
  DEFAULT_DROPDOWN_VALUES,
  ORDER_DATES_FILTER,
} from '../../../stations/shared/const-var';
import moment from 'moment';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss'],
})
export class DeviceListComponent implements OnInit, OnDestroy {
  private _pagination: IPagination<IDevice>;
  pagination: IPagination<IDevice>;
  message: string;
  messageType: string;
  searchValue = '';
  roles: IMerchantRole;
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
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Hardware',
    },
    {
      label: 'Devices',
    },
  ];

  // filter 1
  statusText = _.mapValues(DevicesStatus, (value) => _.startCase(_.lowerCase(value)));
  statuses: IDropdownItem[] = DEFAULT_DROPDOWN_VALUES.concat(
    _.entries(this.statusText).map(([value, text]) => ({text, value})),
  );
  selectedStatus = this.statuses[0];

  // filter 2
  dateFilters: IDropdownItem[] = ORDER_DATES_FILTER;
  selectedDateFilter: IDropdownItem = this.dateFilters[0];
  startDate: string;
  endDate: string;
  errorMessage = {
    endDate: '',
  };

  constructor(
    private readonly apiMerchantsService: ApiMerchantsService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.reset();
    this.initSessionRoles();
    this.indexDevices();
  }

  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }

  initSessionRoles() {
    this.roles = this.apiMerchantsService.getRolePermissions();
  }

  indexDevices(searchValue: string = '', loader: string = 'full') {
    const params: IDeviceIndexParams = {};
    if (this.selectedStatus.value) {
      params.status = this.selectedStatus.value;
    }

    if (this.startDate) {
      params.deviceDateFrom = formatDate(this.startDate);
    }

    if (this.endDate) {
      params.deviceDateTo = formatDate(this.endDate);
    }

    if (!isBlank(searchValue)) {
      params.searchValue = searchValue;
    }
    this.loading[loader] = true;
    this.apiMerchantsService
      .indexDevices(this.pagination.index, this.pagination.page, params)
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
    this.indexDevices(this.searchValue);
  }

  reset() {
    this.pagination = this._pagination = resetPagination(50);
  }

  prev() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index--;
    this.indexDevices(this.searchValue, 'page');
  }

  next() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index++;
    this.indexDevices(this.searchValue, 'page');
  }

  openAddDialog() {
    const data: EditDeviceModalData = {
      mode: EditMode.ADD,
    };

    const dialogRef = this.dialog.open(EditDeviceModalComponent, {
      width: '500px',
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.messageType = 'success';
        this.message = 'A new device has been added';
        this.indexDevices(this.searchValue);
      }
    });
  }

  openEditDialog(device: IDevice) {
    const data: EditDeviceModalData = {
      mode: EditMode.EDIT,
      deviceData: device,
    };

    const dialogRef = this.dialog.open(EditDeviceModalComponent, {
      width: '500px',
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.messageType = 'success';
        this.message = 'A new device has been updated';
        this.indexDevices(this.searchValue);
      }
    });
  }

  updateDateFilter() {
    const value = this.selectedDateFilter.value;
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

  filter() {
    this.errorMessage = {endDate: ''};
    const validRanges = moment(this.endDate).isSameOrAfter(this.startDate);

    if (this.endDate && this.startDate && !validRanges) {
      return (this.errorMessage = {
        endDate: 'Invalid Date Range',
      });
    }

    this.indexDevices();
  }
}
