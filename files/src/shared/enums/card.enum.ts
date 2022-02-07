export enum EFormFactor {
  VIRTUAL = 'virtual',
  PHYSICAL = 'physical',
}

export enum EType {
  FLEET = 'fleet',
  LOYALTY = 'loyalty',
  GIFT = 'gift',
}

export enum EPhysicalType {
  MAGSTRIPE = 'magstripe',
  CHIP = 'chip',
  SCRATCH = 'scratch',
}

export enum ESubtype {
  DRIVER = 'driver',
  VEHICLE = 'vehicle',
  STANDALONE = 'standalone',
  FLEET_MANAGER = 'fleet_manager',
}

export const SubtypeMap = [
  {label: 'Vehicle', value: ESubtype.VEHICLE},
  {label: 'Driver', value: ESubtype.DRIVER},
  {label: 'Standalone', value: ESubtype.STANDALONE},
  {label: 'Fleet manager', value: ESubtype.FLEET_MANAGER},
];

export const SubtypeManual = {
  topup: [
    {
      label: 'Manual top up',
      value: 'MANUAL_TOPUP',
    },
  ],
  charge: [
    {
      label: 'Manual charge',
      value: 'MANUAL_CHARGE',
    },
  ],
};

export const EManualTransactionType = ['topup', 'charge'];
