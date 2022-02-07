import {Component, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {ActivatedRoute} from '@angular/router';
import {ApiCardRangeService} from '../../../api-card-range.service';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';

@Component({
  moduleId: module.id,
  selector: 'app-card-range-details',
  templateUrl: 'card-range-details.html',
  styleUrls: ['card-range-details.scss'],
})
export class CardRangeDetailsComponent implements OnDestroy {
  readonly webDashboardUrl = CURRENT_ENTERPRISE.dashboardUrl;
  cardRange: any;
  showCode = false;
  allSub: Subject<any> = new Subject<any>();
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Card issuing',
    },
    {
      to: '/card-issuing/card-ranges',
      label: 'Card ranges',
    },
    {
      label: 'Card range details',
    },
  ];

  constructor(route: ActivatedRoute, private cardRangeService: ApiCardRangeService) {
    route.params.pipe(takeUntil(this.allSub)).subscribe((param) => {
      this.initCardRange(param.id);
    });
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  toggleDisplay() {
    this.showCode = !this.showCode;
  }

  initCardRange(id: string) {
    this.cardRangeService
      .readCardRangeDetails(id)
      .pipe(takeUntil(this.allSub))
      .subscribe((res) => {
        this.cardRange = res;
      });
  }
}
