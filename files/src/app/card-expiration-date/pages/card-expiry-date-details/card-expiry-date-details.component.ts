import {Component, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {ActivatedRoute} from '@angular/router';
import {ApiCardExpiryDateService} from '../../../api-card-expiry-date.service';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';

@Component({
  moduleId: module.id,
  selector: 'app-card-expiry-date-details',
  templateUrl: 'card-expiry-date-details.component.html',
  styleUrls: ['card-expiry-date-details.component.scss'],
})
export class CardExpiryDateDetailsComponent implements OnDestroy {
  readonly webDashboardUrl = CURRENT_ENTERPRISE.dashboardUrl;
  cardExpiryDate: any;
  showCode = false;
  allSub: Subject<any> = new Subject<any>();
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: 'Card issuing',
    },
    {
      to: '/card-issuing/card-expiry-date',
      label: 'Card expiration date',
    },
    {
      label: 'Card expiry date details',
    },
  ];

  constructor(route: ActivatedRoute, private cardExpiryDateService: ApiCardExpiryDateService) {
    route.params.pipe(takeUntil(this.allSub)).subscribe((param) => {
      this.initCardExpiryDate(param.id);
    });
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  toggleDisplay() {
    this.showCode = !this.showCode;
  }

  initCardExpiryDate(id: string) {
    this.cardExpiryDateService
      .readCardExpiryDateDetails(id)
      .pipe(takeUntil(this.allSub))
      .subscribe((res) => {
        this.cardExpiryDate = res;
      });
  }
}
