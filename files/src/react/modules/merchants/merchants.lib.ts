import {MerchantBalanceType, MerchantTypeCodes} from 'src/shared/enums/merchant.enum';
import {DropdownOption, Merchant, MerchantSmartpayStatus} from './merchants.type';
import {MERCHANT_TYPES_USED_STORAGE_KEY} from '../merchant-types/merchant-types.service';
import {IMerchantTypeUsed} from '../merchant-types/merchant-types.type';
import {BadgeProps, IndicatorProps, titleCase} from '@setel/portal-ui';

export const computeMerchantAvailableBalance = (merchant: Merchant) => {
  const availableBalance = (merchant.balances || []).find(
    (balance) => balance.type === MerchantBalanceType.AVAILABLE,
  );

  return (availableBalance && availableBalance.balance) || 0;
};

export const isGiftCardClientMerchant = (merchant: Merchant) => {
  return merchant.merchantType?.code === MerchantTypeCodes.GIFT_CARD_CLIENT;
};

export const computeMerchantPrepaidBalance = (merchant: Merchant) => {
  const availableBalance = (merchant.balances || []).find(
    (balance) => balance.type === MerchantBalanceType.PREPAID,
  );

  return (availableBalance && availableBalance.balance) || 0;
};

export const getMerchantTypeNameByCode = (typeCode: string) => {
  const listMerchantTypesUsed = JSON.parse(
    localStorage.getItem(MERCHANT_TYPES_USED_STORAGE_KEY) || '[]',
  ) as IMerchantTypeUsed[];
  const typeUsed = listMerchantTypesUsed.find((type) => type.code === typeCode);
  if (typeUsed?.code === MerchantTypeCodes.STATION_DEALER) {
    return 'Station dealer';
  }
  return typeUsed?.name || '';
};

export const getMerchantStatusBadgeColor = (status: string): BadgeProps['color'] => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'success';
    case 'frozen':
      return 'error';
  }
  return 'grey';
};

export const getFleetTransStatusBadgeColor = (status: string): BadgeProps['color'] => {
  switch (status.toLowerCase()) {
    case 'authorised':
    case 'succeeded':
      return 'success';
    case 'voided':
      return 'error';
  }
  return 'grey';
};

export const getSmartpayMerchantStatusBadgeColor = (status: string): BadgeProps['color'] => {
  switch (status.toLowerCase()) {
    case MerchantSmartpayStatus.ACTIVE:
    case 'approved':
      return 'success';
    case MerchantSmartpayStatus.CANCELLED:
    case MerchantSmartpayStatus.REJECTED:
    case MerchantSmartpayStatus.OVERDUE:
    case MerchantSmartpayStatus.DORMANT:
      return 'error';
    case MerchantSmartpayStatus.PENDING:
    case MerchantSmartpayStatus.FROZEN:
      return 'warning';
  }
  return 'grey';
};

export const getMerchantTimelineColor = (value: string): IndicatorProps['color'] => {
  switch (value.toLowerCase()) {
    case 'active':
      return 'success';
    case 'approved':
      return 'blue';
    case 'created':
      return 'brand';
    case 'pending':
      return 'lemon';
    case 'closed':
      return 'error';
  }
  return 'grey';
};

export const capitalizeFirstLetter = (str: string): string => {
  return str
    .split(' ')
    .map((s) => titleCase(s))
    .join(' ');
};

export const getOptionLabel = (options: DropdownOption[], value?: string): string => {
  if (!value) return '';
  const option = options.find((o) => o.value === value);
  return option?.label || value;
};
