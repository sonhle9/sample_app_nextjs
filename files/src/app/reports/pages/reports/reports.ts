import {Component, OnInit} from '@angular/core';
import {IDropdownItem} from 'src/shared/components/dropdown/dropdown.interface';

@Component({
  moduleId: module.id,
  selector: 'app-reports',
  templateUrl: 'reports.html',
  styleUrls: ['./reports.scss'],
})
export class ReportsComponent implements OnInit {
  reports: IDropdownItem[] = [
    {
      value: '1',
      text: 'Weekly report',
    },
    {
      value: '2',
      text: 'Weekly report: Customer listing',
    },
    {
      value: '3',
      text: 'Customer funnel',
    },
  ];

  selectedReport = this.reports[0];

  constructor() {}

  ngOnInit() {}
}
