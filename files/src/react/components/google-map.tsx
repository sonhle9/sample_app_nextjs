import GoogleMapReact, {Bounds, Coords, Props} from 'google-map-react';
import * as React from 'react';

export {Bounds, Coords, fitBounds} from 'google-map-react';

export interface GoogleMapProps extends Props {
  children?: React.ReactNode;
}

export const GoogleMap = ({
  defaultCenter = MALAYSIA_COORDS,
  options = defaultOptions,
  ...props
}: GoogleMapProps) => (
  <GoogleMapReact
    bootstrapURLKeys={{key: 'AIzaSyAWXBpTHOCSkqZZYU9RFVuRuibgUx2FFSI'}}
    defaultCenter={defaultCenter}
    options={options}
    {...props}
  />
);

export const MALAYSIA_COORDS = {
  lat: 4.285134,
  lng: 101.722128,
};

const defaultOptions = {
  streetViewControl: true,
};

export const isWithinBounds = ({ne, sw}: Bounds, coords: Coords) =>
  coords.lat < ne.lat && coords.lat > sw.lat && coords.lng < ne.lng && coords.lng > sw.lng;
