import {IMerchant} from '../../../shared/interfaces/merchant.interface';
import {MerchantBalanceType} from '../../../shared/enums/merchant.enum';
import {Currency} from '../../../shared/enums/wallet.enum';

export function getMerchantBalance(
  merchant: IMerchant,
  type: MerchantBalanceType,
  currency: Currency,
): number | undefined {
  const matchingBalance = (merchant.balances || []).find(
    (mb) => mb.type === type && mb.currency === currency,
  );
  return matchingBalance ? matchingBalance.balance : undefined;
}
