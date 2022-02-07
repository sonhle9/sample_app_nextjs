import {Component, Input} from '@angular/core';
import {IFraudProfiles} from 'src/app/api-blacklist-service';

@Component({
  selector: 'app-customer-fraud-profile-alert',
  templateUrl: './customerFraudProfileAlert.component.html',
  styleUrls: ['./customerFraudProfileAlert.component.scss'],
})
export class CustomerFraudProfileAlertComponent {
  @Input()
  fraudProfile: IFraudProfiles;
}
