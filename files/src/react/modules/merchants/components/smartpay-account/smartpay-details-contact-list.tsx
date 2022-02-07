import {
  Card,
  Button,
  PlusIcon,
  DataTable,
  PaginationNavigation,
  DataTableRowGroup,
  DataTableRow as Tr,
  DataTableCell as Td,
  DataTableCaption,
  Badge,
  formatDate,
} from '@setel/portal-ui';
import * as React from 'react';
import {MerchantTypeCodes, SmartpayAccountTabs} from '../../../../../shared/enums/merchant.enum';
import {useNotification} from '../../../../hooks/use-notification';
import {useDataTableState} from '../../../../hooks/use-state-with-query-params';
import {useRouter} from '../../../../routing/routing.context';
import {merchantQueryKey} from '../../merchants.queries';
import {getSmartpayAccountContacts} from '../../merchants.service';
import {SmartpayDetailsContactModal} from './smartpay-details-contact-modal';

interface ISpaContactProps {
  applicationId: string;
  merchantId: string;
}

export const SmartpayDetailsContactList = (props: ISpaContactProps) => {
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const setNotify = useNotification();
  const router = useRouter();

  const {pagination, query} = useDataTableState({
    initialFilter: {},
    queryKey: [merchantQueryKey.smartpayContactsList, props.applicationId],
    queryFn: (pagingParam) => getSmartpayAccountContacts(props.applicationId, pagingParam),
  });

  const type = props.merchantId ? 'merchant' : 'application';
  const id = props.merchantId ? props.merchantId : props.applicationId;

  return (
    <React.Fragment>
      <Card className="">
        <Card.Heading title="Contact list">
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
                <Td className="pl-8">Contact name</Td>
                <Td className="text-right">Mobile number</Td>
                <Td>Email address</Td>
                <Td className="text-right pr-8">Created on</Td>
              </Tr>
            </DataTableRowGroup>
            <DataTableRowGroup>
              {query.data &&
                query.data.items.map((contact, index) => (
                  <Tr
                    key={index}
                    className="cursor-pointer"
                    onClick={() =>
                      router.navigateByUrl(
                        `/merchants/types/${MerchantTypeCodes.SMART_PAY_ACCOUNT}/${type}/${id}/${SmartpayAccountTabs.CONTACT_LIST}/${contact.id}`,
                      )
                    }>
                    <Td className="pl-8">
                      {contact.contactPerson}
                      <span>{renderDefaultBadge(contact.default)}</span>
                    </Td>
                    <Td className="text-right">{contact.mobilePhone}</Td>
                    <Td>{contact.email}</Td>
                    <Td className="text-right pr-8">{formatDate(contact.createdAt)}</Td>
                  </Tr>
                ))}
            </DataTableRowGroup>
            {query.data?.isEmpty && (
              <DataTableCaption>
                <div className="py-6">
                  <p className="text-center text-gray-400 text-sm">No contact found</p>
                </div>
              </DataTableCaption>
            )}
          </DataTable>
        </Card.Content>
      </Card>
      {showCreateModal && (
        <SmartpayDetailsContactModal
          appId={props.applicationId}
          onClose={(message) => {
            setShowCreateModal(false);
            message === 'success' &&
              setNotify({
                title: 'Successful!',
                variant: 'success',
                description: 'New contact has been successfully created.',
              });
          }}
        />
      )}
    </React.Fragment>
  );
};

export const renderDefaultBadge = (isDefault: boolean) => {
  return isDefault ? (
    <Badge className="uppercase ml-2" color="success" rounded="rounded">
      DEFAULT
    </Badge>
  ) : (
    ''
  );
};
