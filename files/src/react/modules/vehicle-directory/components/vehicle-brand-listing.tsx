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
import {useBrandListing} from '../vehicle-directory.queries';
import {VehicleTypeMap} from '../../vehicle/interface/vehicle.interface';

export const VehicleBrandListing = () => {
  const defaultPage = 1;
  const defaultPerPage = 50;
  const [searchValue, setSearchValue] = React.useState('');
  const [vehicleType, setVehicleType] = React.useState(null);
  const [page, setPage] = React.useState(defaultPage);
  const [perPage, setPerPage] = React.useState(defaultPerPage);

  const {data} = useBrandListing({
    page,
    perPage,
    searchValue,
    vehicleType,
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(defaultPage);
    setPerPage(defaultPerPage);
  };

  return (
    <>
      <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between">
          <h1 className={classes.h1}>Vehicle directory</h1>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="grid sm:grid-cols-2 gap-4 pt-5">
              <FieldContainer label="Search">
                <SearchTextInput
                  value={searchValue}
                  onChangeValue={setSearchValue}
                  placeholder="Any brand"
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
                  <Td>BRAND ID</Td>
                  <Td>BRAND NAME</Td>
                  <Td>TYPE</Td>
                </Tr>
              </DataTableRowGroup>
              <DataTableRowGroup>
                {data.items.map((brand) => (
                  <Tr key={brand.id}>
                    <Td>{brand.id}</Td>
                    <Td className="flex justify-start">
                      {brand.logo && (
                        <div className="float-left w-8 h-8">
                          <img
                            src={brand.logo}
                            className="w-full h-full align-middle border-none"
                          />
                        </div>
                      )}
                      <div className="float-left ml-4 mt-2">
                        <a href={`/vehicle-directory/models/${brand && brand.id}`} target="_blank">
                          {brand.name}
                        </a>
                      </div>
                    </Td>
                    <Td>{toFirstUpperCase(brand.vehicleType)}</Td>
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

export const NoRecordFoundInList = () => {
  return (
    <DataTable>
      <div className="table-caption">
        <div className="text-center py-12 text-mediumgrey text-md">
          <p>No records found</p>
          <p>Try again with a different information type</p>
        </div>
      </div>
    </DataTable>
  );
};
