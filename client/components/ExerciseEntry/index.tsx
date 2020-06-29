import React from 'react';
import { Box, Typography } from '@material-ui/core';
import styled from 'styled-components';

const ExerciseBox = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: lightGrey;
`;

const ExerciseEntry = ({ exercise }) => {
  return (
    <ExerciseBox>
      <Typography variant="h6">{exercise}</Typography>
    </ExerciseBox>
  );
};

export default ExerciseEntry;
