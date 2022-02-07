import {Button, Card, DescItem, DescList, EditIcon, formatDate} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from '../../../../components/page-container';
import {useNotification} from '../../../../hooks/use-notification';
import {useSmartpayAccountAddressDetail, useSmartpayAccountDetails} from '../../merchants.queries';
import {fnCodeToName} from './smartpay-details-address-list';
import {SmartpayDetailsAddressModal} from './smartpay-details-address-modal';
import {QueryErrorAlert} from '../../../../components/query-error-alert';
import {statesOfMalayOptions} from '../../merchant.const';

interface ISpaAddressDetailsProps {
  spId: string;
  id: string;
  type: string;
}

export const SmartpayAccountAddressDetails = (props: ISpaAddressDetailsProps) => {
  return props.type === 'merchant' ? (
    <AccountAddrDetails merchantId={props.spId} type={props.type} addrId={props.id} />
  ) : (
    <AppAddrDetails appId={props.spId} type={props.type} addrId={props.id} />
  );
};

const AccountAddrDetails = (props: {merchantId: string; type: string; addrId: string}) => {
  const {data, error, isLoading} = useSmartpayAccountDetails(props.merchantId);
  return (
    <>
      {!isLoading && error && <QueryErrorAlert error={error as any} />}
      {data?.applicationId && (
        <AppAddrDetails
          addrId={props.addrId}
          appId={data.applicationId}
          merchantId={props.merchantId}
          type={props.type}
        />
      )}
    </>
  );
};

const AppAddrDetails = (props: {
  appId: string;
  merchantId?: string;
  type: string;
  addrId: string;
}) => {
  const [showEditModal, setShowEditModal] = React.useState(false);
  const setNotify = useNotification();

  const {data, isLoading, error} = useSmartpayAccountAddressDetail(props.addrId);

  return (
    <PageContainer heading={'Address details'} className={'mt-4'}>
      <Card>
        <Card.Heading title="General">
          <Button variant="outline" leftIcon={<EditIcon />} onClick={() => setShowEditModal(true)}>
            EDIT
          </Button>
        </Card.Heading>
        <Card.Content>
          {!isLoading && error && <QueryErrorAlert error={error as any} />}
          <DescList isLoading={isLoading}>
            <DescItem label="Address type" value={fnCodeToName(data?.addressType)} />
            <DescItem label="Address line 1" value={data?.addressLine1} />
            <DescItem label="Address line 2" value={data?.addressLine2 || '-'} />
            <DescItem label="Address line 3" value={data?.addressLine3 || '-'} />
            <DescItem label="Address line 4" value={data?.addressLine4 || '-'} />
            <DescItem label="Address line 5" value={data?.addressLine5 || '-'} />
            <DescItem label="City" value={data?.city || '-'} />
            <DescItem label="Postcode" value={data?.postcode || '-'} />
            <DescItem
              label="State"
              value={
                data?.state ? statesOfMalayOptions.find((v) => v.value === data.state).label : '-'
              }
            />
            <DescItem label="Country" value={data?.country || '-'} />
            <DescItem label="Created on" value={data ? formatDate(data.createdAt) : '-'} />
          </DescList>
        </Card.Content>
      </Card>
      {showEditModal && (
        <SmartpayDetailsAddressModal
          appId={props.appId}
          merchantId={props.merchantId}
          type={props.type}
          address={data}
          onClose={(message) => {
            setShowEditModal(false);
            ['success', 'delete_success'].includes(message) &&
              setNotify({
                title: 'Successful!',
                variant: 'success',
                description:
                  message === 'success'
                    ? 'Address details has been successfully updated.'
                    : 'Address has been successfully deleted.',
              });
          }}
        />
      )}
    </PageContainer>
  );
};
