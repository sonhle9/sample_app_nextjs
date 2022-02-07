import {environment} from 'src/environments/environment';
import {ajax, fetchPaginatedData, IPaginationParam} from 'src/react/lib/ajax';

export enum AcquirersType {
  PLATFORM = 'PLATFORM',
  MERCHANT = 'MERCHANT',
}

export enum AcquirersStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  DORMANT = 'DORMANT',
}

export enum AcquirersSecurityProtocol {
  TWO_D = '2D',
  THREE_D = '3D',
}

export enum AcquirersPaymentProcessor {
  IPAY88 = 'IPAY88',
  BOOST = 'BOOST',
  SETEL_LOYALTY = 'SETEL_LOYALTY',
}

export interface IAcquirersCredentialsBoost {
  merchantId: string;
  apiKey: string;
  apiSecretKey: string;
}

export interface IAcquirersCredentialsIpay88 {
  merchantCode: string;
  merchantKey: string;
  aesKey: string;
}

export interface IAcquirersCredentials {
  boost?: IAcquirersCredentialsBoost;
  ipay88?: IAcquirersCredentialsIpay88;
}

export interface AcquirerCreateInput {
  name: string;
  combinedName: string;
  type: AcquirersType;
  merchantIds: string[];
  bank?: string;
  paymentProcessor: AcquirersPaymentProcessor;
  securityProtocol?: AcquirersSecurityProtocol;
  credentials: IAcquirersCredentials;
  status: AcquirersStatus;
}

export interface AcquirerUpdateInput extends Partial<AcquirerCreateInput> {
  id: string;
}

export interface Acquirer extends AcquirerCreateInput {
  id: string;
  createdAt: string;
}

const apiSwitchUrl = `${environment.switchApiBaseUrl}/api/switch`;

export interface ListAcquirersParams extends IPaginationParam {
  paymentProcessor?: AcquirersPaymentProcessor;
  type?: AcquirersType;
  merchantId?: string;
  name?: string;
  combinedName?: string;
  bank?: string;
  bankName?: string;
  securityProtocol?: AcquirersSecurityProtocol;
  credentialsIdentifier?: string;
  status?: AcquirersStatus;
  createdAtFrom?: string;
  createdAtTo?: string;
}

export const listAcquirers = (params: ListAcquirersParams) =>
  fetchPaginatedData<Acquirer>(`${apiSwitchUrl}/admin/acquirers`, params);

export const createAcquirer = (data: AcquirerCreateInput) =>
  ajax.post<Acquirer>(`${apiSwitchUrl}/admin/acquirers`, data);

export const getAcquirerDetails = (id: string) =>
  ajax.get<Acquirer>(`${apiSwitchUrl}/admin/acquirers/${id}`);

export const updateAcquirer = ({id, ...data}: AcquirerUpdateInput) =>
  ajax.put<Acquirer>(`${apiSwitchUrl}/admin/acquirers/${id}`, data);
