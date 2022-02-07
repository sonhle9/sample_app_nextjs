import {
  Badge,
  Button,
  Card,
  DataTable,
  DataTableCaption,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup as Tg,
  PaginationNavigation,
  PlusIcon,
  usePaginationState,
} from '@setel/portal-ui';
import {formatDate} from '@setel/web-utils';
import * as React from 'react';
import {useNotification} from '../../../hooks/use-notification';
import {useRouter} from '../../../routing/routing.context';
import {useSmartpayCompanyContactList} from '../companies.queries';
import {SmartpayCompanyContactModal} from './smartpay-company-contact-modal';

type CompanyContactListProps = {
  id: string;
};

export const CompanyContactList = (props: CompanyContactListProps) => {
  const {page, perPage, setPage, setPerPage} = usePaginationState();
  const {data, isFetching, isLoading} = useSmartpayCompanyContactList(props.id, {
    page,
    perPage,
  });

  const showMessage = useNotification();
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  const router = useRouter();

  return (
    <Card>
      <Card.Heading title={'Contact list'}>
        <Button
          variant={'outline'}
          leftIcon={<PlusIcon />}
          onClick={() => setShowCreateModal(true)}>
          CREATE
        </Button>
        {showCreateModal && (
          <SmartpayCompanyContactModal
            companyId={props.id}
            onDone={() => {
              setShowCreateModal(false);
              showMessage({
                title: 'Successfully',
                description: 'Contact has been successfully created.',
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
              <Td className={'pl-7'}>Contact name</Td>
              <Td className={'text-right'}>Mobile number</Td>
              <Td className={'text-left'}>Email address</Td>
              <Td className={'text-right'}>Created on</Td>
            </Tr>
          </Tg>
          <Tg>
            {data?.items.map((contact, index) => (
              <Tr
                key={index}
                onClick={() =>
                  router.navigateByUrl(`companies/${props.id}/smartpay-contact/${contact.id}`)
                }
                className={'cursor-pointer'}>
                <Td className={'pl-7'} style={{minWidth: '12rem'}}>
                  {contact.contactPerson}{' '}
                  {contact.isDefaultContact && (
                    <Badge
                      rounded="rounded"
                      color={'success'}
                      className="uppercase"
                      key={contact.id}>
                      {'default'}
                    </Badge>
                  )}
                </Td>
                <Td className={'w-72 text-right'}>{contact.mobilePhone}</Td>
                <Td className={'w-72 text-left'}>{contact.email}</Td>
                <Td className={'w-72 text-right'}>{formatDate(contact.createdAt)}</Td>
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
