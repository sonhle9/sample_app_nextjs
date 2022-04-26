import API from '.';

// export interface CreateParams {
//   password_reset: PasswordResetCreateField
// }

export interface PasswordResetCreateField {
  email: string
}

export interface CreateResponse {
  flash: [message_type: string, message: string]
}

export interface UpdateResponse {
  user_id?: string
  flash?: [message_type: string, message: string]
  error?: string[]
}

export interface UpdateParams {
  email: string,
  user: PasswordResetUpdateField
}

export interface PasswordResetUpdateField {
  password: string
  password_confirmation: string
}

const passwordResetApi = {
  create(params: PasswordResetCreateField): Promise<CreateResponse> {
    const url = '/auth/forgot-password';
    return API.post(url, params);
  },
  update(reset_token: string, params: UpdateParams): Promise<UpdateResponse> {
    const url = `/auth/reset-password?token=${reset_token}`;
    return API.post(url, { password: params.user.password });
  }
};

export default passwordResetApi;
