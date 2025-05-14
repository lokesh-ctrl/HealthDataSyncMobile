// src/components/WeeklyStepComparisonChart.tsx
import * as shape from 'd3-shape';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import {G, Text as SVGText} from 'react-native-svg';
import {LineChart, XAxis} from 'react-native-svg-charts';
import {useWeeklyStepComparison} from '../hooks/useWeeklyStepComparison';

export const WeeklyStepComparisonChart = () => {
  const {currentWeek, previousWeek} = useWeeklyStepComparison();

  const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const average = (arr: number[]) =>
    arr.reduce((a, b) => a + b, 0) / arr.length;

  const pctChange = average(previousWeek)
    ? (
        ((average(currentWeek) - average(previousWeek)) /
          average(previousWeek)) *
        100
      ).toFixed(1)
    : 'N/A';

  const Decorator = ({x, y, data}: any) => (
    <G>
      {data.map((value: number, index: number) => (
        <SVGText
          key={index}
          x={x(index)}
          y={y(value) - 10}
          fontSize={10}
          fill="#42a5f5"
          alignmentBaseline="middle"
          textAnchor="middle">
          {value.toFixed(0)}
        </SVGText>
      ))}
    </G>
  );

  return (
    <View style={{padding: 20, height: 260}}>
      <Text variant="titleMedium">Week-over-Week Steps</Text>
      <LineChart
        style={{height: 140}}
        data={previousWeek}
        svg={{stroke: '#f50202'}}
        curve={shape.curveMonotoneX}
        contentInset={{top: 30, bottom: 20}}>
        <Decorator />
      </LineChart>
      <LineChart
        style={{height: 140}}
        data={currentWeek}
        svg={{stroke: '#32a852', strokeWidth: 2}}
        curve={shape.curveMonotoneX}
        contentInset={{top: 30, bottom: 20}}>
        <Decorator />
      </LineChart>
      <XAxis
        style={{marginTop: 10}}
        data={currentWeek}
        formatLabel={(value, index) => labels[index]}
        contentInset={{left: 10, right: 10}}
        svg={{fontSize: 10, fill: '#666'}}
      />
      <Text variant="labelSmall" style={{marginTop: 8}}>
        {`Change from last week: ${pctChange}%`}
      </Text>
    </View>
  );
};
