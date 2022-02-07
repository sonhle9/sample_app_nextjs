import * as React from 'react';
import {Helmet} from 'react-helmet';

export type SeoProps = {
  title: string;
  titleTemplate?: string;
};

export const Seo = (props: SeoProps) => {
  return (
    <Helmet titleTemplate={props.titleTemplate}>
      <title>{props.title}</title>
    </Helmet>
  );
};
