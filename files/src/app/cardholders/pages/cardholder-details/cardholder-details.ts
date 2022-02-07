import {Component, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {ActivatedRoute} from '@angular/router';
import {ApiCardholderService} from '../../../api-cardholders.service';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';

@Component({
  moduleId: module.id,
  selector: 'app-cardholder-details',
  templateUrl: 'cardholder-details.html',
  styleUrls: ['cardholder-details.scss'],
})
export class CardholderDetailsComponent implements OnDestroy {
  readonly webDashboardUrl = CURRENT_ENTERPRISE.dashboardUrl;
  cardholderDetailsDBUrl: string;
  cardholderId: string;
  cardholder: any;
  showCode = false;
  allSub: Subject<any> = new Subject<any>();
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Card issuing',
    },
    {
      to: '/card-issuing/cardholders',
      label: 'Cardholders',
    },
    {
      label: 'Cardholder details',
    },
  ];

  constructor(route: ActivatedRoute, private cardholderService: ApiCardholderService) {
    route.params.pipe(takeUntil(this.allSub)).subscribe((param) => {
      this.cardholderId = param.id;
      this.initCardholder(param.id);
    });
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  toggleDisplay() {
    this.showCode = !this.showCode;
  }

  initCardholder(id: string) {
    this.cardholderService
      .readCardholderDetails(id)
      .pipe(takeUntil(this.allSub))
      .subscribe((res) => {
        this.cardholder = res;
      });
  }

  gotoCardholderdetailsDB() {
    window.open(
      `${this.webDashboardUrl}/merchants/${this.cardholder.merchantId}/cards/cardholders/${this.cardholder.id}`,
    );
  }
}
