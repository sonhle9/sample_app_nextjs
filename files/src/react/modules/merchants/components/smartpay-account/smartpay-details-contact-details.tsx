import {Button, Card, DescItem, DescList, EditIcon, formatDate} from '@setel/portal-ui';
import React from 'react';
import {PageContainer} from '../../../../components/page-container';
import {useNotification} from '../../../../hooks/use-notification';
import {useSmartpayAccountContactDetail, useSmartpayAccountDetails} from '../../merchants.queries';
import {SmartpayDetailsContactModal} from './smartpay-details-contact-modal';
import {QueryErrorAlert} from '../../../../components/query-error-alert';

interface ISpaContactDetailsProps {
  spId: string;
  id: string;
  type: string;
}

export const SmartpayAccountContactDetails = (props: ISpaContactDetailsProps) => {
  return props.type === 'merchant' ? (
    <AccountContactDetails merchantId={props.spId} type={props.type} contactId={props.id} />
  ) : (
    <AppContactDetails appId={props.spId} type={props.type} contactId={props.id} />
  );
};

const AccountContactDetails = (props: {merchantId: string; type: string; contactId: string}) => {
  const {data, error, isLoading} = useSmartpayAccountDetails(props.merchantId);
  return (
    <>
      {!isLoading && error && <QueryErrorAlert error={error as any} />}
      {data?.applicationId && (
        <AppContactDetails
          contactId={props.contactId}
          appId={data.applicationId}
          merchantId={props.merchantId}
          type={props.type}
        />
      )}
    </>
  );
};

const AppContactDetails = (props: {
  appId: string;
  merchantId?: string;
  type: string;
  contactId: string;
}) => {
  const [showEditModal, setShowEditModal] = React.useState(false);
  const setNotify = useNotification();

  const {data, error, isLoading} = useSmartpayAccountContactDetail(props.contactId);

  return (
    <PageContainer heading={'Contact details'} className={'mt-4'}>
      <Card>
        <Card.Heading title="General">
          <Button variant="outline" leftIcon={<EditIcon />} onClick={() => setShowEditModal(true)}>
            EDIT
          </Button>
        </Card.Heading>
        <Card.Content>
          {!isLoading && error && <QueryErrorAlert error={error as any} />}
          <DescList isLoading={isLoading}>
            <DescItem labelClassName="w-35" label="Contact person" value={data?.contactPerson} />
            <DescItem
              labelClassName="w-36"
              label="Set as default contact"
              value={data?.default ? 'Yes' : 'No'}
            />
            <DescItem labelClassName="w-36" label="Email address" value={data?.email || '-'} />
            <DescItem
              labelClassName="w-36"
              label="Mobile number"
              value={data?.mobilePhone || '-'}
            />
            <DescItem
              labelClassName="w-36"
              label="Home phone number"
              value={data?.homePhone || '-'}
            />
            <DescItem
              labelClassName="w-36"
              label="Work phone number"
              value={data?.workPhone || '-'}
            />
            <DescItem labelClassName="w-36" label="Fax number" value={data?.fax || '-'} />
            <DescItem
              labelClassName="w-36"
              label="Created on"
              value={data?.createdAt ? formatDate(data.createdAt) : '-'}
            />
          </DescList>
        </Card.Content>
      </Card>
      {showEditModal && (
        <SmartpayDetailsContactModal
          appId={props.appId}
          merchantId={props.merchantId}
          type={props.type}
          contact={data}
          onClose={(message) => {
            setShowEditModal(false);
            ['success', 'delete_success'].includes(message) &&
              setNotify({
                title: 'Successful!',
                variant: 'success',
                description:
                  message === 'success'
                    ? 'Contact details has been successfully updated.'
                    : 'Contact has been successfully deleted.',
              });
          }}
        />
      )}
    </PageContainer>
  );
};
