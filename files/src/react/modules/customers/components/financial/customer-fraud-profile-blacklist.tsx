import {
  Card,
  CardHeading,
  Button,
  EditIcon,
  CardContent,
  DescList,
  DescItem,
  Modal,
  formatDate,
  Badge,
} from '@setel/portal-ui';
import * as React from 'react';
import {FraudProfileForm} from 'src/react/modules/fraud-profile/components/fraud-profile-form';
import {
  GetBadgeStatusColor,
  restrictionTypeLabel,
} from 'src/react/modules/fraud-profile/fraud-profile.const';
import {useFraudProfileDetails} from 'src/react/modules/fraud-profile/fraud-profile.queries';

interface ICustomerBlacklistParams {
  userId: string;
}

export function CustomerFraudProfileBlacklist({userId}: ICustomerBlacklistParams) {
  const [isExpanded, setExpanded] = React.useState(false);
  const [isShowPopup, setShowPopup] = React.useState(false);

  const {data: fraudProfile, isLoading: isLoading, refetch} = useFraudProfileDetails(userId);

  const handleOnDismiss = () => {
    refetch();
    setShowPopup(false);
  };

  return (
    <>
      <Modal
        data-testid="edit-fraud-profile-popup"
        aria-label="Edit Fraud Profile"
        isOpen={isShowPopup}
        onDismiss={() => setShowPopup(false)}
        initialFocus="content"
        header={`${fraudProfile ? 'Update' : 'Add'} fraud profile`}>
        <FraudProfileForm
          userId={userId}
          onDismiss={handleOnDismiss}
          current={fraudProfile}
          isShowCustomerName={false}
        />
      </Modal>

      <Card
        expandable
        isLoading={isLoading}
        data-testid="expand-blacklist"
        className="mb-8"
        isOpen={isExpanded}
        onToggleOpen={() => setExpanded((prev) => !prev)}>
        <CardHeading title="Blacklist">
          <Button
            variant="outline"
            data-testid="add-blacklist-button"
            leftIcon={<EditIcon />}
            minWidth="none"
            onClick={() => setShowPopup(true)}>
            {fraudProfile ? 'EDIT' : 'ADD'}
          </Button>
        </CardHeading>

        <CardContent className="flex">
          <DescList isLoading={isLoading}>
            <DescItem label="Remarks" value={fraudProfile?.remarks ? fraudProfile.remarks : '-'} />
            <DescItem
              label="Status"
              value={
                fraudProfile?.status ? (
                  <Badge color={GetBadgeStatusColor[fraudProfile.status] || 'grey'}>
                    {fraudProfile.status}
                  </Badge>
                ) : (
                  '-'
                )
              }
            />
            <DescItem
              label="Restrictions"
              value={
                fraudProfile?.restrictions.length > 0
                  ? fraudProfile.restrictions.map((item) => (
                      <div key={item.type} className={'py-1'}>
                        {restrictionTypeLabel[item.type]}
                        <br />
                      </div>
                    ))
                  : '-'
              }
            />
            <DescItem
              label="Created at"
              value={fraudProfile?.createdAt ? formatDate(fraudProfile.createdAt) : '-'}
            />
            <DescItem
              label="Updated at"
              value={fraudProfile?.createdAt ? formatDate(fraudProfile.updatedAt) : '-'}
            />
          </DescList>
        </CardContent>
      </Card>
    </>
  );
}
