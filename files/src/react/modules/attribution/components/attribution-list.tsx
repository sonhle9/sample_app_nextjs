import {
  Alert,
  AlertMessages,
  Badge,
  Button,
  Card,
  CardContent,
  DataTable as Table,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DropdownSelectField,
  Filter,
  PaginationNavigation,
  TextField,
  usePaginationState,
} from '@setel/portal-ui';
import * as React from 'react';
import dateFormat from 'date-fns/format';
import {useFormik} from 'formik';
import {PageContainer} from 'src/react/components/page-container';
import {AttributionCreate} from './attribution-create';
import {ATTR_RULE_SOURCE_LABELS, ATTR_RULE_TYPE_LABELS, findLabel} from '../const';
import {IAttributeFilter, IAttributeRuleReadOnly} from '../types';
import {useAttributionRuleList} from '../attribution.queries';
import {AttributionUpload} from './attribution-upload';
import {Link} from 'src/react/routing/link';
import {IPaginationResult} from 'src/react/lib/ajax';
import {QueryObserverResult} from 'react-query';
import {attributionRoles} from '../../../../shared/helpers/roles.type';
import {HasPermission} from '../../auth/HasPermission';

interface AttributionRuleHeader {
  header: React.ReactNode;
  accessor: (data: IAttributeRuleReadOnly) => React.ReactNode;
  className?: string;
}

const ATTR_RULE_TABLE_HEADERS: AttributionRuleHeader[] = [
  {
    header: 'TYPE',
    accessor: (d) => (
      <div className={'inline-block w-32 truncate'}>{findLabel(d.type, 'type')}</div>
    ),
  },
  {
    header: 'REF. ID',
    accessor: (d) => <span className={'inline-block w-32 truncate'}>{d.referenceId}</span>,
  },
  {
    header: 'REF. SOURCE',
    accessor: (d) => findLabel(d.referenceSource, 'referenceSource'),
  },
  {
    header: 'METADATA',
    accessor: (d) =>
      d.metadata.map((metadata) => (
        <div key={metadata.key}>{`${metadata.key} = ${metadata.value}`}</div>
      )),
  },
  {
    header: 'CREATED ON',
    accessor: (d) => dateFormat(new Date(d.createdAt), 'd MMM yyyy, p'),
    className: 'text-right',
  },
];

function getFilterList(filters: IAttributeFilter) {
  return Object.entries(filters)
    .map(([key, value]: [keyof IAttributeFilter, string]) => {
      if (!value) {
        return null;
      }
      const label = findLabel(value, key);
      return {
        key,
        value,
        label,
      };
    })
    .filter(Boolean);
}

function AttributionListFilter(props: {
  onSearch: (values: IAttributeFilter) => void;
  currentFilters: IAttributeFilter;
}) {
  const {currentFilters} = props;
  const formik = useFormik({
    initialValues: {
      searchQuery: '',
      type: '',
      referenceSource: '',
    },
    onSubmit: (values) => {
      props.onSearch(values);
    },
  });

  return (
    <>
      <Card>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="flex items-center space-x-3 w-100">
            <TextField
              wrapperClass="flex-grow"
              label={'Search'}
              placeholder={'Search for reference ID or metadata'}
              name={'searchQuery'}
              value={formik.values.searchQuery}
              onChange={formik.handleChange}
              data-testid="txt-query"
            />
            <DropdownSelectField
              wrapperClass="flex-grow"
              label={'Type'}
              name={'type'}
              value={formik.values.type}
              onChangeValue={(value) => formik.setFieldValue('type', value)}
              options={Object.entries(ATTR_RULE_TYPE_LABELS).map(([key, label]) => ({
                label,
                value: key,
              }))}
              placeholder={'All'}
              data-testid="dd-type"
            />
            <DropdownSelectField
              wrapperClass="flex-grow"
              label={'Reference Source'}
              name={'referenceSource'}
              value={formik.values.referenceSource}
              onChangeValue={(value) => formik.setFieldValue('referenceSource', value)}
              options={Object.entries(ATTR_RULE_SOURCE_LABELS).map(([key, label]) => ({
                label,
                value: key,
              }))}
              placeholder={'All'}
              data-testid="dd-source"
            />
            <Button variant="primary" type="submit" data-testid="btn-search">
              SEARCH
            </Button>
          </form>
        </CardContent>
      </Card>
      {currentFilters && Object.values(currentFilters).some(Boolean) && (
        <Filter
          className="px-3"
          onReset={() => {
            formik.resetForm();
            formik.submitForm();
          }}>
          {getFilterList(currentFilters).map(({key, label}) => (
            <Badge
              onDismiss={() => {
                formik.setFieldValue(key, '');
                formik.submitForm();
              }}
              key={key}>
              {label}
            </Badge>
          ))}
        </Filter>
      )}
    </>
  );
}

interface IPaginationState {
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  page: number;
  perPage: number;
}
function PaginatedAttributionList(props: {
  filters: IAttributeFilter;
  pagination: IPaginationState;
  attributionRuleList: QueryObserverResult<IPaginationResult<IAttributeRuleReadOnly>, unknown>;
}) {
  const {page, perPage, setPage, setPerPage} = props.pagination;
  const {
    data: {items = [], total = 0} = {},
    isLoading,
    isSuccess,
    isError,
    error,
  } = props.attributionRuleList;
  return (
    <>
      {isError && (
        <Alert variant="error" description="Something went wrong">
          <AlertMessages messages={[String(error)]} />
        </Alert>
      )}
      <Card>
        <div className="overflow-x-auto">
          <Table type="secondary" isLoading={isLoading}>
            <DataTableRowGroup groupType="thead">
              <Tr>
                {ATTR_RULE_TABLE_HEADERS.map(({header, className}, index) => (
                  <Td key={index} className={className}>
                    {header}
                  </Td>
                ))}
              </Tr>
            </DataTableRowGroup>
            <DataTableRowGroup>
              {items.map((item, itemIndex) => (
                <Tr key={itemIndex}>
                  {ATTR_RULE_TABLE_HEADERS.map(({accessor, className}, headerIndex) => (
                    <Td key={headerIndex} className={className}>
                      <Link to={`attribution/attribution-rules/${item.referenceId}`}>
                        {accessor(item)}
                      </Link>
                    </Td>
                  ))}
                </Tr>
              ))}
            </DataTableRowGroup>
          </Table>
        </div>
        {items.length === 0 && !isLoading ? (
          <div className="h-64 w-full flex items-center justify-center text-lightgrey">
            <div>
              {isSuccess && (
                <span>
                  {'No results'}
                  <strong>
                    {getFilterList(props.filters)
                      .map(({label}, index) => `${index === 0 ? ' for ' : ''}${label}`)
                      .join(', ')}
                  </strong>
                </span>
              )}
            </div>
          </div>
        ) : (
          <PaginationNavigation
            className="p-4"
            total={total}
            currentPage={page}
            perPage={perPage}
            onChangePage={setPage}
            onChangePageSize={setPerPage}
          />
        )}
      </Card>
    </>
  );
}

export function AttributionList() {
  const [filters, setFilters] = React.useState<IAttributeFilter>({});
  const pagination = usePaginationState();
  const {page, perPage} = pagination;
  const attributionRuleList = useAttributionRuleList({page, perPage}, filters);

  const onSearch = (newFilters: IAttributeFilter) => {
    setFilters(newFilters);
    pagination.setPage(1);
  };

  return (
    <PageContainer
      heading={'Attribution rules'}
      className={'space-y-4'}
      action={
        <div className="flex items-center space-x-3">
          <HasPermission accessWith={[attributionRoles.create]}>
            <AttributionUpload onSuccess={attributionRuleList.refetch} />
            <AttributionCreate onSuccess={attributionRuleList.refetch} />
          </HasPermission>
        </div>
      }>
      <AttributionListFilter onSearch={onSearch} currentFilters={filters} />
      <HasPermission accessWith={[attributionRoles.view]}>
        <PaginatedAttributionList
          filters={filters}
          pagination={pagination}
          attributionRuleList={attributionRuleList}
        />
      </HasPermission>
    </PageContainer>
  );
}
