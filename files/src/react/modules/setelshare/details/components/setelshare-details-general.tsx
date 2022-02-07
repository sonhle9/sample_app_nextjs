import {Badge, Card, DescList, formatDate, isNil} from '@setel/portal-ui';
import * as React from 'react';
import {ICircle} from '../../../../../shared/interfaces/circles.interface';
import {SetelShareUserExternalIcon} from '../../components/setelshare-user-external-icon';
import {circleStatusColorMap} from '../../setelshare.const';

interface Props {
  circleDetails: ICircle | undefined;
  isLoading: boolean;
}

export const SetelShareDetailsGeneral: React.VFC<Props> = (props) => {
  return (
    <Card data-testid="setelshare-details-general" isLoading={props.isLoading}>
      <Card.Heading title="General" />
      <Card.Content>
        <DescList isLoading={props.isLoading}>
          <DescList.Item label="Setel Share ID" value={props.circleDetails?.id} />
          <DescList.Item
            label="Owner"
            value={
              props.circleDetails?.fullName && (
                <div className="flex text-black">
                  {props.circleDetails.fullName}
                  <SetelShareUserExternalIcon userId={props.circleDetails.userId} />
                </div>
              )
            }
          />
          <DescList.Item
            label="Status"
            value={
              props.circleDetails?.status && (
                <Badge
                  color={circleStatusColorMap[props.circleDetails.status] || 'grey'}
                  className="uppercase">
                  {props.circleDetails.status}
                </Badge>
              )
            }
          />
          <DescList.Item
            label="Created on"
            value={props.circleDetails?.createdAt ? formatDate(props.circleDetails.createdAt) : '-'}
          />
          <DescList.Item
            label="Deleted"
            value={
              !isNil(props.circleDetails?.isDeleted) &&
              (props.circleDetails.isDeleted ? 'Yes' : 'No')
            }
          />
          <DescList.Item
            label="Deleted on"
            value={
              props.circleDetails?.isDeleted && props.circleDetails?.updatedAt
                ? formatDate(props.circleDetails.updatedAt)
                : '-'
            }
          />
        </DescList>
      </Card.Content>
    </Card>
  );
};
