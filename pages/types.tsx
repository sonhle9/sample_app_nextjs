export interface FlashMessage {
  message_type: string;
  message: string;
}

export interface User {
  id: BigInt
  name: string
  admin: boolean
  email: string
}

export interface UserState {
  value: User
  status: 'idle' | 'loading' | 'failed'
  error: string
}
