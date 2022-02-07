export interface IMobileVersionPayload {
  releaseDate: string;
  version: string;
  status: string;
  platform: 'ios' | 'android';
}

export interface IMobileVersion extends IMobileVersionPayload {
  id: string;
  createdAt: string;
  updatedAt: string;
}
