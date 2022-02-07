import {
  Button,
  Badge,
  Card,
  classes,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  formatDate,
  FilterControls,
  FieldContainer,
  DropdownSelect,
  PaginationNavigation,
  PlusIcon,
  usePaginationState,
  SearchTextInput,
} from '@setel/portal-ui';
import * as React from 'react';
import {Link} from '../../../routing/link';
import {useCustomFieldRules} from '../custom-field-rules.queries';
import {CustomFieldRuleDetailsModal} from './custom-field-rules-details-modal';
import {ENTITY_NAME, FIELD_VALUE_TYPE} from '../custom-field-rules.type';
import {useHasPermission} from '../../auth/HasPermission';
import {customFieldRuleRole} from '../../../../shared/helpers/roles.type';
import {CURRENT_ENTERPRISE} from '../../../../shared/const/enterprise.const';
import {EnterpriseNameEnum} from '../../../../shared/enums/enterprise.enum';

const inputTypeOpts = [
  {
    label: 'Any',
    value: '',
  },
  {
    label: 'Text Box',
    value: FIELD_VALUE_TYPE.TEXTBOX,
  },
  {
    label: 'Dropdown',
    value: FIELD_VALUE_TYPE.DROPDOWN,
  },
  {
    label: 'Checkbox',
    value: FIELD_VALUE_TYPE.CHECKBOX,
  },
];
const entityOptions = [
  {
    label: 'Any',
    value: '',
  },
  {
    label: 'Merchant',
    value: ENTITY_NAME.MERCHANT,
  },
  {
    label: 'Site',
    value: ENTITY_NAME.SITE,
  },
  {
    label: 'Attribution rule',
    value: ENTITY_NAME.ATTRIBUTION_RULE,
  },
  {
    label: 'Item',
    value: ENTITY_NAME.ITEM,
  },
];
if (CURRENT_ENTERPRISE.name === EnterpriseNameEnum.PDB) {
  entityOptions.push({
    label: 'Customer',
    value: ENTITY_NAME.CUSTOMER,
  });
}
const statusOptions = [
  {
    label: 'Any',
    value: '',
  },
  {
    label: 'Active',
    value: '1',
  },
  {
    label: 'Disabled',
    value: '0',
  },
];

export const CustomFieldRulesListing = () => {
  const [visibleModal, setVisibleModal] = React.useState(false);
  const {page, perPage, setPage, setPerPage} = usePaginationState();
  const [searchValue, setSearchValue] = React.useState('');
  const [filterInputType, setFilterInputType] = React.useState('');
  const [filterEntity, setFilterEntity] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('');
  const isEdit = useHasPermission([customFieldRuleRole.modify]);

  const {data} = useCustomFieldRules({
    page,
    perPage,
    searchValue: searchValue !== '' ? searchValue : undefined,
    fieldValueType: filterInputType !== '' ? filterInputType : undefined,
    entityName: filterEntity !== '' ? filterEntity : undefined,
    isEnabled: filterStatus !== '' ? filterStatus === '1' : undefined,
  });

  const items = data?.items || [];

  const renderRuleStatus = (status: boolean) => {
    return status ? (
      <Badge className="uppercase" color="success" rounded="rounded">
        Active
      </Badge>
    ) : (
      <Badge className="uppercase" color="grey" rounded="rounded">
        Disabled
      </Badge>
    );
  };

  const renderEntityName = (entityName: string) => {
    switch (entityName) {
      case ENTITY_NAME.MERCHANT:
        return 'Merchant';
      case ENTITY_NAME.ATTRIBUTION_RULE:
        return 'Attribution rule';
      case ENTITY_NAME.SITE:
        return 'Site';
      case ENTITY_NAME.CUSTOMER:
        return 'Customer';
      case ENTITY_NAME.ITEM:
        return 'Item';
      default:
        return '-';
    }
  };

  const renderInputType = (inputType: string) => {
    switch (inputType) {
      case FIELD_VALUE_TYPE.TEXTBOX:
        return 'Textbox';
      case FIELD_VALUE_TYPE.CHECKBOX:
        return 'Checkbox';
      case FIELD_VALUE_TYPE.DROPDOWN:
        return 'Dropdown';
      default:
        return '';
    }
  };

  return (
    <>
      <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between">
          <h1 className={classes.h1}>Custom field rules</h1>
          {isEdit && (
            <Button
              variant="primary"
              onClick={() => {
                setVisibleModal(true);
              }}
              leftIcon={<PlusIcon />}>
              CREATE
            </Button>
          )}
        </div>
        <Card className="mb-3">
          <FilterControls>
            <FieldContainer label="Input type">
              <DropdownSelect<string>
                placeholder={'Any'}
                options={inputTypeOpts}
                value={filterInputType}
                onChangeValue={(val: string) => {
                  setFilterInputType(val);
                  setPage(1);
                }}
              />
            </FieldContainer>
            <FieldContainer label="Entity applied">
              <DropdownSelect<string>
                placeholder={'Any'}
                options={entityOptions}
                value={filterEntity}
                onChangeValue={(val: string) => {
                  setFilterEntity(val);
                  setPage(1);
                }}
              />
            </FieldContainer>
            <FieldContainer label="Status">
              <DropdownSelect<string>
                placeholder={'Any'}
                options={statusOptions}
                value={filterStatus}
                onChangeValue={(val: string) => {
                  setFilterStatus(val);
                  setPage(1);
                }}
              />
            </FieldContainer>
            <FieldContainer label="Search">
              <SearchTextInput
                placeholder={'Search'}
                value={searchValue}
                onChangeValue={(val: string) => {
                  setSearchValue(val);
                  setPage(1);
                }}
              />
            </FieldContainer>
          </FilterControls>
        </Card>
        <Card>
          <DataTable
            pagination={
              <PaginationNavigation
                currentPage={page}
                perPage={perPage}
                total={data?.total || 0}
                onChangePage={setPage}
                onChangePageSize={setPerPage}
              />
            }>
            <DataTableRowGroup groupType="thead">
              <Tr>
                <Td>Name</Td>
                <Td>Display name</Td>
                <Td>Input Type</Td>
                <Td>Entity Type</Td>
                <Td>Status</Td>
                <Td className="text-right">Created On</Td>
              </Tr>
            </DataTableRowGroup>
            <DataTableRowGroup>
              {items && items.length ? (
                items.map((rule) => {
                  return (
                    <Tr
                      render={(props) => <Link {...props} to={`/custom-field-rules/${rule.id}`} />}
                      key={rule.id}>
                      <Td>{rule?.fieldName}</Td>
                      <Td>{rule?.fieldLabel}</Td>
                      <Td>{renderInputType(rule?.fieldValueType)}</Td>
                      <Td>{renderEntityName(rule?.entityName)}</Td>
                      <Td>{renderRuleStatus(rule?.isEnabled)}</Td>
                      <Td className="text-right">{formatDate(rule?.createdAt)}</Td>
                    </Tr>
                  );
                })
              ) : (
                <Tr>
                  <Td />
                  <Td />
                  <Td>No custom field rule</Td>
                  <Td />
                  <Td className="text-right" />
                </Tr>
              )}
            </DataTableRowGroup>
          </DataTable>
        </Card>
        {visibleModal && (
          <CustomFieldRuleDetailsModal
            visible={visibleModal}
            onClose={() => setVisibleModal(false)}
          />
        )}
      </div>
    </>
  );
};
