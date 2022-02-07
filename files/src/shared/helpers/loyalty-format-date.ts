import {parse} from 'date-fns';

export const convertToDate = (date_input: string): Date => {
  let date: Date;

  date = parse(date_input, 'dd-MM-yyyy', new Date());

  if (!isValidDate(date)) {
    date = new Date(date_input);
  }

  return date;
};

export const isValidDate = (date: any) => {
  return date instanceof Date && !isNaN(date as any);
};
