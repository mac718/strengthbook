import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Grow,
} from '@material-ui/core';
import styled from 'styled-components';
import { exec } from 'child_process';
//import e from 'express';

const ExerciseBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  background-color: #49dcb1;
  padding-left: 25px;
  border-radius: 15px 15px 0 0;
`;

const SetsContainer = styled(Box)`
  border: 1px solid lightGray;
  padding-left: 25px;
  border-radius: 0 0 15px 15px;
`;

const MovementContainer = styled(Box)`
  border: 1px solid lightGray;
  margin-bottom: 15px;

  margin-left: 15px;
  border-radius: 15px;
`;

const ExerciseEntry = ({ exercise, exerciseNumber }) => {
  const [sets, setSets] = useState([]);
  const [weight, setWeight] = useState(0);
  const [reps, setReps] = useState(0);
  const [rpe, setRpe] = useState(0);
  //   let movement = exercise;
  //   let object = {};
  //   object[`${movement}`] = {};
  //   const [entry, setEntry] = useState(object);

  const addSet = e => {
    e.preventDefault();
    let setNumber = Object.keys(sets).length + 1;
    setSets([
      ...sets,
      {
        exerciseOrder: exerciseNumber,
        setOrder: setNumber,
        movement: exercise,
        weight: 0,
        reps: 0,
        rpe: 0,
      },
    ]);
    //console.log(entry);
    console.log(sets);
  };

  const saveWorkout = e => {
    e.preventDefault();
    localStorage.clear();
  };

  //   console.log(sets);
  //   console.log(entry);

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
              //setWeight(parseFloat(e.target.value));
              //   setEntry({
              //     ...entry,
              //     movement: `${exercise}`,
              //     number: set.number,
              //     weight: parseFloat(e.target.value),
              //   });
              //   console.log(entry);
              //   let temp = entry;
              //   temp[`${movement}`][`${set.number}`] = {
              //     ...temp[`${set.number}`],
              //     weight: e.target.value,
              //   };
              //   console.log(temp);
              //   setEntry(temp);
              setWeight(parseFloat(e.target.value));
            }}
            onBlur={() => {
              let tempSets = sets;
              let temp = set;

              let index = tempSets.indexOf(temp);

              temp.weight = weight;
              tempSets.splice(index, 1, temp);
              setSets(tempSets);
              //   object[`${movement}`][`${set.number}`] = {
              //     ...object[`${movement}`][`${set.number}`],
              //     weight: parseFloat(e.target.value),
              //   };
              //console.log(entry);
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
              //   let temp = entry;
              //   temp[`${movement}`][`${set.number}`] = {
              //     ...temp[`${set.number}`],
              //     reps: e.target.value,
              //   };
              //   console.log(temp);
              //   setEntry(temp);
            }}
            onBlur={() => {
              let tempSets = sets;
              let temp = set;

              let index = tempSets.indexOf(set);

              temp.reps = reps;
              tempSets.splice(index, 1, temp);
              setSets(tempSets);
              //console.log(entry);
              //localStorage.setItem(`${exercise}`, JSON.stringify(entry));
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

              //   let temp = entry;
              //   temp[`${movement}`][`${set.number}`] = {
              //     ...temp[`${set.number}`],
              //     rpe: e.target.value,
              //   };
              //   setEntry(temp);
            }}
            onBlur={() => {
              let tempSets = sets;
              let temp = set;

              let index = tempSets.indexOf(set);

              temp.rpe = rpe;
              tempSets.splice(index, 1, temp);
              setSets(tempSets);
              //console.log(entry);
              //localStorage.setItem(`${exercise}`, JSON.stringify(entry))
              localStorage.setItem(`${exercise}`, JSON.stringify(sets));
              console.log(localStorage);
            }}
          />
        </Grid>
      </Grid>
    );
  });
  return (
    <MovementContainer>
      <ExerciseBox>
        <Typography variant="h6">{exercise}</Typography>
        <Button onClick={e => addSet(e)}>Add Set</Button>
      </ExerciseBox>
      <SetsContainer>{setDivs}</SetsContainer>
    </MovementContainer>
  );
};

export default ExerciseEntry;
