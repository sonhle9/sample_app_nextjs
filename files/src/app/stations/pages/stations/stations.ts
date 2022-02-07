import {Router, ActivatedRoute} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {
  IReadStation,
  IStationRole,
  StationStatus,
} from '../../../../shared/interfaces/station.interface';

import {ApiStationsService} from '../../../api-stations.service';

@Component({
  moduleId: module.id,
  selector: 'app-stations',
  templateUrl: 'stations.html',
  styleUrls: ['stations.scss'],
})
export class StationsComponent implements OnInit {
  station: IReadStation;
  roles: IStationRole;
  tabNavs = [
    {label: 'Details', link: './details', index: 0},
    {label: 'Details(BETA)', link: './details(beta)', index: 1},
    {label: 'Orders', link: './orders', index: 2},
    {label: 'Deliver2Me', link: './deliver2me', index: 3},
    {label: 'Over counter', link: './over-counter', index: 4},
    {label: 'Map', link: './map', index: 5},
  ];
  activeLink = -1;
  sub: any;
  stationId: string;

  message = '';

  get stationStatusCss() {
    return this.station && this.station.status === StationStatus.ACTIVE ? 'active' : '';
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stationsService: ApiStationsService,
  ) {
    this.initSessionRoles();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe((param) => {
      this.stationId = param['id'];
    });
  }

  private initSessionRoles() {
    this.roles = this.stationsService.getRolePermissions();
  }

  routeStations() {
    this.router.navigate(['stations']);
  }

  routeEdit() {
    this.router.navigate(['stations', this.stationId, 'edit']);
  }
}
