import {classes, InfoIcon, Skeleton, SkeletonProps, Text, Tooltip} from '@setel/portal-ui';
import cn from 'classnames';
import * as React from 'react';

export type InfoLineProps = {
  label: string;
  tooltip?: string;
  labelClassName?: string;
  valueClassName?: string;
  isLoading?: boolean;
  skeletonLines?: number;
  skeletonWidth?: SkeletonProps['width'];
  skeletonHeight?: SkeletonProps['height'];
};

export const InfoLine: React.FC<InfoLineProps> = ({
  label,
  tooltip,
  isLoading,
  skeletonLines = 1,
  skeletonWidth,
  skeletonHeight,
  labelClassName,
  valueClassName,
  children,
}) => (
  <div className="flex my-3">
    <Text className={cn(classes.body, 'w-1/4', 'pr-10', labelClassName)} color="mediumgrey">
      {label}
      {tooltip && (
        <span className="ml-4">
          <Tooltip label={tooltip}>
            <span>
              <InfoIcon className="inline w-5 h-5 fill-current text-gray-400" />
            </span>
          </Tooltip>
        </span>
      )}
    </Text>
    {isLoading ? (
      <div className="flex flex-col space-y-1">
        {Array.from({length: skeletonLines}, (_, idx) => (
          <Skeleton
            key={idx}
            className="animate-pulse"
            width={skeletonWidth}
            height={skeletonHeight}
          />
        ))}
      </div>
    ) : typeof children === 'string' || typeof children === 'number' ? (
      <Text className={cn(classes.body, 'w-3/4 pr-20', valueClassName)}>{children}</Text>
    ) : (
      <div className={cn('w-3/4 pr-20', valueClassName)}>{children}</div>
    )}
  </div>
);
