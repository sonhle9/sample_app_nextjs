import {Button, Card, DescItem, DescList, EditIcon, Fieldset} from '@setel/portal-ui';
import {formatDate} from '@setel/web-utils';
import * as React from 'react';
import {MerchantTypeCodes} from '../../../../shared/enums/merchant.enum';
import {useRouter} from '../../../routing/routing.context';
import {getOptionLabel} from '../../merchants/merchants.lib';
import {useSmartpayApplicationDetails} from '../../merchants/merchants.queries';
import {
  MerchantSmartpayBusinessCategoryOptions,
  MerchantSmartpayCompanyTypeOptions,
  MerchantSmartpayFleetPlanOption,
} from '../../merchants/merchants.type';

type FleetAccountReferenceProps = {
  applicationId: string;
  requestID: string;
};

export const FleetAccountReference = (props: FleetAccountReferenceProps) => {
  const {data, isLoading} = useSmartpayApplicationDetails(props.applicationId);

  const router = useRouter();

  return (
    <Card className={'mb-4'}>
      <Card.Heading title={'Reference'}>
        <Button
          leftIcon={<EditIcon />}
          variant={'outline'}
          onClick={() => {
            router.navigateByUrl(
              `/merchants/types/${MerchantTypeCodes.SMART_PAY_ACCOUNT}/application/${props.applicationId}`,
            );
          }}>
          UPDATE MERCHANT INFO
        </Button>
      </Card.Heading>
      <Card.Content>
        <Fieldset legend={'GENERAL INFORMATION'}>
          <DescList isLoading={isLoading} className={'pb-5'}>
            {data?.merchantId && <DescItem label={'Merchant ID'} value={data.merchantId} />}
            <DescItem label={'Application ID'} value={data?.applicationId} />
            <DescItem
              label={'Fleet plan'}
              value={getOptionLabel(MerchantSmartpayFleetPlanOption, data?.generalInfo.fleetPlan)}
            />
            <DescItem label={'Smartpay company'} value={data?.generalInfo.smartpayCompanyName} />
          </DescList>
        </Fieldset>
        <Fieldset legend={'COMPANY / INDIVIDUAL INFORMATION'} borderTop>
          <DescList isLoading={isLoading}>
            <DescItem
              label={'Company/individual name'}
              value={data?.companyOrIndividualInfo.companyOrIndividualName}
            />
            <DescItem
              label={'Company type'}
              value={getOptionLabel(
                MerchantSmartpayCompanyTypeOptions,
                data?.companyOrIndividualInfo.companyType,
              )}
            />
            <DescItem
              label={'Company emboss name'}
              value={data?.companyOrIndividualInfo.companyEmbossName}
            />
            <DescItem
              label={'Company registration number / ic number'}
              value={data?.companyOrIndividualInfo.companyRegNo}
            />
            <DescItem
              label={'Company registration date'}
              value={
                data?.companyOrIndividualInfo.companyRegDate
                  ? formatDate(data?.companyOrIndividualInfo.companyRegDate, {
                      formatType: 'dateOnly',
                    })
                  : ''
              }
            />
            <DescItem
              label={'Business category'}
              value={getOptionLabel(
                MerchantSmartpayBusinessCategoryOptions,
                data?.companyOrIndividualInfo.businessCategory,
              )}
            />
          </DescList>
        </Fieldset>
      </Card.Content>
    </Card>
  );
};
