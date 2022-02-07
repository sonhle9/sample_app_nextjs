import {
  SidebarSlideMenu,
  SidebarSlideMenuItem,
  SidebarSlideMenuProps,
  SidebarSlideMenuSection,
} from '@setel/portal-ui';
import * as React from 'react';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {ENTERPRISES} from '../../shared/enums/enterprise.enum';
import {LogoAndEnterpriseName} from './logo-and-enterprise-name';

export interface IRsSidebarSlideMenuProps {
  isOpenSlide: boolean;
  dismissSlide: () => void;
  targetRef: SidebarSlideMenuProps['targetRef'];
}

export const RsSidebarSlideMenu = (props: IRsSidebarSlideMenuProps) => {
  return (
    <SidebarSlideMenu
      targetRef={props.targetRef}
      heading="Switch to"
      isOpen={props.isOpenSlide}
      onDismiss={props.dismissSlide}>
      <SidebarSlideMenuSection heading="ENTERPRISE">
        {ENTERPRISES.map((ent) => (
          <SidebarSlideMenuItem
            className="flex flex-row items-center"
            active={ent === CURRENT_ENTERPRISE}
            onClick={() => {
              props.dismissSlide();
              if (ent !== CURRENT_ENTERPRISE) {
                window.location.href = ent.url;
              }
            }}
            key={ent.name}>
            <LogoAndEnterpriseName enterprise={ent} />
          </SidebarSlideMenuItem>
        ))}
      </SidebarSlideMenuSection>
    </SidebarSlideMenu>
  );
};
