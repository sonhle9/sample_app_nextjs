import * as React from 'react';
import {AccountInfo} from './components/account-info';
import {LoyaltyInfo} from './components/loyalty-info';
import {LatestPaymentTransactions} from './components/latest-payment-transactions';
import {LatestOrder} from './components/latest-orders';
import {useCanReadLoyalty} from '../loyalty/custom-hooks/use-check-permissions';
import {
  useCanReadFuelOrder,
  useCanReadPaymentTransactions,
  useCanReadStoreOrder,
  useCanReadStoreOrderInCarView,
} from './hooks/use-customer-permissions';

interface ICustomerDashBoard {
  customerID: string;
}

export function CustomerDashboard({customerID}: ICustomerDashBoard) {
  const userCanReadLoyaltyInfo = useCanReadLoyalty();
  const userCanReadLatestPaymentTransactions = useCanReadPaymentTransactions();
  const userCanViewFuelOrder = useCanReadFuelOrder();
  const userCanViewStoreOrder = useCanReadStoreOrder();
  const userCanViewConciergeOrders = useCanReadStoreOrderInCarView();
  const userCanReadLatestOrder =
    userCanViewStoreOrder || userCanViewFuelOrder || userCanViewConciergeOrders;

  return (
    <>
      <div className="p-1 pl-6">
        <div className="flex flex-col items-stretch space-y-2 md:space-y-0 justify-between md:flex-row">
          <AccountInfo
            customerId={customerID}
            isLoyaltyInfoCardExist={userCanReadLoyaltyInfo}></AccountInfo>
          {userCanReadLoyaltyInfo && <LoyaltyInfo customerId={customerID}></LoyaltyInfo>}
        </div>

        {userCanReadLatestOrder && (
          <div className="mt-5">
            <LatestOrder customerId={customerID} />
          </div>
        )}

        {userCanReadLatestPaymentTransactions && (
          <div className="mt-5">
            <LatestPaymentTransactions customerId={customerID} />
          </div>
        )}
      </div>
    </>
  );
}
