import {
  Button,
  Card,
  CardContent,
  CardHeading,
  DescItem,
  DescList,
  EditIcon,
} from '@setel/portal-ui';
import React, {useState} from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useIPay88Banks, useSystemState} from '../outage.query';
import {OutageAnnouncementEditModal} from './outage-announcement-edit-modal';
import {OutageMaintainAppModal} from './outage-maintain-app-modal';
import {OutageMaintainServicesModal} from './outage-maintain-services-modal';
import {OutageMaintainVendorsModal} from './outage-maintain-vendors-modal';
import {OutageMaintainFeaturesModal} from './outage-maintain-features-modal';
import {OutageMaintainIPay88BanksModal} from './outage-maintain-ipay88-banks-modal';
import {OutageChatSupport} from './outage-chat-suppport';

export const Outage = () => {
  const [visibleAnnouncementEditModal, setVisibleAnnouncementEditModal] = useState(false);
  const [visibleMaintainAppModal, setVisibleMaintainAppModal] = useState(false);
  const [visibleMaintainVendorModal, setVisibleMaintainVendorModal] = useState(false);
  const [visibleMaintainServicesModal, setVisibleMaintainServicesModal] = useState(false);
  const [visibleMaintainFeaturesModal, setVisibleMaintainFeaturesModal] = useState(false);
  const [visibleMaintainIPay88BanksModal, setVisibleMaintainIPay88BanksModal] = useState(false);

  const {data: systemState, isLoading} = useSystemState();
  const announcement = {
    ...systemState?.currentAnnouncementTextLocale,
    currentAnnouncementColour: systemState?.currentAnnouncementColour,
    id: systemState?.futureMaintenancePeriods[0]?.id,
  };
  const {data: iPay88Banks} = useIPay88Banks();
  return (
    <PageContainer heading="Outage management">
      <div className="mb-8">
        <Card isLoading={isLoading}>
          <CardHeading title="Announcement">
            <Button
              onClick={() => setVisibleAnnouncementEditModal(true)}
              variant="outline"
              minWidth="none"
              leftIcon={<EditIcon />}
              data-testid="">
              EDIT
            </Button>
          </CardHeading>
          <CardContent>
            <DescList className="grid-cols-2">
              <DescItem
                labelClassName="sm:text-black"
                valueClassName="text-right font-medium"
                label="Status"
                value={systemState?.currentAnnouncementTextLocale?.en ? 'ON' : 'OFF'}
              />
              <DescItem
                labelClassName="sm:text-black"
                valueClassName="text-right font-medium"
                label="Color"
                value={systemState?.currentAnnouncementColour}
              />
              <DescItem
                labelClassName="sm:text-black"
                valueClassName="text-right font-medium"
                label="Content-en"
                value={systemState?.currentAnnouncementTextLocale?.en}
              />
              <DescItem
                labelClassName="sm:text-black"
                valueClassName="text-right font-medium"
                label="Content-ms"
                value={systemState?.currentAnnouncementTextLocale?.ms}
              />
              <DescItem
                labelClassName="sm:text-black"
                valueClassName="text-right font-medium"
                label="Content-zh-Hans"
                value={systemState?.currentAnnouncementTextLocale?.['zh-Hans']}
              />
              <DescItem
                labelClassName="sm:text-black"
                valueClassName="text-right font-medium"
                label="Content-zh-Hant"
                value={systemState?.currentAnnouncementTextLocale?.['zh-Hant']}
              />
              <DescItem
                labelClassName="sm:text-black"
                valueClassName="text-right font-medium"
                label="Content-ta"
                value={systemState?.currentAnnouncementTextLocale?.ta}
              />
            </DescList>
          </CardContent>
        </Card>
      </div>
      <div className="mb-8">
        <Card isLoading={isLoading}>
          <CardHeading title="Maintenance override: App">
            <Button
              onClick={() => setVisibleMaintainAppModal(true)}
              variant="outline"
              minWidth="none"
              leftIcon={<EditIcon />}
              data-testid="">
              EDIT
            </Button>
          </CardHeading>
          <CardContent>
            <DescList className="grid-cols-2">
              <DescItem
                labelClassName="sm:text-black"
                valueClassName="text-right font-medium"
                label="Android"
                value={systemState?.android ? 'ON' : 'OFF'}
              />
              <DescItem
                labelClassName="sm:text-black"
                valueClassName="text-right font-medium"
                label="iOS"
                value={systemState?.ios ? 'ON' : 'OFF'}
              />
            </DescList>
          </CardContent>
        </Card>
      </div>
      <div className="mb-8">
        <Card isLoading={isLoading}>
          <CardHeading title="Maintenance override: Vendor">
            <Button
              onClick={() => setVisibleMaintainVendorModal(true)}
              variant="outline"
              minWidth="none"
              leftIcon={<EditIcon />}
              data-testid="">
              EDIT
            </Button>
          </CardHeading>
          <CardContent>
            <DescList className="grid-cols-2">
              <DescItem
                labelClassName="sm:text-black"
                valueClassName="text-right font-medium"
                label="Orders Vendor (All Orders Vendors)"
                value={systemState?.vendors.pos ? 'ON' : 'OFF'}
              />
              <DescItem
                labelClassName="sm:text-black"
                valueClassName="text-right font-medium"
                label="Orders Vendor (Sapura POS)"
                value={systemState?.vendors.posSapura ? 'ON' : 'OFF'}
              />
              <DescItem
                labelClassName="sm:text-black"
                valueClassName="text-right font-medium"
                label="Orders Vendor (Sentinel POS)"
                value={systemState?.vendors.posSentinel ? 'ON' : 'OFF'}
              />
              <DescItem
                labelClassName="sm:text-black"
                valueClassName="text-right font-medium"
                label="Orders Vendor (Setel POS)"
                value={systemState?.vendors.posSetel ? 'ON' : 'OFF'}
              />
              <DescItem
                labelClassName="sm:text-black"
                valueClassName="text-right font-medium"
                label="Payments Vendor (kiplePay)"
                value={systemState?.vendors.kiple ? 'ON' : 'OFF'}
              />
              <DescItem
                labelClassName="sm:text-black"
                valueClassName="text-right font-medium"
                label="Loyalty Vendor (Cardtrend LMS)"
                value={systemState?.vendors.cardtrendLms ? 'ON' : 'OFF'}
              />
              <DescItem
                labelClassName="sm:text-black"
                valueClassName="text-right font-medium"
                label="SMS Vendor (Silverstreet)"
                value={systemState?.vendors.silverstreet ? 'ON' : 'OFF'}
              />
            </DescList>
          </CardContent>
        </Card>
      </div>
      <div className="mb-8">
        <Card isLoading={isLoading}>
          <CardHeading title="Maintenance override: Service">
            <Button
              onClick={() => setVisibleMaintainServicesModal(true)}
              variant="outline"
              minWidth="none"
              leftIcon={<EditIcon />}
              data-testid="">
              EDIT
            </Button>
          </CardHeading>
          <CardContent>
            <DescList className="grid-cols-2">
              <DescItem
                labelClassName="sm:text-black"
                valueClassName="text-right font-medium"
                label="Accounts"
                value={systemState?.services.accounts ? 'ON' : 'OFF'}
              />
              <DescItem
                labelClassName="sm:text-black"
                valueClassName="text-right font-medium"
                label="Orders"
                value={systemState?.services.orders ? 'ON' : 'OFF'}
              />
              <DescItem
                labelClassName="sm:text-black"
                valueClassName="text-right font-medium"
                label="Store Orders"
                value={systemState?.services.storeOrders ? 'ON' : 'OFF'}
              />
              <DescItem
                labelClassName="sm:text-black"
                valueClassName="text-right font-medium"
                label="Payments"
                value={systemState?.services.payments ? 'ON' : 'OFF'}
              />
              <DescItem
                labelClassName="sm:text-black"
                valueClassName="text-right font-medium"
                label="Loyalty"
                value={systemState?.services.loyalty ? 'ON' : 'OFF'}
              />
              <DescItem
                labelClassName="sm:text-black"
                valueClassName="text-right font-medium"
                label="Rewards"
                value={systemState?.services.rewards ? 'ON' : 'OFF'}
              />
              <DescItem
                labelClassName="sm:text-black"
                valueClassName="text-right font-medium"
                label="Stations"
                value={systemState?.services.stations ? 'ON' : 'OFF'}
              />
              <DescItem
                labelClassName="sm:text-black"
                valueClassName="text-right font-medium"
                label="Emails"
                value={systemState?.services.emails ? 'ON' : 'OFF'}
              />
            </DescList>
          </CardContent>
        </Card>
      </div>
      <div className="mb-8">
        <Card isLoading={isLoading}>
          <CardHeading title="Maintenance override: Features">
            <Button
              onClick={() => setVisibleMaintainFeaturesModal(true)}
              variant="outline"
              minWidth="none"
              leftIcon={<EditIcon />}
              data-testid="">
              EDIT
            </Button>
          </CardHeading>
          <CardContent>
            <DescList className="grid-cols-2">
              <DescItem
                labelClassName="sm:text-black"
                valueClassName="text-right font-medium"
                label="Top-up with card"
                value={systemState?.features.topUpWithCard ? 'ON' : 'OFF'}
              />
              <DescItem
                labelClassName="sm:text-black"
                valueClassName="text-right font-medium"
                label="Top-up with bank"
                value={systemState?.features.topUpWithBank ? 'ON' : 'OFF'}
              />
              <DescItem
                labelClassName="sm:text-black"
                valueClassName="text-right font-medium"
                label="Redeem Mesra points to Wallet Balance"
                value={systemState?.features.redeemLoyaltyPoints ? 'ON' : 'OFF'}
              />
            </DescList>
          </CardContent>
        </Card>
      </div>
      <div className="mb-8">
        <Card>
          <CardHeading title="Maintenance override: Ipay88 Banks">
            <Button
              onClick={() => setVisibleMaintainIPay88BanksModal(true)}
              variant="outline"
              minWidth="none"
              leftIcon={<EditIcon />}
              data-testid="maintain-override">
              EDIT
            </Button>
          </CardHeading>
          <CardContent>
            <DescList className="grid-cols-2">
              {iPay88Banks?.map((iPay88Bank, index) => (
                <DescItem
                  key={index}
                  labelClassName="sm:text-black"
                  valueClassName="text-right font-medium"
                  label={iPay88Bank.name}
                  value={iPay88Bank.isMaintenance ? 'ON' : 'OFF'}
                />
              ))}
            </DescList>
          </CardContent>
        </Card>
      </div>

      <OutageChatSupport />

      {visibleAnnouncementEditModal && (
        <OutageAnnouncementEditModal
          announcement={announcement}
          onClose={() => setVisibleAnnouncementEditModal(false)}
        />
      )}
      {visibleMaintainAppModal && (
        <OutageMaintainAppModal
          app={{ios: systemState.ios, android: systemState.android}}
          onClose={() => setVisibleMaintainAppModal(false)}
        />
      )}
      {visibleMaintainVendorModal && (
        <OutageMaintainVendorsModal
          vendors={systemState.vendors}
          onClose={() => setVisibleMaintainVendorModal(false)}
        />
      )}
      {visibleMaintainServicesModal && (
        <OutageMaintainServicesModal
          services={systemState.services}
          onClose={() => setVisibleMaintainServicesModal(false)}
        />
      )}
      {visibleMaintainFeaturesModal && (
        <OutageMaintainFeaturesModal
          features={systemState.features}
          onClose={() => setVisibleMaintainFeaturesModal(false)}
        />
      )}
      {visibleMaintainIPay88BanksModal && (
        <OutageMaintainIPay88BanksModal
          iPay88Banks={iPay88Banks}
          onClose={() => setVisibleMaintainIPay88BanksModal(false)}
        />
      )}
    </PageContainer>
  );
};
