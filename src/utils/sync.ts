export const uploadSteps = async (stepCount: number) => {
  await fetch('https://your-backend.com/api/steps', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      device_id: 'ios-device-001',
      steps: stepCount,
    }),
  });
};
