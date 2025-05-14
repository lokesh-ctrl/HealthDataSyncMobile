// src/components/WeeklyStepChart.tsx
import * as shape from 'd3-shape';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import {Grid, LineChart, XAxis} from 'react-native-svg-charts';
import {useWeeklySteps} from '../hooks/useWeeklySteps';

export const WeeklyStepChart = () => {
  const data = useWeeklySteps();

  const stepValues = data.map(d => d.value);
  const labels = data.map(d => d.label);

  return (
    <View style={{padding: 20, height: 200}}>
      <Text variant="titleMedium">Steps (last 7 days)</Text>
      <LineChart
        style={{height: 140}}
        data={stepValues}
        svg={{stroke: '#42a5f5', strokeWidth: 3}}
        curve={shape.curveMonotoneX}
        contentInset={{top: 20, bottom: 20}}>
        <Grid />
      </LineChart>
      <XAxis
        style={{marginTop: 10}}
        data={stepValues}
        formatLabel={(value, index) => labels[index]}
        contentInset={{left: 10, right: 10}}
        svg={{fontSize: 10, fill: '#666'}}
      />
    </View>
  );
};
