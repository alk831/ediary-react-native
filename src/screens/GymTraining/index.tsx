import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import { Text, Button, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useUserId, useMobxStore } from '../../hooks';

interface TrainingScreenProps {}

export const TrainingScreen = observer((props: TrainingScreenProps) => {
  const rootStore = useMobxStore();
  const trainingStore = rootStore.gymTraining;
  const userId = useUserId();

  useEffect(() => {
    trainingStore.loadTrainings();
  }, []);

  return (
    <Container>
      <Text>Twoje treningi</Text>
      <Text>
        Aktywny trening:
        {trainingStore.activeTraining ? trainingStore.activeTraining.name : 'Brak'}
      </Text>
      {trainingStore.mergedTrainings.map(training => (
        <View key={training.id as any}>
          <TrainingItem
            onPress={() => trainingStore.trainingStart(training.id)}
            isActive={training.isActive}
            isPaused={training.isPaused}
          >
            <Text>
              Training: {training.id}{'\n'}
              Czas: {training.duration}
            </Text>
          </TrainingItem>
          {training.isActive && training.exercises.map(exercise => (
            <Exercise key={exercise.id as any}>
              <Text>Ćwiczenie: {exercise.id}</Text>
              {exercise.sets.map(exerciseSet => (
                <ExerciseSetButton
                  key={exerciseSet.id as any}
                  isActive={exerciseSet.state === 'active'}
                  isRest={exerciseSet.isRest}
                  onPress={() => trainingStore.exerciseSetToggle(exerciseSet.id)}
                >
                  <>
                    <Text>
                      Seria: {exerciseSet.id}{'\n'}
                      Czas: {exerciseSet.duration}{'\n'}
                      Czas przerwy: {exerciseSet.restTime}{'\n'}
                      Przerwa: {exerciseSet.restDuration}{'\n'}
                      Obciążenie {exerciseSet.loadWeight}{'\n'}
                    </Text>
                    <Button
                      title="Usuń"
                      onPress={() => trainingStore.entity!.removeExercise(exercise.id)}
                    />
                    <Button
                      title="Dodaj serię"
                      onPress={() => exercise.entity._addExerciseSet({ loadWeight: 40, repeats: 12 })}
                    />
                    <Button
                      title="Aktywuj przerwę"
                      onPress={() => trainingStore.exerciseSetRestActivate()}
                    />
                    {exerciseSet.isRest && (
                      <>
                        <Text>
                          Do końca przerwy:
                          {exerciseSet.restTime - exerciseSet.restDuration}
                        </Text>
                        <Button
                          title="Przedłuż przerwę o 10"
                          onPress={() => trainingStore.exerciseSetRestExpand()}
                        />
                      </>
                    )}
                  </>
                </ExerciseSetButton>
              ))}
            </Exercise>
          ))}
        </View>
      ))}
      <Button onPress={() => trainingStore.entity!.duration++} title="Increment duration" />
      <Button
        onPress={() => trainingStore.exerciseSetUpdate(4, { loadWeight: Math.random() })}
        title="Increment duration"
      />
    </Container>
  );
});

const Container = styled.ScrollView`
`

const TrainingItem = styled.TouchableOpacity<{
  isActive: boolean
  isPaused: boolean
}>`
  background: ${props => {
    if (props.isPaused) {
      return 'lightgray';
    } else if (props.isActive) {
      return 'lightskyblue';
    }
    return 'lightsteelblue';
  }};
  padding: 20px;
  margin-bottom: 10px;
`

const Exercise = styled.View`
  padding: 10px;
`

const ExerciseSetButton = styled.TouchableOpacity<{
  isActive: boolean
  isRest: boolean
}>`
  padding: 15px;
  background: lightgreen;
  background: ${props => {
    if (props.isRest) {
      return 'lightgray';
    }
    if (props.isActive) {
      return 'lightgreen';
    } 
    return 'lightpink';
  }}
`