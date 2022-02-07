import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router, Event, NavigationEnd} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {AppEmitter} from './../../../../app/emitter.service';
import {PermissionDeniedError} from './../../../../shared/helpers/permissionDenied.error';
import {ApiStationsService} from './../../../../app/api-stations.service';
import {mapStyles} from './station-map-styles';

@Component({
  selector: 'app-station-details-map',
  templateUrl: './station-details-map.component.html',
  styleUrls: ['./station-details-map.component.scss'],
})
export class StationDetailsMapComponent implements OnInit, OnDestroy {
  styles = mapStyles;
  allSub: Subject<any> = new Subject<any>();
  routerSub;
  markers: any[];
  zoom: number;
  stationId: string;
  isLoading: boolean;
  formValue: any = {};
  messageContent: string;
  messageType: string;
  isShowing: boolean;
  station: any;

  icon = {
    url: './assets/images/icons/marker_station_setel.png',
    scaledSize: {
      width: 35,
      height: 40,
    },
  };

  geofenceIcon = {
    url: './assets/images/icons/marker_geofence_setel.png',
    scaledSize: {
      width: 35,
      height: 40,
    },
  };

  constructor(
    private stationsService: ApiStationsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.naviagationEnd();
  }

  ngOnInit() {
    this.zoom = 18;
    this.isLoading = true;
    this.route.parent.params.subscribe((param) => {
      this.stationId = param['id'];
      this.indexStations();
      this.loadStationDetail();
    });
  }

  naviagationEnd() {
    this.routerSub = this.router.events.subscribe((e: Event) => {
      if (e instanceof NavigationEnd) {
        this.isShowing = false;
      }
    });
  }

  tilesLoaded() {
    this.isLoading = false;
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
    this.routerSub.unsubscribe();
  }

  markerDrag() {
    this.isShowing = true;
  }

  markerDragEnd(event: any) {
    this.isShowing = true;
    this.formValue.latitude = parseFloat(event.coords.lat.toFixed(6));
    this.formValue.longitude = parseFloat(event.coords.lng.toFixed(6));
  }

  geofenceMarkerDrag() {
    this.isShowing = true;
  }

  geofenceMarkerDragEnd(event: any) {
    this.isShowing = true;
    this.formValue.geofenceLatitude = parseFloat(event.coords.lat.toFixed(6));
    this.formValue.geofenceLongitude = parseFloat(event.coords.lng.toFixed(6));
  }

  changeRadius(radius) {
    this.formValue.geofenceRadius = parseFloat(radius || 0);
  }

  updateStationLocation() {
    this.isLoading = true;
    this.formValue.latitude = parseFloat(this.formValue.latitude);
    this.formValue.longitude = parseFloat(this.formValue.longitude);
    this.formValue.geofenceLatitude = parseFloat(this.formValue.geofenceLatitude);
    this.formValue.geofenceLongitude = parseFloat(this.formValue.geofenceLongitude);
    this.formValue.geofenceRadius = parseFloat(this.formValue.geofenceRadius);

    if (
      !this.formValue.latitude ||
      !this.formValue.longitude ||
      !this.formValue.geofenceLatitude ||
      !this.formValue.geofenceLongitude ||
      !this.formValue.geofenceRadius
    ) {
      this.isLoading = false;
      this.messageContent = `Please provide a valid data`;
      this.messageType = 'error';
      return;
    }

    this.stationsService.updateStationPartially(this.stationId, this.formValue).subscribe(
      (res: any) => {
        this.indexStations();
        this.isLoading = false;
        this.messageContent = res.message;
        this.messageType = 'success';
        this.isShowing = false;
      },
      () => {
        this.isLoading = false;
        this.messageContent = `Something went wrong. Please try again!`;
        this.messageType = 'error';
      },
    );
  }

  indexStations() {
    this.stationsService
      .indexStationsMap()
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          this.markers = res;
        },
        () => {
          this.isLoading = false;
        },
      );
  }

  loadStationDetail() {
    this.stationsService
      .station(this.stationId)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (station) => {
          this.station = station;
          this.formValue.latitude = station.latitude;
          this.formValue.longitude = station.longitude;
          this.formValue.geofenceLatitude = station.geofenceLatitude;
          this.formValue.geofenceLongitude = station.geofenceLongitude;
          this.formValue.geofenceRadius = station.geofenceRadius;
        },
        (err) => {
          if (err instanceof PermissionDeniedError) {
            return AppEmitter.get(AppEmitter.PermissionDenied).emit();
          }
          this.isLoading = false;
        },
      );
  }

  onCancel() {
    this.indexStations();
    this.loadStationDetail();
  }
}
