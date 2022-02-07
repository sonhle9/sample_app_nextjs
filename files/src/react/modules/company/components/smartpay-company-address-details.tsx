import {
  Button,
  Card,
  CardContent,
  CardHeading,
  DescItem,
  DescList,
  EditIcon,
  formatDate,
  titleCase,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from '../../../components/page-container';
import {useNotification} from '../../../hooks/use-notification';
import {useSmartpayCompanyAddressDetails} from '../companies.queries';
import {smartpayCompanyAddressTypeOptions} from '../companies.type';
import {SmartpayCompanyAddressModal} from './smartpay-company-address-modal';

type SmartpayCompanyAddressDetailsProps = {
  companyId: string;
  addressId: string;
};

export const SmartpayCompanyAddressDetails = (props: SmartpayCompanyAddressDetailsProps) => {
  const [showAddressModal, setShowAddressModal] = React.useState(false);
  const {data: address, isLoading} = useSmartpayCompanyAddressDetails(props.addressId);

  const showMessage = useNotification();

  return (
    <PageContainer heading="Address details">
      <div className="space-y-8">
        <Card>
          <CardHeading title="General">
            <Button
              data-testid={'edit-smartpay-company-address'}
              variant="outline"
              onClick={() => setShowAddressModal(true)}
              leftIcon={<EditIcon />}>
              EDIT
            </Button>
            {showAddressModal && address && (
              <SmartpayCompanyAddressModal
                companyId={props.companyId}
                addressId={props.addressId}
                address={address}
                onDone={() => {
                  setShowAddressModal(false);
                  showMessage({
                    title: 'Successful!',
                    description: 'Address details has been updated.',
                  });
                }}
                onClose={() => setShowAddressModal(false)}
              />
            )}
          </CardHeading>
          <CardContent>
            <DescList isLoading={isLoading}>
              <DescItem
                label="Address type"
                value={
                  smartpayCompanyAddressTypeOptions.find(
                    (type) => type.value === address?.addressType,
                  )?.label || '-'
                }
              />
              <DescItem label="Address line 1" value={address?.addressLine1 || '-'} />
              <DescItem label="Address line 2" value={address?.addressLine2 || '-'} />
              <DescItem label="Address line 3" value={address?.addressLine3 || '-'} />
              <DescItem label="Address line 4" value={address?.addressLine4 || '-'} />
              <DescItem label="Address line 5" value={address?.addressLine5 || '-'} />
              <DescItem label="City" value={address?.city || '-'} />
              <DescItem label="Postcode" value={address?.postcode || '-'} />
              <DescItem label="State" value={titleCase(address?.state || '-')} />
              <DescItem label="Country" value={titleCase(address?.country || '-')} />
              <DescItem
                label="Created on"
                value={address?.createdAt ? formatDate(address.createdAt) : '-'}
              />
            </DescList>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
