import {Component, OnInit} from '@angular/core';
import {combineLatest} from 'rxjs';
import {AppEmitter} from '../../../emitter.service';
import {
  IMalaysiaSystemState,
  IMaintenanceRole,
} from '../../../../shared/interfaces/maintenance.interface';
import {PermissionDeniedError} from '../../../../shared/helpers/permissionDenied.error';
import {ApiMaintenanceService} from '../../../api-maintenance.service';
// import {AuthService} from '../../../auth.service';
import {IOverrides, getOverrides, systemState2Overrides} from './overrides.config';
import {outageError2Message} from '../../shared/helpers';
import {forkJoin} from 'rxjs';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-outage',
  templateUrl: './outage.component.html',
  styleUrls: ['./outage.component.scss'],
})
export class OutageComponent implements OnInit {
  environment = environment;
  loading = true;
  systemState: IMalaysiaSystemState | null = null;
  overrides: IOverrides | null = null;
  showDialog = false;
  password = '';
  pendingOverride: {
    key: string;
    fields: Record<string, boolean>;
  } | null = null;
  roles: IMaintenanceRole;
  fieldBanks: any;

  constructor(
    private maintenanceService: ApiMaintenanceService, // private authService: AuthService,
  ) {}

  ngOnInit() {
    this.initSessionRoles();
    this.loadOveride();
  }

  loadOveride() {
    forkJoin([
      this.maintenanceService.readSystemState(),
      this.maintenanceService.getIPay88Banks(),
    ]).subscribe({
      next: (data) => {
        this.loading = false;
        this.systemState = data[0];
        this.overrides = systemState2Overrides(getOverrides(this.roles), data[0]);
        const object = {};
        data[1].map((item) => {
          object[item.paymentId] = {
            label: item.name,
            value: item.isMaintenance,
          };
        });
        this.fieldBanks = object;
        this.overrides['banks'].fields = this.fieldBanks;
      },
      error: (err) => {
        this.loading = false;
        this.systemState = null;
        this.fieldBanks = {};
        if (err instanceof PermissionDeniedError) {
          AppEmitter.get(AppEmitter.PermissionDenied).emit();
        }
      },
    });
  }

  onOverrideSwitch(key: string) {
    this.overrides[key].isOpen = !this.overrides[key].isOpen;
  }

  onOverridePending(key: string, fields: Record<string, boolean>) {
    this.showDialog = true;
    this.pendingOverride = {key, fields};
  }

  onAnnouncementScheduled(futureAnnouncement) {
    if (!this.systemState.futureMaintenancePeriods) {
      this.systemState.futureMaintenancePeriods = [];
    }

    this.systemState.futureMaintenancePeriods.push(futureAnnouncement);
  }

  onAnnouncementCompleted({id}) {
    this.systemState.entireSystem = false;
    this.systemState.futureMaintenancePeriods = this.systemState.futureMaintenancePeriods.filter(
      ({id: existingId}) => existingId !== id,
    );
  }

  onAnnouncementUpdated({id, payload}) {
    const future = this.systemState.futureMaintenancePeriods.find(
      ({id: existingId}) => existingId === id,
    );

    Object.assign(future, payload);
  }

  onOverrideSave() {
    const {key, fields} = this.pendingOverride;
    const existingOverride = this.overrides[key];

    this.showDialog = false;

    const schedulePred = ([fieldName, value]) => existingOverride.fields[fieldName].value !== value;

    const scheduleMapper = ([fieldName, value]) =>
      value
        ? this.maintenanceService.scheduleMaintenance({
            scope: existingOverride.fields[fieldName].scopeName,
          })
        : this.maintenanceService.completeMaintenance(existingOverride.fields[fieldName].scopeName);

    const changeState$ = existingOverride.schedule
      ? combineLatest(Object.entries(fields).filter(schedulePred).map(scheduleMapper))
      : key !== 'banks'
      ? this.maintenanceService.toggleMaintenance({
          key,
          body: fields,
        })
      : this.saveMaintenBanks(fields);

    // this.authService
    //   .login(this.authService.getSession().email, this.password)
    // .pipe(switchMapTo(changeState$))

    // @ts-ignore
    // eslint-disable-next-line import/no-deprecated
    changeState$.subscribe({
      next: () => {
        // this.password = '';
        existingOverride.errorMessage = null;

        for (const [fieldName, value] of Object.entries(fields)) {
          existingOverride.fields[fieldName].value = value;
        }
      },
      error: (err) => {
        existingOverride.errorMessage = outageError2Message(err);
      },
      complete: () => {
        this.pendingOverride = null;
        existingOverride.isOpen = false;
      },
    });
  }

  saveMaintenBanks(fields) {
    const fieldArray = Object.entries(fields);
    const arrChange = [];
    fieldArray.forEach(([key, value]) => {
      if (this.fieldBanks[key].value !== value) {
        const change = {paymentId: key, payload: {isMaintenance: value}};
        arrChange.push(change);
      }
    });
    const observableBatch = [];
    arrChange.forEach((element) => {
      observableBatch.push(this.maintenanceService.updateIPay88BanksMainten(element));
    });

    return forkJoin(observableBatch);
  }

  initSessionRoles() {
    this.roles = this.maintenanceService.getRolePermissions();
  }
}
