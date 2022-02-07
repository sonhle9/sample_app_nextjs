import {Component} from '@angular/core';
import {AuthService} from '../../../auth.service';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {customerRole} from 'src/shared/helpers/roles.type';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
})
export class DevicesComponent {
  constructor(private authService: AuthService) {}

  /** Breadcrumb */
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Risk Controls',
    },
    {
      label: 'Account devices',
    },
  ];
  get allowEditing() {
    return this.authService.getRoles().includes(customerRole.editDevice);
  }
}
