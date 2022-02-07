import {callAll} from '@setel/portal-ui';
import cx from 'classnames';
import * as React from 'react';
import {useRouter} from './routing.context';

export type LinkProps = React.ComponentProps<'a'> & {
  to: string;
  activeClassName?: string;
};

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function LinkImpl(
  {to, href = to, onClick, activeClassName, className, ...props},
  ref,
) {
  const router = useRouter();

  return (
    <a
      href={href}
      onClick={callAll((ev) => {
        ev.preventDefault();
        router.navigateByUrl(to);
      }, onClick)}
      {...props}
      className={cx(href === router.url && activeClassName, className)}
      ref={ref}
    />
  );
});
