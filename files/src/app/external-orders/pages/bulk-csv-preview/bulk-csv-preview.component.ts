import {Component, OnInit, AfterViewInit} from '@angular/core';
import {ICsvPreviewOrdersResponse} from 'src/shared/interfaces/externalOrder.interface';
import {ApiExternalOrderService} from 'src/app/api-external-orders.service';

@Component({
  selector: 'app-bulk-csv-preview',
  templateUrl: './bulk-csv-preview.component.html',
  styleUrls: ['./bulk-csv-preview.component.scss'],
})
export class BulkCsvPreviewComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'status',
    'receiptNumber',
    'transactionDate',
    'stationName',
    'purchaseType',
    'items',
    'isValidExternalOrder',
    'isGrantedBasePoint',
    'grantedBasePoints',
    'pointsToBeGranted',
  ];

  isVisible = false;
  isLoadingResults = false;
  resultsLength = 0;
  data: ICsvPreviewOrdersResponse[];

  constructor(private externalOrderService: ApiExternalOrderService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.externalOrderService.previewAvailable.subscribe((data) => {
      if (data.length) {
        this.data = data;
        this.resultsLength = data.length;
        this.isVisible = true;
      } else {
        this.isVisible = false;
      }
    });
  }
}
