import {getS3FileKeyFromURL} from './get-s3-filekey';

describe('getS3FileKeyFromURL', () => {
  it('returns the fileKey from valid url', () => {
    const url =
      'https://api-loyalty.s3.amazonaws.com/dev/image/1619074363266-70831577777779133-grant.png';

    expect(getS3FileKeyFromURL(url)).toBe('image/1619074363266-70831577777779133-grant.png');
  });
  it('returns the empty string from invalid url', () => {
    const url =
      'https://api-loyalty.s3.ama.com/dev/image/1619074363266-70831577777779133-grant.png';

    expect(getS3FileKeyFromURL(url)).toBe('');
  });
});
