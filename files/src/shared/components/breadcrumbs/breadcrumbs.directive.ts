import {Directive, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {BreadcrumbsService} from './breadcrumbs.service';

@Directive({
  selector: '[appBreadcrumbs]',
})
export class BreadcrumbsDirective implements OnInit, OnChanges, OnDestroy {
  @Input('appBreadcrumbs') breadcrumbs: BreadcrumbItem[];
  constructor(private readonly breadcrumbService: BreadcrumbsService) {}

  ngOnInit() {
    this.breadcrumbService.setBreadcrumbs(this.breadcrumbs);
  }

  ngOnChanges() {
    this.breadcrumbService.setBreadcrumbs(this.breadcrumbs);
  }

  ngOnDestroy() {
    this.breadcrumbService.clearBreadcrumbs();
  }
}
