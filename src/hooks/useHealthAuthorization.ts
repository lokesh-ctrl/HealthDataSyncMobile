// src/hooks/useHealthAuthorization.ts
import {
  HKQuantityTypeIdentifier,
  useHealthkitAuthorization,
} from '@kingstinct/react-native-healthkit';
import {
  readPermissions,
  saveableCountTypes,
  saveableMassTypes,
  saveableWorkoutStuff,
} from '../utils/permissions';

export const useHealthAuthorization = () => {
  return useHealthkitAuthorization(readPermissions, [
    HKQuantityTypeIdentifier.bodyMass,
    ...saveableCountTypes,
    ...saveableMassTypes,
    ...saveableWorkoutStuff,
  ]);
};
