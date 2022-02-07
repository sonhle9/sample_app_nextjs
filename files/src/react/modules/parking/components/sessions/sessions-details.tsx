import * as React from 'react';
import {Card, DescList, formatMoney, Badge, JsonPanel, Button, EditIcon} from '@setel/portal-ui';
import {PageContainer} from 'src/react/components/page-container';
import {SessionStatusesBadge} from '../../parking.const';
import {useGetParkingSessionDetails} from '../../parking.queries';
import {SessionStatuses} from '../../parking.type';
import {EditSessionModal} from './sessions-edit-modal';
import {format, formatDistance} from 'date-fns';

export type ParkingSessionDetailProps = {
  id: string;
};

export const ParkingSessionDetails: React.VFC<ParkingSessionDetailProps> = ({id}) => {
  const {data, isSuccess, isLoading} = useGetParkingSessionDetails(id);
  const [isOpenModal, setIsOpenModal] = React.useState(false);

  const checkinAt = data?.session?.checkinAt && new Date(data?.session?.checkinAt);
  const checkoutAt = data?.session?.checkoutAt && new Date(data?.session?.checkoutAt);

  return (
    <>
      <EditSessionModal
        isOpen={isOpenModal}
        onDismiss={() => setIsOpenModal(false)}
        session={data?.session}
      />
      <PageContainer heading="Session details">
        {(isSuccess || isLoading) && (
          <Card className="mb-4" data-testid="session-details-cards">
            <Card.Heading title="General">
              <Button
                variant="outline"
                leftIcon={<EditIcon />}
                onClick={() => setIsOpenModal(true)}
                disabled={data?.session.status === SessionStatuses.VOIDED}>
                EDIT
              </Button>
            </Card.Heading>
            <Card.Content>
              <DescList isLoading={isLoading}>
                <DescList.Item label="Customer name" value={data?.session?.userFullname || '-'} />
                <DescList.Item
                  label="Vehicle plate number"
                  value={data?.session?.plateNumber || '-'}
                />
                <DescList.Item label="Transaction ID" value={data?.session?.id} />
                {data?.session?.status === SessionStatuses.COMPLETED && (
                  <DescList.Item
                    label="Amount"
                    value={`RM${formatMoney(data?.session?.finalFees)}`}
                  />
                )}
                <DescList.Item
                  label="Parking status"
                  value={
                    <Badge
                      color={SessionStatusesBadge.get(data?.session?.status)?.color || 'grey'}
                      rounded="rounded"
                      className="uppercase">
                      {SessionStatusesBadge.get(data?.session?.status)?.text ||
                        data?.session?.status ||
                        '-'}
                    </Badge>
                  }
                />
                {/*<DescList.Item label="Parking type" value={`-`} />*/}
                <DescList.Item
                  label="Check in"
                  value={checkinAt && format(checkinAt, 'hh:mm aa')}
                />
                <DescList.Item
                  label="Check out"
                  value={checkoutAt ? format(checkoutAt, 'hh:mm aa') : '-'}
                />
                {data?.session?.status === SessionStatuses.COMPLETED && (
                  <DescList.Item
                    label="Duration"
                    value={
                      <div className="capitalize">
                        {checkoutAt && checkinAt ? formatDistance(checkinAt, checkoutAt) : '-'}
                      </div>
                    }
                  />
                )}
                {/*<DescList.Item label="Payment method" value={'-'} />*/}
                {/*<DescList.Item label="Tax invoice no." value={'-'} />*/}
                <DescList.Item label="Parking location name" value={data?.session?.locationName} />
                <DescList.Item
                  label="Parking location address"
                  value={data?.session?.locationAddress}
                />
                <DescList.Item label="Remark" value={'-'} />
              </DescList>
            </Card.Content>
          </Card>
        )}
        <JsonPanel defaultOpen allowToggleFormat defaultIsPretty json={data?.session} />
      </PageContainer>
    </>
  );
};
