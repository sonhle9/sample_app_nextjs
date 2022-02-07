import {getLoyaltyAmount} from './get-loyalty-amount';
import {TransactionTypes} from 'src/react/modules/loyalty/loyalty.type';

describe('getLoyaltyAmount', () => {
  it('returns deducted points accordingly', () => {
    const transaction = {
      deductedPoints: 10,
      amount: 40,
      type: TransactionTypes.EARN,
    };

    expect(getLoyaltyAmount(transaction)).toBe(10);
  });
  it('returns amount accordingly', () => {
    const transaction = {
      deductedPoints: undefined,
      amount: 20,
      type: TransactionTypes.EARN,
    };

    expect(getLoyaltyAmount(transaction)).toBe(20);
  });
  it('shows amount when deducted points is 0', () => {
    const transaction = {
      deductedPoints: 0,
      amount: 40,
      type: TransactionTypes.EARN,
    };
    expect(getLoyaltyAmount(transaction)).toBe(40);
  });
  it('handles undefined / null accordingly', () => {
    const transaction = {amount: null, type: TransactionTypes.EARN};
    expect(getLoyaltyAmount(transaction)).toBe(null);
  });
  it('shows negative amount for REDEEM', () => {
    const transaction = {
      amount: 20,
      type: TransactionTypes.REDEEM,
    };
    expect(getLoyaltyAmount(transaction)).toBe(-20);
  });

  it('shows negative amount for REDEEM_AUTH', () => {
    const transaction = {
      amount: 20,
      type: TransactionTypes.REDEEM_AUTH,
    };
    expect(getLoyaltyAmount(transaction)).toBe(-20);
  });

  it('shows negative amount for REDEEM_CAPTURE', () => {
    const transaction = {
      amount: 20,
      type: TransactionTypes.REDEEM_CAPTURE,
    };
    expect(getLoyaltyAmount(transaction)).toBe(-20);
  });

  it('shows negative amount for EARN_REVERSAL', () => {
    const transaction = {
      amount: 20,
      type: TransactionTypes.EARN_REVERSAL,
    };
    expect(getLoyaltyAmount(transaction)).toBe(-20);
  });
});
