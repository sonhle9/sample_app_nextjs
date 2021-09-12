// import { ListParams, ListResponse, Student } from 'models';
import API from '.';

export interface ListParams {
  page?: number
  [key: string]: any
}

export interface ListResponse<Micropost> {
  feed_items: Micropost[]
  followers: number
  following: number
  gravatar: string
  micropost: number
  total_count: number
}

export interface Micropost {
  readonly id: number
  content: string
  gravatar_id?: string
  image: string
  size: number
  timestamp: string
  readonly user_id: number
  user_name?: string
}

const micropostApi = {
  getAll(params: ListParams): Promise<ListResponse<Micropost>> {
    const url = '';
    return API.get(url, { params });
  },

  // getById(id: string): Promise<Student> {
  //   const url = `/students/${id}`;
  //   return API.get(url);
  // },

  // add(data: Student): Promise<Student> {
  //   const url = '/students';
  //   return API.post(url, data);
  // },

  // update(data: Partial<Student>): Promise<Student> {
  //   const url = `/students/${data.id}`;
  //   return API.patch(url, data);
  // },

  remove(id: number): Promise<any> {
    const url = `/microposts/${id}`;
    return API.delete(url);
  },
};

export default micropostApi;
