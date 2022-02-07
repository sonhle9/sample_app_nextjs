import {isEmptyObject} from '@setel/portal-ui';
import {ActivatedRoute, Params, Router} from '@angular/router';
import * as React from 'react';

export const RoutingContext = React.createContext<Router>(null);
RoutingContext.displayName = 'Routing';

export const ActivatedRouteContext = React.createContext<ActivatedRoute>(null);
ActivatedRouteContext.displayName = 'ActivatedRoute';

const QueryParamsContext = React.createContext<{params: Params; activated: boolean}>({
  params: {},
  activated: false,
});
QueryParamsContext.displayName = 'QueryParams';

export const QueryParamsProvider = ({
  activatedRoute,
  children,
}: {
  children: React.ReactNode;
  activatedRoute: ActivatedRoute;
}) => {
  const [params, setParams] = React.useState<Params>({});
  const [activated, setActivated] = React.useState(false);

  React.useEffect(() => {
    // hack for this Angular open issue: https://github.com/angular/angular/issues/12157
    const timeoutId = window.setTimeout(() => {
      setActivated(true);
    }, 500);
    return () => window.clearTimeout(timeoutId);
  }, []);

  React.useEffect(() => {
    if (activatedRoute) {
      // hack for this Angular open issue: https://github.com/angular/angular/issues/12157
      const timeoutId = window.setTimeout(() => {
        setActivated(true);
      }, 500);
      const clearTimer = () => window.clearTimeout(timeoutId);
      const sub = activatedRoute.queryParams.subscribe((newParams) => {
        setParams(newParams);
        if (!isEmptyObject(newParams)) {
          setActivated(true);
          clearTimer();
        }
      });
      return () => {
        sub.unsubscribe();
        clearTimer();
      };
    }
  }, [activatedRoute]);

  const value = React.useMemo(() => ({params, activated}), [params, activated]);

  return activated ? (
    <QueryParamsContext.Provider value={value}>
      <ActivatedRouteContext.Provider value={activatedRoute}>
        {children}
      </ActivatedRouteContext.Provider>
    </QueryParamsContext.Provider>
  ) : null;
};

export const useRouter = () => React.useContext(RoutingContext);

export const useQueryParams = () => React.useContext(QueryParamsContext);

export const useSetQueryParams = () => {
  const activatedRoute = React.useContext(ActivatedRouteContext);
  const router = React.useContext(RoutingContext);

  const set = React.useCallback(
    (params: Params, {merge = true}: {merge?: boolean} = {}) =>
      router.navigate([], {
        relativeTo: activatedRoute,
        queryParams: params,
        queryParamsHandling: merge ? 'merge' : undefined,
      }),
    [activatedRoute, router],
  );

  return set;
};

export const useParams = (activatedRoute?: ActivatedRoute) => {
  const [params, setParams] = React.useState<Params>({});
  const injectedActivatedRoute = React.useContext(ActivatedRouteContext);
  const usedActivatedRoute = activatedRoute || injectedActivatedRoute;
  React.useEffect(() => {
    if (usedActivatedRoute) {
      const sub = usedActivatedRoute.params.subscribe(setParams);
      return sub.unsubscribe.bind(sub);
    }
  }, [usedActivatedRoute]);
  return params;
};
