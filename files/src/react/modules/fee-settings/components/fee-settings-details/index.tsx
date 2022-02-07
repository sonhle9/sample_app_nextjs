import {EditIcon, Button, CardHeading, DescList, formatDate, formatMoney} from '@setel/portal-ui';
import {Card} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {HasPermission} from 'src/react/modules/auth/HasPermission';
import {feeSettingsRole} from 'src/shared/helpers/roles.type';
import {useFeeSettingDetails} from '../../fee-settings.queries';
import {IFeeSettingsRequest} from '../../fee-settings.type';
import {FeeSettingDetailModalEdit} from './fee-setting-details-modal-edit';

export const FeeSettingDetails = ({feeSettingId}: IFeeSettingsRequest) => {
  const [showAssignModal, setShowAssignModal] = React.useState(false);
  const {data, isError, error, isLoading} = useFeeSettingDetails(feeSettingId);

  return (
    <PageContainer heading="Fee setting details" className="space-y-8 mt-6">
      {isError && <QueryErrorAlert error={error as any} />}
      <Card>
        <CardHeading title="General">
          <HasPermission accessWith={[feeSettingsRole.modify]}>
            <Button
              onClick={() => setShowAssignModal(true)}
              variant="outline"
              minWidth="none"
              leftIcon={<EditIcon />}>
              EDIT
            </Button>
          </HasPermission>
        </CardHeading>
        <Card.Content>
          <DescList isLoading={isLoading}>
            <DescList.Item label="Fee ID" value={data?.feeSettingId} />
            <DescList.Item label="Fee name" value={data?.name} />
            <DescList.Item
              label="Fee amount (RM)"
              value={!isNaN(data?.amount) ? formatMoney(data?.amount) : '-'}
            />
            <DescList.Item
              label="Created on"
              value={data?.createdAt ? formatDate(data?.createdAt) : '-'}
            />
            <DescList.Item label="Created by" value={data?.createdBy || '-'} />
            <DescList.Item
              label="Updated on"
              value={data?.updatedAt ? formatDate(data?.updatedAt) : '-'}
            />
            <DescList.Item label="Updated by" value={data?.updatedBy || '-'} />
          </DescList>
        </Card.Content>
      </Card>
      {showAssignModal && (
        <FeeSettingDetailModalEdit
          feeSettingId={data.feeSettingId}
          name={data.name}
          amount={data.amount.toString()}
          setShowModal={setShowAssignModal}
        />
      )}
    </PageContainer>
  );
};
