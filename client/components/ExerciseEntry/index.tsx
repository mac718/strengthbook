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

const ExerciseEntry = ({ exercise }) => {
  const [sets, setSets] = useState([]);
  const addSet = e => {
    e.preventDefault();
    const setNumber = Object.keys(sets).length + 1;
    setSets([...sets, { number: setNumber, weight: 0, reps: 0, RPE: 0 }]);
  };

  let setDivs = sets.map(set => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Typography>{set.number}</Typography>
        </Grid>
        <Grid item xs={10}>
          <TextField label="weight" margin="normal"></TextField>
          <TextField label="reps" margin="normal"></TextField>
          <TextField label="RPE" margin="normal"></TextField>
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
