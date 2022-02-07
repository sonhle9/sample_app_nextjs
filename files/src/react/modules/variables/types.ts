import {ConstraintOperator, VariableType, VariableState} from './const';

export interface ITag {
  key: string;
  value: string;
}

export interface IDistribution {
  percent: number;
  variantKey: string;
}

export interface IConstraint {
  property: string;
  operator: ConstraintOperator;
  value: any;
}

export interface ITarget {
  priority: number;
  description?: string;
  constraints: IConstraint[];
  distributions: IDistribution[];
  rolloutPercent?: number;
}

export interface IVariant {
  key: string;
  description?: string;
  value: any;
}

export interface IVariants {
  [key: string]: IVariant;
}

export interface IVariable {
  key: string;
  name: string;
  description?: string;
  type: VariableType;
  group: string;
  tags?: ITag[];
  targets?: ITarget[];
  variants?: IVariants;
  isToggled: boolean;
  onVariation?: IDistribution[];
  offVariation?: string;
  version: number;
  isArchived: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
  state: VariableState;
  comment?: string;
}

export interface IVariablesFilter {
  searchQuery?: string;
  tags?: string;
}

export interface IMetadata {
  currentPage: number;
  pageCount: number;
  totalCount: number;
  nextPageToken?: string;
  pageSize: number;
}

export interface IPaginationParam {
  currentPage: number;
  pageSize: number;
}

export interface IPaginationResult<T> {
  data: T;
  metadata: IMetadata;
}

export interface IVariableError {
  response: {message: string; statusCode: number};
}

export interface IUpdateVariableInput {
  name?: string;
  description?: string;
  group?: string;
  tags?: ITag[];
  targets?: ITarget[];
  variants?: IVariants;
  isToggled?: boolean;
  onVariation?: IDistribution[];
  offVariation?: string;
  isArchived?: boolean;
  comment?: string;
}

export interface ICreateVariableInput {
  key: string;
  name: string;
  description?: string;
  type: VariableType;
  group: string;
  tags?: ITag[];
  targets?: ITarget[];
  variants?: IVariants;
  isToggled: boolean;
  onVariation?: string;
  offVariation?: string;
}

export interface IVariableHistory {
  key: string;
  variable: IVariable;
  updatedBy: string;
  createdAt: number;
  eventName?: string;
  comment?: string;
}

export interface IProperty {
  key: string;
  value: string;
}

export type OperatorValueType = 'string' | 'object';

export interface IOperator extends IProperty {
  valueType: OperatorValueType;
}

export interface ITargetingOptions {
  properties: IProperty[];
  operators: IOperator[];
}
