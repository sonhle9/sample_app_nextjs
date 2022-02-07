import {Badge, Button, Card, DescList, formatMoney, titleCase, formatDate} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {PlanStatus} from 'src/react/modules/bnpl-plan-config/bnpl.enum';
import {statusColor} from '../bnpl-plan.constant';
import {usePlanDetails} from '../bnpl-plan.queries';
import {useActiveBnplPlanConfigModal} from './modals/active-plan-modal';
import {useDeactivateBnplPlanConfigModal} from './modals/deactivate-plan-modal';
import {useBnplPlanConfigDetailModal} from './modals/plan-config-detail-modal';
import {HasPermission} from 'src/react/modules/auth/HasPermission';
import {adminBnplPlanConfig} from 'src/shared/helpers/roles.type';

export interface IPlanDetailsProps {
  id: string;
}

export const PlanDetails = ({id}: IPlanDetailsProps) => {
  const {data, isFetching} = usePlanDetails(id);

  const bnplPlanConfigDetailModal = useBnplPlanConfigDetailModal(data);
  const deactivateBnplPlanConfigModal = useDeactivateBnplPlanConfigModal(id);
  const activateBnplPlanConfigModal = useActiveBnplPlanConfigModal(data);

  const pageContainer = () => {
    if (!data) {
      return <PageContainer heading="BNPL plan details" />;
    }

    return (
      <PageContainer
        heading="BNPL plan details"
        action={
          <div className="flex">
            <>
              <HasPermission accessWith={[adminBnplPlanConfig.adminCreate]}>
                <Button
                  className="mr-4"
                  onClick={bnplPlanConfigDetailModal.open}
                  variant="outline"
                  disabled={isFetching}>
                  DUPLICATE
                </Button>
                {bnplPlanConfigDetailModal.component}
              </HasPermission>
            </>
            <HasPermission accessWith={[adminBnplPlanConfig.adminUpdate]}>
              {data.status === PlanStatus.INACTIVE ? (
                <>
                  <Button
                    onClick={activateBnplPlanConfigModal.open}
                    variant="primary"
                    disabled={isFetching}>
                    ACTIVATE PLAN
                  </Button>
                  {activateBnplPlanConfigModal.component}
                </>
              ) : (
                <>
                  <Button
                    onClick={deactivateBnplPlanConfigModal.open}
                    variant="error-outline"
                    disabled={isFetching}>
                    DEACTIVATE PLAN
                  </Button>
                  {deactivateBnplPlanConfigModal.component}
                </>
              )}
            </HasPermission>
          </div>
        }>
        <Card className="mb-6">
          <Card.Heading title={data.id} />
          <Card.Content>
            <DescList>
              <DescList.Item label="Plan name" value={data?.name} />

              <DescList.Item
                label="Status"
                value={<Badge color={statusColor[data.status]}>{data.status.toUpperCase()}</Badge>}
              />

              <DescList.Item label="Plan type" value={titleCase(data.instructionInterval)} />

              <DescList.Item label="Currency" value={data.currencyCode} />

              <DescList.Item label="Country" value={titleCase(data.country)} />

              <DescList.Item label="Min. amount" value={formatMoney(data.minAmount, 'RM')} />

              <DescList.Item label="Max. amount" value={formatMoney(data.maxAmount, 'RM')} />

              <DescList.Item
                label="Effective date"
                value={formatDate(data.effectiveDate, {
                  format: 'dd MMM yyyy',
                })}
              />

              <DescList.Item
                label="Expired date"
                value={formatDate(data.expiredDate, {
                  format: 'dd MMM yyyy',
                })}
              />

              <DescList.Item
                label="Interest fee"
                value={`${formatMoney(data.interestFee, {decimalPlaces: 2})}%`}
              />

              <DescList.Item
                label="Late payment fee"
                value={formatMoney(data.latePaymentFee, 'RM')}
              />

              <DescList.Item label="Plan structure" value={titleCase(data.planStructure)} />

              <DescList.Item
                label="Instruction quantities"
                value={
                  <div className="flex flex-wrap">
                    {data.instructionQuantities.map((item, index) => (
                      <div className="pr-1" key={`${index + 1}`}>
                        <Badge color={'grey'} rounded="full" className="py-1">
                          {item}x
                        </Badge>
                      </div>
                    ))}
                  </div>
                }
              />
            </DescList>
          </Card.Content>
        </Card>
      </PageContainer>
    );
  };

  return pageContainer();
};
