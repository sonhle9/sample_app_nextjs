export interface IUpdateOrderTagsParams {
  orderId: string;
  tag: string;
}

export interface IDeleteTag {
  adminTags: string[];
}

export interface IAddTag {
  adminTags: string[];
}
