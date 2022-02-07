import {Card, CardContent, CardHeading, FieldContainer, Skeleton, Text} from '@setel/portal-ui';
import * as React from 'react';
import _capitalize from 'lodash/capitalize';
import dateFormat from 'date-fns/format';
import {PageContainer} from 'src/react/components/page-container';
import {useNotification} from 'src/react/hooks/use-notification';
import {IAttributeRuleReadOnly} from '../types';
import {AttributionEdit} from './attribution-edit';
import {useAttributionRule} from '../attribution.queries';
import {ATTR_RULE_METADATA_LABELS, findLabel} from '../const';
import {useRouter} from '../../../routing/routing.context';
import {attributionRoles} from '../../../../shared/helpers/roles.type';
import {HasPermission} from '../../auth/HasPermission';

interface IAttributeDetailLabel {
  label: string;
  value: string;
}
const getAttributeLabels = (data: IAttributeRuleReadOnly): IAttributeDetailLabel[] => [
  {
    label: 'Type',
    value: findLabel(data?.type, 'type'),
  },
  {
    label: 'Reference Source',
    value: findLabel(data?.referenceSource, 'referenceSource'),
  },
  {
    label: 'Reference ID',
    value: data?.referenceId,
  },
  ...(data?.metadata || []).map((metadata) => ({
    label: _capitalize(ATTR_RULE_METADATA_LABELS[metadata.key]) || metadata.key,
    value: metadata.value,
  })),
  {
    label: 'Created on',
    value: data?.createdAt && dateFormat(new Date(data?.createdAt), 'd MMM yyyy, p'),
  },
];
export interface IAttributionDetailsProps {
  id: string;
}
export function AttributionDetails(props: IAttributionDetailsProps) {
  const showMessage = useNotification();
  const {data, isLoading, error, refetch} = useAttributionRule(props.id, {
    onError: () =>
      showMessage({
        variant: 'error',
        title: 'Error occured while fetching attribution rule!',
        description: String(error),
      }),
  });
  const router = useRouter();

  const onEdited = (newValue) => {
    if (newValue.referenceId !== props.id) {
      router.navigateByUrl(`/attribution/attribution-rules/${newValue.referenceId}`);
    } else {
      refetch();
    }
  };
  const onDeleted = () => router.navigateByUrl('/attribution/attribution-rules');

  return (
    <PageContainer heading="Attribution details">
      <Card>
        <CardHeading title={props.id}>
          {data && (
            <HasPermission accessWith={[attributionRoles.update]}>
              <AttributionEdit attributeRule={data} onEdited={onEdited} onDeleted={onDeleted} />
            </HasPermission>
          )}
        </CardHeading>
        <CardContent>
          {getAttributeLabels(data).map((item) => (
            <FieldContainer key={item.label} label={item.label} layout={'horizontal'}>
              {isLoading ? <Skeleton /> : <Text className="text-sm">{item.value}</Text>}
            </FieldContainer>
          ))}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
