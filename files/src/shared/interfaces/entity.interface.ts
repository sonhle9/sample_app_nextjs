export interface IAttribute {
  key: string;
  value: any;
  updatedAt?: number;
}

export interface IAttributes {
  [key: string]: IAttribute;
}

export interface IEntity {
  entityId: string;
  entityType: string;
  attributes?: IAttributes;
  createdAt?: number;
  updatedAt?: number;
}
