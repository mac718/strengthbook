import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  TextField,
  Grid,
  Table,
  TableContainer,
  TableCell,
  TableRow,
  TableHead,
  Box,
  Paper,
  TableBody,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import * as styles from './styles';
import { Set } from '../../types';
import styled from 'styled-components';

const DeleteSetIcon = styled(CloseIcon)`
  cursor: pointer;
`;

const DeleteSetIconContainer = styled(Grid)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledTableContainer = styled(TableContainer)`
  margin-left: 15px;
  margin-bottom: 15px;
`;

const WorkoutHeading = styled(Box)`
  display: flex;
  justify-content: space-between;
  margin-left: 15px;
`;

const ExerciseBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  background-color: #49dcb1;
  padding-left: 25px;
  border-radius: 15px 15px 0 0;
`;

interface ExerciseEntryProps {
  exercise: string;
  exerciseNumber: number;
  date: Date;
  savedSets?: Set[];
}

const ExerciseEntry = ({
  exercise,
  exerciseNumber,
  date,
  savedSets,
}: ExerciseEntryProps) => {
  const [sets, setSets] = useState(savedSets ? savedSets : []);
  const [weight, setWeight] = useState(0);
  const [reps, setReps] = useState(0);
  const [rpe, setRpe] = useState(null);
  const [rir, setRir] = useState(null);

  //load pre-existing sets into local storage if provided
  useEffect(() => {
    if (savedSets && localStorage.length === 0) {
      let savedWorkoutExercises = [];

      savedSets.forEach(set => {
        if (!savedWorkoutExercises.includes(set.movement)) {
          savedWorkoutExercises.push(set.movement + '-' + set.exerciseOrder);
        }
      });

      savedWorkoutExercises.forEach(exercise => {
        let exerciseSets = savedSets.filter(
          set => set.movement + '-' + set.exerciseOrder === exercise,
        );
        localStorage.setItem(`${exercise}`, JSON.stringify([...exerciseSets]));
      });
    }
    console.log('useEffect', localStorage);
  });

  console.log(sets);

  const addSet = e => {
    e.preventDefault();
    let setNumber = Object.keys(sets).length + 1;
    setSets([
      ...sets,
      {
        date: date,
        exerciseOrder: exerciseNumber,
        setOrder: setNumber,
        movement: exercise,
        weight: 0,
        reps: 0,
        rpe: 0,
        rir: 0,
        e1rm: 0,
      },
    ]);
  };

  const handleDeleteSet = set => {
    console.log('fyarts', localStorage);
    let index = sets.indexOf(set);
    let setsCopy = sets.slice(0);
    for (let i = index + 1; i < setsCopy.length; i++) {
      setsCopy[i].setOrder -= 1;
    }

    let json = JSON.parse(localStorage[`${set.movement}-${set.exerciseOrder}`]);

    json.splice(set.setOrder - 1, 1);

    localStorage.removeItem(`${set.movement}-${set.exerciseOrder}`);

    let stringified = JSON.stringify(json);

    localStorage.setItem(`${set.movement}-${set.exerciseOrder}`, stringified);

    setsCopy.splice(index, 1);
    setSets(setsCopy);
  };

  let setDivs;

  setDivs = sets.map(set => {
    return (
      <Grid
        key={set.movement + set.setOrder + set.exerciseOrder}
        container
        spacing={2}
      >
        <Grid item xs={2}>
          <Typography>{set.setOrder}</Typography>
        </Grid>
        <Grid item xs={9}>
          <TextField
            label="weight"
            margin="normal"
            defaultValue={set.weight}
            onChange={e => {
              setWeight(parseFloat(e.target.value));
            }}
            onBlur={() => {
              let tempSets = sets;
              let temp = set;

              let index = tempSets.indexOf(temp);

              temp.weight = weight;
              tempSets.splice(index, 1, temp);
              setSets(tempSets);
              localStorage.setItem(
                `${exercise}-${set.exerciseOrder}`,
                JSON.stringify(sets),
              );
              console.log(localStorage);
            }}
            required
          />
          <TextField
            label="reps"
            margin="normal"
            defaultValue={set.reps}
            onChange={e => {
              setReps(parseInt(e.target.value));
            }}
            onBlur={() => {
              let tempSets = sets;
              let temp = set;

              let index = tempSets.indexOf(set);

              temp.reps = reps;
              tempSets.splice(index, 1, temp);
              setSets(tempSets);
              localStorage.setItem(
                `${exercise}-${set.exerciseOrder}`,
                JSON.stringify(sets),
              );
              console.log(localStorage);
            }}
            required
          />
          <TextField
            label="RPE"
            margin="normal"
            defaultValue={set.rpe}
            disabled={rir ? true : false}
            onChange={e => {
              setRpe(parseFloat(e.target.value));
            }}
            onBlur={() => {
              let tempSets = sets;
              let temp = set;

              let index = tempSets.indexOf(set);

              temp.rpe = rpe;
              tempSets.splice(index, 1, temp);
              setSets(tempSets);
              localStorage.setItem(
                `${exercise}-${set.exerciseOrder}`,
                JSON.stringify(sets),
              );
              console.log(localStorage);
            }}
          />
          <TextField
            label="RIR"
            margin="normal"
            defaultValue={set.rir}
            disabled={rpe ? true : false}
            onChange={e => {
              setRir(parseFloat(e.target.value));
            }}
            onBlur={() => {
              let tempSets = sets;
              let temp = set;

              let index = tempSets.indexOf(set);

              temp.rir = rir;
              tempSets.splice(index, 1, temp);
              setSets(tempSets);
              localStorage.setItem(
                `${exercise}-${set.exerciseOrder}`,
                JSON.stringify(sets),
              );
              console.log(localStorage);
            }}
          />
        </Grid>
        <DeleteSetIconContainer item xs={1}>
          <DeleteSetIcon onClick={() => handleDeleteSet(set)} />
        </DeleteSetIconContainer>
      </Grid>
    );
  });

  return (
    <styles.MovementContainer>
      <styles.ExerciseBox>
        <Typography variant="h6">{exercise}</Typography>
        <Button onClick={e => addSet(e)}>Add Set</Button>
      </styles.ExerciseBox>
      <styles.SetsContainer>{setDivs}</styles.SetsContainer>
    </styles.MovementContainer>
  );
};

export default ExerciseEntry;
