import {Component, OnDestroy, OnInit} from '@angular/core';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {IPagination} from '../../../../shared/interfaces/core.interface';
import {Subject} from 'rxjs';
import {ApiCardRangeService} from '../../../api-card-range.service';
import {takeUntil} from 'rxjs/operators';
import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import {forceUpdate, resetPagination, isBlank} from '../../../../shared/helpers/common';
import {ICardRange, ICardRangeRole} from '../../../../shared/interfaces/card-range.interface';
import * as _ from 'lodash';
import {IDropdownItem} from '../../../../shared/components/dropdown/dropdown.interface';
import {ORDER_TYPES_FILTER_CARDRANGE} from '../../shared/enum';
import {EditMode} from '../../shared/enum';
import {IMerchant} from '../../../../shared/interfaces/merchant.interface';
import {CardRangeModalData} from '../../shared/models';
import {MatDialog} from '@angular/material/dialog';
import {CardRangeModalComponent} from '../card-range-modal/card-range-modal.component';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';

@Component({
  selector: 'app-card-range-list',
  templateUrl: './card-range-list.component.html',
  styleUrls: ['./card-range-list.component.scss'],
})
export class CardRangeListComponent implements OnInit, OnDestroy {
  private _pagination: IPagination<ICardRange>;
  pagination: IPagination<ICardRange>;
  message: string;
  messageType: string;
  searchName = '';
  txtName = '';
  searchStartNumber = '';
  txtStartNumber = '';
  roles: ICardRangeRole;
  allSub: Subject<any> = new Subject<any>();
  loading = {
    full: false,
    page: false,

    get any() {
      return this.full || this.page;
    },

    stop() {
      this.full = this.page = false;
    },
  };

  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Card issuing',
    },
    {
      label: 'Card ranges',
    },
  ];

  // filter
  typeFilters: IDropdownItem[] = ORDER_TYPES_FILTER_CARDRANGE;
  selectedTypeFilter: IDropdownItem = this.typeFilters[0];
  constructor(
    private readonly apiCardRangeService: ApiCardRangeService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.reset();
    this.initSessionRoles();
    this.indexCardRange();
  }

  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }

  initSessionRoles() {
    this.roles = this.apiCardRangeService.getRolePermissions();
  }

  indexCardRange(searchName: string = '', searchStartNumber: string = '', loader: string = 'full') {
    const params: any = {};

    if (this.selectedTypeFilter.value) {
      params.type = this.selectedTypeFilter.value;
    }

    if (!isBlank(searchName)) {
      params.name = searchName.trim();
    }

    if (!isBlank(searchStartNumber)) {
      params.startNumber = searchStartNumber.trim();
    }

    this.loading[loader] = true;
    this.pagination.max = 1;
    this.apiCardRangeService
      .indexCardRange(this.pagination.index, this.pagination.page, params)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          this.pagination.max = this._pagination.max = res.max;
          this.pagination.items = this._pagination.items = res.items;
          this.pagination = forceUpdate(this.pagination);
          this.loading.stop();
        },
        (err) => {
          this.pagination.items = [];
          serviceHttpErrorHandler(err);
          this.loading.stop();
        },
      );
  }

  searchValueName() {
    this.reset();
    this.txtName = this.searchName;
    this.indexCardRange(this.txtName, this.txtStartNumber);
  }

  searchValueStartNumber() {
    this.reset();
    this.txtStartNumber = this.searchStartNumber;
    this.indexCardRange(this.txtName, this.txtStartNumber);
  }

  reset() {
    this.pagination = this._pagination = resetPagination(50);
  }

  prev() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index--;
    this.indexCardRange(this.txtName, this.txtStartNumber, 'page');
  }

  next() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index++;
    this.indexCardRange(this.txtName, this.txtStartNumber, 'page');
  }

  fnChangeShowName = (str: string) => {
    return _.isString(str)
      ? (str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()).split('_').join(' ')
      : str;
  };

  openAddDialog() {
    const data: CardRangeModalData = {
      mode: EditMode.ADD,
    };
    const dialogRef = this.dialog.open(CardRangeModalComponent, {
      width: '1000px',
      height: 'auto',
      data,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.messageType = 'success';
        this.message = 'A new card range has been added';
        this.indexCardRange(this.txtName, this.txtStartNumber);
      }
    });
  }

  openEditDialog(item: ICardRange) {
    const startNumber = item.startNumber.slice(6);
    const endNumber = item.endNumber.slice(6);
    const data: CardRangeModalData = {
      mode: EditMode.EDIT,
      cardRangeData: {...item, startNumber, endNumber},
      cardRangeId: item.id,
    };
    const dialogRef = this.dialog.open(CardRangeModalComponent, {
      width: '1000px',
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.messageType = 'success';
        this.message = 'A card range has been updated';
        this.indexCardRange(this.txtName, this.txtStartNumber);
      }
    });
  }

  updateTypeFilter() {
    return this.filter();
  }

  filter() {
    this.reset();
    this.indexCardRange(this.txtName, this.txtStartNumber);
  }

  redirectMerchantSettings(item: IMerchant) {
    window.open(
      `${CURRENT_ENTERPRISE.dashboardUrl}/settings?merchantId=${item.merchantId}&redirect-from=admin`,
      '_blank',
    );
  }
}
