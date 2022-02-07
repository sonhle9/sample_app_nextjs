import * as React from 'react';
import {
  Badge,
  Button,
  classes,
  DataTable,
  DataTableCaption,
  DataTableCell as Td,
  DataTableExpandableGroup as ExpandGroup,
  DataTableExpandableRow as ExpandableRow,
  DataTableExpandButton as ExpandButton,
  DataTableRow as Tr,
  DataTableRowGroup,
  DescItem,
  DescList,
  FilterControls,
  formatDate,
  PaginationNavigation,
  PlusIcon,
} from '@setel/portal-ui';
import {useDataTableState} from '../../../hooks/use-state-with-query-params';
import {merchantQueryKey} from '../../merchants/merchants.queries';
import {QueryErrorAlert} from '../../../components/query-error-alert';
import {getMerchantLinks} from '../merchant-links.service';
import {MerchantLinkModal} from './merchant-link-modal';
import {MerchantLinkEnterpriseOptions} from '../merchant-links.constant';
import {useRouter} from '../../../routing/routing.context';
import {useNotification} from 'src/react/hooks/use-notification';

export const MerchantLinkListing = () => {
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const router = useRouter();
  const showNotify = useNotification();
  const {
    pagination,
    query: {data, isLoading, isFetching, error},
    filter,
  } = useDataTableState({
    initialFilter: {
      searchBy: '',
      searchValue: '',
    },
    queryKey: merchantQueryKey.merchantLinkListing,
    queryFn: (filterValue) =>
      getMerchantLinks({
        ...filterValue,
        searchValue: filterValue.searchValue.trim() ? filterValue.searchValue.trim() : undefined,
        searchBy: filterValue.searchBy === 'name' ? 'merchantName' : 'merchantId',
      }),
    components: (filterValue) => [
      {
        key: 'searchBy',
        type: 'select',
        props: {
          placeholder: 'Please select',
          label: 'Search by',
          options: [
            {
              label: 'Merchant name',
              value: 'name',
            },
            {
              label: 'Merchant ID',
              value: 'ID',
            },
          ],
        },
      },
      {
        key: 'searchValue',
        type: 'search',
        props: {
          placeholder: filterValue.searchBy ? `Enter merchant ${filterValue.searchBy}` : '',
          wrapperClass: 'xl:col-span-2',
          disabled: !filterValue.searchBy,
        },
      },
    ],
  });

  return (
    <div className="grid gap-4 pt-10 max-w-6xl mx-auto px-4 sm:px-6  pb-12">
      <div className="flex justify-between">
        <h1 className={classes.h1}>Merchant links</h1>
        <Button leftIcon={<PlusIcon />} variant="primary" onClick={() => setShowCreateModal(true)}>
          CREATE
        </Button>
      </div>
      <div>
        <FilterControls filter={filter} className={'mb-5'} />
        {error && <QueryErrorAlert error={error as any} />}
        <DataTable
          striped
          native
          isLoading={isLoading}
          isFetching={isFetching}
          pagination={
            <PaginationNavigation
              currentPage={pagination.page}
              perPage={pagination.perPage}
              total={data ? data.total : 0}
              onChangePage={pagination.setPage}
              onChangePageSize={pagination.setPerPage}
            />
          }>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td>Merchant name</Td>
              <Td>Linked enterprise</Td>
              <Td className="text-right">Total linked merchants</Td>
              <Td className="text-right">Last updated on</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {data?.items.map((link) => (
              <ExpandGroup key={link.id}>
                <Tr>
                  <Td
                    className={'cursor-pointer'}
                    onClick={() => router.navigateByUrl(`/merchant-links/${link.id}`)}>
                    <ExpandButton onClick={(e) => e.stopPropagation()} />
                    {link.merchantName}
                  </Td>
                  <Td
                    className={'cursor-pointer'}
                    onClick={() => router.navigateByUrl(`/merchant-links/${link.id}`)}>
                    {
                      MerchantLinkEnterpriseOptions.find(
                        (ent) => ent.value === link.enterpriseToLink,
                      )?.label
                    }
                  </Td>
                  <Td
                    className="text-right cursor-pointer"
                    onClick={() => router.navigateByUrl(`/merchant-links/${link.id}`)}>
                    {link.linkedMerchants.length ? link.linkedMerchants.length - 1 : ''}
                  </Td>
                  <Td
                    className="text-right cursor-pointer"
                    onClick={() => router.navigateByUrl(`/merchant-links/${link.id}`)}>
                    {formatDate(link.updatedAt, {
                      formatType: 'dateAndTime',
                    })}
                  </Td>
                </Tr>
                <ExpandableRow>
                  <DescList>
                    <DescItem
                      label={'Linked merchants'}
                      value={link.linkedMerchants
                        .filter((lm) => lm.merchantId !== link.merchantId)
                        .map((linkedMerchant) => (
                          <Badge
                            rounded={'full'}
                            key={linkedMerchant.merchantId}
                            color={'grey'}
                            className={'mr-2 mb-2'}>
                            <span className={'font-normal text-sm text-mediumgrey'}>
                              {linkedMerchant.merchantName}
                            </span>
                          </Badge>
                        ))}
                    />
                  </DescList>
                </ExpandableRow>
              </ExpandGroup>
            ))}
          </DataTableRowGroup>
          {data?.isEmpty && (
            <DataTableCaption>
              <div className="py-6">
                <p className="text-center text-gray-400 text-sm">
                  You have no data to be displayed here
                </p>
              </div>
            </DataTableCaption>
          )}
        </DataTable>
      </div>
      {showCreateModal && (
        <MerchantLinkModal
          onDismiss={() => {
            setShowCreateModal(false);
          }}
          onDone={() => {
            showNotify({
              variant: 'success',
              title: 'Success!',
              description: 'You have successfully created your merchant link',
            });
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
};
