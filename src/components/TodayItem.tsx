import type {
  HKQuantityTypeIdentifier,
  HKUnit,
} from '@kingstinct/react-native-healthkit';
import React from 'react';
import {List} from 'react-native-paper';
import type {IconSource} from 'react-native-paper/lib/typescript/components/Icon';
import {useStepCount} from '../hooks/useStepCount';

export const TodayItem: React.FC<{
  identifier: HKQuantityTypeIdentifier;
  unit?: HKUnit;
  icon: IconSource;
  title: string;
  quantity?: number;
}> = ({identifier, title}) => {
  const todayData = useStepCount();
  return (
    <>
      <List.Item
        title={title || identifier}
        description={
          todayData ? `${todayData.sumQuantity.quantity}` : 'No data found'
        }
      />
      <List.Item
        title={'Date'}
        description={
          todayData ? new Date().toLocaleDateString() : 'No data found'
        }
      />
    </>
  );
};
