import {Component, OnInit} from '@angular/core';
import {ApiStationsService} from 'src/app/api-stations.service';
import {
  IReadStation,
  IStationFeatureType,
  IStationRole,
  IOperatingDay,
} from 'src/shared/interfaces/station.interface';
import {takeUntil} from 'rxjs/operators';
import {PermissionDeniedError} from 'src/shared/helpers/permissionDenied.error';
import {AppEmitter} from 'src/app/emitter.service';
import {Subject} from 'rxjs';
import {Router, ActivatedRoute} from '@angular/router';
import {JsonViewerModalComponent} from 'src/shared/components/json-viewer-modal/json-viewer-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {ApiMerchantsService} from '../../../api-merchants.service';
import moment from 'moment';

@Component({
  selector: 'app-station-details',
  templateUrl: './station-details.component.html',
  styleUrls: ['./station-details.component.scss'],
})
export class StationDetailsComponent implements OnInit {
  loading: boolean;
  station: IReadStation;
  features: IStationFeatureType[] = [];
  roles: IStationRole;
  allSub: Subject<any> = new Subject<any>();
  isLoadingResults: boolean;

  sub: any;
  stationId: string;
  message = '';

  fuelMerchantName: string;
  storeMerchantName: string;

  operatingHours = [];
  operatingHoursTimeSlots = [];
  fuelInCarOperatingHours = [];
  fuelInCarTimeSlots = [];
  days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  constructor(
    public dialog: MatDialog,
    private stationsService: ApiStationsService,
    private merchantsService: ApiMerchantsService,
    private router: Router,
    private route: ActivatedRoute,
    private overlay: Overlay,
  ) {
    this.initSessionRoles();
  }

  ngOnDestory() {
    this.allSub.unsubscribe();
  }

  ngOnInit() {
    this.sub = this.route.parent.params.subscribe((param) => {
      this.stationId = param['id'];
      this.initStation(this.stationId);
      this.initFeatures();
    });
    this.initSuccessMessage();
  }

  private initSessionRoles() {
    this.roles = this.stationsService.getRolePermissions();
  }

  initSuccessMessage() {
    this.message = '';
    AppEmitter.get(AppEmitter.UpdatedStation)
      .pipe(takeUntil(this.allSub))
      .subscribe((res) => {
        this.message = res;
      });
  }

  routeStations() {
    this.router.navigate(['stations']);
  }

  routeEdit() {
    this.router.navigate(['stations', this.station.id, 'edit']);
  }

  private initStation(id) {
    this.station = null;
    this.loading = true;
    this.isLoadingResults = true;

    this.stationsService
      .station(id)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (station) => {
          station.setelAcceptedFor = station.setelAcceptedFor ? station.setelAcceptedFor : [];
          this.station = station;
          this.loading = false;
          this.isLoadingResults = false;
          this.fuelInCarOperatingHours = station.fuelInCarOperatingHours;
          this.fuelInCarTimeSlots = this.getTimeSlots(this.fuelInCarOperatingHours);
          this.operatingHours = station.operatingHours;
          this.operatingHoursTimeSlots = this.getTimeSlots(this.operatingHours);

          if (station.fuelMerchantId) {
            this.merchantsService.readMerchant(station.fuelMerchantId).subscribe((value) => {
              this.fuelMerchantName = station.fuelMerchantId + '-' + value.name;
            });
          }

          if (station.storeMerchantId) {
            this.merchantsService.readMerchant(station.storeMerchantId).subscribe((value) => {
              this.storeMerchantName = station.storeMerchantId + '-' + value.name;
            });
          }
        },
        (err) => {
          if (err instanceof PermissionDeniedError) {
            return AppEmitter.get(AppEmitter.PermissionDenied).emit();
          }
          this.isLoadingResults = false;
          this.loading = false;
          this.station = null;
          this.router.navigate(['stations']);
        },
      );
  }

  initFeatures() {
    this.stationsService
      .indexStationFeatures()
      .pipe(takeUntil(this.allSub))
      .subscribe((features) => {
        this.features = features;
      });
  }

  getFeatureTypeName(typeId: string): string {
    const features = this.features || [];
    const found = features.find((s) => typeId === s.typeId);
    return found && found.name;
  }

  getFeatureTypeItemName(typeId: string, itemId: string): string {
    const features = this.features || [];
    const feature = features.find((s) => typeId === s.typeId);
    if (!feature) {
      return '';
    }

    const item = feature.features.find((s) => s.id === itemId);
    return item && item.name;
  }

  openJsonViewerModal(data: any): void {
    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    this.dialog.open(JsonViewerModalComponent, {
      width: '800px',
      panelClass: 'custom-dialog-container',
      data,
      autoFocus: false,
      scrollStrategy,
    });
  }

  getTime(hours: number, minutes: number = 0) {
    return moment()
      .set({
        hour: hours,
        minute: minutes,
        second: 0,
        millisecond: 0,
      })
      .toDate();
  }

  getTimeSlots(fuelInCarOperatingHours: IOperatingDay[]): any {
    const array = [];
    this.days.forEach((_day, dayIndex) => {
      const day = fuelInCarOperatingHours.find((d) => d.day === dayIndex);
      const timeSlots = {
        slots: [],
      };
      if (day) {
        timeSlots.slots = day.timeSlots.map((timeSlot) => {
          return `${moment(this.convertMinutesToDate(timeSlot.from)).format('h:mm A')} ~ ${moment(
            this.convertMinutesToDate(timeSlot.to),
          ).format('h:mm A')}`;
        });
        array.push(timeSlots);
      }
    });
    return array;
  }

  convertMinutesToDate(minutes: number) {
    return this.getZeroTime().add(minutes, 'minute').toDate();
  }

  getZeroTime() {
    return moment().set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
  }
}
