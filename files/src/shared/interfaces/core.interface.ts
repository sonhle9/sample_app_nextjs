type IconType = (props: React.ComponentPropsWithoutRef<'svg'>) => React.ReactElement;

export interface IMenuItem {
  text: string;
  accessedWith?: string[];
  url: string;
  icon?: IconType;
  productKey?: string;
  type?: 'item';
}

export interface IMenuItemGroup {
  text: string;
  icon: IconType;
  items: Array<IMenuItem>;
  active?: boolean;
  productKey?: string;
  type: 'group';
}

export interface IMenuGroup {
  text?: string;
  items: Array<IMenuItem | IMenuItemGroup>;
  active?: boolean;
  productKey?: string;
}

export interface IPagination<T> {
  max: number;
  index?: number;
  page?: number;
  items: T[];
  hideCount?: boolean;
}

export interface IPaginationHeaders {
  'x-total-count': number;
  'x-next-page': number;
  'x-per-page': number;
}

export interface IPaginationResponse<T> {
  headers: IPaginationHeaders;
  items: T[];
}

export interface IPag {
  page: number;
  perPage: number;
  total?: number;
}

export interface IPaginatedResult<D> {
  data: D;
  pagination: {
    total: number;
  };
}

export interface IPaginationParams {
  page?: number;
  perPage?: number;
}
