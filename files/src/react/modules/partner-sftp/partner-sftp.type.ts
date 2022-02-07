export enum SftpTargetType {
  MERCHANT = 'merchant',
}

export type SftpConnectionConfig = {
  id: string;
  targetType: SftpTargetType;
  targetId: string;
  host: string;
  port: number;
  username: string;
  destinationFolder?: string;
  isActivated: boolean;
  password?: string;
};

export type CreateSftpConnectionConfig = {
  targetType: SftpTargetType;
  targetId: string;
  host: string;
  port: number;
  username: string;
  password?: string;
  destinationFolder?: string;
};

export type UpdateSftpConnectionConfig = Partial<CreateSftpConnectionConfig> & {
  isActivated?: boolean;
};
