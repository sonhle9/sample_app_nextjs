import {
  classes,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  PaginationNavigation,
  DropdownSelectField,
  FieldContainer,
  SearchTextInput,
} from '@setel/portal-ui';
import * as React from 'react';
import {toFirstUpperCase} from 'src/shared/helpers/common';
import {useBrandDetails, useModelListing} from '../vehicle-directory.queries';
import {VehicleTypeMap} from '../../vehicle/interface/vehicle.interface';
import {IModelListingProps} from '../interface/vehicle-directory.interface';
import {NoRecordFoundInList} from './vehicle-brand-listing';

export const VehicleModelListing = (props: IModelListingProps) => {
  const brandId = props.brandId;
  const defaultPage = 1;
  const defaultPerPage = 50;
  const [searchValue, setSearchValue] = React.useState('');
  const [vehicleType, setVehicleType] = React.useState(null);
  const [page, setPage] = React.useState(defaultPage);
  const [perPage, setPerPage] = React.useState(defaultPerPage);

  const {data} = useModelListing(+brandId, {
    page,
    perPage,
    searchValue,
    vehicleType,
  });

  const {data: brandData} = useBrandDetails(+brandId);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(defaultPage);
    setPerPage(defaultPerPage);
  };

  return (
    <>
      <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between">
          <h1 className={classes.h1}>{(brandData && brandData.name) || '-'}</h1>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="grid sm:grid-cols-2 gap-4 pt-5">
              <FieldContainer label="Search">
                <SearchTextInput
                  value={searchValue}
                  onChangeValue={setSearchValue}
                  placeholder="Any model"
                />
              </FieldContainer>

              <form onSubmit={onSubmit}>
                <DropdownSelectField
                  label="Type"
                  value={vehicleType || ''}
                  onChangeValue={setVehicleType}
                  placeholder="All"
                  options={VehicleTypeMap}
                />
              </form>
            </div>
          </div>
        </div>
        {(data && data.items && data.items.length && (
          <>
            <DataTable
              striped
              pagination={
                <PaginationNavigation
                  total={data.total}
                  currentPage={page}
                  perPage={perPage}
                  onChangePage={setPage}
                  onChangePageSize={setPerPage}
                />
              }>
              <DataTableRowGroup groupType="thead">
                <Tr>
                  <Td>MODEL ID</Td>
                  <Td>MODEL NAME</Td>
                  <Td>TYPE</Td>
                </Tr>
              </DataTableRowGroup>
              <DataTableRowGroup>
                {data.items.map((model) => (
                  <Tr key={model.id}>
                    <Td>{model.id}</Td>
                    <Td>{model.name}</Td>
                    <Td>{toFirstUpperCase(model.vehicleType)}</Td>
                  </Tr>
                ))}
              </DataTableRowGroup>
            </DataTable>
          </>
        )) || <NoRecordFoundInList />}
      </div>
    </>
  );
};
