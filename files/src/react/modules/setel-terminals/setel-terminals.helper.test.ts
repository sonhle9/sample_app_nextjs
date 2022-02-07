import {MerchantContactInfo} from '../merchants/merchants.type';
import {
  convertStringWithSquareBracketsToArray,
  createMerchantAddress,
} from './setel-terminals.helper';

describe('Setel Terminal Helper', () => {
  describe('convertStringWithSquareBracketsToArray', () => {
    it('should return an array with length 1', () => {
      const input = `Values already exist in collection ["123"]`;
      const res = convertStringWithSquareBracketsToArray(input);
      expect(res).toEqual(['123']);
    });
    it('should return an array with length 5', () => {
      const input = `Values already exist in collection ["123","serialNum","helloWorld","random","string"]`;
      const res = convertStringWithSquareBracketsToArray(input);
      expect(res).toEqual(['123', 'serialNum', 'helloWorld', 'random', 'string']);
    });
    it('should return undefined', () => {
      const input = `Values already exist in collection`;
      const res = convertStringWithSquareBracketsToArray(input);
      expect(res).toEqual(undefined);
    });
  });
  describe('createMerchantAddress', () => {
    it('should return full merchant address', () => {
      const input: MerchantContactInfo = {
        addressLine1: 'address one',
        addressLine2: 'address two',
        city: 'kl',
        postcode: '58100',
        state: 'state',
      };
      const res = createMerchantAddress(input);
      expect(res).toEqual('address one, address two, kl, 58100, state');
    });
    it('should return partial merchant address', () => {
      const input: MerchantContactInfo = {
        addressLine1: 'address one',
        postcode: '58100',
        state: 'state',
      };
      const res = createMerchantAddress(input);
      expect(res).toEqual('address one, 58100, state');
    });
    it('should return dashed address on empty object', () => {
      const input: MerchantContactInfo = {};
      const res = createMerchantAddress(input);
      expect(res).toEqual('-');
    });
    it('should return dashed address on undefined', () => {
      const input: MerchantContactInfo = undefined;
      const res = createMerchantAddress(input);
      expect(res).toEqual('-');
    });
  });
});
