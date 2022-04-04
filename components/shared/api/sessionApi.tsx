// import { ListParams, ListResponse, Student } from 'models';
import API from '.';
import { User } from '../../../redux/session/sessionSlice';

// export interface SessionParams {
//   session: LoginField
// }

export interface LoginField {
  email: string
  password: string
  // remember_me: string
}

export interface LogoutField {
  refreshToken: string
}

export interface Response<User> {
  user?: User
  // jwt: string
  tokens: { 
    access : {expires: string, token: string},
    refresh : {expires: string, token: string}
  }
  flash?: [message_type: string, message: string]
  // message?: string
  error?: string[]
}

const sessionApi = {
  create(params: LoginField): Promise<Response<User>> {
    const url = '/auth/login';
    return API.post(url, params);
  },

  destroy(params: LogoutField): Promise<any> {
    const url = '/auth/logout';
    return API.post(url, params);
  },
};

export default sessionApi;
