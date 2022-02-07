import {Transactions, TransactionTypes} from 'src/react/modules/loyalty/loyalty.type';

export const getLoyaltyAmount = (
  input: Pick<Transactions, 'deductedPoints' | 'amount' | 'type'>,
): number => {
  const amount = input.deductedPoints || input.amount;

  if (
    [
      TransactionTypes.REDEEM,
      TransactionTypes.REDEEM_CAPTURE,
      TransactionTypes.REDEEM_AUTH,
      TransactionTypes.EARN_REVERSAL,
    ].includes(input.type)
  ) {
    return -amount;
  }

  return amount;
};
