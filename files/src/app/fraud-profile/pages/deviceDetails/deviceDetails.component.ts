import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {Subject} from 'rxjs';
import {filter, switchMap, takeUntil} from 'rxjs/operators';
import moment from 'moment';
import {ApiAccountsService} from '../../../api-accounts.service';
import {IDeviceWithUsers} from '../../../../shared/interfaces/devices';
import {DeviceConfirmModalComponent} from '../../components/deviceConfirmModal/deviceConfirmModal.component';
import {AuthService} from '../../../auth.service';

@Component({
  selector: 'app-device-details',
  templateUrl: './deviceDetails.component.html',
  styleUrls: ['./deviceDetails.component.scss'],
})
export class DeviceDetailsComponent implements OnInit, OnDestroy {
  columns = [
    {
      prop: 'fullName',
      name: 'Full Name',
    },
    {
      prop: 'username',
      name: 'Phone',
    },
    {
      prop: 'email',
      name: 'Email',
    },
    {
      prop: 'createdAt',
      name: 'Created At',
    },
  ];

  loading = true;

  deviceWithUsers: IDeviceWithUsers = null;

  cancel = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private authService: AuthService,
    private apiAccountsService: ApiAccountsService,
  ) {}

  get allowEditing() {
    return this.authService.getRoles().includes('write-customer-devices');
  }

  ngOnInit() {
    const {id} = this.route.snapshot.params;

    this.apiAccountsService
      .getDeviceWithUsers({id})
      .pipe(takeUntil(this.cancel))
      .subscribe({
        next: ({device, users}) => {
          this.loading = false;
          this.deviceWithUsers = {
            device,
            users: Array.from(users)
              .sort(
                (a, b) =>
                  (new Date(b.deviceCreatedAt) as any) - (new Date(a.deviceCreatedAt) as any),
              )
              .map((user) => ({
                ...user,
                createdAt: moment(user.createdAt).format('lll'),
              })),
          };
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  ngOnDestroy() {
    this.cancel.next();
    this.cancel.complete();
  }

  onActivate(ev) {
    if (ev.type === 'click') {
      window.open(`${location.origin}/accounts/${ev.row.id}`, '_blank');
    }
  }

  onSwitchBlocked() {
    let preparedPayload;

    this.dialog
      .open(DeviceConfirmModalComponent, {
        data: {
          withRemark: !this.deviceWithUsers.device.isBlocked,
          title: `Are you sure you want to ${
            this.deviceWithUsers.device.isBlocked ? 'reactivate' : 'blacklist'
          } this device?`,
          device: this.deviceWithUsers.device,
        },
      })
      .afterClosed()
      .pipe(
        filter((data) => data && data.confirmed),
        switchMap(({payload}) => {
          preparedPayload = {
            isBlocked: !this.deviceWithUsers.device.isBlocked,
            remark: !this.deviceWithUsers.device.isBlocked ? payload.remark : null,
          };

          return this.apiAccountsService.updateDevice({
            id: this.deviceWithUsers.device.deviceId,
            payload: preparedPayload,
          });
        }),
        takeUntil(this.cancel),
      )
      .subscribe({
        next: () => {
          this.deviceWithUsers.device = {
            ...this.deviceWithUsers.device,
            ...preparedPayload,
          };
        },
      });
  }
}
