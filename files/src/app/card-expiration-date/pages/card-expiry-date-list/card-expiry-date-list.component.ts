import {Component, OnDestroy, OnInit} from '@angular/core';
import {IPagination} from '../../../../shared/interfaces/core.interface';
import {Subject} from 'rxjs';
import {ApiCardExpiryDateService} from '../../../api-card-expiry-date.service';
import {takeUntil} from 'rxjs/operators';
import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import {forceUpdate, resetPagination} from '../../../../shared/helpers/common';
import {
  ICardExpiryDate,
  ICardExpiryDateRole,
} from '../../../../shared/interfaces/card-expiry-date.interface';
import * as _ from 'lodash';
import {EditMode} from '../../../card-range/shared/enum';
import {MatDialog} from '@angular/material/dialog';
import {CardExpiryDateModalComponent} from '../card-expiry-date-modal/card-expiry-date-modal.component';
import {CardExpiryDateModalData} from '../../shared/models';
import {Types, FormFactor} from 'src/app/card-groups/shared/enum';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';

@Component({
  selector: 'app-card-expiry-date-list',
  templateUrl: './card-expiry-date-list.component.html',
  styleUrls: ['./card-expiry-date-list.component.scss'],
})
export class CardExpiryDateListComponent implements OnInit, OnDestroy {
  private _pagination: IPagination<ICardExpiryDate>;
  pagination: IPagination<ICardExpiryDate>;
  message: string;
  messageType: string;
  roles: ICardExpiryDateRole;
  allSub: Subject<any> = new Subject<any>();

  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: 'Card issuing',
    },
    {
      label: 'Card expiration date',
    },
  ];

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

  constructor(
    private readonly apiCardExpiryDateService: ApiCardExpiryDateService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.reset();
    this.initSessionRoles();
    this.indexCardExpiryDate();
  }

  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }

  initSessionRoles() {
    this.roles = this.apiCardExpiryDateService.getRolePermissions();
  }

  indexCardExpiryDate() {
    this.apiCardExpiryDateService
      .indexCardExpiryDate(this.pagination.index, this.pagination.page)
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

  reset() {
    this.pagination = this._pagination = resetPagination(50);
  }

  prev() {
    if (this.loading.any) {
      return;
    }
    this.pagination.index--;
    this.indexCardExpiryDate();
  }

  next() {
    if (this.loading.any) {
      return;
    }
    this.pagination.index++;
    this.indexCardExpiryDate();
  }

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

  fnChangeShowFormFactor = (type: FormFactor) => {
    switch (type) {
      case FormFactor.Physical:
        return 'Physical';
      case FormFactor.Virtual:
        return 'Virtual';
      default:
        return '';
    }
  };

  openAddDialog() {
    const data: CardExpiryDateModalData = {
      mode: EditMode.ADD,
    };

    const dialogRef = this.dialog.open(CardExpiryDateModalComponent, {
      width: '1000px',
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.messageType = 'success';
        this.message = 'A new card expiry date has been added';
        this.indexCardExpiryDate();
      }
    });
  }

  openEditDialog(item: ICardExpiryDate) {
    const data: CardExpiryDateModalData = {
      mode: EditMode.EDIT,
      cardExpiryDateData: item,
      cardExpiryDateId: item.id,
    };
    const dialogRef = this.dialog.open(CardExpiryDateModalComponent, {
      width: '1000px',
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.messageType = 'success';
        this.message = 'A card expiry has been updated';
        this.indexCardExpiryDate();
      }
    });
  }
}
