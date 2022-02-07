import * as React from 'react';
import {screen} from '@testing-library/react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {ReceivablesExceptionModal} from './receivables-exception-modal';
import {IReceivableException} from 'src/react/services/api-ledger.type';

const SAMPLE_EXCEPTION: IReceivableException = {
  id: '5e5e3bf63e869e0010cf2641',
  metadata: {
    date: null,
    amount: 1,
    feeAmount: 0.5,
    transId: '123abc',
    merchantRefNo: '1010101',
    commAmount: 0,
    merchantCode: 'string',
    no: 0,
    paymentMethod: '',
    prodDesc: '',
    remark: '',
    status: '',
    taxAmount: 0,
    totalAmount: 0,
    userName: '',
  },
  reason: 'test',
  isResolved: false,
  receivableId: '5e607f287c73f90010a8ab3b',
};

describe(`<ReceivablesExceptionModal />`, () => {
  it('Pop up Receivables Exception Modal', async () => {
    renderWithConfig(
      <ReceivablesExceptionModal
        data={SAMPLE_EXCEPTION}
        header={`Exception Details - ${SAMPLE_EXCEPTION.metadata.merchantRefNo}`}
        onDismiss={() => {}}
      />,
    );
    expect(screen.queryAllByTestId('card-content').length).toBe(2);
  });
});
