import type {
  HealthkitReadAuthorization,
  HealthkitWriteAuthorization,
} from '@kingstinct/react-native-healthkit';
import {
  HKCategoryTypeIdentifier,
  HKQuantityTypeIdentifier,
  HKStatisticsOptions,
  HKWorkoutActivityType,
} from '@kingstinct/react-native-healthkit';

export const LATEST_QUANTITIES_TO_SHOW = [
  {
    icon: 'battery-heart-variant' as const,
    title: 'Resting Heart Rate',
    identifier: HKQuantityTypeIdentifier.restingHeartRate,
  },
  {
    icon: 'lungs' as const,
    title: 'Respiratory Rate',
    identifier: HKQuantityTypeIdentifier.respiratoryRate,
  },
  {
    icon: 'account-heart' as const,
    title: 'Walking Heart Rate Average',
    identifier: HKQuantityTypeIdentifier.walkingHeartRateAverage,
  },
  {
    icon: 'needle' as const,
    title: 'Blood Glucose',
    identifier: HKQuantityTypeIdentifier.bloodGlucose,
  },
  {
    icon: 'heart-pulse',
    title: 'Heart rate',
    identifier: HKQuantityTypeIdentifier.heartRate,
    unit: 'count/min',
  },
  {
    icon: 'water-percent',
    title: 'Oxygen saturation',
    identifier: HKQuantityTypeIdentifier.oxygenSaturation,
    unit: '%',
  },
  {
    icon: 'percent',
    title: 'Body Fat',
    identifier: HKQuantityTypeIdentifier.bodyFatPercentage,
    unit: '%',
  },
];

// feel free to add more :)
export const TODAY_STATS_TO_SHOW = [
  {
    identifier: HKQuantityTypeIdentifier.restingHeartRate,
    option: HKStatisticsOptions.discreteAverage,
    icon: 'heart',
    title: 'Resting Heart Rate',
    unit: 'count/min' as const,
  },
  {
    identifier: HKQuantityTypeIdentifier.stepCount,
    option: HKStatisticsOptions.cumulativeSum,
    icon: 'walk',
    title: 'Steps',
    unit: 'count' as const,
  },
  {
    identifier: HKQuantityTypeIdentifier.activeEnergyBurned,
    option: HKStatisticsOptions.cumulativeSum,
    icon: 'fire',
    title: 'Active Energy Burned',
    unit: 'kcal' as const,
  },
  {
    identifier: HKQuantityTypeIdentifier.distanceWalkingRunning,
    option: HKStatisticsOptions.cumulativeSum,
    icon: 'walk',
    title: 'Distance Walking/Running',
    unit: 'km' as const,
  },
  {
    identifier: HKQuantityTypeIdentifier.flightsClimbed,
    option: HKStatisticsOptions.cumulativeSum,
    icon: 'stairs',
    title: 'Flights Climbed',
    unit: 'count' as const,
  },
];

export const SOURCES_TO_SHOW = [
  {
    identifier: HKQuantityTypeIdentifier.restingHeartRate,
    icon: 'heart',
    title: 'Resting Heart Rate',
  },
  {
    identifier: HKQuantityTypeIdentifier.stepCount,
    icon: 'walk',
    title: 'Steps',
  },
  {
    identifier: HKCategoryTypeIdentifier.sexualActivity,
    icon: 'bed',
    title: 'Sexual activity',
  },
];
// Note: we need to add a translation to present a workout type in a meaningful way since it maps to a number enum on
// the native side
export const TRANSLATED_WORKOUT_TYPES_TO_SHOW = {
  [HKWorkoutActivityType.americanFootball]: 'American Football',
  [HKWorkoutActivityType.soccer]: 'Football',
  [HKWorkoutActivityType.running]: 'Running',
  [HKWorkoutActivityType.walking]: 'Walking',
};

export const saveableCountTypes: readonly HKQuantityTypeIdentifier[] = [
  HKQuantityTypeIdentifier.stepCount,
  HKQuantityTypeIdentifier.pushCount,
];

export const saveableMassTypes: readonly HKQuantityTypeIdentifier[] = [
  HKQuantityTypeIdentifier.dietaryFatTotal,
  HKQuantityTypeIdentifier.dietaryCarbohydrates,
  HKQuantityTypeIdentifier.dietaryProtein,
];

export type WorkoutType = keyof typeof TRANSLATED_WORKOUT_TYPES_TO_SHOW;

export const readPermissions: readonly HealthkitReadAuthorization[] = [
  HKQuantityTypeIdentifier.activeEnergyBurned,
  HKQuantityTypeIdentifier.distanceDownhillSnowSports,
  HKQuantityTypeIdentifier.distanceDownhillSnowSports,
  HKQuantityTypeIdentifier.basalEnergyBurned,
  HKQuantityTypeIdentifier.restingHeartRate,
  'HKCharacteristicTypeIdentifierActivityMoveMode',
  'HKWorkoutTypeIdentifier',
  'HKWorkoutRouteTypeIdentifier',
  'HKQuantityTypeIdentifierStepCount',
  'HKWorkoutTypeIdentifier',
  HKQuantityTypeIdentifier.distanceCycling,
  HKQuantityTypeIdentifier.distanceSwimming,
  HKQuantityTypeIdentifier.distanceWalkingRunning,
  HKQuantityTypeIdentifier.oxygenSaturation,
  HKQuantityTypeIdentifier.heartRate,
  HKQuantityTypeIdentifier.heartRateVariabilitySDNN,
  'HKDataTypeIdentifierHeartbeatSeries',
  'HKStateOfMindTypeIdentifier',
  HKQuantityTypeIdentifier.swimmingStrokeCount,
  HKQuantityTypeIdentifier.bodyFatPercentage,
  HKQuantityTypeIdentifier.bodyMass,
  ...LATEST_QUANTITIES_TO_SHOW.map(entry => entry.identifier),
  ...TODAY_STATS_TO_SHOW.map(entry => entry.identifier),
  ...SOURCES_TO_SHOW.map(entry => entry.identifier),
  ...saveableMassTypes,
  ...saveableCountTypes,
];

export const saveableWorkoutStuff: readonly HealthkitWriteAuthorization[] = [
  'HKQuantityTypeIdentifierDistanceWalkingRunning',
  'HKQuantityTypeIdentifierActiveEnergyBurned',
  'HKWorkoutTypeIdentifier',
  'HKWorkoutRouteTypeIdentifier',
  HKQuantityTypeIdentifier.heartRate,
  HKQuantityTypeIdentifier.runningSpeed,
];
