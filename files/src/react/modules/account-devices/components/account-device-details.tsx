import {
  JsonPanel,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  formatDate,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {Link} from 'src/react/routing/link';
import {useAccountDeviceDetails} from '../account-device.query';

interface IAccountDeviceDetailsProps {
  id: string;
}

export const AccountDeviceDetails = (props: IAccountDeviceDetailsProps) => {
  const {data} = useAccountDeviceDetails(props.id);
  return (
    <PageContainer heading={`Account device details - ${props.id}`}>
      <JsonPanel defaultOpen allowToggleFormat json={data?.device as any} />
      {data?.users && (
        <div className="mt-8">
          <DataTable>
            <DataTableRowGroup groupType="thead">
              <Tr>
                <Td>Full name</Td>
                <Td>Phone</Td>
                <Td>Email</Td>
                <Td>Created At</Td>
              </Tr>
            </DataTableRowGroup>
            <DataTableRowGroup>
              {data?.users.map((user, index) => (
                <Tr key={index} render={(props) => <Link {...props} to={`accounts/${user.id}`} />}>
                  <Td>{user.fullName}</Td>
                  <Td>{user.username}</Td>
                  <Td>{user.email}</Td>
                  <Td>{formatDate(user.createdAt)}</Td>
                </Tr>
              ))}
            </DataTableRowGroup>
          </DataTable>
        </div>
      )}
    </PageContainer>
  );
};
