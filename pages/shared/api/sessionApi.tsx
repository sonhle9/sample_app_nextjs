// import { ListParams, ListResponse, Student } from 'models';
import API from '.';
import { User } from '../../redux/session/sessionSlice';

export interface SessionParams {
  session: LoginField
}

export interface LoginField {
  email: string
  password: string
  remember_me: string
}

export interface Response<User> {
  user?: User
  flash?: [message_type: string, message: string]
}

const sessionApi = {
  create(params: SessionParams): Promise<Response<User>> {
    const url = '/login';
    return API.post(url, params);
  },

  destroy(): Promise<any> {
    const url = '/logout';
    return API.delete(url);
  },
};

export default sessionApi;
