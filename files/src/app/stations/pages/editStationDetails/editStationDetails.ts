import {ActivatedRoute, Router} from '@angular/router';
import {AppFormBuilder, AppFormGroup, AppValidators} from '../../../../shared/helpers/formGroup';
import {Component, OnInit} from '@angular/core';
import {FormArray, Validators, FormControl} from '@angular/forms';
import {
  IPump,
  IReadStation,
  IStationFeature,
  IStationFeatureType,
  IUpdateStation,
  IOperatingDay,
  ITimeSlot,
} from '../../../../shared/interfaces/station.interface';
import {
  SetelAcceptedFor,
  StationStatus,
  StoreStatus,
  FuelInCarStatus,
  ConciergeStatus,
} from '../../shared/const-var';
import {takeUntil} from 'rxjs/operators';

import {ApiStationsService} from '../../../api-stations.service';
import {AppEmitter} from '../../../emitter.service';
import {Subject, combineLatest} from 'rxjs';
import * as _ from 'lodash';
import moment from 'moment';
import {ApiMerchantsService} from '../../../api-merchants.service';
import {PumpStatus} from '../../../../react/modules/stations/stations.enum';

@Component({
  selector: 'app-edit-station-details',
  templateUrl: './editStationDetails.html',
  styleUrls: ['./editStationDetails.scss'],
})
export class EditStationDetailsComponent implements OnInit {
  isChecked = 2;
  loading: boolean;
  station: IReadStation;
  stationId: string;

  message = '';
  messageType = '';

  form: AppFormGroup;
  pumpsForm: FormArray;
  errorMessage: {[key: string]: boolean};
  allSub: Subject<any> = new Subject<any>();

  features: IStationFeatureType[] = [];
  selectedFeatures: {[key: string]: string[]} = {};

  fuelMerchants: any[] = [];
  storeMerchants: any[] = [];

  get selectedFeaturesValues(): IStationFeature[] {
    if (!this.selectedFeatures) {
      return [];
    }

    const selected: IStationFeature[] = [];
    const keys = Object.keys(this.selectedFeatures);
    for (const typeId of keys) {
      selected.push({
        typeId,
        featureItems: this.selectedFeatures[typeId] || [],
      });
    }
    return selected;
  }

  statuses: string[] = Object.values(StationStatus);
  storeStatuses: string[] = Object.values(StoreStatus);
  fuelInCarStatuses: string[] = Object.values(FuelInCarStatus);
  pumpStatuses: string[] = Object.values(PumpStatus);
  conciergeStatuses: string[] = Object.values(ConciergeStatus);
  modes: string[] = Object.values(SetelAcceptedFor);
  days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  fuelInCarOperatingHours = [];
  operatingHours = [];

  private currentPumps: IPump[] = [];

  constructor(
    route: ActivatedRoute,
    private router: Router,
    private stationsService: ApiStationsService,
    private merchantsService: ApiMerchantsService,
    private fb: AppFormBuilder,
  ) {
    route.params.pipe(takeUntil(this.allSub)).subscribe((param) => {
      this.initStation((this.stationId = param.id));
      this.indexFeatures();
    });
    this.initSuccessMessage();
    this.initForm();
  }

  ngOnInit() {}

  ngOnDestory() {
    this.allSub.unsubscribe();
  }

  routeStation() {
    this.router.navigate(['stations', this.stationId, 'details']);
  }

  initSuccessMessage() {
    this.message = '';
    AppEmitter.get(AppEmitter.AddedStation)
      .pipe(takeUntil(this.allSub))
      .subscribe(() => {
        this.message = 'Petrol station successfully added.';
      });
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      gstNumber: [''],
      address: [''],
      latitude: [0, [AppValidators.numberOnly]],
      longtitude: [0, [AppValidators.numberOnly]],
      geofenceLatitude: [0, [AppValidators.numberOnly]],
      geofenceLongitude: [0, [AppValidators.numberOnly]],
      geofenceRadius: [0, [AppValidators.numberOnly]],
      phone: [''],
      merchantId: ['', [Validators.required]],
      loyaltyVendorMerchantId: [''],
      status: [this.statuses[1]],
      setelAcceptedFor: [SetelAcceptedFor.fuel],
      pumps: this.fb.array([]),
      features: this.fb.array([]),
      storeStatus: [this.storeStatuses[1]],
      fuelInCarStatus: [this.fuelInCarStatuses[1]],
      conciergeStatus: [this.fuelInCarStatuses[1]],
      conciergStatus: [this.conciergeStatuses[1]],
      isOperating24Hours: [''],
      fuelMerchantId: [''],
      storeMerchantId: [''],
    });
    this.pumpsForm = this.form.get('pumps') as FormArray;
    this.errorMessage = AppValidators.initErrorMessageObject(this.form);
  }

  syncPumps() {
    this.loading = true;
    this.stationsService
      .syncPumps(this.stationId)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (station) => {
          this.initStation(this.stationId);
          window.scrollTo(0, 0);
          this.message = this.getPumpSyncSuccessMessage(station.pumps); // 'Pumps successfully updated.';
          this.messageType = '';
        },
        () => {
          this.loading = false;
          window.scrollTo(0, 0);
          this.message = 'Ops! Unable to update station pumps.';
          this.messageType = 'error';
        },
      );
  }

  submit() {
    this.form.markAllAsDirty();
    this.errorMessage = AppValidators.getErrorMessageObject(this.form);

    if (this.form.invalid) {
      window.scrollTo(0, 0);
      return;
    }

    this.loading = true;
    this.message = this.messageType = '';
    this.station = null;
    const {
      latitude,
      longtitude,
      geofenceLatitude,
      geofenceLongitude,
      geofenceRadius,
      merchantId,
      phone,
      companyName,
      gstNumber,
      fuelInCarOperatingDays,
      fuelInCarOperatingHours,
      operatingHours,
      operatingDays,
      ...others
    } = this.form.value;

    const postValue: IUpdateStation = {
      kipleMerchantId: merchantId,
      latitude: +(latitude || 0),
      longitude: +(longtitude || 0),
      geofenceLatitude: +(geofenceLatitude || 0),
      geofenceLongitude: +(geofenceLongitude || 0),
      geofenceRadius: +(geofenceRadius || 0),
      merchant: {
        phoneNumber: phone,
        tradingCompanyName: companyName,
        gstNumber,
      },
      ...others,
      features: this.selectedFeaturesValues,
      fuelInCarOperatingHours: this.convertToOperatingDays(
        this.form.value.fuelInCarOperatingDays,
        this.form.value.fuelInCarOperatingHours,
      ),
      operatingHours: this.convertToOperatingDays(
        this.form.value.operatingDays,
        this.form.value.operatingHours,
      ),
    };

    this.stationsService
      .update(this.stationId, postValue)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        async () => {
          AppEmitter.get(AppEmitter.UpdatedStation).emit('Petrol station successfully updated.');
          await this.router.navigate(['/stations', this.stationId, 'details']);
        },
        () => {
          this.loading = false;
          window.scrollTo(0, 0);
          this.message = 'Ops! Unable to update station.';
          this.messageType = 'error';
        },
      );
  }

  private getStation(id: string) {
    return this.stationsService.station(id);
  }

  private initStation(id: string) {
    this.station = null;
    this.loading = true;

    combineLatest([this.getStation(id), this.indexFeatures() as any])
      .pipe(takeUntil(this.allSub))
      .subscribe(
        ([station, features]: any) => {
          this.station = station;
          this.features = features;
          this.loading = false;
          this.removeFeature(this.features, 'facilities', 'facilities_setel_enabled');
          this.fuelInCarOperatingHours = this.station.fuelInCarOperatingHours;
          this.operatingHours = this.station.operatingHours;
          this.form.patchValue({
            name: station.name,
            address: station.address,
            latitude: station.latitude || 0,
            longtitude: station.longitude || 0,
            geofenceLatitude: station.geofenceLatitude || 0,
            geofenceLongitude: station.geofenceLongitude || 0,
            geofenceRadius: station.geofenceRadius || 0,
            merchantId: station.kipleMerchantId,
            loyaltyVendorMerchantId: station.loyaltyVendorMerchantId,
            status: station.status || StationStatus.inactive,
            storeStatus: station.storeStatus || StoreStatus.comingsoon,
            fuelInCarStatus: station.fuelInCarStatus || FuelInCarStatus.comingsoon,
            conciergeStatus: station.conciergeStatus || ConciergeStatus.comingsoon,
            companyName: station.merchant.tradingCompanyName,
            gstNumber: station.merchant.gstNumber,
            phone: station.merchant.phoneNumber,
            setelAcceptedFor: station.setelAcceptedFor,
            fuelMerchantId: station.fuelMerchantId,
            storeMerchantId: station.storeMerchantId,
            isOperating24Hours: station.isOperating24Hours,
          });

          this.form.controls['fuelInCarOperatingDays'] = this.fb.array(
            this.convertDaysToCheckbox(this.station.fuelInCarOperatingHours),
            Validators.required,
          );
          this.form.controls['fuelInCarOperatingHours'] = this.fb.array(
            this.getTimeSlots(this.station.fuelInCarOperatingHours),
            Validators.required,
          );

          this.form.controls['operatingDays'] = this.fb.array(
            this.convertDaysToCheckbox(this.station.operatingHours),
            Validators.required,
          );
          this.form.controls['operatingHours'] = this.fb.array(
            this.getTimeSlots(this.station.operatingHours),
            Validators.required,
          );
          this.initPumpsForm(station.pumps || []);
          this.initFeaturesForm(this.features, station.features || []);
        },
        () => {
          this.loading = false;
          this.station = null;
          this.router.navigate(['stations']);
        },
      );
  }

  private indexFeatures() {
    return this.stationsService.indexStationFeatures();
  }

  private initPumpsForm(pumps: IPump[]) {
    this.currentPumps = pumps || [];
    Array(this.pumpsForm.length)
      .fill(0)
      .map(() => this.pumpsForm.removeAt(0));

    for (const {pumpId, status} of pumps) {
      this.pumpsForm.push(
        this.fb.group({
          pumpId: [pumpId],
          status: [status || StationStatus.inactive],
        }),
      );
    }
  }

  private initFeaturesForm(allFeatureTypes: IStationFeatureType[], selected: IStationFeature[]) {
    for (const featureType of allFeatureTypes) {
      const {typeId} = featureType;
      const found = selected.find((s) => s.typeId === typeId);
      this.selectedFeatures[typeId] = this.sanitizeFeatureItems(featureType, found);
    }
  }

  private sanitizeFeatureItems(type: IStationFeatureType, selected: IStationFeature): string[] {
    if (!type || !type.features || !selected || !selected.featureItems) {
      return [];
    }

    const {features} = type;
    const {featureItems} = selected;
    const sanitize = [];
    for (const {id} of features) {
      const exist = featureItems.some((s) => s === id);
      if (!exist) {
        continue;
      }
      sanitize.push(id);
    }

    return sanitize;
  }

  private getPumpSyncSuccessMessage(pumps: IPump[]): string {
    const current = this.currentPumps;
    const anyResponse = pumps.length !== 0;
    const anyDatabase = current.length !== 0;

    if (anyResponse) {
      return anyDatabase
        ? 'Updated pump details updated to station'
        : 'New pump details added to station';
    }

    return anyDatabase ? 'Pumps have been removed' : 'No pumps available yet';
  }

  private removeFeature(featureTypes: IStationFeatureType[], typeId: string, featureId: string) {
    // Not returns anything since splice mutates the array

    const type = _.find(featureTypes, {typeId});

    // Use optional chaining when upgrade Typescript to 3.7
    if (type) {
      const indexToRemove = _.findIndex(type.features, {id: featureId});

      if (indexToRemove >= 0) {
        type.features.splice(indexToRemove, 1);
      }
    }
  }

  convertDaysToCheckbox(operatingHours: IOperatingDay[]): FormControl[] {
    const array = [];
    this.days.forEach((_day, dayIndex) => {
      const day = operatingHours.find((d) => d.day === dayIndex);
      array.push(new FormControl(!!day));
    });
    return array;
  }

  getTimeSlots(operatingHours: IOperatingDay[]): FormControl[] {
    const array = [];
    this.days.forEach((_day, dayIndex) => {
      const day = operatingHours.find((d) => d.day === dayIndex);
      const timeSlots: ITimeSlot = {
        slots: [],
      };
      if (day) {
        timeSlots.slots = day.timeSlots.map((timeSlot) => {
          return [this.convertMinutesToDate(timeSlot.from), this.convertMinutesToDate(timeSlot.to)];
        });
      } else {
        // Set default value 9am to 5pm
        timeSlots.slots = [[this.convertMinutesToDate(540), this.convertMinutesToDate(1020)]];
      }

      array.push(new FormControl(timeSlots));
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

  convertDateToMinutes(date) {
    return moment(date).diff(this.getZeroTime(), 'minute');
  }

  convertToOperatingDays(operatingDays: boolean[], timeSlots: ITimeSlot[]): IOperatingDay[] {
    const array = [];
    this.days.forEach((_day, dayIndex) => {
      if (operatingDays[dayIndex]) {
        array.push({
          day: dayIndex,
          timeSlots: timeSlots[dayIndex].slots.map((hour) => {
            return {
              from: this.convertDateToMinutes(hour[0]),
              to: this.convertDateToMinutes(hour[1]),
            };
          }),
        });
      }
    });
    return array;
  }

  onOperatingHoursUpdate(
    data: {index: number; timeSlots: ITimeSlot},
    dayIndex: number,
    operatingHours,
  ) {
    const updatedHours = operatingHours.value.slice();
    updatedHours[dayIndex] = data.timeSlots;
    operatingHours.patchValue(updatedHours);
  }

  onDayChange(index, indicator) {
    this.form.value[indicator][index] = !this.form.value[indicator][index];
  }

  fetchFuelMerchants() {
    const searchValue = this.form.controls.fuelMerchantId.value;
    this.merchantsService
      .indexMerchants(
        0,
        25,
        searchValue
          ? {
              searchValue,
            }
          : null,
      )
      .subscribe((value) => {
        this.fuelMerchants = value.items;
      });
  }

  fetchStoreMerchants() {
    const searchValue = this.form.controls.storeMerchantId.value;
    this.merchantsService
      .indexMerchants(
        0,
        25,
        searchValue
          ? {
              searchValue,
            }
          : null,
      )
      .subscribe((value) => {
        this.storeMerchants = value.items;
      });
  }
}
