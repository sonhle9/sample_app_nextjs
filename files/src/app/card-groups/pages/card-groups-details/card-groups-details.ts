import {Component, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {ActivatedRoute} from '@angular/router';
import {ApiCardGroupService} from '../../../api-card-groups.service';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';

@Component({
  moduleId: module.id,
  selector: 'app-card-groups-details',
  templateUrl: 'card-groups-details.html',
  styleUrls: ['card-groups-details.scss'],
})
export class CardGroupsDetailsComponent implements OnDestroy {
  readonly webDashboardUrl = CURRENT_ENTERPRISE.dashboardUrl;
  cardgroups: any;
  showCode = false;
  allSub: Subject<any> = new Subject<any>();
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Card issuing',
    },
    {
      to: '/card-issuing/card-groups',
      label: 'Card groups',
    },
    {
      label: 'Card group details',
    },
  ];

  constructor(route: ActivatedRoute, private cardGroupsService: ApiCardGroupService) {
    route.params.pipe(takeUntil(this.allSub)).subscribe((param) => {
      this.initCardgroups(param.id);
    });
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  toggleDisplay() {
    this.showCode = !this.showCode;
  }

  initCardgroups(id: string) {
    this.cardGroupsService
      .readCardGroupDetails(id)
      .pipe(takeUntil(this.allSub))
      .subscribe((res) => {
        this.cardgroups = res;
      });
  }
}
