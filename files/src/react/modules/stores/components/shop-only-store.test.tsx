import {screen, within} from '@testing-library/react';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {ShopOnly} from './shop-only-store';

describe(`<ShopOnly />`, () => {
  it('render waiting Area', async () => {
    renderWithConfig(<ShopOnly storeId={'abc123'} />);

    const waitingAreaStore = within(screen.getByTestId('waiting-area-store'));

    expect(await waitingAreaStore.findByText('Area Name')).toBeDefined();
    expect(await waitingAreaStore.findByText('Status')).toBeDefined();
  });
});
