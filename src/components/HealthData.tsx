import Healthkit, {
  deleteQuantitySample,
  deleteSamples,
  HKAuthorizationRequestStatus,
  HKCategoryTypeIdentifier,
  HKQuantityTypeIdentifier,
  HKStatisticsOptions,
  HKWorkoutActivityType,
  queryHeartbeatSeriesSamplesWithAnchor,
  queryQuantitySamplesWithAnchor,
  queryStateOfMindSamples,
  queryStatisticsCollectionForQuantity,
  saveQuantitySample,
  saveWorkoutSample,
  useHealthkitAuthorization,
  useMostRecentQuantitySample,
  useMostRecentWorkout,
  useSources,
  useStatisticsForQuantity,
} from '@kingstinct/react-native-healthkit';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import {
  Button,
  List,
  Menu,
  Provider,
  Text,
  TextInput,
} from 'react-native-paper';

// import {generateWorkoutSamples} from './utils';

import type {HKUnit} from '@kingstinct/react-native-healthkit';
import type {ComponentProps} from 'react';
import type {IconSource} from 'react-native-paper/lib/typescript/components/Icon';
import {
  LATEST_QUANTITIES_TO_SHOW,
  readPermissions,
  saveableCountTypes,
  saveableMassTypes,
  saveableWorkoutStuff,
  SOURCES_TO_SHOW,
  TODAY_STATS_TO_SHOW,
  TRANSLATED_WORKOUT_TYPES_TO_SHOW,
} from '../utils/permissions';

dayjs.extend(relativeTime);

const LatestListItem: React.FC<{
  readonly identifier: HKQuantityTypeIdentifier;
  readonly unit?: HKUnit;
  readonly icon: IconSource;
  readonly title: string;
}> = ({identifier, unit, title, icon}) => {
  const latestValue = useMostRecentQuantitySample(identifier, unit),
    left = useCallback(
      (props: Omit<ComponentProps<typeof List.Icon>, 'icon'>) => (
        <List.Icon {...props} icon={icon} />
      ),
      [icon],
    );

  return (
    <List.Item
      title={title || identifier}
      left={left}
      description={
        latestValue
          ? `${
              latestValue.unit === '%'
                ? (latestValue.quantity * 100).toFixed(1)
                : latestValue.quantity.toFixed(
                    latestValue.unit === 'count' ||
                      latestValue.unit === 'count/min'
                      ? 0
                      : 2,
                  )
            } ${latestValue.unit} (${dayjs(latestValue.endDate).fromNow()})`
          : 'No data found'
      }
    />
  );
};

const LatestWorkout: React.FC<{
  readonly icon: IconSource;
  readonly title: string;
}> = ({title, icon}) => {
  const latestValue = useMostRecentWorkout(),
    left = useCallback(
      (props: Omit<ComponentProps<typeof List.Icon>, 'icon'>) => (
        <List.Icon {...props} icon={icon} />
      ),
      [icon],
    );

  return (
    <List.Accordion title="Latest workout" id="workout">
      <List.Item
        title={title}
        left={left}
        description={
          latestValue
            ? `${
                TRANSLATED_WORKOUT_TYPES_TO_SHOW[
                  latestValue.workoutActivityType as WorkoutType
                ] ??
                `Untranslated workout type (${latestValue.workoutActivityType})`
              } (${dayjs(latestValue.endDate).fromNow()})`
            : 'No data found'
        }
      />
      <List.Item
        title="Distance"
        // eslint-disable-next-line react/no-unstable-nested-components
        left={props => <List.Icon {...props} icon="map-marker-distance" />}
        description={
          latestValue?.totalDistance
            ? `${latestValue.totalDistance.quantity.toFixed(2)} ${
                latestValue.totalDistance.unit
              }`
            : 'No data found'
        }
      />
      <List.Item
        title="Energy"
        // eslint-disable-next-line react/no-unstable-nested-components
        left={props => <List.Icon {...props} icon="fire" />}
        description={
          latestValue?.totalEnergyBurned
            ? `${latestValue.totalEnergyBurned.quantity.toFixed(0)} ${
                latestValue.totalEnergyBurned.unit
              }`
            : 'No data found'
        }
      />
      <List.Item
        title="Metadata"
        // eslint-disable-next-line react/no-unstable-nested-components
        left={props => <List.Icon {...props} icon="database" />}
        description={
          latestValue?.metadata
            ? `${JSON.stringify(latestValue.metadata)}`
            : 'No data found'
        }
      />
      <List.Item
        title="Device"
        // eslint-disable-next-line react/no-unstable-nested-components
        left={props => <List.Icon {...props} icon="watch" />}
        description={
          latestValue?.device ? `${latestValue.device.name}` : 'No data found'
        }
      />
    </List.Accordion>
  );
};

const TodayListItem: React.FC<{
  readonly identifier: HKQuantityTypeIdentifier;
  readonly unit: HKUnit;
  readonly title: string;
  readonly icon: IconSource;
  readonly option: HKStatisticsOptions;
}> = ({identifier, option, unit, title, icon}) => {
  const latestValue = useStatisticsForQuantity(
      identifier,
      [option],
      dayjs().startOf('day').toDate(),
      undefined,
      unit,
    ),
    left = useCallback(
      (props: Omit<ComponentProps<typeof List.Icon>, 'icon'>) => (
        <List.Icon {...props} icon={icon} />
      ),
      [icon],
    );

  const quantity = latestValue?.sumQuantity ?? latestValue?.averageQuantity;

  return (
    <List.Item
      title={title}
      left={left}
      description={
        // eslint-disable-next-line no-nested-ternary
        quantity
          ? `${
              quantity?.unit === 'count'
                ? quantity?.quantity
                : quantity?.quantity.toFixed(2)
            } (${quantity?.unit})`
          : 'No data found'
      }
    />
  );
};

const SourceListItem: React.FC<{
  readonly identifier: HKCategoryTypeIdentifier | HKQuantityTypeIdentifier;
  readonly title: string;
  readonly icon: IconSource;
}> = ({identifier, title, icon}) => {
  const sources = useSources(identifier),
    left = useCallback(
      (props: Omit<ComponentProps<typeof List.Icon>, 'icon'>) => (
        <List.Icon {...props} icon={icon} />
      ),
      [icon],
    );

  return (
    <List.Item
      title={title}
      left={left}
      onPress={() => {
        Alert.alert(
          'Sources',
          sources ? JSON.stringify(sources, null, 2) : 'No sources found',
        );
      }}
      description={
        sources && sources.length
          ? `${
              sources.length === 1
                ? `1 source for this data type`
                : `${sources.length} sources for this data type`
            }`
          : 'Loading..'
      }
    />
  );
};

const SaveWorkout = () => {
  const [typeToSave, setTypeToSave] = useState<WorkoutType>(
    HKWorkoutActivityType.americanFootball,
  );
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [kcalStr, setkcalStr] = useState<string>('50');
  const [distanceMetersStr, setDistanceMetersStr] = useState<string>('1000');

  const save = useCallback(() => {
    const val = parseFloat(kcalStr);
    const distance = parseFloat(distanceMetersStr);
    if (
      val !== undefined &&
      !Number.isNaN(val) &&
      distance !== undefined &&
      !Number.isNaN(distance)
    ) {
      void saveWorkoutSample(
        typeToSave,
        [
          {
            quantity: distance,
            unit: 'm',
            quantityType: HKQuantityTypeIdentifier.distanceWalkingRunning,
          },
          {
            quantity: val,
            unit: 'kcal',
            quantityType: HKQuantityTypeIdentifier.activeEnergyBurned,
          },
        ],
        new Date(),
      );
      setkcalStr('0');
    }
  }, [kcalStr, typeToSave, distanceMetersStr]);

  return (
    <>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button uppercase={false} onPress={() => setMenuVisible(true)}>
            {TRANSLATED_WORKOUT_TYPES_TO_SHOW[typeToSave]}
          </Button>
        }>
        {Object.keys(TRANSLATED_WORKOUT_TYPES_TO_SHOW).map(type => (
          <Menu.Item
            key={type}
            onPress={() => {
              setTypeToSave(parseInt(type, 10) as WorkoutType);
              setMenuVisible(false);
            }}
            title={
              TRANSLATED_WORKOUT_TYPES_TO_SHOW[
                type as unknown as WorkoutType
              ] ?? `Untranslated workout type (${type})`
            }
          />
        ))}
      </Menu>
      <TextInput
        accessibilityLabel="Value"
        keyboardType="numeric"
        onSubmitEditing={save}
        label="Kcal"
        returnKeyType="done"
        accessibilityHint="Enter a value to save"
        value={kcalStr}
        onChangeText={setkcalStr}
      />
      <TextInput
        accessibilityLabel="Value"
        keyboardType="numeric"
        onSubmitEditing={save}
        label="Meters running/walking"
        returnKeyType="done"
        accessibilityHint="Enter a value to save"
        value={distanceMetersStr}
        onChangeText={setDistanceMetersStr}
      />
      <Button onPress={save}>Save</Button>
    </>
  );
};

const SaveWorkoutRoute = () => {
  const save = useCallback(async () => {
    // const {startTime, samples, locationSamples} = generateWorkoutSamples();
    // if (startTime && samples.length) {
    //   try {
    //     const workoutUUID = await saveWorkoutSample(
    //       HKWorkoutActivityType.running,
    //       samples,
    //       new Date(startTime),
    //     );
    //     if (workoutUUID && locationSamples.length) {
    //       await saveWorkoutRoute(workoutUUID, locationSamples);
    //     }
    //   } catch (error) {
    //     console.error('Error Saving Activity', error);
    //   }
    // }
  }, []);

  return (
    <>
      <Text>
        This will save an example Workout with Heart Rate, Pace and Location
        Data
      </Text>
      <Button onPress={save}>Save</Button>
    </>
  );
};

const DeleteQuantity = () => {
  const typeToDelete = HKQuantityTypeIdentifier.stepCount;
  const latestValue = useMostRecentQuantitySample(typeToDelete);

  const deleteFn = useCallback(() => {
    if (latestValue) {
      void deleteQuantitySample(typeToDelete, latestValue?.uuid);
    }
  }, [latestValue, typeToDelete]);

  return (
    <>
      <LatestListItem
        key={typeToDelete}
        icon="clock"
        title="Latest value"
        identifier={typeToDelete}
      />
      <Button onPress={deleteFn}>Delete Last Value</Button>
    </>
  );
};

const DeleteSample = () => {
  const typeToDelete = HKQuantityTypeIdentifier.bodyMass;
  const latestValue = useMostRecentQuantitySample(typeToDelete);

  const deleteFn = useCallback(() => {
    if (latestValue) {
      void deleteSamples({
        identifier: typeToDelete,
        startDate: new Date(new Date(latestValue.startDate).getTime() - 1000),
        endDate: new Date(new Date(latestValue.endDate).getTime() + 1000),
      });
    }
  }, [latestValue, typeToDelete]);

  return (
    <>
      <LatestListItem
        key={typeToDelete}
        icon="clock"
        title="Latest value"
        identifier={typeToDelete}
      />
      <Button onPress={deleteFn}>Delete Last Value</Button>
    </>
  );
};

const SaveQuantity = () => {
  const [typeToSave, setTypeToSave] = useState<HKQuantityTypeIdentifier>(
    HKQuantityTypeIdentifier.stepCount,
  );
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [saveValueStr, setSaveValueStr] = useState<string>('0');

  const unit =
    saveableMassTypes.includes(typeToSave) ||
    typeToSave === HKQuantityTypeIdentifier.bodyMass
      ? 'g'
      : 'count';

  const save = useCallback(() => {
    const val = parseFloat(saveValueStr);
    if (saveValueStr !== undefined && !Number.isNaN(val)) {
      void saveQuantitySample(typeToSave, unit, val);
      setSaveValueStr('0');
    }
  }, [saveValueStr, typeToSave, unit]);

  return (
    <>
      <LatestListItem
        key={typeToSave}
        icon="clock"
        title="Latest value"
        identifier={typeToSave}
      />
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button uppercase={false} onPress={() => setMenuVisible(true)}>
            {typeToSave.replace('HKQuantityTypeIdentifier', '')}
          </Button>
        }>
        {[
          ...saveableCountTypes,
          ...saveableMassTypes,
          HKQuantityTypeIdentifier.bodyMass,
        ].map(type => (
          <Menu.Item
            key={type}
            onPress={() => {
              setTypeToSave(type);
              setMenuVisible(false);
            }}
            title={type.replace('HKQuantityTypeIdentifier', '')}
          />
        ))}
      </Menu>
      <TextInput
        accessibilityLabel="Value"
        keyboardType="numeric"
        label={unit}
        onSubmitEditing={save}
        returnKeyType="done"
        accessibilityHint="Enter a value to save"
        value={saveValueStr}
        onChangeText={setSaveValueStr}
      />
      <Button onPress={save}>Save</Button>
    </>
  );
};

const HealthData = () => {
  const [status, request] = useHealthkitAuthorization(readPermissions, [
    HKQuantityTypeIdentifier.bodyMass,
    ...saveableCountTypes,
    ...saveableMassTypes,
    ...saveableWorkoutStuff,
  ]);

  const [isProtectedDataAvailable, setProtectedDataAvailable] =
    useState<boolean>(false);

  useEffect(() => {
    Healthkit.isProtectedDataAvailable()
      .then(setProtectedDataAvailable)
      .catch(() => setProtectedDataAvailable(false));
  }, []);

  const anchor = useRef<string>();
  const heartbeatsAnchor = useRef<string>();

  return status !== HKAuthorizationRequestStatus.unnecessary ? (
    <View style={styles.buttonWrapper}>
      <Button onPress={request}>Authorize</Button>
    </View>
  ) : (
    <Provider>
      <ScrollView style={styles.scrollView}>
        <Button
          onPress={async () => {
            const res = await queryQuantitySamplesWithAnchor(
              HKQuantityTypeIdentifier.stepCount,
              {
                limit: 2,
              },
            );

            anchor.current = res.newAnchor;

            alert(JSON.stringify(res));
          }}>
          First 2 stepCount
        </Button>
        <Button
          onPress={async () => {
            const res = await queryQuantitySamplesWithAnchor(
              HKQuantityTypeIdentifier.stepCount,
              {
                limit: 2,
                anchor: anchor.current,
              },
            );

            anchor.current = res.newAnchor;

            alert(JSON.stringify(res));
          }}>
          Next 2 stepCount
        </Button>
        <Button
          onPress={async () => {
            const res = await queryStateOfMindSamples({
              limit: 1,
            });

            alert(JSON.stringify(res));
          }}>
          State of Mind
        </Button>
        <Button
          onPress={async () => {
            const now = new Date();
            const startDate = dayjs(now).subtract(30, 'day').toDate();

            const res = await queryStatisticsCollectionForQuantity(
              HKQuantityTypeIdentifier.stepCount,
              [HKStatisticsOptions.cumulativeSum],
              now,
              {day: 1},
              startDate,
              now,
            );

            alert(JSON.stringify(res));
          }}>
          Daily statistics for stepCount
        </Button>
        <Button
          onPress={async () => {
            const res = await queryHeartbeatSeriesSamplesWithAnchor({
              limit: 2,
              anchor: heartbeatsAnchor.current,
            });

            heartbeatsAnchor.current = res.newAnchor;

            alert(JSON.stringify(res));
          }}>
          Next 2 HeartbeatSeries samples
        </Button>
        <LatestWorkout icon="run" title="Latest workout" />
        <List.AccordionGroup>
          <List.Accordion title="Latest values" id="1">
            {LATEST_QUANTITIES_TO_SHOW.map(e => (
              <LatestListItem
                key={e.identifier}
                icon={e.icon}
                title={e.title}
                identifier={e.identifier}
              />
            ))}
          </List.Accordion>

          <List.Accordion title="Today stats" id="2">
            {TODAY_STATS_TO_SHOW.map(e => (
              <TodayListItem
                key={e.identifier}
                icon={e.icon}
                title={e.title}
                identifier={e.identifier}
                option={e.option}
                unit={e.unit}
              />
            ))}
          </List.Accordion>

          <List.Accordion title="Sources" id="3">
            {SOURCES_TO_SHOW.map(e => (
              <SourceListItem
                key={e.identifier}
                identifier={e.identifier}
                title={e.title}
                icon={e.icon}
              />
            ))}
          </List.Accordion>

          <List.Accordion title="Save Quantity" id="4">
            <SaveQuantity />
          </List.Accordion>

          <List.Accordion title="Delete Latest Quantity" id="5">
            <DeleteQuantity />
          </List.Accordion>

          <List.Accordion title="Save Workout" id="6">
            <SaveWorkout />
          </List.Accordion>

          <List.Accordion title="Save Workout Route" id="7">
            <SaveWorkoutRoute />
          </List.Accordion>

          <List.Accordion title="Delete Latest body mass Value" id="8">
            <DeleteSample />
          </List.Accordion>
        </List.AccordionGroup>
        <Text>{`Can access protected data: ${
          isProtectedDataAvailable ? '✅' : '❌'
        }`}</Text>
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  scrollView: {marginTop: 100, flex: 1, width: '100%'},
  buttonWrapper: {paddingTop: 100},
});

export default HealthData;
