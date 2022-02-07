import {cleanup, screen, within} from '@testing-library/react';
import React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {ICircle} from 'src/shared/interfaces/circles.interface';
import {SetelShareDetailsMembers} from './setelshare-details-members';

describe(`<SetelShareDetailsMembers />`, () => {
  const cardComponent = (
    <SetelShareDetailsMembers circleDetails={{} as ICircle} isLoading={false} isError={false} />
  );

  afterAll(() => {
    cleanup();
  });

  it('should renders card', async () => {
    renderWithConfig(cardComponent);
    const card = within(screen.getByTestId('setelshare-details-members'));
    expect(await card.findByText('Members')).toBeDefined();
    expect(await card.findByText('Current')).toBeDefined();
    expect(await card.findByText('Former')).toBeDefined();
    expect(await card.findAllByTestId('setelshare-member-listing')).toBeDefined();
  });
});
