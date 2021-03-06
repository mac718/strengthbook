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
import { exerciseList } from '../static-data/excersiseList';
import styled from 'styled-components';
import Cookies from 'js-cookie';
import Router from 'next/router';
import { Workout } from '../types';

interface EditWorkoutFormProps {
  date: Date;
  workout: Workout;
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
  justify-content: center;
`;

const EditWorkoutForm = ({ date, workout }: EditWorkoutFormProps) => {
  const [redirect, setRedirect] = useState(false);
  let savedWorkoutExercises = [];

  workout.sets.forEach(set => {
    if (!savedWorkoutExercises.includes(set.movement)) {
      savedWorkoutExercises.push(set.movement);
    }
  });
  const [exercises, setExercises] = useState(
    savedWorkoutExercises ? savedWorkoutExercises.reverse() : [],
  );

  const addExercise = e => {
    e.preventDefault();
    const exercise = e.target.innerText;
    setExercises([...exercises, exercise]);
    console.log(e.target.innerText);
  };

  const submitWorkout = e => {
    e.preventDefault();
    const token = Cookies.get('token');

    console.log('date', date);

    console.log(localStorage);

    fetch(`http://localhost:3001/users/edit-workout/${workout._id}`, {
      method: 'PUT',
      body: JSON.stringify({ date, sets: localStorage }),
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).then(res => {
      localStorage.clear();
      if (res.status === 200) {
        setRedirect(true);
      }
    });
  };

  console.log(workout);

  const exerciseDivs = exercises.map((exercise, i) => {
    return (
      <ExerciseEntry
        exercise={exercise}
        exerciseNumber={i + 1}
        date={date}
        savedSets={workout.sets.filter(set => set.movement === exercise)}
        key={exercise + (i + 1)}
      />
    );
  });

  //create wrapper function for list

  const exerciseMenuItems = exerciseList.map((exercise, i) => {
    return (
      <MenuItemDiv
        key={exercise}
        onDoubleClick={e => addExercise(e)}
        title="double click to add to workout"
      >
        <Typography>{exercise}</Typography>
      </MenuItemDiv>
    );
  });

  //console.log(localStorage);

  let submitButton;

  if (exerciseDivs.length > 0) {
    submitButton = (
      <SubmitButtonContainer>
        <SubmitWorkoutButton type="submit" variant="contained">
          Save Workout
        </SubmitWorkoutButton>
      </SubmitButtonContainer>
    );
  } else {
    submitButton = null;
  }

  if (redirect) {
    Router.push(`/workout/[id]`, `/workout/${workout._id}`);
    setRedirect(false);
  }

  return (
    <>
      <WorkoutForm
        onSubmit={e => {
          submitWorkout(e);
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={8}>
            {exerciseDivs}
            {submitButton}
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

export default EditWorkoutForm;
