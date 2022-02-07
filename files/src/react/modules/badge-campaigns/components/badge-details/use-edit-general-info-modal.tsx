import * as React from 'react';
import {BadgeModal} from '../badge-modal';
import {IBadge} from 'src/react/modules/badge-campaigns/badge-campaigns.type';

export function useEditGeneralInfoModal(badge: IBadge) {
  const [isVisible, setIsVisible] = React.useState(false);
  return {
    open: () => setIsVisible(true),
    component: <BadgeModal badge={badge} isOpen={isVisible} onClose={() => setIsVisible(false)} />,
  };
}
