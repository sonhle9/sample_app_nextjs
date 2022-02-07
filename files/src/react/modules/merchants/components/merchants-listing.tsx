import {
  Badge,
  Button,
  DataTable,
  DataTableCaption,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DotVerticalIcon,
  DropdownItem,
  DropdownMenu,
  DropdownMenuItems,
  Filter,
  FilterControls,
  formatDate,
  formatMoney,
  Modal,
  PaginationNavigation,
  PlusIcon,
  positionRight,
  TextEllipsis,
  UploadIcon,
} from '@setel/portal-ui';
import * as React from 'react';
import {BuckActionImportModal} from 'src/react/components/bulk-action-import-modal';
import {PageContainer} from 'src/react/components/page-container';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {EnterpriseNameEnum} from 'src/shared/enums/enterprise.enum';
import {merchantQueryKey} from '../merchants.queries';
import {getMerchants} from '../merchants.service';
import {Merchant} from '../merchants.type';
import {MerchantAdjustBalanceModal} from './merchant-adjust-balance-modal';
import {MerchantCreateModal} from './merchant-create-modal';
import {merchantTrans} from '../../../../shared/helpers/pdb.roles.type';
import {HasPermission} from '../../auth/HasPermission';
import {
  useMerchantTypeDetails,
  useMerchantTypes,
  useMerchantTypesUsed,
} from '../../merchant-types/merchant-types.queries';
import {
  computeMerchantAvailableBalance,
  computeMerchantPrepaidBalance,
  getMerchantStatusBadgeColor,
} from '../merchants.lib';
import {useNotification} from '../../../hooks/use-notification';
import {useRouter} from '../../../routing/routing.context';
import {IListingColumn} from '../../merchant-types/merchant-types.type';
import {
  ColumnNames,
  defaultAllMerchantsListingColumns,
  defaultMerchantsOfTypeListingColumns,
} from '../../merchant-types/merchant-types.constant';
import classNames from 'classnames';

interface IMerchantProps {
  typeCode?: string;
  typeName?: string;
  userEmail?: string;
}

export const MerchantListing = (props: IMerchantProps) => {
  const {typeCode, typeName} = props;
  const [columns, setColumns] = React.useState<IListingColumn[]>(
    typeCode ? defaultMerchantsOfTypeListingColumns : defaultAllMerchantsListingColumns,
  );
  const {data: merchantTypes} = useMerchantTypes();
  const {data: merchantTypesUsed} = useMerchantTypesUsed();
  const currentType = typeCode ? merchantTypes?.find((type) => type.code === typeCode) : undefined;
  const {data: currentTypeDetail} = useMerchantTypeDetails(currentType?.id);
  const currentTypeName = typeName || 'All merchants';
  const [isNoFilter, setIsNoFilter] = React.useState<boolean>(true);

  React.useEffect(() => {
    currentTypeDetail?.listingConfigurations?.length > 0 &&
      setColumns(currentTypeDetail.listingConfigurations);
  }, [currentTypeDetail]);

  const merchantTypesOptions = merchantTypesUsed
    ? merchantTypesUsed.map((types) => {
        return {
          label: types.name,
          value: types.code,
        };
      })
    : [];
  const {pagination, query, filter} = useDataTableState({
    initialFilter: {
      name: '',
      merchantTypes: '',
    },
    queryKey: typeCode
      ? `${merchantQueryKey.merchantTypeList}-${typeCode}`
      : merchantQueryKey.merchantList,
    queryFn: (filterValue) =>
      getMerchants({
        ...filterValue,
        merchantTypes: typeCode ? typeCode : filterValue.merchantTypes || undefined,
        name: filterValue.name.trim() ? filterValue.name.trim() : undefined,
      }),
    onChange: (newValue) => {
      setIsNoFilter(typeCode ? !newValue.name : !newValue.name && !newValue.merchantTypes);
    },
    components: !typeCode
      ? [
          {
            key: 'merchantTypes',
            type: 'select',
            props: {
              label: 'Type',
              options: [
                {
                  label: 'Any types',
                  value: '',
                },
                {
                  label: 'No type',
                  value: 'null',
                },
                ...merchantTypesOptions,
              ],
            },
          },
          {
            key: 'name',
            type: 'search',
            props: {
              label: 'Search',
              placeholder: 'Search merchant name',
              wrapperClass: 'xl:col-span-2',
            },
          },
        ]
      : [
          {
            key: 'name',
            type: 'search',
            props: {
              label: 'Search',
              placeholder: 'Search merchant name',
              wrapperClass: 'xl:col-span-2',
            },
          },
        ],
  });

  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showImportModal, setShowImportModal] = React.useState(false);
  const [merchantToAdjust, setMerchantToAdjust] = React.useState<Merchant | undefined>(undefined);

  const showCreateButton = !typeCode || currentType;
  const showMessage = useNotification();

  const isSetel = CURRENT_ENTERPRISE.name === EnterpriseNameEnum.SETEL;

  return (
    <PageContainer
      heading={currentTypeName}
      action={
        <div className="inline-flex space-x-3">
          {showCreateButton && (
            <Button
              onClick={() => setShowCreateModal(true)}
              variant="primary"
              leftIcon={<PlusIcon />}>
              CREATE
            </Button>
          )}
          {!typeCode && CURRENT_ENTERPRISE.name === EnterpriseNameEnum.PDB && (
            <HasPermission accessWith={[merchantTrans.bulk]}>
              <Button
                onClick={() => setShowImportModal(true)}
                variant="outline"
                rightIcon={<UploadIcon />}>
                IMPORT
              </Button>
            </HasPermission>
          )}
        </div>
      }>
      {showCreateModal && (
        <MerchantCreateModal
          onDone={() => {
            setShowCreateModal(false);
            showMessage({
              title: 'A new merchant has been added',
            });
          }}
          userEmail={props.userEmail}
          defaultType={currentType}
          onDismiss={() => setShowCreateModal(false)}
        />
      )}
      {showImportModal && (
        <Modal
          isOpen
          aria-label="Import merchant external top-up CSV"
          onDismiss={() => setShowImportModal(false)}>
          <BuckActionImportModal onDismiss={() => setShowImportModal(false)} withoutWrapper />
        </Modal>
      )}
      {merchantToAdjust && (
        <MerchantAdjustBalanceModal
          isOpen
          merchant={merchantToAdjust}
          onDismiss={() => setMerchantToAdjust(undefined)}
        />
      )}
      <div className="space-y-8">
        <FilterControls filter={filter} />
        <Filter filter={filter} />
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
              {columns.map((column, index) => {
                if (column.name === ColumnNames.adjustBalance) {
                  return isSetel ? <Td key={index} /> : null;
                }
                return (
                  <Td className={getColumnClasses(column.name)} key={index}>
                    {column.label}
                  </Td>
                );
              })}
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {query.data &&
              query.data.items.map((merchant) => (
                <MerchantRow
                  isSetel={isSetel}
                  typeCode={typeCode}
                  merchant={merchant}
                  onSelectForAdjustment={() => setMerchantToAdjust(merchant)}
                  columns={columns}
                  key={merchant.id}
                />
              ))}
          </DataTableRowGroup>
          <DataTableCaption>
            {query.data && !query.data.items.length && (
              <div className="w-full py-12 text-sm flex items-center justify-center">
                {showCreateButton && isNoFilter ? (
                  <div>
                    <p className={'mb-3'}>You have not created any merchant yet</p>
                    <div className={'flex items-center justify-center'}>
                      <Button
                        onClick={() => setShowCreateModal(true)}
                        variant="outline"
                        leftIcon={<PlusIcon />}>
                        CREATE
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>No merchant found</>
                )}
              </div>
            )}
          </DataTableCaption>
        </DataTable>
      </div>
    </PageContainer>
  );
};

const formatColumnValue = (columnName, merchant: Merchant) => {
  if (columnName === ColumnNames.name) {
    return (
      <TextEllipsis
        widthClass={'w-80'}
        text={
          merchant.legalName && merchant.legalName !== merchant.name
            ? `${merchant.name} (${merchant.legalName})`
            : merchant.name
        }
      />
    );
  }
  if (
    [
      ColumnNames.paymentsEnabled,
      ColumnNames.payoutEnabled,
      ColumnNames.settlementsEnabled,
    ].includes(columnName)
  ) {
    return merchant[columnName] ? 'Yes' : 'No';
  }
  if (columnName === ColumnNames.prepaidBalance) {
    return formatMoney(computeMerchantPrepaidBalance(merchant));
  }
  if (columnName === ColumnNames.availableBalance) {
    return formatMoney(computeMerchantAvailableBalance(merchant));
  }
  if (columnName === ColumnNames.status) {
    return merchant.status ? (
      <Badge color={getMerchantStatusBadgeColor(merchant.status)} className={'uppercase'}>
        {merchant.status}
      </Badge>
    ) : (
      '-'
    );
  }
  if (columnName === ColumnNames.createdAt) {
    return formatDate(merchant.createdAt);
  }
  if (columnName === ColumnNames.merchantType) {
    return merchant.merchantType.name;
  }
  if (columnName === ColumnNames.creditLimit) {
    return formatMoney(merchant.creditLimit || 0);
  }
  return merchant[columnName] || '-';
};

const getColumnClasses = (columnName: string): string => {
  switch (columnName) {
    case ColumnNames.availableBalance:
    case ColumnNames.prepaidBalance:
      return 'text-right';
    case ColumnNames.name:
      return 'text-left';
    default:
      return '';
  }
};

const MerchantRow = ({
  typeCode,
  merchant,
  isSetel,
  onSelectForAdjustment,
  columns,
}: {
  typeCode?: string;
  merchant: Merchant;
  isSetel?: boolean;
  onSelectForAdjustment: () => void;
  columns: IListingColumn[];
}) => {
  const router = useRouter();
  return (
    columns && (
      <Tr>
        {columns.map((column, index) => {
          if (column.name === ColumnNames.adjustBalance) {
            return isSetel ? (
              <Td key={index}>
                <DropdownMenu
                  variant="icon"
                  label={
                    <DotVerticalIcon className="w-4 h-4 text-lightgrey" aria-label="Action" />
                  }>
                  <DropdownMenuItems getPosition={positionRight}>
                    <DropdownItem onSelect={onSelectForAdjustment}>Adjust Balance</DropdownItem>
                  </DropdownMenuItems>
                </DropdownMenu>
              </Td>
            ) : null;
          }
          return (
            <Td
              key={index}
              className={classNames('cursor-pointer', getColumnClasses(column.name))}
              onClick={() =>
                router.navigateByUrl(
                  typeCode
                    ? `/merchants/types/${typeCode}/${merchant.id}`
                    : `/merchants/${merchant.id}`,
                )
              }>
              {formatColumnValue(column.name, merchant)}
            </Td>
          );
        })}
      </Tr>
    )
  );
};
