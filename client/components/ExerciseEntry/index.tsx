import React, { useState } from 'react';
import { Typography, Button, TextField, Grid } from '@material-ui/core';
import * as styles from './styles';

const ExerciseEntry = ({ exercise, exerciseNumber, date }) => {
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

  let setDivs = sets.map(set => {
    return (
      <Grid key={set.number} container spacing={2}>
        <Grid item xs={2}>
          <Typography>{set.number}</Typography>
        </Grid>
        <Grid item xs={10}>
          <TextField
            label="weight"
            margin="normal"
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
