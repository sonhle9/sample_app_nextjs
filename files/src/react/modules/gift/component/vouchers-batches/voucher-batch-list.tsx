import {
  Alert,
  Button,
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
  DotVerticalIcon,
  DropdownMenu as Menu,
  Filter,
  FilterControls,
  formatDate,
  PaginationNavigation,
  PlusIcon,
} from '@setel/portal-ui';
import React, {useState} from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {ModeType} from '../../../voucher-report/shared/voucher.constants';
import {CACHE_KEYS, useCloneVoucher} from '../../voucher-batch.query';
import {getVouchersBatches} from '../../voucher-batch.service';
import {VoucherBatchEditModal} from './voucher-batch-edit-modal';
import {useRouter} from 'src/react/routing/routing.context';
import {
  VoucherBatchSection,
  VoucherBatchStatus,
  VoucherRedeemType,
} from '../../shared/gift-voucher.constant';
import {useDownloadVoucherBatch} from '../../shared/use-download-voucher-batch';

export const VoucherBatchList = () => {
  const [visibleAddVoucherModal, setVisibleAddVoucherModal] = useState(false);
  const router = useRouter();
  const downloadVoucherBatch = useDownloadVoucherBatch();
  const {mutate: cloneVoucher} = useCloneVoucher();

  const {
    query: {data: resolvedData, isError, isLoading},
    filter,
    pagination,
  } = useDataTableState({
    initialFilter: {
      startDate: ['', ''] as [string, string],
      expiryDate: ['', ''] as [string, string],
      status: '',
      type: '',
      name: '',
    },
    queryKey: CACHE_KEYS.VoucherBatchList,
    queryFn: (currentValues) => {
      const {
        startDate: [startDateFrom, startDateTo],
        expiryDate: [expiryDateFrom, expiryDateTo],
        ...filter
      } = currentValues;
      return getVouchersBatches({
        startDateFrom,
        startDateTo,
        expiryDateFrom,
        expiryDateTo,
        ...filter,
      });
    },
    components: () => [
      {
        key: 'status',
        type: 'select',
        props: {
          options: STATUS_OPTIONS,
          label: 'Status',
        },
      },
      {
        key: 'type',
        type: 'select',
        props: {
          options: TYPE_OPTIONS,
          label: 'Type',
        },
      },
      {
        key: 'startDate',
        type: 'daterange',
        props: {
          label: 'Start date',
        },
      },
      {
        key: 'expiryDate',
        type: 'daterange',
        props: {
          label: 'Expiry date',
        },
      },
      {
        key: 'name',
        type: 'search',
        props: {
          placeholder: 'Search voucher name',
          wrapperClass: 'md:col-span-2',
        },
      },
    ],
  });

  const editVoucherBatch = (batchId: string) => {
    router.navigateByUrl(`/gifts/voucher-batches/details/${batchId}`);
  };

  return (
    <PageContainer
      heading="Vouchers Batches"
      action={
        <Button
          onClick={() => setVisibleAddVoucherModal(true)}
          variant="outline"
          leftIcon={<PlusIcon />}>
          ADD NEW VOUCHER BATCH
        </Button>
      }>
      <div className="my-8 space-y-8">
        <FilterControls filter={filter} />
        <Filter filter={filter} />
      </div>
      {isError ? (
        <Alert variant="error" className="mb-8" description="Failed to load data" />
      ) : (
        <DataTable
          native
          isLoading={isLoading}
          pagination={
            resolvedData && (
              <PaginationNavigation
                total={resolvedData.total}
                currentPage={pagination.page}
                perPage={pagination.perPage}
                onChangePage={pagination.setPage}
                onChangePageSize={pagination.setPerPage}
              />
            )
          }>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td>Name</Td>
              <Td>Start date</Td>
              <Td>Expiry Date</Td>
              <Td>Voucher count</Td>
              <Td>Type</Td>
              <Td></Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {resolvedData &&
              resolvedData.items.map((voucher, index) => (
                <ExpandGroup key={index}>
                  <Tr data-testid={voucher.name}>
                    <Td>
                      <ExpandButton />
                      {voucher.name}
                    </Td>
                    <Td>{voucher.startDate && formatDate(voucher.startDate)}</Td>
                    <Td>{voucher.expiryDate && formatDate(voucher.expiryDate)}</Td>
                    <Td>{voucher.vouchersCount}</Td>
                    <Td>{voucher.redeemType}</Td>
                    <Td>
                      <Menu
                        variant="icon"
                        data-testid="action-menu"
                        label={
                          <>
                            <span className="sr-only">Menu</span>
                            <DotVerticalIcon className="w-5 h-5 text-lightgrey" />
                          </>
                        }>
                        <Menu.Items className="min-w-32">
                          <Menu.Item
                            onSelect={() => {
                              editVoucherBatch(voucher._id);
                            }}>
                            Edit
                          </Menu.Item>
                          <Menu.Item
                            onSelect={() => {
                              cloneVoucher(voucher);
                            }}>
                            Clone
                          </Menu.Item>
                          <Menu.Item
                            onSelect={() => {
                              downloadVoucherBatch(voucher.name, voucher._id);
                            }}>
                            Download CSV
                          </Menu.Item>
                        </Menu.Items>
                      </Menu>
                    </Td>
                  </Tr>
                  <ExpandableRow>
                    <DescList>
                      <DescItem label="Issued" value={'-'} />
                      <DescItem label="Granted" value={'-'} />
                      <DescItem label="Redeemed" value={'-'} />
                      <DescItem label="Expired" value={'-'} />
                      <DescItem label="Voided" value={'-'} />
                    </DescList>
                  </ExpandableRow>
                </ExpandGroup>
              ))}
          </DataTableRowGroup>
          {resolvedData && !resolvedData.items.length && (
            <DataTableCaption>
              <div className="py-5">
                <div className="text-center py-5 text-md">
                  <p className="font-normal">You have no data to be displayed here</p>
                </div>
              </div>
            </DataTableCaption>
          )}
        </DataTable>
      )}
      {visibleAddVoucherModal && (
        <VoucherBatchEditModal
          modeType={ModeType.Add}
          section={VoucherBatchSection.general}
          onClose={() => setVisibleAddVoucherModal(false)}
        />
      )}
    </PageContainer>
  );
};

const STATUS_OPTIONS = [
  {
    label: 'All statuses',
    value: '',
  },
  ...Object.keys(VoucherBatchStatus).map((key) => ({
    label: VoucherBatchStatus[key],
    value: key,
  })),
];

const TYPE_OPTIONS = [
  {
    label: 'All type',
    value: '',
  },
  ...Object.keys(VoucherRedeemType).map((key) => ({
    label: VoucherRedeemType[key],
    value: key,
  })),
];
