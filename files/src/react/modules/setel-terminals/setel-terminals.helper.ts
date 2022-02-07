import {MerchantContactInfo} from '../merchants/merchants.type';
import {
  AcquirerType,
  CardBrand,
  CardBrandOption,
  CardBrandPrettyTextMapping,
} from './setel-terminals.const';
import {SetelTerminalCardType} from './setel-terminals.types';
/**
 *
 * @description This function accept a string and search for square brackets to convert it into array
 * @example convertStringWithSquareBracketsToArray("Some wording ["serialNum1","serialNum2"]")
 * @returns Array ["serialNum1","serialNum3"]
 */
export const convertStringWithSquareBracketsToArray = (value: string): string[] | undefined => {
  const regexBetweenSquareBrackets = /\[(.*?)\]/g;
  const regexMatch = value.match(regexBetweenSquareBrackets)?.[0];

  return regexMatch ? JSON.parse(regexMatch) : undefined;
};

export const createMerchantAddress = (value: MerchantContactInfo): string => {
  /* if value is undefined or empty object {} */
  if (!value || !Boolean(Object.keys(value).length)) return '-';

  let fullAddress = '';

  if (value.addressLine1) {
    fullAddress += value.addressLine1;
  }

  if (value.addressLine2) {
    fullAddress += ', ' + value.addressLine2;
  }

  if (value.city) {
    fullAddress += ', ' + value.city;
  }

  if (value.postcode) {
    fullAddress += ', ' + value.postcode;
  }

  if (value.state) {
    fullAddress += ', ' + value.state;
  }

  return fullAddress;
};

export const filterCardBrand = (cardBrandOptions: CardBrandOption[], acquirerType: string) => {
  let filteredCardBrandOptions: CardBrandOption[] = [];
  if (acquirerType === AcquirerType.FLEET) {
    filteredCardBrandOptions = cardBrandOptions
      .map((options) => options)
      .filter((option) => option.label === CardBrandPrettyTextMapping[CardBrand.PETRONAS_SMARTPAY]);
  } else {
    filteredCardBrandOptions = cardBrandOptions
      .map((options) => options)
      .filter((option) => option.label !== CardBrandPrettyTextMapping[CardBrand.PETRONAS_SMARTPAY]);
  }
  return filteredCardBrandOptions;
};

export const GET_SETEL_TERMINAL_CARD_TYPE = {
  card: SetelTerminalCardType.OPEN_LOOP_CARDS,
  closeLoopCard: SetelTerminalCardType.CLOSED_LOOP_CARDS,
};
