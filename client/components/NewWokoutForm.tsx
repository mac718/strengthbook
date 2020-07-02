import React, { useState } from 'react';
import {
  Button,
  Grid,
  Box,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';
import ExerciseEntry from '../components/ExerciseEntry';
import styled from 'styled-components';

interface NewWorkoutFormProps {
  date: Date;
}

const ExerciseMenu = styled(Box)`
  height: 50vh;
  border: 1px solid lightGrey;
  margin-left: 15px;
  margin-right: 15px;
  overflow: scroll;
  border-radius: 15px;
`;

const ExerciseMenuContainer = styled(Grid)`
  position: fixed;
  right: calc(1vw - 10px);
`;

const MenuItemDiv = styled(ListItem)`
  &:hover {
    background-color: #fdf6ed;
  }
`;

const SubmitWorkoutButton = styled(Button)`
  width: 50%;
  background-color: #91acca !important;
`;

const WorkoutForm = styled.form`
  margin-top: 25px;
`;

const SubmitButtonContainer = styled.div`
  width: 100%;
  display: flex;
`;

const NewWorkoutForm = ({ date }: NewWorkoutFormProps) => {
  const [exercises, setExercises] = useState([]);
  const [sets, setSets] = useState({});

  const addExercise = e => {
    e.preventDefault();
    const exercise = e.target.innerText;
    setExercises([...exercises, exercise]);
    console.log(e.target.innerText);
  };

  const exerciseDivs = exercises.map(exercise => {
    return <ExerciseEntry exercise={exercise} />;
  });

  let exerciseList = [
    'Low Bar Squat with Belt',
    'High Bar Squat with Belt',
    '2-count Paused Low Bar Squat with Belt',
    'Competition Bench',
    '2-count Paused Bench',
    'Conventional Deadlift with Belt',
    'Sumo Deadlift with Belt',
  ];

  const exerciseMenuItems = exerciseList.map((exercise, i) => {
    return (
      <MenuItemDiv key={i * 10} onDoubleClick={e => addExercise(e)}>
        <Typography>{exercise}</Typography>
      </MenuItemDiv>
    );
  });

  return (
    <>
      <WorkoutForm>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            {exerciseDivs}
            <SubmitButtonContainer>
              <SubmitWorkoutButton type="submit" variant="contained">
                Save Workout
              </SubmitWorkoutButton>
            </SubmitButtonContainer>
          </Grid>
          <ExerciseMenuContainer item xs={4}>
            <ExerciseMenu>
              <List>{exerciseMenuItems}</List>
            </ExerciseMenu>
          </ExerciseMenuContainer>
        </Grid>
      </WorkoutForm>
    </>
  );
};

export default NewWorkoutForm;
