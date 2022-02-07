import {Component, OnInit} from '@angular/core';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';

@Component({
  selector: 'app-adjustment-view',
  templateUrl: './adjustment-view.component.html',
  styleUrls: ['./adjustment-view.component.scss'],
})
export class AdjustmentViewComponent implements OnInit {
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: 'Payments',
    },
    {
      label: 'Adjustments',
    },
  ];
  constructor() {}

  ngOnInit() {}
}
