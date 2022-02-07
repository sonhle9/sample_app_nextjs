export interface ApiError extends Error {
  status: number;
  statusText: string;
  headers: Record<string, any>;
  data: {
    message?: string;
    errorCode: string;
    statusCode: number;
  };
  config: Record<string, any>;
}
