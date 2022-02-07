export interface IDevice {
  id: string;
  userId: string;
  deviceId: string;
  isBlocked: boolean;
  remark: string | null;
  createdAt: string;
  updatedAt: string;
  verified: boolean;
}

export interface IUser {
  id: string;
  email: string;
  username: string;
  fullName: string;
  enabled: boolean;
  emailVerified: boolean;
  createdAt: string;
  deviceCreatedAt: string;
}

export interface IDeviceWithUsers {
  device: IDevice;
  users: IUser[];
}
