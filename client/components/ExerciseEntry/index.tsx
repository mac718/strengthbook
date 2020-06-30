import React from 'react';
import { Box, Typography } from '@material-ui/core';
import styled from 'styled-components';

const ExerciseBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  background-color: lightGrey;
  padding-left: 25px;
  margin-left: 15px;
  margin-bottom: 15px;
`;

const ExerciseEntry = ({ exercise }) => {
  return (
    <ExerciseBox>
      <Typography variant="h6">{exercise}</Typography>
    </ExerciseBox>
  );
};

export default ExerciseEntry;
