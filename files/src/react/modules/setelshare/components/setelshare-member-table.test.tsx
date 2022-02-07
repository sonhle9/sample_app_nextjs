import {cleanup, screen, within} from '@testing-library/react';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {ICircle} from 'src/shared/interfaces/circles.interface';
import {SetelShareMemberTable} from './setelshare-member-table';

describe(`<SetelShareMemberTable />`, () => {
  const currentMemberTableComponent = (
    <SetelShareMemberTable
      circle={{id: 'id', isDeleted: false} as ICircle}
      members={[]}
      isLoading={false}
      isError={false}
    />
  );
  const formerMemberTableComponent = (
    <SetelShareMemberTable members={[]} isLoading={false} isError={false} isFormer />
  );

  afterAll(() => {
    cleanup();
  });

  it('should renders current member list', async () => {
    renderWithConfig(currentMemberTableComponent);
    const table = within(screen.getByTestId('setelshare-member-listing'));
    expect(await table.findByText('MEMBERS')).toBeDefined();
    expect(await table.findByText('STATUS')).toBeDefined();
    expect(await table.findByText('JOINED DATE')).toBeDefined();
    expect(await table.findByText('You have no data to be displayed here')).toBeDefined();
  });

  it('should renders former member list', async () => {
    renderWithConfig(formerMemberTableComponent);
    const table = within(screen.getByTestId('setelshare-member-listing'));
    expect(await table.findByText('MEMBERS')).toBeDefined();
    expect(await table.findByText('STATUS')).toBeDefined();
    expect(await table.findByText('JOINED DATE')).toBeDefined();
    expect(await table.findByText('LEAVE DATE')).toBeDefined();
    expect(await table.findByText('You have no data to be displayed here')).toBeDefined();
  });
});
