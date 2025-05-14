// src/hooks/useWeeklySteps.ts
import {
  HKQuantityTypeIdentifier,
  HKStatisticsOptions,
  queryStatisticsCollectionForQuantity,
} from '@kingstinct/react-native-healthkit';
import dayjs from 'dayjs';
import {useEffect, useState} from 'react';

export const useWeeklySteps = () => {
  const [data, setData] = useState<{label: string; value: number}[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const now = new Date();
      const startDate = dayjs().subtract(6, 'day').startOf('day').toDate();
      const result = await queryStatisticsCollectionForQuantity(
        HKQuantityTypeIdentifier.stepCount,
        [HKStatisticsOptions.cumulativeSum],
        now, // anchor date
        {day: 1},
        startDate,
        now,
      );

      const formatted = result.map(sample => ({
        label: dayjs(sample.startDate).format('dd'), // e.g. "Mo"
        value: sample.sumQuantity?.quantity ?? 0,
      }));

      setData(formatted);
    };

    fetch();
  }, []);

  return data;
};
