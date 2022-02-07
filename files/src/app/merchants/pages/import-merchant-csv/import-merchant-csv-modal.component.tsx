import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {BuckActionImportModal} from '../../../../react/components/bulk-action-import-modal';
import {MatDialogRef} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';

@Component({
  template: '<div #container></div>',
})
export class ImportMerchantCsvModalComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;

  constructor(
    private dialogRef: MatDialogRef<ImportMerchantCsvModalComponent>,
    private adapter: ReactAdapterService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngAfterViewInit() {
    this.render();
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.wrapper.nativeElement);
  }

  render() {
    if (this.wrapper && this.wrapper.nativeElement) {
      ReactDOM.render(
        <ReactAdapterProvider adapterService={this.adapter} activatedRoute={this.activatedRoute}>
          <BuckActionImportModal onDismiss={() => this.dialogRef.close()} />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
