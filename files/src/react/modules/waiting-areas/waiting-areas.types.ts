export * from 'src/react/services/api-stores.type';

export interface NameLocale {
  en?: string;
  ms?: string;
  'zh-Hans'?: string;
  'zh-Hant'?: string;
  ta?: string;
}

export interface WaitingArea {
  id: string;
  name: string;
  status: WaitingAreaStatus;
  latitude: number;
  longitude: number;
  image?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  nameLocale?: NameLocale;
  type?: WaitingAreaType;
}

export enum WaitingAreaStatus {
  ON = 'on',
  OFF = 'off',
}

export enum WaitingAreaType {
  COOKING_GAS_CAGE = 'cooking_gas_cage',
  OTHER = 'other',
}

export interface WaitingAreaPayload
  extends Pick<
    WaitingArea,
    'name' | 'status' | 'latitude' | 'longitude' | 'tags' | 'nameLocale' | 'type'
  > {
  image: File | string;
}

export interface UpdateWaitingAreaPayload extends WaitingAreaPayload, Pick<WaitingArea, 'id'> {}

export const INITIAL_WAITING_AREA: Omit<
  WaitingArea,
  'id' | 'createdAt' | 'updatedAt' | 'nameLocale'
> = {
  name: '',
  latitude: 0,
  longitude: 0,
  status: WaitingAreaStatus.OFF,
  tags: [],
  type: WaitingAreaType.OTHER,
};
