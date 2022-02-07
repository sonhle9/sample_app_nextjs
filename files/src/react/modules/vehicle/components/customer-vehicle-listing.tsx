import {Card, Tabs} from '@setel/portal-ui';
import * as React from 'react';
import {ActivityTypeEnum} from '../interface/vehicle.interface';
import {useVehicleActivities, useVehicleDetails, useVehicles} from '../vehicle.queries';
import {
  getRecentVehicleActivity,
  RecentActivityDetailsContainer,
  VehicleDetailsContainer,
} from './vehicle-details';

export const CustomerVehicleListing = (params: any) => {
  const ownerId = params && params.id;
  const [tabIndex, setTabIndex] = React.useState(0);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const {data, isLoading} = useVehicles(
    {
      ownerId,
    },
    {
      enabled: isExpanded,
    },
  );

  const handleTabsChange = (index) => {
    setTabIndex(index);
  };

  return (
    <Card isOpen={isExpanded} onToggleOpen={() => setIsExpanded(!isExpanded)}>
      <Card.Heading title="Vehicles" />
      <Card.Content>
        {data && !data.isEmpty && (
          <Tabs index={tabIndex} onChange={handleTabsChange}>
            <Tabs.TabList>
              {data.items.map((vehicle, index) => (
                <Tabs.Tab label={vehicle.vehicleNumber || '-'} key={index} />
              ))}
            </Tabs.TabList>
            <Tabs.Panels>
              {data.items.map(
                (vehicle, index) =>
                  (tabIndex === index && (
                    <Tabs.Panel key={index}>
                      <GetVehicleDetails vehicleId={vehicle.vehicleId} />
                    </Tabs.Panel>
                  )) || <Tabs.Panel key={index}>loading...</Tabs.Panel>,
              )}
            </Tabs.Panels>
          </Tabs>
        )}
        {data && data.isEmpty && (
          <div>
            <p className="py-10 px-3 text-center">No data</p>
          </div>
        )}
        {isLoading && (
          <div>
            <p className="py-10 px-3 text-center animate-pulse">No data</p>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

const GetVehicleDetails = ({vehicleId}) => {
  const {data: vehicle} = useVehicleDetails(vehicleId);
  const {data: activities} = useVehicleActivities({
    vehicleId,
    activityType: ActivityTypeEnum.FUEL,
  });

  const recentActivity = getRecentVehicleActivity(activities && activities.items);

  return (
    <div className="pt-5 divide-y divide-gray-200 text-sm">
      <VehicleDetailsContainer vehicle={vehicle} title="DETAILS" hideLink={true} />
      {recentActivity && <RecentActivityDetailsContainer activity={recentActivity} />}
    </div>
  );
};
