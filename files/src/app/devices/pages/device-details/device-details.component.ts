import {Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {OnDestroy, Component} from '@angular/core';
import {IDevice} from '../../../../shared/interfaces/merchant.interface';
import {ApiMerchantsService} from '../../../api-merchants.service';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';

@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss'],
})
export class DeviceDetailsComponent implements OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Hardware',
    },
    {
      to: 'devices/list',
      label: 'Devices',
    },
    {
      label: 'Device detail',
    },
  ];
  deviceId: string;
  device: IDevice;

  message: string;
  messageType: string;

  allSub: Subject<any> = new Subject<any>();

  constructor(route: ActivatedRoute, private merchantsService: ApiMerchantsService) {
    route.params.pipe(takeUntil(this.allSub)).subscribe((param) => {
      this.deviceId = param.id;
      this.initDevice(this.deviceId);
    });
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  initDevice(id: string) {
    this.merchantsService
      .readDevice(id)
      .pipe(takeUntil(this.allSub))
      .subscribe((res) => {
        this.device = res;
      });
  }
}
