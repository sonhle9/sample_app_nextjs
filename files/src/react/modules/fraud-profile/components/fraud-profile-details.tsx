import {Button, Modal, Card, DescList, EditIcon, JsonPanel} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useFraudProfileDetails} from '../fraud-profile.queries';
import {FraudProfileStatus} from './fraud-profile-status';
import {FraudProfileForm} from './fraud-profile-form';
import {restrictionTypeLabel} from '../fraud-profile.const';
import {HasPermission} from '../../auth/HasPermission';
import {adminFraudProfile} from 'src/shared/helpers/roles.type';
import {Link} from 'src/react/routing/link';

export const FraudProfileDetails = (props: {id: string}) => {
  const {data, isLoading} = useFraudProfileDetails(props.id);

  const [showEditModal, setShowEditModal] = React.useState(false);
  const dismissEditModal = () => setShowEditModal(false);

  return (
    <PageContainer
      heading="Fraud Profile Details"
      action={
        <HasPermission accessWith={[adminFraudProfile.adminUpdate]}>
          <Button onClick={() => setShowEditModal(true)} variant="outline" leftIcon={<EditIcon />}>
            EDIT
          </Button>
          <Modal isOpen={showEditModal} onDismiss={dismissEditModal} header="Edit Fraud Profile">
            <FraudProfileForm
              userId={props.id}
              onDismiss={dismissEditModal}
              current={data}
              isShowCustomerName={true}
            />
          </Modal>
        </HasPermission>
      }>
      <div className="space-y-5">
        <Card>
          <Card.Heading title="General" />
          <Card.Content>
            <DescList isLoading={isLoading}>
              <DescList.Item
                label="Customer name"
                value={
                  data && (
                    <Link className="text-brand-500 font-bold" to={`/customers/${data.targetId}`}>
                      {data.targetName}
                    </Link>
                  )
                }
              />
              <DescList.Item
                label="Status"
                value={data && <FraudProfileStatus status={data.status} />}
              />
              <DescList.Item
                label="Restrictions"
                value={
                  data &&
                  (data.restrictions.length === 0 ? (
                    '-'
                  ) : (
                    <>
                      {data.restrictions.map((rule, index) => (
                        <span className="block" key={index}>
                          {restrictionTypeLabel[rule.type] || rule.type}
                        </span>
                      ))}
                    </>
                  ))
                }
              />
              <DescList.Item
                label="Remarks"
                value={
                  data &&
                  (data.remarks ? <span className="whitespace-pre-wrap">{data.remarks}</span> : '-')
                }
              />
            </DescList>
          </Card.Content>
        </Card>
        <JsonPanel json={(data as any) || {}} allowToggleFormat />
      </div>
    </PageContainer>
  );
};
