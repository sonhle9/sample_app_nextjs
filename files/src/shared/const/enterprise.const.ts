import {environment} from 'src/environments/environment';
import {KEYED_ENTERPRISES} from 'src/shared/enums/enterprise.enum';

export const CURRENT_ENTERPRISE = (function () {
  const enterprise = KEYED_ENTERPRISES[environment.enterprise as keyof typeof KEYED_ENTERPRISES];

  if (!enterprise) {
    throw new Error(`Enterprise metadata is not configured for ${environment.enterprise}`);
  }

  return enterprise;
})();
