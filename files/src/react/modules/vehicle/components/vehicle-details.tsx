import * as React from 'react';
import {
  classes,
  Field,
  JsonPanel,
  Label,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  PaginationNavigation,
  DropdownSelectField,
  formatDate,
  Badge,
} from '@setel/portal-ui';
import {useRouter} from '../../../routing/routing.context';
import {useVehicleActivities, useVehicleDetails} from '../vehicle.queries';
import {toFirstUpperCase} from 'src/shared/helpers/common';
import {
  ActivityTypeEnum,
  ActivityTypeMaps,
  IIndexVehicleActivitiesResponse,
  IVehiclePaginatedResult,
  VehicleFuelTypeMaps,
} from '../interface/vehicle.interface';

interface IVehicleDetailsProps {
  id: string;
}

let recentActivity;

export const VehicleDetails = (props: IVehicleDetailsProps) => {
  const vehicleId = props.id;
  const [jsonString, setJsonString] = React.useState({});

  const {data: vehicle, isError: isVehicleError} = useVehicleDetails(vehicleId);

  const [activityType, setActivityType] = React.useState(ActivityTypeEnum.FUEL.toString());
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);

  const {data: activities} = useVehicleActivities({
    vehicleId,
    activityType,
    perPage,
    page,
  });

  if (!recentActivity) {
    recentActivity = getRecentVehicleActivity(activities && activities.items);
  }

  const router = useRouter();

  React.useEffect(() => {
    if (isVehicleError) {
      router.navigateByUrl('vehicle');
      return;
    }

    setJsonString(vehicle);
  }, [vehicle, isVehicleError]);

  return (
    <>
      <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between">
          <h1 className={classes.h1}>{(vehicle && vehicle.vehicleNumber) || '-'}</h1>
        </div>
        <div className="card">
          <div className="px-4 border-b border-gray-200 text-md leading-7 pt-5 py-4 flex justify-between">
            <div className="flex items-center">DETAILS</div>
          </div>
          <div className="card-body divide-y divide-gray-200 text-sm">
            <VehicleDetailsContainer vehicle={vehicle} title="VEHICLE" hideLink={false} />

            <CustomerDetailsContainer vehicle={vehicle} />

            {recentActivity ? <RecentActivityDetailsContainer activity={recentActivity} /> : ''}
          </div>
        </div>

        <div className="card">
          <div className="px-4 md:px-6 lg:px-8 border-b border-gray-200 text-xl font-medium leading-7 pt-5 py-4 flex justify-between">
            <div className="flex items-center">Vehicle activities</div>
            <DropdownSelectField<string>
              wrapperClass="sm:grid-cols-2 lg:grid-cols-6"
              label="Type"
              value={activityType}
              onChangeValue={setActivityType}
              options={ActivityTypeMaps}
            />
          </div>
          <div className="card-body text-sm">
            <VehicleActivitiesList
              activities={activities}
              page={page}
              perPage={perPage}
              setPage={setPage}
              setPerPage={setPerPage}
              activityType={activityType}
            />
          </div>
        </div>

        <JsonPanel defaultOpen allowToggleFormat json={jsonString} />
      </div>
    </>
  );
};

function VehicleActivitiesList({activities, page, perPage, setPage, setPerPage, activityType}) {
  const activityData: IVehiclePaginatedResult<IIndexVehicleActivitiesResponse> = activities;

  if (!((activityData && activityData.items) || []).length) {
    return (
      <div className="flex items-center justify-center py-24">
        <Label>No Vehicle activities found.</Label>
      </div>
    );
  }

  return (
    <>
      {activityType === ActivityTypeEnum.FUEL ? (
        <DataTable striped>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td>Mileage (KM)</Td>
              <Td>Fuel Type</Td>
              <Td>Status</Td>
              <Td>Litres (L)</Td>
              <Td>Cost (RM)</Td>
              <Td>Efficiency (L/100KM)</Td>
              <Td>Created On</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {activityData.items.map((activity, index) => (
              <Tr key={index}>
                <Td>{activity.odometer}</Td>
                <Td>{VehicleFuelTypeMaps[activity.fuelType] || '-'}</Td>
                <Td>{activity.isFullTank ? 'Full tank' : 'Partial'}</Td>
                <Td>{activity.noOfLiters}</Td>
                <Td>{activity.totalCost}</Td>
                <Td>
                  {(activity && activity.efficiency && activity.efficiency.toFixed(2)) || '-'}
                </Td>
                <Td>
                  {formatDate(activity.activityDate, {
                    formatType: 'dateAndTime',
                  })}
                </Td>
              </Tr>
            ))}
          </DataTableRowGroup>
        </DataTable>
      ) : (
        <DataTable striped>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td>Mileage (KM)</Td>
              <Td>Activity Type</Td>
              <Td>Description</Td>
              <Td>Created On</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {activityData.items.map((activity, index) => (
              <Tr key={index}>
                <Td>{activity.odometer}</Td>
                <Td>{activity.activityTypeDisplayName}</Td>
                <Td>{activity.description || '-'}</Td>
                <Td>
                  {formatDate(activity.activityDate, {
                    formatType: 'dateAndTime',
                  })}
                </Td>
              </Tr>
            ))}
          </DataTableRowGroup>
        </DataTable>
      )}

      <PaginationNavigation
        total={activities.total}
        currentPage={page}
        perPage={perPage}
        onChangePage={setPage}
        onChangePageSize={setPerPage}
      />
    </>
  );
}

export const getRecentVehicleActivity = (activities: IIndexVehicleActivitiesResponse[]) =>
  activities && activities[0];

function GetEfficiencyBadge({efficiencyPercentage}) {
  const diffPercent = efficiencyPercentage * -1;
  return (
    <div className="flex">
      <Badge color={isNegative(diffPercent) ? 'error' : 'success'} className="mr-2">
        {isNegative(diffPercent) ? `${diffPercent}% DECLINE` : `${diffPercent}% IMPROVEMENT`}
      </Badge>
    </div>
  );
}

function isNegative(percentage: number): boolean {
  return `${percentage}`.startsWith('-');
}

export function VehicleDetailsContainer({vehicle, title, hideLink}) {
  return (
    <div className="grid sm:grid-cols-6 gap-4 pb-5">
      <div className="col-span-2 pt-2">{title}</div>

      <div className="col-span-4">
        <Field className="sm:grid sm:grid-cols-3 pt-4">
          <Label>Type</Label>
          <div className="col-span-2">{vehicle && toFirstUpperCase(vehicle.vehicleType)}</div>
        </Field>
        <Field className="sm:grid sm:grid-cols-3 pt-4">
          <Label>Brand</Label>
          <div className="col-span-2">{vehicle && vehicle.vehicleBrand}</div>
        </Field>
        <Field className="sm:grid sm:grid-cols-3 pt-4">
          <Label>Model</Label>
          <div className="col-span-2">{vehicle && vehicle.vehicleModel}</div>
        </Field>
        <Field className="sm:grid sm:grid-cols-3 pt-4">
          <Label>Year of make</Label>
          <div className="col-span-2">{(vehicle && vehicle.yearOfMake) || '-'}</div>
        </Field>
        <Field className="sm:grid sm:grid-cols-3 pt-4">
          <Label>Engine capacity</Label>
          <div className="col-span-2">
            {(vehicle &&
              vehicle.engineCapacity &&
              `${vehicle.engineCapacity} ${vehicle.engineCapacityUnit}`) ||
              '-'}
          </div>
        </Field>
        <Field className="sm:grid sm:grid-cols-3 pt-4">
          <Label>Transmission</Label>
          <div className="col-span-2">{(vehicle && vehicle.transmission) || '-'}</div>
        </Field>
        <Field className="sm:grid sm:grid-cols-3 pt-4">
          <Label>Engine type</Label>
          <div className="col-span-2">{(vehicle && vehicle.engineType) || '-'}</div>
        </Field>
        <Field className="sm:grid sm:grid-cols-3 pt-4">
          <Label>Created</Label>
          <div className="col-span-2">
            {vehicle &&
              vehicle.createdAt &&
              formatDate(vehicle.createdAt, {
                formatType: 'dateAndTime',
              })}
          </div>
        </Field>
        {hideLink && (
          <Field className="sm:grid sm:grid-cols-3 pt-4">
            <Label>&nbsp;</Label>
            <div className="col-span-2">
              <a
                target="_blank"
                className="text-teal-400"
                href={`/vehicle/${vehicle && vehicle.vehicleId}`}>
                VIEW DETAILS &gt;
              </a>
            </div>
          </Field>
        )}
      </div>
    </div>
  );
}

function CustomerDetailsContainer({vehicle}) {
  return (
    <div className="grid sm:grid-cols-6 gap-4 pt-5">
      <div className="col-span-2">OWNER ID</div>

      <div className="col-span-4">
        <Field className="sm:grid sm:grid-cols-3 pt-4">
          <Label>ID number</Label>
          <div className="col-span-2">{vehicle && vehicle.ownerId}</div>
        </Field>
        <Field className="sm:grid sm:grid-cols-3 pt-4">
          <Label>Name</Label>
          <div className="col-span-2">
            {vehicle && vehicle.userDetails && vehicle.userDetails.fullName}
          </div>
        </Field>
        <Field className="sm:grid sm:grid-cols-3 pt-4">
          <Label>Phone no.</Label>
          <div className="col-span-2">
            {vehicle && vehicle.userDetails && vehicle.userDetails.phone}
          </div>
        </Field>
        <Field className="sm:grid sm:grid-cols-3 pt-4">
          <Label>&nbsp;</Label>
          <div className="col-span-2">
            <a
              target="_blank"
              className="text-teal-400"
              href={`/customers/${vehicle && vehicle.ownerId}`}>
              VIEW DETAILS &gt;
            </a>
          </div>
        </Field>
      </div>
    </div>
  );
}

export function RecentActivityDetailsContainer({activity}) {
  return (
    <div className="grid sm:grid-cols-6 gap-4 pt-5">
      <div className="col-span-2">MILEAGE</div>

      <div className="col-span-4">
        <Field className="sm:grid sm:grid-cols-3 pt-4">
          <Label>Date</Label>
          <div className="col-span-2">
            {activity &&
              activity.activityDate &&
              formatDate(activity.activityDate, {
                formatType: 'dateOnly',
              })}
          </div>
        </Field>
        <Field className="sm:grid sm:grid-cols-3 pt-4">
          <Label>Current mileage</Label>
          <div className="col-span-2">{activity.odometer} km</div>
        </Field>
        <Field className="sm:grid sm:grid-cols-3 pt-4">
          <Label>Activity</Label>
          <div className="col-span-2">{activity.activityTypeDisplayName || '-'}</div>
        </Field>
        <Field className="sm:grid sm:grid-cols-3 pt-4">
          <Label>Efficiency</Label>
          <div className="col-span-2">
            {(activity.efficiency && activity.efficiency.toFixed(2)) || '-'}
            {activity.efficiency && ` ${activity.efficiencyUnit}`}
          </div>
        </Field>
        <Field className="sm:grid sm:grid-cols-3 pt-4">
          <Label>Status</Label>
          <div className="col-span-2">
            {activity.efficiencyPercentage && activity.efficiencyPercentage !== 0 ? (
              <GetEfficiencyBadge efficiencyPercentage={activity.efficiencyPercentage} />
            ) : activity.efficiencyPercentage === 0 ? (
              <Badge color="success" className="mr-2">
                0%
              </Badge>
            ) : (
              '-'
            )}
          </div>
        </Field>
      </div>
    </div>
  );
}
