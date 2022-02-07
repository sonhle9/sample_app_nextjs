import * as React from 'react';
import {FieldContainer} from '@setel/portal-ui';

export type PointRuleFieldProps = {
  name: string;
};

export const PointRuleField: React.FC<PointRuleFieldProps> = ({name, children}) => {
  return (
    <FieldContainer label={name} layout="horizontal-responsive">
      <div className="text-sm">{children ?? '-'}</div>
    </FieldContainer>
  );
};
