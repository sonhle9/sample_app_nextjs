import {
  Card,
  HistoryIcon,
  ListIcon,
  PortalTransactionsIcon,
  RewardsIcon,
  SettlementsIcon,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {Link} from 'src/react/routing/link';
import {CURRENT_ENTERPRISE} from '../../../../shared/const/enterprise.const';
import {EnterpriseNameEnum} from '../../../../shared/enums/enterprise.enum';

const CardReportsNav = () => {
  const isPDB = CURRENT_ENTERPRISE.name === EnterpriseNameEnum.PDB;

  return (
    <PageContainer heading="Reports">
      <div className="grid grid-cols-3 gap-6">
        <Card
          className="p-5 flex flex-col"
          render={(props) => (
            <Link {...props} to="/card-issuing/reports/expired-card-balance-summary" />
          )}>
          <div className="items-center self-center">
            <div className="w-20 h-20 bg-purple-200 mb-4 rounded-full justify-center items-center flex">
              <HistoryIcon className="w-10 h-10" color="white" />
            </div>
          </div>
          <div className="font-normal text-lg text-center mb-2">Expired card balance summary</div>
          <div className="text-sm text-gray-500 text-center">
            Viewing of unutilized card balance for expired cards based on card groups
          </div>
        </Card>
        <Card
          className="p-5 flex flex-1 flex-col"
          render={(props) => (
            <Link {...props} to="/card-issuing/reports/expired-card-balance-details" />
          )}>
          <div className="items-center self-center">
            <div className="w-20 h-20 bg-turquoise-700 mb-4 rounded-full justify-center items-center flex">
              <HistoryIcon className="w-10 h-10" color="white" />
            </div>
          </div>
          <div className="font-normal text-lg text-center mb-2">Expired card balance details</div>
          <div className="text-sm text-gray-500 text-center">
            Viewing of unutilized card balance for expired cards by card number
          </div>
        </Card>
        <Card
          className="p-5 flex flex-1 flex-col truncate"
          render={(props) => <Link {...props} to="/card-issuing/reports/gift-card-ageing" />}>
          <div className="items-center self-center">
            <div className="w-20 h-20 bg-carbon-200 mb-4 rounded-full justify-center items-center flex">
              <ListIcon className="w-10 h-10" color="white" />
            </div>
          </div>
          <div className="font-normal text-lg text-center mb-2">Gift card ageing</div>
          <div className="text-sm text-gray-500 text-center">
            View total transactions for each ageing buckets
          </div>
        </Card>

        {/* MERCHANT REPORT */}
        <Card
          className="p-5 flex flex-col"
          render={(props) => (
            <Link {...props} to="/card-issuing/reports/approved-topup-transactions" />
          )}>
          <div className="items-center self-center">
            <div className="w-20 h-20 bg-purple-200 mb-4 rounded-full justify-center items-center flex">
              <ListIcon className="w-10 h-10" color="white" />
            </div>
          </div>
          <div className="font-normal text-lg text-center mb-2">
            Approved merchant top up transactions
          </div>
          <div className="text-sm text-gray-500 text-center">
            Viewing of approved merchant top up transactions
          </div>
        </Card>
        <Card
          className="p-5 flex flex-1 flex-col"
          render={(props) => (
            <Link {...props} to="/card-issuing/reports/approved-adjustment-transactions" />
          )}>
          <div className="items-center self-center">
            <div className="w-20 h-20 bg-turquoise-700 mb-4 rounded-full justify-center items-center flex">
              <ListIcon className="w-10 h-10" color="white" />
            </div>
          </div>
          <div className="font-normal text-lg text-center mb-2">
            Approved merchant adjustment transactions
          </div>
          <div className="text-sm text-gray-500 text-center">
            Viewing of approved merchant adjustment transactions
          </div>
        </Card>

        <Card
          className="p-5 flex flex-1 flex-col"
          render={(props) => (
            <Link {...props} to="/card-issuing/reports/gift-card-itemised-transaction" />
          )}>
          <div className="items-center self-center">
            <div className="w-20 h-20 bg-success mb-4 rounded-full justify-center items-center flex">
              <SettlementsIcon className="w-10 h-10" color="white" />
            </div>
          </div>
          <div className="font-normal text-lg text-center mb-2">
            Gift card itemised transaction{' '}
          </div>
          <div className="text-sm text-gray-500 text-center">
            Viewing the transactions details by item breakdown
          </div>
        </Card>

        <Card
          className="p-5 flex flex-1 flex-col"
          render={(props) => <Link {...props} to="/card-issuing/reports/gift-card-summary" />}>
          <div className="items-center self-center">
            <div className="w-20 h-20 bg-lemon mb-4 rounded-full justify-center items-center flex">
              <RewardsIcon className="w-10 h-10" color="white" />
            </div>
          </div>
          <div className="font-normal text-lg text-center mb-2">Gift card summary</div>
          <div className="text-sm text-gray-500 text-center">
            Viewing the total cards and its status to date grouped by card groups
          </div>
        </Card>

        {isPDB && (
          <Card
            className="p-5 flex flex-col"
            render={(props) => (
              <Link {...props} to="/card-issuing/reports/gift-card-transactions-summary" />
            )}>
            <div className="items-center self-center">
              <div className="w-20 h-20 bg-purple-200 mb-4 rounded-full justify-center items-center flex">
                <PortalTransactionsIcon className="w-12 h-12" color="white" />
              </div>
            </div>
            <div className="font-normal text-lg text-center mb-2">
              Gift card transactions by sales territory report
            </div>
            <div className="text-sm text-gray-500 text-center">
              Viewing all the transactions performed under a giftCardClient merchant
            </div>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};

export default CardReportsNav;
