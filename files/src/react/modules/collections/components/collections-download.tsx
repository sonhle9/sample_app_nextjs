import {Button, DocIcon, DownloadIcon, Alert, Card} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useReportDownloadUrl} from '../collections.queries';

export type CollectionTransactionsReportDownloadProps = {
  generationId: string;
};

export const CollectionTransactionsReportDownload = (
  props: CollectionTransactionsReportDownloadProps,
) => {
  const {data, isLoading, isError} = useReportDownloadUrl(props.generationId);

  if (isError) {
    return (
      <PageContainer>
        <Alert variant="error" description="Something goes wrong" />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Card className="max-w-xl mx-auto">
        <Card.Content>
          <div className="text-center pt-5">
            <DocIcon className="w-12 inline-block text-lightgrey" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl my-4">Download report</h1>
            <p className="mb-5">
              {data ? `Collection transactions report: ${data.data.id}` : 'Loading...'}
            </p>
            <div className="flex justify-center">
              <Button
                render={(btnProps) => (
                  <a
                    {...btnProps}
                    href={data ? data.data.downloadURL : '#'}
                    download
                    onClick={isLoading ? (ev) => ev.preventDefault() : undefined}
                  />
                )}
                variant="primary"
                leftIcon={<DownloadIcon />}
                isLoading={isLoading}>
                DOWNLOAD CSV
              </Button>
            </div>
          </div>
        </Card.Content>
        <div className="py-5 bg-gray-100">
          <p className="text-center px-6 sm:px-8 max-w-md mx-auto text-xs text-lightgrey">
            This document is strictly confidential and may not be reproduced or circulated without
            the company consent.
          </p>
        </div>
      </Card>
    </PageContainer>
  );
};
