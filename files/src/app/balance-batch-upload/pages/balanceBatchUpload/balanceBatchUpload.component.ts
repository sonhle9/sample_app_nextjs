import {Component, OnInit} from '@angular/core';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';

@Component({
  selector: 'app-balance-batch-upload',
  templateUrl: './balanceBatchUpload.component.html',
  styleUrls: ['./balanceBatchUpload.component.scss'],
})
export class BalanceBatchUploadComponent implements OnInit {
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: 'Wallet',
    },
    {
      label: 'Wallet balance grantings',
    },
  ];
  ngOnInit() {}
}
