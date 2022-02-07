import {Component, Input, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import moment from 'moment';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-button-download',
  templateUrl: './button-download.component.html',
  styleUrls: ['./button-download.component.scss'],
})
export class ButtonDownloadComponent implements OnDestroy {
  @Input()
  download: Observable<any>;
  @Input()
  fileName = '';
  @Input()
  isLoading = false;
  @Input()
  disabled = false;
  @Input()
  totalItem?: number;

  @ViewChild('downloadEl', {static: false})
  downloadEl: ElementRef;

  allSub: Subject<any> = new Subject<any>();

  constructor() {}

  downloadFile() {
    if (this.isLoading) {
      return;
    }

    if (this.totalItem > 1000) {
      alert('You can only download up to 1000 entries. Please specify a smaller date range');
      return;
    }

    this.isLoading = true;
    this.download.pipe(takeUntil(this.allSub)).subscribe(
      (url) => {
        if (!url) {
          this.isLoading = false;
          return;
        }

        const link = this.downloadEl.nativeElement;
        link.href = url;
        link.download = `${this.fileName}${moment().format('YYYYMMDDhhmmss')}.csv`;
        link.click();

        window.URL.revokeObjectURL(url);
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      },
    );
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }
}
