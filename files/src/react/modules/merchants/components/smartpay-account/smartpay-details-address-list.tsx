import {
  Button,
  Card,
  DataTable,
  DataTableRowGroup,
  DataTableRow as Tr,
  DataTableCell as Td,
  PaginationNavigation,
  PlusIcon,
  formatDate,
  DataTableCaption,
} from '@setel/portal-ui';
import * as React from 'react';
import * as _ from 'lodash';
import {useNotification} from '../../../../hooks/use-notification';
import {useDataTableState} from '../../../../hooks/use-state-with-query-params';
import {getSmartpayAccountAddresses} from '../../merchants.service';
import {SmartpayAccountAddress} from '../../merchants.type';
import {merchantQueryKey} from '../../merchants.queries';
import {SmartpayDetailsAddressModal} from './smartpay-details-address-modal';
import {useRouter} from '../../../../routing/routing.context';
import {MerchantTypeCodes, SmartpayAccountTabs} from '../../../../../shared/enums/merchant.enum';

interface ISpaAddressProps {
  applicationId: string;
  merchantId: string;
}

export const SmartpayDetailsAddressList = (props: ISpaAddressProps) => {
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const setNotify = useNotification();
  const router = useRouter();

  const {pagination, query} = useDataTableState({
    initialFilter: {},
    queryKey: [merchantQueryKey.smartpayAddressesList, props.applicationId],
    queryFn: (pagingParam) => getSmartpayAccountAddresses(props.applicationId, pagingParam),
  });

  const type = props.merchantId ? 'merchant' : 'application';
  const id = props.merchantId ? props.merchantId : props.applicationId;

  return (
    <React.Fragment>
      <Card className="">
        <Card.Heading title="Address list">
          <Button
            variant="outline"
            leftIcon={<PlusIcon />}
            onClick={() => {
              setShowCreateModal(true);
            }}>
            CREATE
          </Button>
        </Card.Heading>
        <Card.Content className={'px-0 py-0'}>
          <DataTable
            isLoading={query.isLoading}
            isFetching={query.isFetching}
            pagination={
              <PaginationNavigation
                currentPage={pagination.page}
                perPage={pagination.perPage}
                total={query.data ? query.data.total : 0}
                onChangePage={pagination.setPage}
                onChangePageSize={pagination.setPerPage}
              />
            }>
            <DataTableRowGroup groupType="thead">
              <Tr>
                <Td className="pl-8">Address</Td>
                <Td>Type</Td>
                <Td>Main mailing indicator</Td>
                <Td className="text-right pr-8">Created on</Td>
              </Tr>
            </DataTableRowGroup>
            <DataTableRowGroup>
              {query.data &&
                query.data.items.map((address, index) => (
                  <Tr
                    key={index}
                    className="cursor-pointer"
                    onClick={() =>
                      router.navigateByUrl(
                        `/merchants/types/${MerchantTypeCodes.SMART_PAY_ACCOUNT}/${type}/${id}/${SmartpayAccountTabs.ADDRESS_LIST}/${address.id}`,
                      )
                    }>
                    <Td className="pl-8 whitespace-normal w-1/2">{fnAddressToString(address)}</Td>
                    <Td>{fnCodeToName(address.addressType)}</Td>
                    <Td>{address.mainMailingIndicator ? 'Yes' : 'No'}</Td>
                    <Td className="text-right pr-8">{formatDate(address.createdAt)}</Td>
                  </Tr>
                ))}
            </DataTableRowGroup>
            {query.data?.isEmpty && (
              <DataTableCaption>
                <div className="py-6">
                  <p className="text-center text-gray-400 text-sm">No address found</p>
                </div>
              </DataTableCaption>
            )}
          </DataTable>
        </Card.Content>
      </Card>
      {showCreateModal && (
        <SmartpayDetailsAddressModal
          appId={props.applicationId}
          onClose={(message) => {
            setShowCreateModal(false);
            message === 'success' &&
              setNotify({
                title: 'Successful!',
                variant: 'success',
                description: 'New address has been successfully created.',
              });
          }}
        />
      )}
    </React.Fragment>
  );
};

export const fnAddressToString = (address: SmartpayAccountAddress) => {
  address.state = fnCodeToName(address.state);
  address.country = fnCodeToName(address.country);
  const addressArr = [];
  const addressFieldKey = [
    'addressLine1',
    'addressLine2',
    'addressLine3',
    'addressLine4',
    'addressLine5',
    'city',
    'postcode',
    'state',
    'country',
  ];
  Object.entries(address).forEach((pair) => {
    if (addressFieldKey.includes(pair[0])) {
      addressArr.push(pair[1]);
    }
  });
  return addressArr.filter(Boolean).join(', ');
};

export const fnCodeToName = (str: string) => {
  return _.isString(str)
    ? (str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()).split('_').join(' ')
    : str;
};
