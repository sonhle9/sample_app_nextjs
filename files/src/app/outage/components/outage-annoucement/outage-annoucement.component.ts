import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
// import {switchMapTo} from 'rxjs/operators';
import {
  IMalaysiaSystemState,
  ICurrentAnnouncementTextLocale,
  IMaintenanceRole,
} from '../../../../shared/interfaces/maintenance.interface';
import {ApiMaintenanceService} from '../../../api-maintenance.service';
// import {AuthService} from '../../../auth.service';
import {outageError2Message} from '../../shared/helpers';
import {SYSTEM_WIDE_SCOPE} from '../../shared/helpers';
import {IDropdownItem} from 'src/shared/components/dropdown/dropdown.interface';
import {MaintenanceColoursEnum} from 'src/shared/enums/maintenance.enum';

@Component({
  selector: 'app-outage-annoucement',
  templateUrl: './outage-annoucement.component.html',
  styleUrls: ['./outage-annoucement.component.scss'],
})
export class OutageAnnoucementComponent implements OnInit {
  @Input()
  systemState: IMalaysiaSystemState;

  announcementText = '';
  announcementTextLocale: ICurrentAnnouncementTextLocale = {
    en: '',
    ms: '',
    'zh-Hans': '',
    'zh-Hant': '',
    ta: '',
  };
  announcementColour: string;
  entireSystem = [true];
  message = '';
  messageType = '';
  loading = false;
  hasEdit = false;
  showDialog = false;
  password = '';
  roles: IMaintenanceRole;

  colors: IDropdownItem[] = Object.keys(MaintenanceColoursEnum).map((key) => ({
    text: key,
    value: MaintenanceColoursEnum[key],
  }));
  selectedColour;
  saveButtonEnabled: true;

  @Output()
  scheduled = new EventEmitter();

  @Output()
  completed = new EventEmitter();

  @Output()
  updated = new EventEmitter();

  get formattedAnnouncement() {
    const future = this.getFutureAnnouncement();
    return (future && future.announcementText) || '';
  }

  constructor(
    private maintenanceService: ApiMaintenanceService, // private authService: AuthService,
  ) {}

  ngOnInit() {
    this.initSessionRoles();
    this.initializeFormValues();
  }

  initializeFormValues() {
    const future = this.getFutureAnnouncement();
    if (future && future.announcementTextLocale) {
      this.announcementTextLocale = future.announcementTextLocale;
    }
    this.announcementText = future ? future.announcementText : '';
    this.announcementColour = future ? future.announcementColour : 'black';
    this.selectedColour = this.colors.find((color) => color.value === this.announcementColour);
  }

  getFutureAnnouncement() {
    return (this.systemState.futureMaintenancePeriods || []).find(
      ({scope}) => scope === SYSTEM_WIDE_SCOPE,
    );
  }

  edit() {
    this.initializeFormValues();
    this.hasEdit = true;
  }

  cancel() {
    this.initializeFormValues();
    this.hasEdit = false;
  }

  onSave() {
    const [checked] = this.entireSystem;
    const future = this.getFutureAnnouncement();
    let payload;
    let changeState$;

    this.checkAnnouncementTextLocaleObject();
    if (checked) {
      payload = {
        scope: SYSTEM_WIDE_SCOPE,
        announcementText: this.announcementTextLocale.en,
        startDate: null,
        announcementColour: this.announcementColour,
        announcementTextLocale: this.announcementTextLocale,
      };

      if (future) {
        payload = {...future, ...payload};

        changeState$ = this.maintenanceService.updateMaintenance(future.id, payload);
      } else {
        changeState$ = this.maintenanceService.scheduleMaintenance(payload);
      }
    } else {
      changeState$ = this.maintenanceService.completeMaintenance(SYSTEM_WIDE_SCOPE);
    }

    this.loading = true;
    this.message = this.messageType = '';
    // this.authService
    //   .login(this.authService.getSession().email, this.password)
    //   .pipe(switchMapTo(changeState$))
    changeState$.subscribe({
      next: (futureAnnouncement: any) => {
        this.loading = false;
        this.showDialog = false;
        this.password = '';
        this.message = 'Outage status updated';
        this.cancel();

        if (checked) {
          if (future) {
            this.announcementColour = futureAnnouncement.announcementColour;
            this.updated.emit({
              id: future.id,
              payload,
            });
          } else {
            this.announcementColour = futureAnnouncement.announcementColour;
            this.scheduled.emit(futureAnnouncement);
          }
        } else {
          this.announcementText = '';
          this.announcementTextLocale.en = '';
          this.announcementTextLocale.ms = '';
          this.announcementTextLocale['zh-Hans'] = '';
          this.announcementTextLocale['zh-Hant'] = '';
          this.announcementTextLocale.ta = '';
          this.announcementColour = 'black';
          this.completed.emit({id: future.id});
        }
      },
      error: (err) => {
        this.loading = false;
        this.showDialog = false;
        this.password = '';
        this.messageType = 'error';
        this.message = outageError2Message(err);
      },
    });
  }

  updateColor(color: any) {
    this.announcementColour = color.value.value;
  }

  submit() {
    if (this.entireSystem[0] === true) {
      if (!this.announcementTextLocale.en || this.announcementTextLocale.en === '') {
        this.loading = false;
        this.showDialog = false;
        this.password = '';
        this.messageType = 'error';
        this.message = outageError2Message('Announcement content for English is must');
      } else {
        this.showDialog = true;
      }
    } else {
      this.showDialog = true;
    }
  }

  checkAnnouncementTextLocaleObject() {
    if (!this.announcementTextLocale.ms || this.announcementTextLocale.ms === '') {
      this.announcementTextLocale.ms = this.announcementTextLocale.en;
    }
    if (!this.announcementTextLocale['zh-Hans'] || this.announcementTextLocale['zh-Hans'] === '') {
      this.announcementTextLocale['zh-Hans'] = this.announcementTextLocale.en;
    }
    if (!this.announcementTextLocale['zh-Hant'] || this.announcementTextLocale['zh-Hant'] === '') {
      this.announcementTextLocale['zh-Hant'] = this.announcementTextLocale.en;
    }
    if (!this.announcementTextLocale.ta || this.announcementTextLocale.ta === '') {
      this.announcementTextLocale.ta = this.announcementTextLocale.en;
    }
  }

  initSessionRoles() {
    this.roles = this.maintenanceService.getRolePermissions();
  }
}
