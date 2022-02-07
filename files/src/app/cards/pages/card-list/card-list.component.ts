import {Component, OnDestroy, OnInit} from '@angular/core';
import {IPagination} from '../../../../shared/interfaces/core.interface';
import {Subject} from 'rxjs';
import {ApiCardService} from '../../../api-cards.service';
import {takeUntil} from 'rxjs/operators';
import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import {forceUpdate, formatDate, isBlank, resetPagination} from '../../../../shared/helpers/common';
import {
  ICardRole,
  ICardReplacementRole,
  ICard,
  ICardIndexParams,
} from '../../../../shared/interfaces/card.interface';
import {environment} from '../../../../environments/environment';
import {IMerchant} from '../../../../shared/interfaces/merchant.interface';
import {EStatus, EIndicatorCard, ORDER_DATES_FILTER_CARD} from '../../shared/enums';
import * as _ from 'lodash';
import {IDropdownItem} from '../../../../shared/components/dropdown/dropdown.interface';
import {
  DATE_FORMAT,
  DEFAULT_DROPDOWN_VALUES,
  // ORDER_DATES_FILTER,
} from '../../../stations/shared/const-var';
import moment from 'moment';
import {MatDialog} from '@angular/material';
import {CardAddModalComponent} from '../card-add-modal/card-add-modal.component';
import {CardReplacementModalComponent} from '../card-replacement-modal/card-replacement-modal.component';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent implements OnInit, OnDestroy {
  private _pagination: IPagination<ICard>;
  pagination: IPagination<ICard>;
  message: string;
  messageType: string;
  searchValue = '';
  txtSearch = '';
  roles: ICardRole;
  rolesCardReplacement: ICardReplacementRole;
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

  // filter 1
  statusText = _.mapValues(EStatus, (text) => _.startCase(_.lowerCase(text)));
  statuses: IDropdownItem[] = DEFAULT_DROPDOWN_VALUES.concat(
    _.entries(this.statusText).map(([value, text]) => {
      return {text, value: _.lowerCase(value)};
    }),
  );
  selectedStatus = this.statuses[0];

  // filter 2
  dateFilters: IDropdownItem[] = ORDER_DATES_FILTER_CARD;
  selectedDateFilter: IDropdownItem = this.dateFilters[0];
  startDate: string;
  endDate: string;
  errorMessage = {
    endDate: '',
  };

  constructor(
    private readonly apiCardsService: ApiCardService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.reset();
    this.initSessionRoles();
    this.indexCards();
  }

  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }

  initSessionRoles() {
    this.roles = this.apiCardsService.getCardRolePermissions();
    this.rolesCardReplacement = this.apiCardsService.getCardReplacementRolePermissions();
  }

  indexCards(searchValue: string = '', loader: string = 'full') {
    const params: ICardIndexParams = {};
    if (this.selectedStatus.value) {
      params.status = this.selectedStatus.value;
    }

    if (this.startDate) {
      params.dateFrom = formatDate(this.startDate);
    }

    if (this.endDate) {
      params.dateTo = formatDate(this.endDate);
    }

    if (!isBlank(searchValue)) {
      params.cardNumber = searchValue;
    }
    this.loading[loader] = true;
    this.apiCardsService
      .indexCards(this.pagination.index, this.pagination.page, params)
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
    const validRanges = moment(this.endDate).isSameOrAfter(this.startDate);
    if (!validRanges) {
      return;
    }
    this.reset();
    this.indexCards(this.searchValue);
    this.txtSearch = this.searchValue;
  }

  reset() {
    this.pagination = this._pagination = resetPagination(50);
  }

  prev() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index--;
    this.indexCards(this.txtSearch, 'page');
  }

  next() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index++;
    this.indexCards(this.txtSearch, 'page');
  }

  redirectMerchantSettings(item: IMerchant) {
    window.open(
      `${environment.webDashboardUrl}/settings?merchantId=${item.merchantId}&redirect-from=admin`,
      '_blank',
    );
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(CardAddModalComponent, {
      width: '1000px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      const numberOfCards = res.data.numberOfCards;
      if (res.isSuccess && numberOfCards) {
        this.messageType = 'success';
        this.message = `Number of cards has been added is ${numberOfCards}`;
        this.indexCards(this.searchValue);
      } else {
        this.messageType = 'error';
        this.message = res.data;
      }
    });
  }

  IsEnableReplacement(status: EStatus) {
    switch (status) {
      case EStatus.ACTIVE:
        return true;
      case EStatus.FROZEN:
        return true;
      default:
        return false;
    }
  }

  openEditDialog() {} // terminal: ICard

  updateDateFilter() {
    const value = this.selectedDateFilter.value;
    this.endDate = moment().toISOString();
    if (value === 's') {
      this.startDate = this.endDate;
      this.filter();
    }

    if (value) {
      this.startDate = moment().add(value, 'd').format(DATE_FORMAT);
      return this.filter();
    }

    this.startDate = this.endDate = '';
    return this.filter();
  }

  filter() {
    this.errorMessage = {endDate: ''};
    const validRanges = moment(this.endDate).isSameOrAfter(this.startDate);

    if (this.endDate && this.startDate && !validRanges) {
      return (this.errorMessage = {
        endDate: 'Invalid Date Range',
      });
    }
    this.reset();
    this.indexCards(this.txtSearch);
  }

  fnChangeShowIndicator = (type: EIndicatorCard) => {
    switch (type) {
      case EIndicatorCard.NEW:
        return 'NEW';
      case EIndicatorCard.REPLACEMENT:
        return 'REPLACEMENT';
      case EIndicatorCard.RENEWAL:
        return 'RENEWAL';
      default:
        return 'NEW';
    }
  };

  openReplacementDialog(data) {
    const dialogRef = this.dialog.open(CardReplacementModalComponent, {
      width: '1000px',
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.type !== 'replacement') {
          if (result.message === 'success') {
            this.messageType = 'success';
            this.message = 'A new card new has been added';
            this.indexCards();
          }
        } else if (result.message === 'success') {
          this.messageType = 'success';
          this.message = 'A card has been replaced';
          this.reset();
          this.indexCards();
        }
      }
    });
  }
}
