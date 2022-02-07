import {Badge, Card, DescItem, DescList, Fieldset} from '@setel/portal-ui';
import {formatDate} from '@setel/web-utils';
import * as React from 'react';
import {getMerchantStatusBadgeColor} from '../../merchants/merchants.lib';
import {useReadSPPeriodOverrun} from '../../merchants/merchants.queries';

type CreditPeriodOverrunReferenceProps = {
  merchantId: string;
  requestID: string;
  creditPeriodOverrunId: string;
};

export const CreditPeriodOverrunReference = (props: CreditPeriodOverrunReferenceProps) => {
  const {data, isLoading} = useReadSPPeriodOverrun(props.creditPeriodOverrunId);

  return (
    <Card className={'mb-4'}>
      <Card.Heading title={'Reference'} />
      <Card.Content>
        <Fieldset legend={'GENERAL INFORMATION'}>
          <DescList isLoading={isLoading} className={'pb-5'}>
            <DescItem label={'Merchant ID'} value={props.merchantId} />
            <DescItem
              label={'Merchant status'}
              value={
                data?.merchantStatus ? (
                  <Badge
                    color={getMerchantStatusBadgeColor(data.merchantStatus)}
                    className={'uppercase'}>
                    {data.merchantStatus}
                  </Badge>
                ) : (
                  '-'
                )
              }
            />
          </DescList>
        </Fieldset>
        <Fieldset legend={'CREDIT PERIOD OVERRUN'} borderTop>
          <DescList isLoading={isLoading}>
            <DescItem
              label={'Start date'}
              value={data?.startDate ? formatDate(data.startDate, {formatType: 'dateOnly'}) : '-'}
            />
            <DescItem
              label={'End date'}
              value={data?.endDate ? formatDate(data.endDate, {formatType: 'dateOnly'}) : '-'}
            />
            <DescItem label={'Remarks'} value={data?.remark || '-'} />
          </DescList>
        </Fieldset>
      </Card.Content>
    </Card>
  );
};
