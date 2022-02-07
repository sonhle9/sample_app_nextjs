export const getS3FileKeyFromURL = (url?: string) => {
  try {
    const isValid = /s3(.ap-southeast-1)?.amazonaws.com/gi.test(url);
    if (!isValid) throw new Error('Not valid bucket');
    return new URL(url).pathname.split('/').slice(2).join('/');
  } catch (_) {
    return '';
  }
};

export const getS3FileNameFromURL = (url?: string) => {
  try {
    const isValid = /s3(.ap-southeast-1)?.amazonaws.com/gi.test(url);
    if (!isValid) throw new Error('Not valid bucket');
    return new URL(url).pathname.split('/').slice(3);
  } catch (_) {
    return null;
  }
};
