import {
  Alert,
  Badge,
  Button,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DropdownSelect,
  FieldContainer,
  Filter,
  FilterControls,
  Modal,
  ModalHeader,
  PaginationNavigation,
  PlusIcon,
  SearchTextInput,
  titleCase,
  useFilter,
  usePaginationState,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {Link} from 'src/react/routing/link';
import {
  GeneralLedgerParameterStatus,
  SearchBy,
  SEARCH_BY,
} from 'src/react/services/api-ledger.type';
import {useGLParameters} from '../general-ledger.queries';
import {GeneralLedgerParameterForm} from './general-ledger-parameter-form';

export const GeneralLedgerParameterListing = () => {
  const [searchBy, setSearchBy] = React.useState<SearchBy>(SEARCH_BY[0]);
  const [{values, applied}, {setValueCurry, reset}] = useFilter({
    searchKey: '',
    status: 'active' as GeneralLedgerParameterStatus,
  });

  const pagination = usePaginationState();
  const {
    data: resolvedData,
    isLoading,
    isError,
  } = useGLParameters({
    page: pagination.page,
    perPage: pagination.perPage,
    searchBy: (values.searchKey ? searchBy : '') as SearchBy,
    searchKey: values.searchKey,
    status: values.status,
  });

  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const dismissCreateForm = () => setShowCreateForm(false);

  return (
    <PageContainer
      heading="General ledger codes"
      action={
        <Button leftIcon={<PlusIcon />} onClick={() => setShowCreateForm(true)} variant="primary">
          CREATE
        </Button>
      }>
      <Modal
        isOpen={showCreateForm}
        aria-label="Create new general ledger codes"
        onDismiss={dismissCreateForm}>
        <ModalHeader>Create new general ledger codes</ModalHeader>
        <GeneralLedgerParameterForm onSuccess={dismissCreateForm} onCancel={dismissCreateForm} />
      </Modal>
      <div className="mb-8 space-y-8">
        <FilterControls>
          <FieldContainer label="Search by" layout="vertical">
            <DropdownSelect
              value={searchBy}
              onChangeValue={(val) => setSearchBy(val as SearchBy)}
              options={FILTER_OPTIONS}
              data-testid="search-by-filter"
            />
          </FieldContainer>
          <FieldContainer label="Status" layout="vertical">
            <DropdownSelect
              value={values.status}
              onChangeValue={setValueCurry('status')}
              options={STATUS_OPTIONS}
              data-testid="status-filter"
            />
          </FieldContainer>
          <FieldContainer className="sm:col-span-2">
            <SearchTextInput value={values.searchKey} onChangeValue={setValueCurry('searchKey')} />
          </FieldContainer>
        </FilterControls>
        {applied.length > 0 && (
          <Filter onReset={reset}>
            {applied.map((item) => (
              <Badge onDismiss={item.resetValue} key={item.prop}>
                {item.label}
              </Badge>
            ))}
          </Filter>
        )}
      </div>
      {isError ? (
        <Alert variant="error" className="mb-8" description="Failed to load data" />
      ) : (
        <DataTable
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
              <Td>GL Profile</Td>
              <Td>Transaction Type</Td>
              <Td>Debit GL Code</Td>
              <Td>Credit GL Code</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {resolvedData &&
              resolvedData.items.map((parameter) => (
                <Tr
                  key={parameter.id}
                  render={(props) => (
                    <Link
                      to={`/general-ledger/${parameter.id}`}
                      data-testid="gl-code-record"
                      {...props}
                    />
                  )}>
                  <Td>{titleCase(parameter.GLProfile, {hasUnderscore: true})}</Td>
                  <Td>{parameter.transactionType}</Td>
                  <Td>{parameter.debit.GLCode}</Td>
                  <Td>{parameter.credit.GLCode}</Td>
                </Tr>
              ))}
          </DataTableRowGroup>
        </DataTable>
      )}
    </PageContainer>
  );
};

const FILTER_OPTIONS = [
  {
    value: 'GLProfile',
    label: 'GL Profile',
  },
  {
    value: 'transactionType',
    label: 'Transaction Type',
  },
  {
    value: 'GLCode',
    label: 'GL Code',
  },
];

const STATUS_OPTIONS = [
  {
    label: 'All',
    value: '' as any,
  },
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Disabled',
    value: 'disabled',
  },
];
