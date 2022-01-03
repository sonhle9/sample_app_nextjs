// import { ListParams, ListResponse, Student } from 'models';
import API from '.';
import { User } from '../../redux/session/sessionSlice';

// export interface SessionParams {
//   user: LoginField
// }

export interface LoginField {
  username: string
  password: string
  remember_me: string
}

export interface Response<User> {
  user?: User
  jwt: string
  token: string
  flash?: [message_type: string, message: string]
  error?: string[]
}

const sessionApi = {
  create(params: LoginField): Promise<Response<User>> {
    const url = 'auth/login';
    return API.post(url, params);
  },

  destroy(): Promise<any> {
    const url = '/logout';
    return API.delete(url);
  },
};

export default sessionApi;
