// src/hooks/useHealthKit.ts
import AppleHealthKit from '@kingstinct/react-native-healthkit';

const permissions = {
  permissions: {
    read: ['Steps', 'Height', 'Weight'],
    write: ['Steps', 'Height', 'Weight'],
  },
};

export const initHealthKit = () => {
  console.log(AppleHealthKit);
  AppleHealthKit.isHealthDataAvailable().then((available: boolean) => {
    if (available) {
      console.log('Health data is available');
    } else {
      console.log('Health data is not available');
    }
  });

  AppleHealthKit.initHealthKit().then(async () => {
    const stepsToday = await AppleHealthKit.getStepCount({
      startDate: new Date().toISOString(),
    });

    console.log('Steps:', stepsToday);
  });
};

const uploadSteps = async (steps: number) => {
  await fetch('https://your-server.com/api/steps', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      device_id: 'ios-device-001',
      steps,
    }),
  });
};
