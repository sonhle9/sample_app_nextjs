import {
  Button,
  Card,
  CardContent,
  CardHeading,
  DescList,
  EditIcon,
  formatMoney,
  Fieldset,
  Badge,
} from '@setel/portal-ui';
import * as React from 'react';
import {get} from 'lodash';

import {HasPermission} from 'src/react/modules/auth/HasPermission';

import {customerBlacklistRoles} from 'src/shared/helpers/roles.type';

import {IPeriodCustomerAccumulation} from 'src/app/api-blacklist-service';

import {UpdateChargeLimitModal} from '../modals/update-charge-limit-modal';

interface IChargeLimitProps {
  data: Record<'daily' | 'monthly' | 'annually', IPeriodCustomerAccumulation>;
  isLoading: boolean;
  customerId: string;
}

export const CustomerFraudProfileChargeLimitCard = ({
  data,
  isLoading,
  customerId,
}: IChargeLimitProps) => {
  const [isCardChargeLimitExpand, toggleCardChargeLimitExpand] = React.useState(false);
  const [isShowUpdateModal, toggleUpdateModal] = React.useState(false);

  const isDeviceSupported = get(data?.daily?.metadata, 'isDeviceSupported', true)
    ? 'SUPPORTED'
    : 'UNSUPPORTED';

  return (
    <>
      {isShowUpdateModal && (
        <UpdateChargeLimitModal
          onDismiss={() => toggleUpdateModal(false)}
          data={data}
          customerId={customerId}
        />
      )}
      <Card
        expandable
        isLoading={isLoading}
        data-testid="charge-limit-card"
        className="mb-8"
        isOpen={isCardChargeLimitExpand}
        onToggleOpen={() => toggleCardChargeLimitExpand((prev) => !prev)}>
        <CardHeading title="Charge limit">
          <HasPermission accessWith={[customerBlacklistRoles.update_service_daily_limitations]}>
            <Button
              variant="outline"
              data-testid="edit-charge-limit-button"
              leftIcon={<EditIcon />}
              minWidth="none"
              onClick={() => toggleUpdateModal(true)}>
              EDIT
            </Button>
          </HasPermission>
        </CardHeading>

        <CardContent>
          <DescList isLoading={isLoading} className="pt-3 pb-6">
            <DescList.Item
              label="Device version"
              value={
                <Badge
                  className="-ml-12"
                  color={deviceVersionColorMapping[isDeviceSupported]}
                  rounded="rounded"
                  data-testid="supported-device-info">
                  {isDeviceSupported}
                </Badge>
              }
            />
          </DescList>
          <hr className="col-span-4" />
          <Fieldset legend={<div className="mt-2.5">DAILY LIMIT</div>} className="sm:col-span-2">
            <DescList isLoading={isLoading} className="pl-5 py-5">
              <DescList.Item
                label="Daily charge limit"
                value={<span>RM{formatMoney(data?.daily?.chargeLimit)}</span>}
              />
              <DescList.Item
                label="Daily amount accumulation"
                value={<span>RM{formatMoney(data?.daily?.chargeAccumulation)}</span>}
              />
            </DescList>
          </Fieldset>
          <hr className="col-span-4" />
          <Fieldset legend={<div className="mt-2.5">MONTHLY LIMIT</div>} className="sm:col-span-2">
            <DescList isLoading={isLoading} className="pl-5 py-5">
              <DescList.Item
                label="Monthly charge limit"
                value={<span>RM{formatMoney(data?.monthly?.chargeLimit)}</span>}
              />
              <DescList.Item
                label="Monthly amount accumulation"
                value={<span>RM{formatMoney(data?.monthly?.chargeAccumulation)}</span>}
              />
            </DescList>
          </Fieldset>
          <hr className="col-span-4" />
          <Fieldset legend={<div className="mt-2.5">ANNUAL LIMIT</div>} className="sm:col-span-2">
            <DescList isLoading={isLoading} className="pl-5 py-5">
              <DescList.Item
                label="Annual charge limit"
                value={<span>RM{formatMoney(data?.annually?.chargeLimit)}</span>}
              />
              <DescList.Item
                label="Annual amount accumulation"
                value={<span>RM{formatMoney(data?.annually?.chargeAccumulation)}</span>}
              />
            </DescList>
          </Fieldset>
          <hr className="col-span-4" />
          <Fieldset
            legend={<div className="mt-2.5">TRANSACTION COUNT LIMIT</div>}
            className="sm:col-span-2">
            <DescList isLoading={isLoading} className="pl-5 py-5">
              <DescList.Item
                label="Max payment transaction count per day"
                value={<span>{data?.daily?.numberTransactionLimit} transactions</span>}
              />
              <DescList.Item
                label="Daily accumulation"
                value={<span>{data?.daily?.numberTransactionAccumulation} transactions</span>}
              />
            </DescList>
          </Fieldset>
          <hr className="col-span-4" />
          <Fieldset
            legend={<div className="mt-2.5">TRANSACTION AMOUNT LIMIT</div>}
            className="sm:col-span-2">
            <DescList isLoading={isLoading} className="pl-5 py-5">
              <DescList.Item
                label="Max payment transaction amount"
                value={<span>RM{formatMoney(data?.daily?.maxTransactionAmount)}</span>}
              />
            </DescList>
          </Fieldset>
        </CardContent>
      </Card>
    </>
  );
};

const deviceVersionColorMapping: Record<string, any> = {
  UNSUPPORTED: 'grey',
  SUPPORTED: 'success',
};
