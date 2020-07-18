import React, { useState } from 'react';
import { Typography, Button, TextField, Grid } from '@material-ui/core';
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
  const [sets, setSets] = useState([]);
  const [weight, setWeight] = useState(0);
  const [reps, setReps] = useState(0);
  const [rpe, setRpe] = useState(0);

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
      },
    ]);
  };

  const handleDeleteSet = set => {
    let index = sets.indexOf(set);
    let setsCopy = sets.slice(0);
    for (let i = index + 1; i < setsCopy.length; i++) {
      setsCopy[i].setOrder -= 1;
    }
    setsCopy.splice(index, 1);
    setSets(setsCopy);
  };

  let setDivs;

  let thisSets = savedSets ? savedSets : sets;
  console.log(thisSets);

  setDivs = thisSets.map(set => {
    console.log(set.movement + set.setOrder + set.exerciseOrder);
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
              localStorage.setItem(`${exercise}`, JSON.stringify(sets));
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
              localStorage.setItem(`${exercise}`, JSON.stringify(sets));
              console.log(localStorage);
            }}
            required
          />
          <TextField
            label="RPE"
            margin="normal"
            defaultValue={set.rpe}
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
              localStorage.setItem(`${exercise}`, JSON.stringify(sets));
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
