import {
  HKAuthorizationStatus,
  HKQuantityTypeIdentifier,
} from '@kingstinct/react-native-healthkit';
import {useState} from 'react';
import {ScrollView} from 'react-native';
import {Button, Provider as PaperProvider, Text} from 'react-native-paper';
import {useHealthAuthorization} from '../hooks/useHealthAuthorization';
import {TodayItem} from './TodayItem';
import {WeeklyStepChart} from './WeeklyStepChart';

const HealthKitScreen = () => {
  const [status, request] = useHealthAuthorization();
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  return (
    <PaperProvider>
      <ScrollView style={{padding: 20}}>
        {status == HKAuthorizationStatus.notDetermined ? (
          <Button onPress={request}>Authorize HealthKit</Button>
        ) : (
          <>
            <Text variant="titleMedium">Today Health Data</Text>
            <TodayItem
              title="Step Count"
              identifier={HKQuantityTypeIdentifier.stepCount}
              icon="walk"
              unit="count"
            />
            <WeeklyStepChart />
            {/* {lastSynced && (
              <Text style={{marginTop: 10}} variant="labelSmall">
                Last synced at: {lastSynced.toLocaleTimeString()}
              </Text>
            )} */}
          </>
        )}
      </ScrollView>
    </PaperProvider>
  );
};

export default HealthKitScreen;
