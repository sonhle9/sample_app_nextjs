import {Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-json-viewer-modal',
  templateUrl: './json-viewer-modal.component.html',
  styles: ['::ng-deep .cdk-overlay-pane { overflow: auto; }'],
})
export class JsonViewerModalComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {}
}
