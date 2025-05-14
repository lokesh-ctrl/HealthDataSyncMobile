import {
  HKQuantityTypeIdentifier,
  HKStatisticsOptions,
  HKUnits,
  useStatisticsForQuantity,
} from '@kingstinct/react-native-healthkit';
import dayjs = require('dayjs');

export const useStepCount = () => {
  return useStatisticsForQuantity(
    HKQuantityTypeIdentifier.stepCount,
    [HKStatisticsOptions.cumulativeSum],
    dayjs().startOf('day').toDate(),
    undefined,
    HKUnits.Count,
  );
};
