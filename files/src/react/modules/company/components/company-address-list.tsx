import {
  Button,
  Card,
  DataTable,
  DataTableCaption,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup as Tg,
  PaginationNavigation,
  PlusIcon,
  titleCase,
  usePaginationState,
} from '@setel/portal-ui';
import {formatDate} from '@setel/web-utils';
import * as React from 'react';
import {useNotification} from '../../../hooks/use-notification';
import {useRouter} from '../../../routing/routing.context';
import {useSmartpayCompanyAddressList} from '../companies.queries';
import {SmartpayCompanyAddress, smartpayCompanyAddressTypeOptions} from '../companies.type';
import {SmartpayCompanyAddressModal} from './smartpay-company-address-modal';

type CompanyAddressListProps = {
  id: string;
};

export const CompanyAddressList = (props: CompanyAddressListProps) => {
  const {page, perPage, setPage, setPerPage} = usePaginationState();
  const {data, isFetching, isLoading} = useSmartpayCompanyAddressList(props.id, {
    page,
    perPage,
  });

  const showMessage = useNotification();
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  const router = useRouter();

  const getAddressString = (address: SmartpayCompanyAddress): string => {
    let addressString = [];
    const fieldNames = ['addressLine1', 'city', 'postcode', 'state', 'country'];
    fieldNames.forEach((f) => {
      if (address[f]) {
        if (f === 'state' || f === 'country') {
          addressString.push(titleCase(address[f]));
        } else {
          addressString.push(address[f]);
        }
      }
    });
    return addressString.join(', ');
  };

  return (
    <Card>
      <Card.Heading title={'Address list'}>
        <Button
          variant={'outline'}
          leftIcon={<PlusIcon />}
          onClick={() => setShowCreateModal(true)}>
          CREATE
        </Button>
        {showCreateModal && (
          <SmartpayCompanyAddressModal
            companyId={props.id}
            onDone={() => {
              setShowCreateModal(false);
              showMessage({
                title: 'Successful!',
                description: 'New address has been created.',
              });
            }}
            onClose={() => setShowCreateModal(false)}
          />
        )}
      </Card.Heading>
      <Card.Content className={'p-0'}>
        <DataTable
          isLoading={isLoading}
          isFetching={isFetching}
          pagination={
            <PaginationNavigation
              currentPage={page}
              perPage={perPage}
              total={data ? data.total : 0}
              onChangePage={setPage}
              onChangePageSize={setPerPage}
            />
          }>
          <Tg groupType={'thead'}>
            <Tr>
              <Td className={'pl-7'}>Address</Td>
              <Td>Type</Td>
              <Td>Main mailing indicator</Td>
              <Td className={'text-right pr-7'}>Created on</Td>
            </Tr>
          </Tg>
          <Tg>
            {data?.items.map((address, index) => (
              <Tr
                key={index}
                onClick={() =>
                  router.navigateByUrl(`companies/${props.id}/smartpay-address/${address.id}`)
                }
                className={'cursor-pointer'}>
                <Td className={'pl-7'}>{getAddressString(address)}</Td>
                <Td className={'w-72'}>
                  {
                    smartpayCompanyAddressTypeOptions.find(
                      (type) => type.value === address.addressType,
                    )?.label
                  }
                </Td>
                <Td className={'w-72'}>{address.mainMailingIndicator ? 'Yes' : 'No'}</Td>
                <Td className={'w-72 text-right pr-7'}>{formatDate(address.createdAt)}</Td>
              </Tr>
            ))}
          </Tg>
          {data?.items.length === 0 && (
            <DataTableCaption>
              <div className="w-full flex items-center justify-center py-9 text-sm text-gray-400">
                No data available.
              </div>
            </DataTableCaption>
          )}
        </DataTable>
      </Card.Content>
    </Card>
  );
};
