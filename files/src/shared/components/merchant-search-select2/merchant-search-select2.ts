import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatSelectChange} from '@angular/material/select';
import {ReplaySubject, Subject} from 'rxjs';
import {concatAll, debounceTime, delay, filter, map, takeUntil, tap} from 'rxjs/operators';
import {ApiMerchantsService} from 'src/app/api-merchants.service';
import {IMerchant} from 'src/shared/interfaces/merchant.interface';

const OPTION_ALL = '';

@Component({
  selector: 'app-merchant-search-select2',
  templateUrl: './merchant-search-select2.html',
  styleUrls: ['./merchant-search-select2.scss'],
})
export class MerchantSearchSelect2Component implements OnInit, OnDestroy {
  public merchantServerSideCtrl: FormControl = new FormControl(OPTION_ALL);

  public merchantServerSideFilteringCtrl: FormControl = new FormControl();

  public searching = false;

  public filteredServerSideMerchants: ReplaySubject<IMerchant[]> = new ReplaySubject<IMerchant[]>(
    1,
  );

  protected _onDestroy = new Subject<void>();

  filteredMerchants: IMerchant[];

  @Output()
  selectionChange = new EventEmitter<IMerchant>();

  constructor(private readonly apiMerchantsService: ApiMerchantsService) {}

  ngOnInit() {
    this.merchantServerSideFilteringCtrl.valueChanges
      .pipe(
        filter((search) => !!search.trim()),
        tap(() => (this.searching = true)),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search) => {
          return this.apiMerchantsService.indexMerchants(1, 100, {name: search});
        }),
        concatAll(),
        delay(500),
        takeUntil(this._onDestroy),
      )
      .subscribe(
        (filteredMerchants) => {
          this.filteredMerchants = filteredMerchants.items;
          this.searching = false;
          this.filteredServerSideMerchants.next(this.filteredMerchants);
        },
        () => {
          this.searching = false;
        },
      );
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  onSelectionChange($event: MatSelectChange) {
    $event.source.close();
    this.selectionChange.emit($event.value);
  }

  openedChange(opened: boolean) {
    if (opened) {
      return;
    }
    if (this.merchantServerSideCtrl.value === OPTION_ALL) {
      return;
    }
    if (!this.filteredMerchants.includes(this.merchantServerSideCtrl.value)) {
      this.merchantServerSideCtrl.setValue(OPTION_ALL);
      this.selectionChange.emit(null);
    }
  }
}
