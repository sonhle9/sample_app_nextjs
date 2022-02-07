import * as React from 'react';

export const RequiredTitle = (title: string) => {
  return (
    <>
      {title}&nbsp;
      <sup className="text-red-600" style={{top: 0, fontSize: '1rem'}}>
        *
      </sup>
    </>
  );
};

export const OptionalTitle = (title: string) => {
  return (
    <>
      {title}
      <br />
      (Optional)
    </>
  );
};
