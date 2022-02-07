import {saveAs} from 'file-saver';
import jszip from 'jszip';
import * as _ from 'lodash';
import {generateSignedS3ObjectKey} from './terminal-switch-hourly-transaction-file.service';

const zipDownloadedFile = async (zip: jszip, keys: string[]) => {
  const urls = await generateSignedS3ObjectKey(keys);
  await Promise.all(
    urls.map(async (url, index) => {
      try {
        const key = keys[index];
        const folderName = key.split('/')[2];
        const fileName = key.split('/')[3];
        const folder = zip.folder(folderName);
        const res = await fetch(url, {
          headers: {
            type: 'blob',
            accept: 'text/csv',
          },
        });
        const text = await res.text();
        folder.file(fileName, text);
      } catch (e) {}
    }),
  );
  return zip;
};

export const downloadAndCompress = async (keys: string[], fileName: string) => {
  const zip = new jszip();

  for await (const chuck of _.chunk(keys, 10)) {
    await zipDownloadedFile(zip, chuck);
  }

  await zip
    .generateAsync({
      type: 'blob',
    })
    .then((content) => {
      saveAs(content, fileName);
    });
};
