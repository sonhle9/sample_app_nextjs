import {useMutation} from 'react-query';
import {printCardPinMailer} from './card-pin-mailer.service';

export const usePrintCard = () => {
  return useMutation((data: string[]) => {
    return printCardPinMailer(data);
  });
};
