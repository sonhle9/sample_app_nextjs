import {
  classes,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  Field,
  formatDate,
  Label,
  PaginationNavigation,
  DropdownSelectField,
  DateRangeDropdown,
  SearchableDropdown,
  FieldContainer,
  SearchTextInput,
  usePaginationState,
} from '@setel/portal-ui';
import * as React from 'react';
import {toFirstUpperCase} from 'src/shared/helpers/common';
import {NoRecordFoundInList} from '../../vehicle-directory/components/vehicle-brand-listing';
import {VehicleTypeMap} from '../interface/vehicle.interface';
import {useVehicleBrands, useVehicleModels, useVehicles} from '../vehicle.queries';

export const VehicleListing = (params: any) => {
  const ownerId = params && params.id;
  const [searchValue, setSearchValue] = React.useState('');
  const [brandId, setBrandId] = React.useState('');
  const [modelId, setModelId] = React.useState('');
  const [vehicleType, setVehicleType] = React.useState(null);
  const pagination = usePaginationState();

  const [date, setDate] = React.useState<[string, string]>(['', '']);
  let filteredModelListData = [];
  const {data} = useVehicles({
    page: pagination.page,
    perPage: pagination.perPage,
    searchValue,
    brandId,
    modelId,
    startDate: date[0],
    endDate: date[1],
    vehicleType,
    ownerId,
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    pagination.setPage(1);
  };

  const callModelList = (val) => {
    setBrandId(val);
    setModelId('');
  };

  const {data: brandListData} = useVehicleBrands();
  const filteredBrandList =
    brandListData &&
    brandListData.map((ele) => ({
      label: ele.name,
      value: ele.id.toString(),
    }));

  const {data: modelData} = useVehicleModels(+brandId);
  if (modelData) {
    filteredModelListData = modelData.map((ele) => ({
      label: ele.name,
      value: ele.id.toString(),
    }));
  }

  return (
    <>
      <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between">
          <h1 className={classes.h1}>Vehicles</h1>
        </div>
        <div className="card">
          <div className="card-body divide-y divide-gray-200">
            <div className="flex pb-1">
              <FieldContainer label="Search" className="w-full">
                <SearchTextInput
                  value={searchValue}
                  onChangeValue={setSearchValue}
                  placeholder="Search any plate number or owner id"
                />
              </FieldContainer>
            </div>

            <form onSubmit={onSubmit}>
              <div className="flex justify-between pt-5">
                <FieldContainer label="Brand" className="sm:grid-cols-2 lg:grid-cols-6">
                  <SearchableDropdown
                    value={brandId}
                    onChangeValue={callModelList}
                    placeholder="All"
                    options={filteredBrandList}
                  />
                </FieldContainer>
                <FieldContainer label="Model" className="sm:grid-cols-2 lg:grid-cols-6">
                  <SearchableDropdown
                    value={modelId}
                    onChangeValue={setModelId}
                    placeholder="All"
                    options={filteredModelListData}
                    disabled={!brandId}
                  />
                </FieldContainer>
                <DropdownSelectField
                  wrapperClass="sm:grid-cols-2 lg:grid-cols-6"
                  label="Type"
                  value={vehicleType || ''}
                  onChangeValue={setVehicleType}
                  placeholder="All"
                  options={VehicleTypeMap}
                />
                <Field className="sm:grid-cols-2 lg:grid-cols-6">
                  <Label>Created On</Label>
                  <DateRangeDropdown value={date} onChangeValue={setDate} />
                </Field>
              </div>
            </form>
          </div>
        </div>
        {(data && data.items && data.items.length && (
          <>
            <DataTable
              striped
              pagination={
                <PaginationNavigation
                  total={data.total}
                  currentPage={pagination.page}
                  perPage={pagination.perPage}
                  onChangePage={pagination.setPage}
                  onChangePageSize={pagination.setPerPage}
                />
              }>
              <DataTableRowGroup groupType="thead">
                <Tr>
                  <Td>PLATE NUMBER</Td>
                  <Td>VEHICLE DETAILS</Td>
                  <Td>TYPE</Td>
                  <Td>OWNER ID</Td>
                  <Td className="text-right">CREATED ON</Td>
                </Tr>
              </DataTableRowGroup>
              <DataTableRowGroup>
                {data.items.map((vehicle) => (
                  <Tr key={vehicle.vehicleId}>
                    <Td
                      className="cursor-pointer"
                      onClick={() => {
                        window.open(`/vehicle/${vehicle.vehicleId}`, '_blank');
                      }}>
                      {vehicle.vehicleNumber}
                    </Td>
                    <Td>
                      {vehicle.vehicleBrand} {vehicle.vehicleModel}
                      {vehicle.engineCapacity && ` . ${vehicle.engineCapacity}`}
                    </Td>
                    <Td>{toFirstUpperCase(vehicle.vehicleType)}</Td>
                    <Td
                      className="cursor-pointer"
                      onClick={() => {
                        window.open(`/customers/${vehicle.ownerId}`, '_blank');
                      }}>
                      {vehicle.ownerId}
                    </Td>
                    <Td className="text-right">
                      {formatDate(vehicle.createdAt, {
                        formatType: 'dateAndTime',
                      })}
                    </Td>
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
