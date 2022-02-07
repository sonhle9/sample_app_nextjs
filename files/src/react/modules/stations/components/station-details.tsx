import {
  Badge,
  Button,
  Card,
  CardHeading,
  DataTable as Table,
  DescList,
  EditIcon,
  Skeleton,
} from '@setel/portal-ui';
import classNames from 'classnames';
import {addMinutes, format, setDay} from 'date-fns';
import * as React from 'react';
import {GoogleMap} from '../../../components/google-map';
import {useMerchantDetails} from '../../merchants/merchants.queries';
import {
  PumpStatusColorMap,
  StationStatusColor,
  STATION_STATUS_FRIENDLY_NAME,
} from '../stations.const';
import {PumpStatus} from '../stations.enum';
import {useStation, useStationFeatureTypes} from '../stations.queries';
import {EditFuelOperatingHoursModal} from './edit-fuel-operating-hours-modal';
import {EditPumpsStatusModal} from './edit-pump-status-modal';
import {EditStationDetailsModal} from './edit-station-details-modal';
import {EditStationFeaturesModal} from './edit-station-features-modal';
import {EditStationOperatingHoursModal} from './edit-station-operating-hours-modal';
import {EditStationStatusModal} from './edit-station-status-modal';

export function StationDetails(props) {
  const [showEditStationDetailsForm, setShowEditStationDetailsForm] = React.useState(false);
  const [showEditStationStatusForm, setShowEditStationStatusForm] = React.useState(false);
  const [showEditFuelOperatingHoursForm, setShowEditFuelOperatingHoursForm] = React.useState(false);
  const [showEditPumpStatusForm, setShowEditPumpStatusForm] = React.useState(false);
  const [showEditStationFeaturesForm, setShowEditStationFeaturesForm] = React.useState(false);
  const [showEditStationOperatingHoursForm, setShowEditStationOperatingHoursForm] =
    React.useState(false);
  const [statusType, setStatusType] = React.useState<{
    fieldName: string;
    initialValue: Record<string, string | Record<string, any>>;
    label: string;
  }>({fieldName: '', initialValue: {}, label: ''});
  const {data: stationDetails, isLoading: isLoadingStationDetails} = useStation(props.stationId);
  const {data: fuelMerchantDetails, isLoading: isLoadingFuelMerchantDetails} = useMerchantDetails(
    stationDetails?.fuelMerchantId,
    {
      enabled: !!stationDetails,
    },
  );
  const {data: storeMerchantDetails, isLoading: isLoadingStoreMerchantDetails} = useMerchantDetails(
    stationDetails?.storeMerchantId,
    {
      enabled: !!stationDetails && !!stationDetails.storeMerchantId,
    },
  );
  const {data: stationFeatureTypes} = useStationFeatureTypes();

  return (
    <div className="mt-8">
      {showEditStationDetailsForm && (
        <EditStationDetailsModal
          isOpen={showEditStationDetailsForm}
          onDismiss={() => setShowEditStationDetailsForm(false)}
          details={stationDetails}
        />
      )}
      {showEditStationStatusForm && (
        <EditStationStatusModal
          isOpen={showEditStationStatusForm}
          onDismiss={() => setShowEditStationStatusForm(false)}
          status={statusType}
          stationId={stationDetails.id}
        />
      )}
      {showEditStationOperatingHoursForm && (
        <EditStationOperatingHoursModal
          isOpen={showEditStationOperatingHoursForm}
          onDismiss={() => setShowEditStationOperatingHoursForm(false)}
          isOperating24Hours={stationDetails.isOperating24Hours}
          operatingHours={stationDetails.operatingHours}
          stationId={stationDetails.id}
        />
      )}
      {showEditFuelOperatingHoursForm && (
        <EditFuelOperatingHoursModal
          isOpen={showEditFuelOperatingHoursForm}
          onDismiss={() => setShowEditFuelOperatingHoursForm(false)}
          fuelInCarOperatingHours={stationDetails.fuelInCarOperatingHours}
          stationId={stationDetails.id}
        />
      )}
      {showEditPumpStatusForm && (
        <EditPumpsStatusModal
          isOpen={showEditPumpStatusForm}
          onDismiss={() => setShowEditPumpStatusForm(false)}
          pumps={stationDetails.pumps}
          stationId={stationDetails.id}
        />
      )}
      {showEditStationFeaturesForm && (
        <EditStationFeaturesModal
          isOpen={showEditStationFeaturesForm}
          onDismiss={() => setShowEditStationFeaturesForm(false)}
          existingStationFeatures={stationDetails.features}
          allStationFeatures={stationFeatureTypes}
          stationId={stationDetails.id}
        />
      )}
      <Card className="mb-8">
        <Card.Heading
          title={
            stationDetails ? (
              <div>
                <h1 className="mb-2">{stationDetails.name}</h1>
                <p className="text-sm font-normal text-mediumgrey">{stationDetails.id}</p>
              </div>
            ) : (
              <Skeleton width="medium" />
            )
          }>
          <Button
            data-testid="edit-station-details"
            onClick={() => setShowEditStationDetailsForm(true)}
            variant="outline"
            leftIcon={<EditIcon />}>
            EDIT
          </Button>
        </Card.Heading>
        <Card.Content>
          <DescList className="py-3" isLoading={isLoadingStationDetails}>
            <DescList.Item label="Station name" value={stationDetails?.name} />
            <DescList.Item
              label="Vendor type"
              valueClassName="capitalize"
              value={stationDetails?.vendorType || '-'}
            />
            <DescList.Item
              label="Trading company name"
              value={stationDetails?.merchant?.tradingCompanyName || '-'}
            />
            <DescList.Item label="GST number" value={stationDetails?.merchant?.gstNumber || '-'} />
            <DescList.Item label="Station address" value={stationDetails?.address || '-'} />
            <DescList.Item label="Latitude" value={stationDetails?.latitude || '-'} />
            <DescList.Item label="Longitude" value={stationDetails?.longitude || '-'} />
            <DescList.Item
              label="Geofence latitude"
              value={stationDetails?.geofenceLatitude || '-'}
            />
            <DescList.Item
              label="Geofence longitude"
              value={stationDetails?.geofenceLongitude || '-'}
            />
            <DescList.Item label="Geofence radius" value={stationDetails?.geofenceRadius || '-'} />
            <DescList.Item
              label="Phone number"
              value={stationDetails?.merchant.phoneNumber || '-'}
            />
            <DescList.Item label="Merchant ID" value={stationDetails?.kiplerMerchantId || '-'} />
            <DescList.Item
              label="LMS merchant ID"
              value={stationDetails?.loyaltyVendorMerchantId || '-'}
            />
            <DescList.Item
              label="Fuel merchant"
              value={
                isLoadingStationDetails || isLoadingFuelMerchantDetails ? (
                  <Skeleton width="medium" />
                ) : stationDetails?.fuelMerchantId && fuelMerchantDetails?.name ? (
                  `${stationDetails?.fuelMerchantId} - ${fuelMerchantDetails?.name}`
                ) : (
                  '-'
                )
              }
            />
            <DescList.Item
              label="Store merchant"
              value={
                isLoadingStationDetails || isLoadingStoreMerchantDetails ? (
                  <Skeleton width="medium" />
                ) : stationDetails?.storeMerchantId && storeMerchantDetails?.name ? (
                  `${stationDetails?.storeMerchantId} - ${storeMerchantDetails?.name}`
                ) : (
                  '-'
                )
              }
            />
          </DescList>
        </Card.Content>
      </Card>
      <div className="mb-8">
        <Table isLoading={isLoadingStationDetails} heading={<CardHeading title="Status" />}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Item</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody data-testid="status-rows">
            <Table.Tr>
              <Table.Td>Station</Table.Td>
              <Table.Td>
                <div className="flex justify-between">
                  <Badge
                    className="uppercase"
                    color={StationStatusColor[stationDetails?.status]}
                    rounded="rounded"
                    size="small">
                    {STATION_STATUS_FRIENDLY_NAME[stationDetails?.status]}
                  </Badge>
                  <EditIcon
                    data-testid="edit-station-status"
                    className="text-brand-500 cursor-pointer"
                    onClick={() => {
                      setStatusType({
                        fieldName: 'status',
                        label: 'Station status',
                        initialValue: {status: stationDetails?.status},
                      });
                      setShowEditStationStatusForm(true);
                    }}
                  />
                </div>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Vendor</Table.Td>
              <Table.Td>
                <div className="flex justify-between">
                  {stationDetails?.healthCheck?.status ? (
                    <Badge
                      className="uppercase"
                      color={StationStatusColor[stationDetails?.healthCheck?.status]}
                      rounded="rounded"
                      size="small">
                      {STATION_STATUS_FRIENDLY_NAME[stationDetails?.healthCheck?.status]}
                    </Badge>
                  ) : (
                    '-'
                  )}
                </div>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Store</Table.Td>
              <Table.Td>
                <div className="flex justify-between">
                  <Badge
                    className="uppercase"
                    color={StationStatusColor[stationDetails?.storeStatus]}
                    rounded="rounded"
                    size="small">
                    {STATION_STATUS_FRIENDLY_NAME[stationDetails?.storeStatus]}
                  </Badge>
                  <EditIcon
                    data-testid="edit-store-status"
                    className="text-brand-500 cursor-pointer"
                    onClick={() => {
                      setStatusType({
                        fieldName: 'storeStatus',
                        label: 'Store status',
                        initialValue: {storeStatus: stationDetails?.storeStatus},
                      });
                      setShowEditStationStatusForm(true);
                    }}
                  />
                </div>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Concierge</Table.Td>
              <Table.Td>
                <div className="flex justify-between">
                  <Badge
                    className="uppercase"
                    color={StationStatusColor[stationDetails?.conciergeStatus]}
                    rounded="rounded"
                    size="small">
                    {STATION_STATUS_FRIENDLY_NAME[stationDetails?.conciergeStatus]}
                  </Badge>
                  <EditIcon
                    data-testid="edit-concierge-status"
                    className="text-brand-500 cursor-pointer"
                    onClick={() => {
                      setStatusType({
                        fieldName: 'conciergeStatus',
                        label: 'Concierge status',
                        initialValue: {conciergeStatus: stationDetails?.conciergeStatus},
                      });
                      setShowEditStationStatusForm(true);
                    }}
                  />
                </div>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>
      <div className="mb-8">
        <Table
          isLoading={isLoadingStationDetails}
          heading={
            <CardHeading
              title={`Station operating hours${
                !stationDetails?.isOperating24Hours ? ` (Custom)` : ''
              }`}>
              <Button
                data-testid="edit-operating-hours"
                onClick={() => setShowEditStationOperatingHoursForm(true)}
                variant="outline"
                leftIcon={<EditIcon />}>
                EDIT
              </Button>
            </CardHeading>
          }>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Day</Table.Th>
              <Table.Th>Period</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody data-testid="operating-hours-rows">
            {stationDetails &&
              (stationDetails.isOperating24Hours ? (
                <Table.Tr>
                  <Table.Td>Everyday</Table.Td>
                  <Table.Td>
                    <Badge color="grey" rounded="full" size="large">
                      Available 24 hours
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ) : (
                stationDetails.operatingHours.map((operatingHour) => (
                  <Table.Tr key={operatingHour.day + 'operatingHour'}>
                    <Table.Td>
                      {setDay(new Date(), operatingHour.day).toLocaleDateString('en-US', {
                        weekday: 'long',
                      })}
                    </Table.Td>
                    <Table.Td>
                      {stationDetails.isOperating24Hours ? (
                        <Badge color="grey" rounded="full" size="large">
                          Available 24 hours
                        </Badge>
                      ) : (
                        operatingHour.timeSlots.map(({from, to}, i) => (
                          <Badge key={i + 'timeSlots'} color="grey" rounded="full" size="large">
                            {from === 0 && to === 1440
                              ? 'Available 24 hours'
                              : format(
                                  addMinutes(new Date(new Date().setHours(0, 0, 0, 0)), from),
                                  'hh:mm a',
                                ) +
                                ' - ' +
                                format(
                                  addMinutes(new Date(new Date().setHours(0, 0, 0, 0)), to),
                                  'hh:mm a',
                                )}
                          </Badge>
                        ))
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))
              ))}
          </Table.Tbody>
        </Table>
      </div>
      <Card className="mb-8">
        <Card.Heading title="Pump status">
          <Button
            data-testid="edit-pump-status"
            onClick={() => setShowEditPumpStatusForm(true)}
            variant="outline"
            leftIcon={<EditIcon />}>
            EDIT
          </Button>
        </Card.Heading>
        <Card.Content className="grid grid-cols-6 gap-5" data-testid="pump-status-rows">
          {stationDetails &&
            stationDetails.pumps.map((pump, i) => (
              <div
                key={pump.pumpId + i + 'pump'}
                className={classNames(
                  'p-1 text-center border border-offwhite rounded-lg',
                  pump.status === PumpStatus.INACTIVE && 'bg-grey-100',
                )}>
                <div className="py-3 text-xl text-mediumgrey font-medium">{pump.pumpId}</div>
                <Badge
                  className={classNames(
                    `uppercase justify-center text-xs rounded-b-md rounded-t-none w-full`,
                    pump.status === PumpStatus.INACTIVE && 'text-grey-800',
                  )}
                  color={PumpStatusColorMap[pump.status]}>
                  {pump.status}
                </Badge>
              </div>
            ))}
        </Card.Content>
      </Card>
      <div className="mb-8">
        <Table
          isLoading={isLoadingStationDetails}
          heading={
            <CardHeading title="Features">
              <Button
                data-testid="edit-features"
                onClick={() => setShowEditStationFeaturesForm(true)}
                variant="outline"
                leftIcon={<EditIcon />}>
                EDIT
              </Button>
            </CardHeading>
          }>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Features</Table.Th>
              <Table.Th>Services</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody data-testid="features-rows">
            {stationDetails &&
              stationFeatureTypes &&
              stationDetails.features.map((featureType) => {
                const featureTypeSet = stationFeatureTypes.find(
                  (type) => type.typeId === featureType.typeId,
                );
                const hasFeatureItems = !!featureType.featureItems.length;

                return (
                  <Table.Tr key={featureType.typeId}>
                    <Table.Td>{featureTypeSet?.name}</Table.Td>
                    <Table.Td>
                      <div className="-mt-2">
                        {!hasFeatureItems
                          ? 'Not available'
                          : featureTypeSet.features
                              .filter((feature) => featureType.featureItems.includes(feature.id))
                              .map((type) => (
                                <Badge
                                  key={type.id}
                                  className="mr-2 mt-2"
                                  color="grey"
                                  rounded="full"
                                  size="large">
                                  {type.name}
                                </Badge>
                              ))}
                      </div>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
          </Table.Tbody>
        </Table>
      </div>
      <Card className="mb-8">
        <Card.Heading title="Map"></Card.Heading>
        <Card.Content className="h-96 p-0">
          {stationDetails && (
            <GoogleMap
              yesIWantToUseGoogleMapApiInternals
              onGoogleApiLoaded={({map, maps}) => {
                new maps.Circle({
                  strokeWeight: 0,
                  fillColor: '#f7eb02',
                  fillOpacity: 0.35,
                  map,
                  center: {
                    lat: stationDetails.geofenceLatitude,
                    lng: stationDetails.geofenceLongitude,
                  },
                  radius: stationDetails.geofenceRadius,
                });
                new maps.Marker({
                  position: {lat: stationDetails.latitude, lng: stationDetails.longitude},
                  map,
                  icon: '/assets/images/icon-marker-station.svg',
                });
                new maps.Marker({
                  position: {
                    lat: stationDetails.geofenceLatitude,
                    lng: stationDetails.geofenceLongitude,
                  },
                  map,
                  icon: '/assets/images/icon-marker-station-geofence.svg',
                });
              }}
              zoom={18}
              options={{streetViewControl: false, fullscreenControl: false}}
              center={{lat: stationDetails.latitude, lng: stationDetails.longitude}}></GoogleMap>
          )}
        </Card.Content>
      </Card>
    </div>
  );
}
