import {environment} from 'src/environments/environment';
import {extractError} from 'src/react/lib/ajax';
import {PointBalance} from './points-balance.type';
import axios, {AxiosResponse} from 'axios';

const pointsBalanceBaseURL = `${environment.variablesBaseUrl}/api/points-balance/balance`;

export const getPointsBalanceExpiry = (memberId: string) =>
  axios
    .get(`${pointsBalanceBaseURL}/expiry/${memberId}`)
    .then((res: AxiosResponse<PointBalance>) => res.data)
    .catch((e) => extractError(e));
