import {path} from 'lodash/fp';
import {
  IMalaysiaSystemState,
  IMaintenanceRole,
} from '../../../../shared/interfaces/maintenance.interface';

export interface IOverrides {
  [key: string]: {
    isOpen: boolean;
    hasUpdatePermissions: boolean;
    label: string;
    fields: Record<
      string,
      {
        label: string;
        value: boolean;
        scopeName?: string;
        get?: (obj: any) => boolean;
      }
    >;
    schedule?: boolean;
    errorMessage?: string | null;
  };
}

export const systemState2Overrides = (
  overrides: IOverrides,
  systemState: IMalaysiaSystemState,
): IOverrides =>
  Object.entries(overrides).reduce((acc, [overrideKey, override]) => {
    const mappedFields = Object.entries(override.fields).reduce(
      (innerAcc, [fieldKey, {get, ...rest}]) => {
        const value = get ? get(systemState) : path([overrideKey, fieldKey], systemState);

        innerAcc[fieldKey] = {...rest, value};

        return innerAcc;
      },
      {},
    );

    acc[overrideKey] = {
      ...override,
      fields: mappedFields,
    };

    return acc;
  }, {});

export const getOverrides = (roles: IMaintenanceRole): IOverrides => ({
  devices: {
    isOpen: false,
    label: 'Maintenance override: App',
    hasUpdatePermissions: roles.hasMaintenanceOutageUpdate,
    schedule: true,
    fields: {
      android: {
        label: 'Android',
        value: false,
        scopeName: 'Android',
        get: path('android'),
      },
      ios: {
        label: 'iOS',
        value: false,
        scopeName: 'Ios',
        get: path('ios'),
      },
    },
  },
  vendors: {
    isOpen: false,
    label: 'Maintenance override: Vendor',
    hasUpdatePermissions: roles.hasMaintenanceOutageUpdate,
    fields: {
      pos: {
        label: 'Orders Vendor (All Orders Vendors)',
        value: false,
      },
      posSapura: {
        label: 'Orders Vendor (Sapura POS)',
        value: false,
      },
      posSentinel: {
        label: 'Orders Vendor (Sentinel POS)',
        value: false,
      },
      posSetel: {
        label: 'Orders Vendor (Setel POS)',
        value: false,
      },
      kiple: {
        label: 'Payments Vendor (kiplePay)',
        value: false,
      },
      cardtrendLms: {
        label: 'Loyalty Vendor (Cardtrend LMS)',
        value: false,
      },
      silverstreet: {
        label: 'SMS Vendor (Silverstreet)',
        value: false,
      },
    },
  },
  services: {
    isOpen: false,
    label: 'Maintenance override: Services',
    hasUpdatePermissions: roles.hasMaintenanceOutageUpdate,
    fields: {
      accounts: {
        label: 'Accounts',
        value: false,
      },
      orders: {
        label: 'Orders',
        value: false,
      },
      storeOrders: {
        label: 'Store Orders',
        value: false,
      },
      payments: {
        label: 'Payments',
        value: false,
      },
      loyalty: {
        label: 'Loyalty',
        value: false,
      },
      rewards: {
        label: 'Rewards',
        value: false,
      },
      stations: {
        label: 'Stations',
        value: false,
      },
      emails: {
        label: 'Emails',
        value: false,
      },
    },
  },
  features: {
    isOpen: false,
    label: 'Maintenance override: Features',
    hasUpdatePermissions: roles.hasMaintenanceOutageUpdate,
    fields: {
      topUpWithCard: {
        label: 'Top-up with card',
        value: true,
      },
      topUpWithBank: {
        label: 'Top-up with bank',
        value: true,
      },
      redeemLoyaltyPoints: {
        label: 'Redeem Mesra points to Wallet Balance',
        value: false,
      },
    },
  },
  banks: {
    isOpen: false,
    label: 'Maintenance override: Ipay88 Banks',
    hasUpdatePermissions: roles.hasMaintenanceOutageUpdate,
    fields: {},
  },
});
