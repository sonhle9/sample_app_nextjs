import {
  Badge,
  CardHeading,
  DataTable as Table,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  usePaginationState,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {Link} from 'src/react/routing/link';
import {useWaitingAreas} from '../../waiting-areas/waiting-areas.queries';
import {WaitingAreaStatus} from '../../waiting-areas/waiting-areas.types';
import {useStore} from '../stores.queries';
import {getWaitingAreaStatusColor} from '../../waiting-areas/waiting-areas.helper';

export interface IShopOnlyProps {
  storeId: string;
}

function WaitingAreaNameTd(props: {name: string; id: string}) {
  return (
    <Td>
      <Link to={`/waiting-areas/${props.id}`}>{props.name}</Link>
    </Td>
  );
}

function getWaitingAreaAvailability(status: WaitingAreaStatus) {
  switch (status) {
    case WaitingAreaStatus.ON:
      return 'ACTIVE';
    case WaitingAreaStatus.OFF:
      return 'NOT AVAILABLE';
  }
}

function WaitingAreaStatusTd(props: {status: WaitingAreaStatus}) {
  return (
    <Td className="w-3/12">
      <Badge
        size="small"
        rounded="rounded"
        color={getWaitingAreaStatusColor(props.status)}
        className="uppercase tracking-wider">
        {getWaitingAreaAvailability(props.status)}
      </Badge>
    </Td>
  );
}

export function ShopOnly({storeId}: IShopOnlyProps) {
  const {data: store} = useStore(storeId);
  const pagination = usePaginationState();
  const {data: waitingAreas, isLoading} = useWaitingAreas(
    {perPage: pagination.perPage, page: pagination.page},
    {query: store?.stationId || store?.stationName},
  );

  return (
    <PageContainer>
      <div data-testid="waiting-area-store">
        <Table heading={<CardHeading title={'Waiting areas'}></CardHeading>} isLoading={isLoading}>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td className="text-left">Area Name</Td>
              <Td className="w-3/12">Status</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup groupType="tbody">
            {waitingAreas?.items?.map((waitingArea) => (
              <Tr key={waitingArea.id}>
                <WaitingAreaNameTd name={waitingArea.name} id={waitingArea.id}></WaitingAreaNameTd>
                <WaitingAreaStatusTd status={waitingArea.status}></WaitingAreaStatusTd>
              </Tr>
            ))}
          </DataTableRowGroup>
        </Table>
      </div>
    </PageContainer>
  );
}
