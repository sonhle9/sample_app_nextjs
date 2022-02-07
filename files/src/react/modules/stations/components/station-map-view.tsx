import {Badge, CardPopover} from '@setel/portal-ui';
import cx from 'classnames';
import * as React from 'react';
import {
  Bounds,
  Coords,
  GoogleMap,
  isWithinBounds,
  MALAYSIA_COORDS,
} from 'src/react/components/google-map';
import {StationFilter} from 'src/react/services/api-stations.service';
import {IIndexStation} from 'src/shared/interfaces/station.interface';
import {StationStatusColor, statusLabelMap, vendorStatusColor} from '../stations.const';
import {useStations} from '../stations.queries';

export interface StationMapViewProps {
  filter: StationFilter;
}

export const StationMapView = (props: StationMapViewProps) => {
  const [{zoomLevel, bounds, center}, setMapState] = React.useState<{
    zoomLevel: number;
    bounds: Bounds | undefined;
    center: Coords;
  }>({zoomLevel: 6, bounds: undefined, center: MALAYSIA_COORDS});
  const {data} = useStations(props.filter);
  const size =
    zoomLevel < 8 ? 'none' : zoomLevel < 10 ? 'small' : zoomLevel < 13 ? 'medium' : 'large';

  const markers = React.useMemo(() => {
    // show markers with large zoom level or very few stations
    return size !== 'none' || (data && data.items.length < 10)
      ? data &&
          data.items
            .filter(
              (station) =>
                !bounds || isWithinBounds(bounds, {lat: station.latitude, lng: station.longitude}),
            )
            .map((station) => (
              <Marker
                lat={station.latitude}
                lng={station.longitude}
                station={station}
                size={size === 'none' ? 'small' : size}
                key={station.id}
              />
            ))
      : null;
  }, [data, size, bounds]);

  return (
    <div className="h-screen-60 w-full">
      <GoogleMap
        zoom={zoomLevel}
        center={center}
        onChange={(changes) =>
          setMapState({
            zoomLevel: changes.zoom,
            bounds: changes.bounds,
            center: changes.center,
          })
        }>
        {markers}
      </GoogleMap>
    </div>
  );
};

interface MarkerProps {
  station: IIndexStation;
  size: 'large' | 'medium' | 'small';
  lat: number;
  lng: number;
}

function Marker({size, station}: MarkerProps) {
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const [showPopover, setShowPopover] = React.useState(false);
  const markerImg = (
    <img
      src="/assets/images/icon-marker-station.svg"
      className={cx({large: 'w-11', medium: 'w-7', small: 'w-4'}[size])}
    />
  );

  return size !== 'small' ? (
    <>
      <button
        onClick={() => setShowPopover(!showPopover)}
        onBlur={() => setShowPopover(false)}
        ref={btnRef}
        type="button"
        className="bg-transparent transform -translate-x-1/2 -translate-y-full focus-visible-ring">
        {markerImg}
      </button>
      <CardPopover targetRef={btnRef} isOpen={showPopover} className="w-80">
        {showPopover && (
          <CardPopover.Content>
            <div className="pb-3 border-b border-gray-200">
              <div className="text-xl font-medium text-justify mb-1">{station.name}</div>
              <p className="text-xs mb-2">
                {station.latitude} , {station.longitude}
              </p>
              <Badge color={StationStatusColor[station.status]} className="uppercase">
                {statusLabelMap[station.status]}
              </Badge>
            </div>
            <div className="pt-3 space-y-1">
              <div className="text-xs text-lightgrey font-bold">VENDOR</div>
              <div className="flex items-center space-x-1">
                <span className="capitalize">{station.vendorType}</span>
                {station.healthCheck ? (
                  <Badge
                    color={vendorStatusColor[station.healthCheck.status]}
                    className="uppercase">
                    {station.healthCheck.status}
                  </Badge>
                ) : (
                  <Badge>UNKNOWN</Badge>
                )}
              </div>
            </div>
          </CardPopover.Content>
        )}
      </CardPopover>
    </>
  ) : (
    <div className="transform -translate-x-1/2 -translate-y-full">{markerImg}</div>
  );
}
