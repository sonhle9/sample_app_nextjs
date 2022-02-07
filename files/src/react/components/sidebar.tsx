import {
  ChevronRightIcon,
  InputButton,
  OptionsOrGroups,
  SearchIcon,
  SearchModal,
  Sidebar as RsSidebar,
  SidebarGroup,
  SidebarHeader,
  SidebarLink,
  SidebarLinkGroup,
  SidebarNav,
} from '@setel/portal-ui';
import cx from 'classnames';
import * as React from 'react';
import {useRouter} from 'src/react/routing/routing.context';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {IMenuGroup, IMenuItem, IMenuItemGroup} from 'src/shared/interfaces/core.interface';
import {usePersistedState} from '../hooks/use-persisted-state';
import {useQueueState} from '../hooks/use-queue-state';
import {useToggle} from '../hooks/use-toggle';
import {Link} from '../routing/link';
import {LogoAndEnterpriseName} from './logo-and-enterprise-name';
import {RsSidebarSlideMenu} from './rs-sidebar-slide-menu';
import {Seo} from './seo';

export interface ISidebarProps {
  menus: IMenuGroup[];
  hidden: boolean;
  slideMenuTargetRef: React.RefObject<HTMLElement>;
}

export interface ISwitchEnterpriseProps {
  isOpenSlide: boolean;
  setOpenSlide;
}

export const Sidebar = (props: ISidebarProps) => {
  const [isOpenSlide, setOpenSlide] = React.useState(false);
  const dismissSlide = React.useCallback(() => {
    setOpenSlide(false);
  }, []);

  const [showSearchModal, setShowSearchModal] = React.useState(false);
  const searchOptions = React.useMemo(() => mapMenuToOptions(props.menus), [props.menus]);
  const [histories, setHistories] = usePersistedState<string[]>([], 'menu-search-history');
  const [, addSearchToQueue] = useQueueState(histories, {reverse: true, dedupe: true});

  const router = useRouter();

  return (
    <>
      <Seo title={`${CURRENT_ENTERPRISE.shortName} Admin Portal`} />
      <RsSidebar hidden={props.hidden}>
        <SidebarHeader>
          <div className="pt-3 px-2">
            <SwitchEnterprise setOpenSlide={setOpenSlide} isOpenSlide={isOpenSlide} />
          </div>
          <div className="px-5 pt-2 pb-5">
            <InputButton
              onClick={() => setShowSearchModal(true)}
              accessKey="/"
              size="compact"
              className="w-full bg-carbon-500 border-transparent focus:border-carbon-200">
              <SearchIcon className="w-5 h-5 mr-2 -ml-1 text-gray-300" />
              <span className="text-offwhite text-sm">Search...</span>
            </InputButton>
            {showSearchModal && (
              <SearchModal
                results={searchOptions}
                onSelect={(targetUrl, searchTerm) => {
                  router.navigateByUrl(targetUrl);
                  addSearchToQueue(searchTerm, setHistories);
                }}
                isOpen={showSearchModal}
                onDismiss={() => setShowSearchModal(false)}
                placeholder="Search for product category, name or feature.."
                searchHistories={histories}
              />
            )}
          </div>
        </SidebarHeader>
        <SidebarNav>
          {props.menus.map((menu, index) => (
            <MenuGroup menu={menu} key={index} />
          ))}
        </SidebarNav>
      </RsSidebar>
      <RsSidebarSlideMenu
        targetRef={props.slideMenuTargetRef}
        isOpenSlide={isOpenSlide}
        dismissSlide={dismissSlide}
      />
    </>
  );
};

const MenuGroup = (props: {menu: IMenuGroup}) => {
  const {items = [], text} = props.menu;
  return (
    <SidebarGroup label={text}>
      {items.map((item) => {
        if ('items' in item) {
          return <MenuItemGroup key={item.text} menu={item as IMenuItemGroup} feature={text} />;
        }
        return <MenuItem key={item.text} menu={item as IMenuItem} feature={text} />;
      })}
    </SidebarGroup>
  );
};

const MenuItemGroup = (props: {menu: IMenuItemGroup; feature: string}) => {
  const [open, toggleOpen] = useToggle(false);
  const {icon: Icon, text, items = []} = props.menu;
  const icon = Icon && <Icon className="h-6 w-6 fill-current text-white opacity-50" />;
  return (
    <SidebarLinkGroup
      style={{paddingRight: '0px'}}
      icon={icon}
      label={text}
      isOpen={open}
      onToggleOpen={toggleOpen}>
      {open
        ? items.map((item, index) => (
            <MenuItem key={index} menu={item} feature={props.feature} parentText={text} />
          ))
        : null}
    </SidebarLinkGroup>
  );
};

const MenuItem = (props: {
  menu: IMenuItem;
  className?: string;
  parentText?: string;
  feature: string;
}) => {
  const {icon: Icon, text} = props.menu;
  const router = useRouter();
  const isActive = router.url === props.menu.url;

  const icon = Icon && <Icon className="h-6 w-6 fill-current text-white opacity-50" />;

  const testId = `${props.feature}${
    props.parentText ? `-${props.parentText}` : ''
  }-${text}`.toLowerCase();

  return (
    <>
      <SidebarLink
        render={({baseClass, activeClass, defaultClass}) => (
          <Link
            to={props.menu.url}
            className={cx(baseClass, defaultClass, props.className, {
              'link-disabled': !props.menu.url,
            })}
            activeClassName={activeClass}
            data-testid={testId}>
            {icon && (
              <span className={cx('ml-0.5 mr-2 transition-colors duration-300')}>{icon}</span>
            )}
            {text}
          </Link>
        )}
      />
      {isActive && (
        <Seo
          title={`${[text, props.feature].filter(Boolean).join(' - ')} | ${
            CURRENT_ENTERPRISE.shortName
          } Admin Portal`}
        />
      )}
    </>
  );
};

const SwitchEnterprise = (props: ISwitchEnterpriseProps) => {
  return (
    <button
      className="flex flex-row items-center py-2 px-3 w-full justify-between focus:outline-none focus-visible:shadow-outline-gray"
      onClick={() => {
        props.setOpenSlide(!props.isOpenSlide);
      }}>
      <LogoAndEnterpriseName enterprise={CURRENT_ENTERPRISE} />
      <ChevronRightIcon className="w-4 h-4 flex justify-end" />
    </button>
  );
};

const mapMenuToOptions = (menuItems: IMenuGroup[]): OptionsOrGroups<string> => {
  if (!Array.isArray(menuItems)) {
    return [];
  }

  return menuItems.map((item) => {
    const options: Array<{value: string; label: string; description?: string}> = [];

    item.items.forEach((child) => {
      if ('items' in child) {
        child.items.forEach((grandChild) => {
          options.push({
            value: grandChild.url,
            label: grandChild.text,
          });
        });
      } else {
        options.push({
          value: child.url,
          label: child.text,
        });
      }
    });

    return {
      type: 'group',
      label: item.text,
      options,
    };
  });
};
