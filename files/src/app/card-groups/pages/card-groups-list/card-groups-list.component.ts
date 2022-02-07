import {Component, OnDestroy, OnInit} from '@angular/core';
import {IPagination} from '../../../../shared/interfaces/core.interface';
import {Subject} from 'rxjs';
import {ApiCardGroupService} from '../../../api-card-groups.service';
import {takeUntil} from 'rxjs/operators';
import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import {forceUpdate, formatDate, resetPagination, isBlank} from '../../../../shared/helpers/common';
import {ICardGroup, ICardGroupRole} from '../../../../shared/interfaces/card-group.interface';
import * as _ from 'lodash';
import {IDropdownItem} from '../../../../shared/components/dropdown/dropdown.interface';
import {DATE_FORMAT} from '../../../stations/shared/const-var';
import {ORDER_DATES_FILTER_CARDGROUP, Types} from '../../shared/enum';
import moment from 'moment';
import {EditMode} from '../../shared/enum';
import {MatDialog} from '@angular/material';
import {EditCardGroupModalComponent} from '../edit-card-group-modal/edit-card-group-modal.component';
import {EditCardGroupModalData} from '../../shared/models';
import {Levels} from 'src/app/cards/shared/enums';
import {ApiMerchantsService} from 'src/app/api-merchants.service';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';

@Component({
  selector: 'app-card-groups-list',
  templateUrl: './card-groups-list.component.html',
  styleUrls: ['./card-groups-list.component.scss'],
})
export class CardGroupsListComponent implements OnInit, OnDestroy {
  private _pagination: IPagination<ICardGroup>;
  pagination: IPagination<ICardGroup>;
  message: string;
  messageType: string;
  searchValue = '';
  searchMerchant = '';
  mccFilterModel = '';
  merchants: any[] = [];
  roles: ICardGroupRole;
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
      label: 'Card groups',
    },
  ];

  // filter
  dateFilters: IDropdownItem[] = ORDER_DATES_FILTER_CARDGROUP;
  selectedDateFilter: IDropdownItem = this.dateFilters[0];
  startDate: string;
  endDate: string;
  errorMessage = {
    endDate: '',
  };

  constructor(
    private readonly apiCardGroupsService: ApiCardGroupService,
    private readonly apiMerchantsService: ApiMerchantsService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.reset();
    this.initSessionRoles();
    this.indexCardGroups();
    this.apiMerchantsService.indexMerchants(0, 25).subscribe((value) => {
      this.merchants = value.items;
    });
  }

  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }

  initSessionRoles() {
    this.roles = this.apiCardGroupsService.getRolePermissions();
  }

  indexCardGroups(searchValue: string = '', searchMerchant: string = '', loader: string = 'full') {
    const params: any = {};

    if (this.startDate) {
      params.dateFrom = formatDate(this.startDate);
    }

    if (this.endDate) {
      params.dateTo = formatDate(this.endDate);
    }

    if (!isBlank(searchValue)) {
      params.search = searchValue.trim();
    }
    if (!isBlank(searchMerchant)) {
      params.merchantId = searchMerchant.trim();
    }
    this.loading[loader] = true;
    this.apiCardGroupsService
      .indexCardGroups(this.pagination.index, this.pagination.page, params)
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

  search() {
    this.reset();
    this.indexCardGroups(this.searchValue, this.searchMerchant);
  }

  searchCardGroup() {
    this.reset();
    this.indexCardGroups(this.searchValue, this.searchMerchant);
  }

  onSearchMerchant() {
    this.apiMerchantsService
      .indexMerchants(0, 25, this.mccFilterModel ? {searchValue: this.mccFilterModel} : null)
      .subscribe((value) => {
        this.merchants = value.items;
      });
  }

  reset() {
    this.pagination = this._pagination = resetPagination(50);
  }

  prev() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index--;
    this.indexCardGroups(this.searchValue, this.searchMerchant, 'page');
  }

  next() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index++;
    this.indexCardGroups(this.searchValue, this.searchMerchant, 'page');
  }

  openAddDialog() {
    const data: EditCardGroupModalData = {
      mode: EditMode.ADD,
    };

    const dialogRef = this.dialog.open(EditCardGroupModalComponent, {
      width: '1000px',
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.messageType = 'success';
        this.message = 'A new card groups has been added';
        this.indexCardGroups(this.searchValue, this.searchMerchant);
      }
    });
  }

  openEditDialog(item: ICardGroup) {
    const data: EditCardGroupModalData = {
      mode: EditMode.EDIT,
      cardGroupData: item,
      cardGroupId: item.id,
    };
    const dialogRef = this.dialog.open(EditCardGroupModalComponent, {
      width: '1000px',
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.messageType = 'success';
        this.message = 'A new card groups has been added';
        this.indexCardGroups(this.searchValue, this.searchMerchant);
      }
    });
  }

  updateDateFilter() {
    const value = this.selectedDateFilter.value;
    this.endDate = moment().format(DATE_FORMAT);
    if (value === 's') {
      this.startDate = this.endDate;
      return this.filter();
    }

    if (value) {
      this.startDate = moment().add(value, 'd').format(DATE_FORMAT);
      return this.filter();
    }

    this.startDate = this.endDate = '';
    return this.filter();
  }

  filter() {
    this.reset();
    this.errorMessage = {endDate: ''};
    const validRanges = moment(this.endDate).isSameOrAfter(this.startDate);

    if (this.endDate && this.startDate && !validRanges) {
      return (this.errorMessage = {
        endDate: 'Invalid Date Range',
      });
    }

    this.indexCardGroups(this.searchValue, this.searchMerchant);
  }

  onMerchantSelectionChange(val) {
    this.reset();
    this.searchMerchant = val.id;
    this.indexCardGroups(this.searchValue, this.searchMerchant);
  }

  fnChangeShowLevel = (level: string) => {
    switch (level) {
      case Levels.ENTERPRISE:
        return 'Enterprise';
      case Levels.MERCHANT:
        return 'Merchant';
      default:
        return '';
    }
  };

  fnChangeShowType = (type: Types) => {
    switch (type) {
      case Types.Fleet:
        return 'Fleet';
      case Types.Gift:
        return 'Gift';
      case Types.Loyalty:
        return 'Loyalty';
      default:
        return '';
    }
  };
}
