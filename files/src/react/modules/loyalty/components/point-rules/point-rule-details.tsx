import * as React from 'react';
import {
  Card,
  CardHeading,
  CardContent,
  Button,
  Badge,
  EditIcon,
  formatDate,
} from '@setel/portal-ui';
import {PointRuleField} from '../point-rule-field';
import {useGetPointRulesById} from '../../point-rules.queries';
import {
  OperationType,
  Statuses,
  Sources,
  SourcesType,
  Target,
  TargetType,
} from '../../point-rules.type';
import {PointRuleCreateEditModal} from './point-rule-create-edit-modal';
import {getNameFromEnum} from 'src/react/lib/get-name-from-enum';
import {
  useCanEditEarningRules,
  useCanEditRedemptionRules,
} from '../../custom-hooks/use-check-permissions';
import {useGenerateCardGroups} from '../../custom-hooks/use-list-card-groups';
import {useGenerateLoyaltyCategories} from '../../custom-hooks/use-list-loyalty-categories';
import {PageContainer} from 'src/react/components/page-container';

export type PointRuleDetailsProps = {
  id?: string;
  operationType: OperationType;
};

export const PointRuleDetails: React.VFC<PointRuleDetailsProps> = ({id, operationType}) => {
  const {data} = useGetPointRulesById(id);
  const canEditEarningRules = useCanEditEarningRules();
  const canEditRedemptionRules = useCanEditRedemptionRules();
  const {inclusiveFiltered: cardGroups} = useGenerateCardGroups({
    cardGroupIdFilters: data?.cardCategory,
  });

  const {inclusiveFiltered: loyaltyCategories} = useGenerateLoyaltyCategories({
    loyaltyCategoriesIdFilters: data?.loyaltyCategory,
  });

  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const canEdit =
    operationType === OperationType.REDEMPTION ? canEditRedemptionRules : canEditEarningRules;

  return (
    <>
      <PointRuleCreateEditModal
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        rule={{...data, loyaltyCategory: loyaltyCategories}}
      />
      <PageContainer
        heading={`Point ${
          operationType === OperationType.REDEMPTION ? 'redemption' : 'earning'
        } rule details`}>
        <Card data-testid="rule-details-container">
          <CardHeading title="General">
            {canEdit && (
              <Button
                variant="outline"
                onClick={() => setIsOpen(true)}
                leftIcon={<EditIcon />}
                minWidth="none">
                EDIT
              </Button>
            )}
          </CardHeading>
          <CardContent>
            <PointRuleField name="Status">
              <Badge
                color={data?.status === Statuses.DISABLED ? 'error' : 'turquoise'}
                className="uppercase">
                {data?.status}
              </Badge>
            </PointRuleField>
            <PointRuleField name="Priority">{data?.priority}</PointRuleField>
            {operationType === OperationType.EARN && (
              <>
                <PointRuleField name="Name">{data?.title}</PointRuleField>
                <PointRuleField name="Card groups">
                  {cardGroups?.length &&
                    cardGroups.map((cardGroupName, i) => (
                      <Badge
                        className="mr-2 my-0.5"
                        color="grey"
                        data-testid="card-category"
                        key={i}>
                        <span className="text-black text-sm py-0.5 font-normal">
                          {cardGroupName}
                        </span>
                      </Badge>
                    ))}
                </PointRuleField>
                <PointRuleField name="Loyalty categories">
                  {loyaltyCategories?.length &&
                    loyaltyCategories.map((category, i) => (
                      <Badge
                        className="mr-2 my-0.5"
                        color="grey"
                        data-testid="loyalty-category"
                        key={i}>
                        <span className="text-black text-sm py-0.5 font-normal">{category}</span>
                      </Badge>
                    ))}
                </PointRuleField>
                <PointRuleField name="Source type">
                  {getNameFromEnum(data?.sourceType, SourcesType)}
                </PointRuleField>
              </>
            )}
            <PointRuleField name="Source">
              {getNameFromEnum(data?.source, Sources, data?.source === Sources.MYR)}
            </PointRuleField>
            <PointRuleField name="Target type">
              {getNameFromEnum(data?.targetType, TargetType)}
            </PointRuleField>
            <PointRuleField name="Target">
              {getNameFromEnum(data?.target, Target, data?.target === Target.MYR)}
            </PointRuleField>
            <PointRuleField name="Rate">{data?.ratio}</PointRuleField>
            <PointRuleField name="Start date">
              {data?.startAt ? formatDate(data.startAt) : '-'}
            </PointRuleField>
            <PointRuleField name="End date">
              {data?.expireAt ? formatDate(data.expireAt) : '-'}
            </PointRuleField>
            <PointRuleField name="Remarks">{data?.remarks}</PointRuleField>
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
};
