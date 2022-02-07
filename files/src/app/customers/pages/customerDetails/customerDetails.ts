import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {
  ICustomer,
  ICustomerRole,
  ICustomerWalletInfo,
  ICustomerStorecard,
  ICustomerPinPreferences,
  ICustomerRefreshBalanceResponse,
  ICustomerCardActivationResponse,
} from '../../../../shared/interfaces/customer.interface';
import {ApiCustomersService} from '../../../api-customers.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {IDropdownItem} from '../../../../shared/components/dropdown/dropdown.interface';
import {PetrolBrandPipe} from '../../../../shared/pipes/petrol-brand.pipe';
import {PetrolBrandsEnum} from '../../../stations/shared/const-var';
import * as _ from 'lodash';
import {PermissionDeniedError} from 'src/shared/helpers/permissionDenied.error';
import {AppEmitter} from 'src/app/emitter.service';
import {AuthService} from '../../../auth.service';
import {
  vouchersRole,
  customerRole,
  customerBlacklistRoles,
  rewardsRole,
  badgeCampaignsRoles,
  retailRoles,
  adminAccountRole,
  adminFraudProfile,
} from '../../../../shared/helpers/roles.type';
import {ApiPaymentsService} from '../../../api-payments.service';
import {
  ApiBlacklistService,
  IFraudProfiles,
  ICustomerBlacklistRole,
  IDailyCustomer,
} from 'src/app/api-blacklist-service';
import {getRolePermissions} from 'src/shared/helpers/common';
import {JsonEditModalComponent} from '../../../../shared/components/json-edit-modal/json-edit-modal.component';
import {ApiVariablesService} from '../../../api-variables-.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {IExperienceAppSettingsRole} from '../../../../shared/interfaces/variables.interface';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {environment} from 'src/environments/environment';

const DEFAULT_BRANDS = {
  text: 'Undefined',
  value: undefined,
};

@Component({
  moduleId: module.id,
  selector: 'app-customer-details',
  templateUrl: 'customerDetails.html',
  styleUrls: ['customerDetails.scss'],
})
export class CustomerDetailsComponent implements OnInit {
  loading = false;

  rewardsRole = rewardsRole;
  badgeCampaignsRoles = badgeCampaignsRoles;
  retailRoles = retailRoles;

  customer: ICustomer;
  storecard: ICustomerStorecard;
  customerId: string;
  walletId: string;
  incomingBalance: number;
  pinPreferences: ICustomerPinPreferences;
  targetService: string;

  fullCustomerDetail = {};
  customerCardActivationCount = 0;

  isInternal = [];
  hasActive = false;
  message: string;

  brands: IDropdownItem[] = [];
  selectedBrand: IDropdownItem;
  roles: ICustomerRole;

  allSub: Subject<any> = new Subject<any>();
  messageBus: Subject<any> = new Subject();

  walletSource = 'N/A';

  fraudProfile: IFraudProfiles;
  blacklistRoles: ICustomerBlacklistRole;

  dailyAccumulations: IDailyCustomer;

  experienceAppSettingsRoles: IExperienceAppSettingsRole;

  activeTab = 0;

  environment = environment;

  constructor(
    private readonly route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private customersService: ApiCustomersService,
    private petrolBrandPipe: PetrolBrandPipe,
    private paymentsService: ApiPaymentsService,
    private blacklistService: ApiBlacklistService,
    private apiVariablesService: ApiVariablesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.initSessionRoles();
    this.brands = Object.values(PetrolBrandsEnum)
      .map(
        (value) =>
          ({
            text: this.petrolBrandPipe.transform(value),
            value,
          } as IDropdownItem),
      )
      .concat([DEFAULT_BRANDS]);
    this.selectedBrand = this.brands[0];

    route.params.pipe(takeUntil(this.allSub)).subscribe((param) => {
      this.customerId = param.id;
      this.initCustomer(this.customerId);
      this.initWalletSource();
    });
  }

  get showDevices() {
    return (
      this.authService.getRoles().includes(customerRole.readDevice) ||
      this.authService.getRoles().includes(adminAccountRole.adminRead)
    );
  }

  get allowDevicesEditing() {
    return this.authService.getRoles().includes(customerRole.editDevice);
  }

  get allowViewVouchers() {
    return this.authService.getRoles().includes(vouchersRole.view);
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((queryParams) => {
      const tabIndex = queryParams.get('tabIndex');
      if (tabIndex !== null) {
        const tabIndexValue = Number(tabIndex);
        if (!isNaN(tabIndexValue)) {
          this.activeTab = tabIndexValue;
        }
      }
    });
  }

  ngOnDestory() {
    this.allSub.next();
    this.allSub.complete();
  }

  onTabIndexChange(event: MatTabChangeEvent) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        tabIndex: event.index,
      },
      queryParamsHandling: 'merge',
    });
  }

  private initSessionRoles() {
    const res = this.customersService.getRolePermissions();
    this.roles = res;

    this.blacklistRoles = getRolePermissions<ICustomerBlacklistRole>(
      this.authService,
      customerBlacklistRoles,
    );
    if (this.authService.getRoles().includes(adminFraudProfile.adminView)) {
      this.blacklistRoles.hasAccess = true;
      this.blacklistRoles.hasView = true;
    }
    if (this.authService.getRoles().includes(adminFraudProfile.adminUpdate)) {
      this.blacklistRoles.hasAccess = true;
      this.blacklistRoles.hasUpdate = true;
    }
    this.experienceAppSettingsRoles = this.apiVariablesService.getRolePermissions();
  }

  private initCustomer(id) {
    this.customer = {} as ICustomer;
    this.loading = true;

    this.customersService
      .customer(id)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (customer) => {
          this.customer = customer;
          this.fullCustomerDetail = {...this.fullCustomerDetail, ...customer};
          this.isInternal = customer.internal ? [true] : [];
          this.loading = false;
        },
        (err) => {
          if (err instanceof PermissionDeniedError) {
            return AppEmitter.get(AppEmitter.PermissionDenied).emit();
          }

          this.loading = false;
          this.customer = null;
          this.router.navigate(['customers']);
        },
      );

    this.customersService
      .getCustomerWalletInfo(id)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (walletInfo: ICustomerWalletInfo) => {
          this.storecard = walletInfo;
        },
        (err) => {
          if (err instanceof PermissionDeniedError) {
            return AppEmitter.get(AppEmitter.PermissionDenied).emit();
          }
        },
      );

    this.customersService
      .accountSettings(id)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (accountSettings) => {
          this.fullCustomerDetail = {...this.fullCustomerDetail, accountSettings};
          this.selectedBrand = this.brands.find(
            (s) => s.value === accountSettings.preferredPetrolBrand,
          );
          this.pinPreferences = accountSettings.pinPreferences;
        },
        () => {
          this.selectedBrand = _.last(this.brands);
        },
      );

    this.customersService
      .getCustomerIncomingBalance(id)
      .pipe(takeUntil(this.allSub))
      .subscribe((incomingBalance) => {
        this.incomingBalance = incomingBalance;
      });

    this.customersService
      .getCustomerCardActivationRetry(id)
      .pipe(takeUntil(this.allSub))
      .subscribe((incomingBalance) => {
        this.customerCardActivationCount = incomingBalance.retryCount;
      });

    this.paymentsService
      .getWalletEnv()
      .pipe(takeUntil(this.allSub))
      .subscribe((target: string) => {
        this.targetService = target;
      });

    this.blacklistService
      .getFraudProfileByUserId(id)
      .pipe(takeUntil(this.allSub))
      .subscribe((res) => {
        this.fraudProfile = res.items.length > 0 ? res.items[0] : null;
      });

    this.blacklistService
      .getDailyCustomerAccumulation(id)
      .pipe(takeUntil(this.allSub))
      .subscribe((res) => {
        this.dailyAccumulations = res;
      });
  }

  private initWalletSource() {
    this.walletSource = 'setel'.toUpperCase();
  }

  updateInternalUser() {
    const isInternal = this.isInternal.length !== 0;
    this.customersService
      .updateInternal(this.customerId, isInternal)
      .pipe(takeUntil(this.allSub))
      .subscribe(() => {});
  }

  editBrand() {
    this.hasActive = true;
  }

  refreshBalance() {
    this.customersService
      .refreshCustomerBalance(this.customerId)
      .pipe(takeUntil(this.allSub))
      .subscribe((res: ICustomerRefreshBalanceResponse) => {
        this.storecard.balance = res.balance;
      });
  }

  resetCardActivationRetry() {
    this.customersService
      .resetCustomerCardActivationRetry(this.customerId)
      .pipe(takeUntil(this.allSub))
      .subscribe((res: ICustomerCardActivationResponse) => {
        this.customerCardActivationCount = res.retryCount;
      });
  }

  updateBrands() {
    this.hasActive = false;

    this.customersService
      .updateBrand(this.customerId, this.selectedBrand.value)
      .pipe(takeUntil(this.allSub))
      .subscribe(() => {});
  }

  updateFraudProfile($event) {
    this.fraudProfile = $event;
  }

  onUpdateVariable() {
    this.apiVariablesService.getAppSettings(this.customerId).subscribe(
      (data) => {
        this.openAppSettingsModal(data);
      },
      () => {
        this.openAppSettingsModal({});
      },
    );
  }

  openAppSettingsModal(data) {
    const dialogRef = this.dialog.open(JsonEditModalComponent, {
      width: '900px',
      height: '700px',
      data,
    });

    dialogRef.afterClosed().subscribe((modalRes) => {
      if (!modalRes) {
        return;
      }

      this.apiVariablesService.createOrUpdateAppSettings(modalRes).subscribe(
        () => {
          this.snackBar.open(`Successfully updated`, 'OK', {duration: 5000});
        },
        (err) => {
          this.snackBar.open(`Error occured. ${err.error.description}`, 'OK', {duration: 5000});
        },
      );
    });
  }
}
