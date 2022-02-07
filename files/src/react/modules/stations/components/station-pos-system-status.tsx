import {Alert, Badge, Card, CardContent, CardHeading} from '@setel/portal-ui';
import * as React from 'react';
import {useSystemState} from '../stations.queries';

export const StationPosSystemStatus = () => {
  const {data, error, isLoading} = useSystemState();
  return (
    <Card>
      <CardHeading title="POS system status" />
      {error ? (
        <CardContent>
          <Alert
            variant="error"
            description="Maintenance service down, please contact the Administrator."
          />
        </CardContent>
      ) : (
        <div className="flex flex-col md:flex-row">
          <SystemStatus
            name="Sapura POS"
            isLoading={isLoading}
            isUnderMaintenance={data?.vendors?.pos || data?.vendors?.posSapura}
          />
          <SystemStatus
            name="Sentinel POS"
            isLoading={isLoading}
            isUnderMaintenance={data?.vendors?.pos || data?.vendors?.posSentinel}
          />
          <SystemStatus
            name="Setel POS"
            isLoading={isLoading}
            isUnderMaintenance={data?.vendors?.pos || data?.vendors?.posSetel}
          />
        </div>
      )}
    </Card>
  );
};

const SystemStatus = (props: {name: string; isLoading: boolean; isUnderMaintenance: boolean}) => (
  <div className="flex-1 flex justify-between md:block border-b md:border-b-0 md:border-r last:border-transparent border-gray-200 px-7 md:px-4 lg:px-7 first:pl-7 last:pr-7 py-4">
    <div className="md:mb-3">{props.name}</div>
    <div>
      {props.isLoading ? (
        <Badge color="grey">LOADING...</Badge>
      ) : props.isUnderMaintenance ? (
        <Badge color="lemon">UNDER MAINTENANCE</Badge>
      ) : (
        <Badge color="success">AVAILABLE</Badge>
      )}
    </div>
  </div>
);
