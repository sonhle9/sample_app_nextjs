import {BareButton, Card, CardContent, CardHeading, DescItem, DescList} from '@setel/portal-ui';
import {PageContainer} from 'src/react/components/page-container';
import * as React from 'react';
import {ChangePasswordModal} from 'src/react/modules/auth/components/change-password-modal';
import {useAuth} from '../auth';

interface ProfileProps {
  onChangePasswordSuccess: () => void;
}

export const Profile = ({onChangePasswordSuccess}: ProfileProps) => {
  const {sessionPayload} = useAuth();
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] = React.useState(false);
  const handleChangePasswordClick = () => {
    setChangePasswordModalOpen(true);
  };
  const handleDismissModal = (isSuccess: boolean = false) => {
    setChangePasswordModalOpen(false);
    if (isSuccess) {
      onChangePasswordSuccess();
    }
  };
  return (
    <PageContainer heading={'Profile'} className={'space-y-4'}>
      <Card>
        <CardHeading title="General"></CardHeading>
        <CardContent>
          <DescList>
            <DescItem label="Name" value={sessionPayload?.username} />
            <DescItem label="Email" value={sessionPayload?.email} />
            <DescItem
              label="Password"
              value={
                <BareButton onClick={handleChangePasswordClick} className="">
                  <span className="font-normal text-xs text-brand-500">Change Password</span>
                </BareButton>
              }
            />
          </DescList>
        </CardContent>
      </Card>
      <ChangePasswordModal isOpen={isChangePasswordModalOpen} dismissModal={handleDismissModal} />
    </PageContainer>
  );
};
