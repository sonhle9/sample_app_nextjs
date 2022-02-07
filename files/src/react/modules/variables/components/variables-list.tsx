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
  DotVerticalIcon,
  DropdownSelectField,
  DropdownItem,
  DropdownMenu,
  DropdownMenuItems,
  PaginationNavigation,
  TextField,
  TrashIcon,
  usePaginationState,
} from '@setel/portal-ui';
import * as React from 'react';
import {useFormik} from 'formik';
import {PageContainer} from 'src/react/components/page-container';
import {useNotification} from 'src/react/hooks/use-notification';
import {IVariablesFilter, IPaginationResult, IVariable, ITag} from '../types';
import {Link} from 'src/react/routing/link';
import {QueryObserverResult} from 'react-query';
import {useDeleteVariable, useTags, useUpdateVariable, useVariables} from '../variables.queries';
import {fromUnixTime, format} from 'date-fns';
import {variableTargetingDisplayNames} from '../const';
import {VariableCreate} from './variable-create';
import {ConfirmDialog} from '../../attribution/components/attribution-form';
import {useRouter} from 'src/react/routing/routing.context';
import {variablesRoles} from '../../../../shared/helpers/roles.type';
import {HasPermission} from '../../auth/HasPermission';

interface VariablesListHeader {
  header: React.ReactNode;
  accessor: (data: IVariable) => React.ReactNode;
  className?: string;
}

const VARIABLES_LIST_TABLE_HEADERS: VariablesListHeader[] = [
  {
    header: 'VARIABLES',
    accessor: (d) => (
      <Link to={`experience/variables/${d.key}`}>
        <div className={'inline-block w-64 whitespace-normal break-all'}>{d.key}</div>
      </Link>
    ),
  },
  {
    header: 'DESCRIPTION',
    accessor: (d) => (
      <span className={'inline-block w-56 whitespace-normal break-all'}>{d.description}</span>
    ),
  },
  {
    header: 'TAGS',
    accessor: (d) => (
      <div className="flex flex-wrap">
        {d.tags &&
          d.tags.map((tag) => (
            <div className="pt-2" key={tag.key}>
              <Badge color={'grey'}>{tag.value}</Badge>
            </div>
          ))}
      </div>
    ),
  },
  {
    header: 'TARGETING',
    accessor: (d) => <>{variableTargetingDisplayNames.get(d.isToggled)}</>,
  },
  {
    header: 'UPDATED ON',
    accessor: (d) => format(new Date(fromUnixTime(d.updatedAt)), 'd MMM yyyy, p'),
    className: 'text-right',
  },
];

function VariablesFilter(props: {
  tags: QueryObserverResult<ITag[]>;
  onSearch: (values: IVariablesFilter) => void;
  currentFilters: IVariablesFilter;
}) {
  const formik = useFormik({
    initialValues: {
      searchQuery: '',
      tags: '',
    },
    onSubmit: (values) => {
      props.onSearch(values);
    },
  });
  const {data: tags = []} = props.tags;

  return (
    <>
      <Card>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="flex items-center space-x-3 w-100">
            {
              <DropdownSelectField
                wrapperClass="flex-grow"
                label={'Tags'}
                name={'tags'}
                value={formik.values.tags}
                onChangeValue={(value) => formik.setFieldValue('tags', value)}
                placeholder={'All tags'}
                data-testid="dd-tag"
                options={tags.map((tag) => ({
                  value: tag.key,
                  label: tag.value,
                }))}
              />
            }
            <TextField
              wrapperClass="flex-grow"
              label={'Search'}
              placeholder={'Search variable key and variable name'}
              name={'searchQuery'}
              value={formik.values.searchQuery}
              onChange={formik.handleChange}
              data-testid="txt-query"
            />
            <Button variant="primary" type="submit" data-testid="btn-search">
              SEARCH
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

function PaginatedVariables(props: {
  filters: IVariablesFilter;
  pagination: ReturnType<typeof usePaginationState>;
  variables: QueryObserverResult<IPaginationResult<IVariable[]>, unknown>;
}) {
  const [selectedVariable, setSelectedVariable] = React.useState<IVariable>();
  const [isDisableOpen, setDisable] = React.useState(false);
  const [isEnableOpen, setEnable] = React.useState(false);
  const [isDeleteOpen, setDelete] = React.useState(false);
  const showMessage = useNotification();
  const {
    mutate: updateVariable,
    error: updateError,
    isLoading: isUpdating,
  } = useUpdateVariable({
    onSuccess: () => {
      setDisable(false);
      setEnable(false);
      refetch();
    },
    onError: () => {
      setDisable(false);
      setEnable(false);
      showMessage({
        variant: 'error',
        title: 'Error occured!',
        description: String(updateError?.response?.data?.response?.message || ''),
      });
    },
  });
  const {
    mutate: deleteVariable,
    error: deleteError,
    isLoading: isDeleting,
  } = useDeleteVariable({
    onSuccess: () => {
      setDelete(false);
      refetch();
    },
    onError: () => {
      setDelete(false);
      showMessage({
        variant: 'error',
        title: 'Error occured!',
        description: String(deleteError?.response?.data?.response?.message || ''),
      });
    },
  });
  const pagination = props.pagination;
  const {
    data: {data = [], metadata: {totalCount: total} = {totalCount: 0}} = {},
    isLoading,
    isSuccess,
    isError,
    error,
    refetch,
  } = props.variables;
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
                {VARIABLES_LIST_TABLE_HEADERS.map(({header, className}, index) => (
                  <Td key={index} className={className}>
                    {header}
                  </Td>
                ))}
                <Td key={VARIABLES_LIST_TABLE_HEADERS.length}></Td>
              </Tr>
            </DataTableRowGroup>
            <DataTableRowGroup>
              {data?.map((item, itemIndex) => (
                <Tr key={itemIndex}>
                  {VARIABLES_LIST_TABLE_HEADERS.map(({accessor, className}, headerIndex) => (
                    <Td key={headerIndex} className={className}>
                      {accessor(item)}
                    </Td>
                  ))}
                  <Td key={VARIABLES_LIST_TABLE_HEADERS.length} className="text-right">
                    <DropdownMenu
                      variant="icon"
                      label={<DotVerticalIcon className="w-5 h-5 text-gray-500" />}>
                      <HasPermission accessWith={[variablesRoles.delete]}>
                        <DropdownMenuItems className="min-w-32">
                          <DropdownItem
                            onSelect={() => {
                              setSelectedVariable(item);
                              setDelete(true);
                            }}>
                            <TrashIcon className="w-5 h-5 text-gray-400" />
                            <span className="text-black-400 pl-2">Delete</span>
                          </DropdownItem>
                        </DropdownMenuItems>
                      </HasPermission>
                    </DropdownMenu>
                  </Td>
                </Tr>
              ))}
            </DataTableRowGroup>
          </Table>
        </div>
        {data.length === 0 && !isLoading ? (
          <div className="h-64 w-full flex items-center justify-center text-lightgrey">
            <div>{isSuccess && <span>{'No results'}</span>}</div>
          </div>
        ) : (
          <PaginationNavigation
            className="p-4"
            total={total}
            currentPage={pagination.page}
            perPage={pagination.perPage}
            onChangePage={pagination.setPage}
            onChangePageSize={pagination.setPerPage}
          />
        )}
        {selectedVariable && (
          <ConfirmDialog
            header={`Are you sure you want to disable ${selectedVariable.key}?`}
            confirmLabel={'DISABLE'}
            confirmElement={
              <Button
                variant="primary"
                onClick={() => {
                  updateVariable({key: selectedVariable.key, variable: {isArchived: true}});
                }}
                data-testid="btn-confirm-disable"
                isLoading={isUpdating}>
                DISABLE
              </Button>
            }
            open={isDisableOpen}
            toggleOpen={setDisable}>
            {`You are about to disable ${selectedVariable.key} and all its content.`}
          </ConfirmDialog>
        )}
        {selectedVariable && (
          <ConfirmDialog
            header={`Are you sure you want to enable ${selectedVariable.key}?`}
            confirmLabel={'ENABLE'}
            confirmElement={
              <Button
                variant="primary"
                onClick={() => {
                  updateVariable({key: selectedVariable.key, variable: {isArchived: false}});
                }}
                data-testid="btn-confirm-enable"
                isLoading={isUpdating}>
                ENABLE
              </Button>
            }
            open={isEnableOpen}
            toggleOpen={setEnable}>
            {`You are about to enable ${selectedVariable.key} and all its content.`}
          </ConfirmDialog>
        )}
        {selectedVariable && (
          <ConfirmDialog
            header={`Are you sure you want to delete ${selectedVariable.key} and all its content?`}
            confirmLabel={'ENABLE'}
            confirmElement={
              <Button
                variant="error"
                onClick={() => {
                  deleteVariable({key: selectedVariable.key});
                }}
                data-testid="btn-confirm-delete"
                isLoading={isDeleting}>
                DELETE
              </Button>
            }
            open={isDeleteOpen}
            toggleOpen={setDelete}>
            {`This action cannot be undone and you will not be able to recover.`}
          </ConfirmDialog>
        )}
      </Card>
    </>
  );
}

export function VariablesList() {
  const [filters, setFilters] = React.useState<IVariablesFilter>({});
  const paginationState = usePaginationState();
  const variables = useVariables(
    {currentPage: paginationState.page, pageSize: paginationState.perPage},
    filters,
  );
  const tags = useTags();
  const onSearch = (newFilters: IVariablesFilter) => {
    setFilters(newFilters);
    paginationState.setPage(1);
  };
  const router = useRouter();

  return (
    <PageContainer
      heading={'Variables'}
      className={'space-y-4'}
      action={
        <HasPermission accessWith={[variablesRoles.create]}>
          <div className="flex items-center space-x-3">
            <VariableCreate
              onSuccess={(id) => router.navigateByUrl(`experience/variables/${id}`)}
            />
          </div>
        </HasPermission>
      }>
      <HasPermission accessWith={[variablesRoles.view]}>
        <VariablesFilter tags={tags} onSearch={onSearch} currentFilters={filters} />
        <PaginatedVariables filters={filters} pagination={paginationState} variables={variables} />
      </HasPermission>
    </PageContainer>
  );
}
