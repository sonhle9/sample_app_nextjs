import {cleanup, screen, within} from '@testing-library/react';
import React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {ICircle} from 'src/shared/interfaces/circles.interface';
import {SetelShareDetailsGeneral} from './setelshare-details-general';

describe(`<SetelShareDetailsGeneral />`, () => {
  const cardComponent = (
    <SetelShareDetailsGeneral circleDetails={{} as ICircle} isLoading={false} />
  );

  afterAll(() => {
    cleanup();
  });

  it('should renders card', async () => {
    renderWithConfig(cardComponent);
    const card = within(screen.getByTestId('setelshare-details-general'));
    expect(await card.findByText('General')).toBeDefined();
    expect(await card.findByText('Setel Share ID')).toBeDefined();
    expect(await card.findByText('Owner')).toBeDefined();
    expect(await card.findByText('Status')).toBeDefined();
    expect(await card.findByText('Created on')).toBeDefined();
    expect(await card.findByText('Deleted')).toBeDefined();
    expect(await card.findByText('Deleted on')).toBeDefined();
  });
});
