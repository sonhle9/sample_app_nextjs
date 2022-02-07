import {JsonPanel} from '@setel/portal-ui';
import {AxiosError} from 'axios';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {useValidateVoucher} from '../vouchers.queries';

export function VoucherDetails({voucherCode}: {voucherCode: string}) {
  const {
    data: voucherDetails,
    isError,
    isLoading,
    error,
  } = useValidateVoucher(voucherCode, {
    retry: (retryCount, err: AxiosError) => err?.response?.status !== 404 && retryCount < 3,
  });

  return (
    <>
      {!isLoading &&
        (isError ? (
          <QueryErrorAlert className="mt-4 mx-10" error={(error as any) || null} />
        ) : (
          <PageContainer heading="Voucher details">
            {voucherDetails && (
              <JsonPanel
                json={Object.assign({...voucherDetails})}
                title="JSON"
                defaultOpen
                allowToggleFormat
              />
            )}
          </PageContainer>
        ))}
    </>
  );
}
