import {Component, OnDestroy, OnInit} from '@angular/core';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {IPagination} from '../../../../shared/interfaces/core.interface';
import {Subject} from 'rxjs';
import {ApiMerchantsService} from '../../../api-merchants.service';
import {takeUntil} from 'rxjs/operators';
import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import {forceUpdate, isBlank, resetPagination} from '../../../../shared/helpers/common';
import {
  IMerchant,
  IMerchantIndexParams,
  IMerchantRole,
} from '../../../../shared/interfaces/merchant.interface';
import {EditMerchantModalComponent} from '../edit-merchant-modal/edit-merchant-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {EditMerchantModalData} from '../../shared/models';
import {EditMode} from '../../shared/enums';
import {EditMerchantAdjustBalanceModelComponent} from '../edit-merchant-modal-adjust-balance/edit-merchant-adjust-balance-model.component';
import {getMerchantBalance} from '../../shared/helpers';
import {MerchantBalanceType} from '../../../../shared/enums/merchant.enum';
import {Currency} from '../../../../shared/enums/wallet.enum';
import {EnterpriseNameEnum} from '../../../../shared/enums/enterprise.enum';
import {ImportMerchantCsvModalComponent} from '../import-merchant-csv/import-merchant-csv-modal.component';
import {IDropdownItem} from '../../../../shared/components/dropdown/dropdown.interface';
import {BreadcrumbItem} from '../../../../react/components/app-breadcrumbs';

@Component({
  selector: 'app-merchant-list',
  templateUrl: './merchant-list.component.html',
  styleUrls: ['./merchant-list.component.scss'],
})
export class MerchantListComponent implements OnInit, OnDestroy {
  private _pagination: IPagination<IMerchant>;
  pagination: IPagination<IMerchant>;
  message: string;
  messageType: string;
  searchValue = '';
  typeOptions: IDropdownItem[];
  selectedType: IDropdownItem;
  roles: IMerchantRole;
  isPDB = CURRENT_ENTERPRISE.name === EnterpriseNameEnum.PDB;
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
      label: 'Businesses',
    },
    {
      label: 'Merchants',
    },
    {
      label: 'All merchants',
    },
  ];

  constructor(
    private readonly apiMerchantsService: ApiMerchantsService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.reset();
    this.initSessionRoles();
    this.indexMerchants();
    this.initMerchantTypes();
  }

  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }

  initMerchantTypes() {
    this.apiMerchantsService.indexMerchantTypes().subscribe((types) => {
      const options = types.map((type) => {
        return {
          text: type.name,
          value: type.code,
        };
      });
      this.typeOptions = [
        {
          text: 'All types',
          value: '',
        },
        ...options,
      ];
      this.selectedType = this.typeOptions[0];
    });
  }

  filter() {
    this.indexMerchants();
  }

  initSessionRoles() {
    this.roles = this.apiMerchantsService.getRolePermissions();
  }

  getMerchantAvailableBalance(merchant: IMerchant): number {
    return getMerchantBalance(merchant, MerchantBalanceType.AVAILABLE, Currency.MYR) || 0;
  }

  indexMerchants(name: string = '', loader: string = 'full') {
    const trimmedValue = name.trim();
    const params: IMerchantIndexParams = {
      includeBalances: true,
      merchantTypes: this.selectedType?.value ? [this.selectedType?.value] : undefined,
    };
    if (!isBlank(trimmedValue)) {
      params.name = trimmedValue;
    }
    this.loading[loader] = true;
    this.apiMerchantsService
      .indexMerchants(this.pagination.index, this.pagination.page, params)
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
    this.indexMerchants(this.searchValue);
  }

  reset() {
    this.pagination = this._pagination = resetPagination(50);
  }

  prev() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index--;
    this.indexMerchants(this.searchValue, 'page');
  }

  next() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index++;
    this.indexMerchants(this.searchValue, 'page');
  }

  openAddDialog() {
    const data: EditMerchantModalData = {
      mode: EditMode.ADD,
    };

    const dialogRef = this.dialog.open(EditMerchantModalComponent, {
      width: '500px',
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.messageType = 'success';
        this.message = 'A new merchant has been added';
        this.indexMerchants(this.searchValue);
      }
    });
  }

  openImportMerchantDialog() {
    this.dialog.open(ImportMerchantCsvModalComponent, {
      minWidth: '800px',
      position: {
        top: '100px',
      },
    });
  }

  openAdjustmentMerchantDialog(item: IMerchant) {
    const dialogRef = this.dialog.open(EditMerchantAdjustBalanceModelComponent, {
      data: item,
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.messageType = 'success';
        this.message = 'Merchant balance has been adjusted';
        this.indexMerchants(this.searchValue, 'page');
      } else if (result) {
        this.messageType = 'error';
        this.message = result;
      }
    });
  }

  redirectMerchantSettings(item: IMerchant) {
    window.open(
      `${CURRENT_ENTERPRISE.dashboardUrl}/settings?merchantId=${item.merchantId}`,
      '_blank',
    );
  }
}
