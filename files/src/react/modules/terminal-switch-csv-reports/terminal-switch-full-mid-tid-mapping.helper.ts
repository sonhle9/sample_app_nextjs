import {saveAs} from 'file-saver';
import jszip from 'jszip';
import * as _ from 'lodash';
import {generateSignedLinkS3FullMidTidMappingReportFile} from './terminal-switch-full-mid-tid-mapping.service';

const zipDownloadedFile = async (zip: jszip, keys: string[]) => {
  const urls = await generateSignedLinkS3FullMidTidMappingReportFile(keys);
  await Promise.all(
    urls.map(async (url, index) => {
      try {
        const key = keys[index];
        const fileName = key.split('/')[2];
        const res = await fetch(url, {
          headers: {
            type: 'blob',
            accept: 'text/csv',
          },
        });
        const text = await res.text();
        zip.file(fileName, text);
      } catch (e) {}
    }),
  );
  return zip;
};

export const downloadAndCompressFullMidTidMapping = async (keys: string[], fileName: string) => {
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
