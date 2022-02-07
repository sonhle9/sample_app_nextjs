import {
  Button,
  Card,
  CardContent,
  CardHeading,
  DescItem,
  DescList,
  EditIcon,
} from '@setel/portal-ui';
import moment from 'moment';
import * as React from 'react';
import {useNotification} from '../../../../react/hooks/use-notification';
import {PageContainer} from '../../../components/page-container';
import {useSmartpayCompanyContactDetails} from '../companies.queries';
import {SmartpayCompanyContactModal} from './smartpay-company-contact-modal';

type SmartpayCompanyContactDetailsProps = {
  companyId: string;
  contactId: string;
};

export const SmartpayCompanyContactDetails = (props: SmartpayCompanyContactDetailsProps) => {
  const [showContactModal, setShowContactModal] = React.useState(false);
  const {data: contact, isLoading} = useSmartpayCompanyContactDetails(props.contactId);

  const showMessage = useNotification();

  return (
    <PageContainer heading="Contact details">
      <div className="space-y-8">
        <Card>
          <CardHeading title="General">
            <Button
              data-testid={'edit-smartpay-company-address'}
              variant="outline"
              onClick={() => setShowContactModal(true)}
              leftIcon={<EditIcon />}>
              EDIT
            </Button>
            {showContactModal && contact && (
              <SmartpayCompanyContactModal
                companyId={props.companyId}
                contactId={props.contactId}
                contact={contact}
                onDone={() => {
                  setShowContactModal(false);
                  showMessage({
                    title: 'Successful!',
                    description: 'Contact details has been saved.',
                  });
                }}
                onClose={() => setShowContactModal(false)}
              />
            )}
          </CardHeading>
          <CardContent>
            <DescList isLoading={isLoading}>
              <DescItem label="Contact person" value={contact?.contactPerson || '-'} />
              <DescItem
                label="Set as default contact"
                value={contact?.isDefaultContact ? 'Yes' : 'No'}
              />
              <DescItem label="Email address" value={contact?.email || '-'} />
              <DescItem label="Mobile number" value={contact?.mobilePhone || '-'} />
              <DescItem label="Home phone number" value={contact?.homePhone || '-'} />
              <DescItem label="Work phone number" value={contact?.workPhone || '-'} />
              <DescItem label="Fax number" value={contact?.faxNumber || '-'} />

              <DescItem
                label="Created on"
                value={moment(contact?.createdAt).format('DD MMMM YYYY')}
              />
            </DescList>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
