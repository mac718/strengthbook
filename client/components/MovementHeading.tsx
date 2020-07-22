import React from 'react';
import { ExerciseBox } from './ExerciseEntry/styles';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';

const ExerciseBoxMarginLeft = styled(ExerciseBox)`
  margin-left: 15px;
`;

const MovementHeading = ({ movement }) => {
  return (
    <ExerciseBoxMarginLeft>
      <Typography variant="h6">{movement}</Typography>
    </ExerciseBoxMarginLeft>
  );
};

export default MovementHeading;
