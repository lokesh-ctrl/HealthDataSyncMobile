import {
  HKQuantityTypeIdentifier,
  HKStatisticsOptions,
  queryStatisticsCollectionForQuantity,
} from '@kingstinct/react-native-healthkit';
import dayjs from 'dayjs';
import {useEffect, useState} from 'react';

export const useWeeklyStepComparison = () => {
  const [data, setData] = useState<{
    currentWeek: number[];
    previousWeek: number[];
  }>({currentWeek: [], previousWeek: []});

  useEffect(() => {
    const fetch = async () => {
      const now = new Date();
      const startDate = dayjs().subtract(13, 'day').startOf('day').toDate();

      const result = await queryStatisticsCollectionForQuantity(
        HKQuantityTypeIdentifier.stepCount,
        [HKStatisticsOptions.cumulativeSum],
        now,
        {day: 1},
        startDate,
        now,
      );

      const grouped = result.reduce(
        (acc, s, i) => {
          const val = s.sumQuantity?.quantity ?? 0;
          i < 7 ? acc.previousWeek.push(val) : acc.currentWeek.push(val);
          return acc;
        },
        {currentWeek: [], previousWeek: []} as {
          currentWeek: number[];
          previousWeek: number[];
        },
      );

      setData(grouped);
    };

    fetch();
  }, []);

  return data;
};
