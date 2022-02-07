import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Subject} from 'rxjs';
import {
  tap,
  filter,
  pairwise,
  startWith,
  switchMap,
  switchMapTo,
  takeUntil,
  debounceTime,
} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import moment from 'moment';
import {dateValidator} from '../../../../shared/helpers/common';
import {ApiAccountsService} from '../../../api-accounts.service';
import {IDevice} from '../../../../shared/interfaces/devices';
import {DeviceConfirmModalComponent} from '../deviceConfirmModal/deviceConfirmModal.component';

const CUSTOM_RANGE = -1;

const formFilters2query = (filters) => {
  const {period, isBlocked, deviceId, customRange} = filters;
  const query = {
    ...(deviceId && {deviceId}),
    ...(isBlocked && {isBlocked}),
  };

  if (!isFinite(period)) {
    return query;
  }

  if (period === CUSTOM_RANGE) {
    return {
      ...query,
      ...Object.entries(customRange).reduce((acc, [key, value]) => {
        if (value) {
          query[key] = new Date(value as string).toISOString();
        }

        return acc;
      }, {}),
    };
  }

  return {
    ...query,
    createdAtGte: moment().subtract(period, 'd').toISOString(),
  };
};

@Component({
  selector: 'app-device-table',
  templateUrl: './deviceTable.component.html',
  styleUrls: ['./deviceTable.component.scss'],
})
export class DeviceTableComponent implements OnInit, OnDestroy {
  @Input()
  userId: string;

  @Input()
  allowEditing = false;

  @Input()
  hideFilters = false;

  devices: {
    list: IDevice[];
    total: number;
  };

  periods = [
    {
      text: 'All',
      value: Infinity,
    },
    {
      text: 'Last 7 days',
      value: 7,
    },
    {
      text: 'Last 30 days',
      value: 30,
    },
    {
      text: 'Specific Date Range',
      value: CUSTOM_RANGE,
    },
  ];

  pageSizes = [5, 10, 25, 50];

  filters = this.formBuilder.group({
    deviceId: '',
    isBlocked: '',
    period: Infinity,
    customRange: this.formBuilder.group({
      createdAtGte: ['', dateValidator],
      createdAtLte: ['', dateValidator],
    }),
  });

  loading = false;

  page = 1;

  pageSize = 50;

  cancel = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private apiAccountService: ApiAccountsService,
  ) {}

  get showCustomRange() {
    return this.filters.value.period === CUSTOM_RANGE;
  }

  ngOnInit() {
    const initialFilters = {
      deviceId: '',
      isBlocked: '',
      period: Infinity,
      customRange: {
        createdAtGte: '',
        createdAtLte: '',
      },
    };

    this.filters.valueChanges
      .pipe(
        debounceTime(500),
        startWith(initialFilters),
        pairwise(),
        filter(
          ([prev, latest]) =>
            this.filters.valid &&
            (prev.period === latest.period ||
              latest.period !== CUSTOM_RANGE ||
              Object.values(latest.customRange).some(Boolean)),
        ),
        tap(() => {
          this.page = 1;
        }),
        switchMap(this.listDevices.bind(this)),
      )
      .subscribe();

    this.listDevices().subscribe();
  }

  ngOnDestroy() {
    this.cancel.next();
    this.cancel.complete();
  }

  hasError(path: string) {
    const {errors} = this.filters.get(path);

    return !!(errors && Object.keys(errors).length);
  }

  listDevices() {
    this.loading = true;

    return this.apiAccountService
      .listDevices({
        page: this.page,
        perPage: this.pageSize,
        userId: this.userId,
        filters: formFilters2query(this.filters.value),
      })
      .pipe(
        tap(({data, pagination}) => {
          this.loading = false;
          this.devices = {
            total: pagination.total,
            list: data.map((item) => ({
              ...item,
              status: item.isBlocked ? 'Blacklisted' : 'Active',
              createdAt: moment(item.createdAt).format('lll'),
            })),
          };
        }),
        takeUntil(this.cancel),
      );
  }

  onPageChange({pageIndex, pageSize}) {
    this.page = pageIndex + 1;
    this.pageSize = pageSize;

    this.listDevices().subscribe();
  }

  onUnlink(idToUnlink: string) {
    this.dialog
      .open(DeviceConfirmModalComponent, {
        data: {
          title: 'Are you sure you want to unlink the following device?',
          device: this.devices.list.find(({id}) => id === idToUnlink),
        },
      })
      .afterClosed()
      .pipe(
        filter((data) => data && data.confirmed),
        switchMapTo(
          this.apiAccountService.unlinkDevice({
            id: idToUnlink,
          }),
        ),
        takeUntil(this.cancel),
      )
      .subscribe(() => {
        this.devices.total--;
        this.devices.list = this.devices.list.filter(({id}) => id !== idToUnlink);
      });
  }

  onSwitchBlocked(deviceIdToSwitch: string) {
    const device = this.devices.list.find(({deviceId}) => deviceId === deviceIdToSwitch);
    let preparedPayload;

    this.dialog
      .open(DeviceConfirmModalComponent, {
        data: {
          device,
          withRemark: !device.isBlocked,
          title: `Are you sure you want to ${
            device.isBlocked ? 'reactivate' : 'blacklist'
          } this device?`,
        },
      })
      .afterClosed()
      .pipe(
        filter((data) => data && data.confirmed),
        switchMap(({payload}) => {
          preparedPayload = {
            remark: !device.isBlocked ? payload.remark : null,
            isBlocked: !device.isBlocked,
          };

          return this.apiAccountService.updateDevice({
            id: device.deviceId,
            payload: preparedPayload,
          });
        }),
        takeUntil(this.cancel),
      )
      .subscribe(() => {
        this.devices.list = this.devices.list.map((anyDevice) =>
          anyDevice.deviceId !== deviceIdToSwitch
            ? anyDevice
            : {
                ...anyDevice,
                ...preparedPayload,
                status: !device.isBlocked ? 'Blacklisted' : 'Active',
              },
        );
      });
  }
}
