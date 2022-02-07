import {cleanup, screen, within} from '@testing-library/react';
import user from '@testing-library/user-event';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {ICircleMember} from 'src/shared/interfaces/circles.interface';
import {SetelShareRemoveMemberModal} from './setelshare-remove-member-modal';

describe(`<SetelShareRemoveMemberModal />`, () => {
  const fullName = 'fullName';
  const member = {
    fullName: fullName,
  } as ICircleMember;

  const mockConfirmCallBack = jest.fn();
  const mockCloseCallBack = jest.fn();

  const modalComponent = (
    <SetelShareRemoveMemberModal
      showModal
      isLoading={false}
      member={member}
      onConfirmCallBack={mockConfirmCallBack}
      onCloseCallBack={mockCloseCallBack}
    />
  );

  afterAll(() => {
    cleanup();
  });

  it('should renders modal', async () => {
    renderWithConfig(modalComponent);
    const modal = within(screen.getByTestId('setelshare-remove-member-modal'));
    expect(
      await modal.findByText(`Are you sure you want to remove ${fullName} as member`),
    ).toBeDefined();
    expect(await modal.findByText('Once remove, this action cannot be undone.')).toBeDefined();
    expect(await modal.findByText('CANCEL')).toBeDefined();
    expect(await modal.findByText('REMOVE')).toBeDefined();
  });

  it('should click CANCEL button', () => {
    renderWithConfig(modalComponent);
    const modal = within(screen.getByTestId('setelshare-remove-member-modal'));
    user.click(modal.getByText('CANCEL'));
    expect(mockCloseCallBack).toBeCalled();
  });

  it('should click REMOVE button', () => {
    renderWithConfig(modalComponent);
    const modal = within(screen.getByTestId('setelshare-remove-member-modal'));
    user.click(modal.getByText('REMOVE'));
    expect(mockConfirmCallBack).toBeCalled();
  });
});
