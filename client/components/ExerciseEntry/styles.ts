import styled from 'styled-components';
import { Box } from '@material-ui/core';

export const ExerciseBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  background-color: #49dcb1;
  padding-left: 25px;
  border-radius: 15px 15px 0 0;
`;

export const SetsContainer = styled(Box)`
  border: 1px solid lightGray;
  padding-left: 25px;
  border-radius: 0 0 15px 15px;
`;

export const MovementContainer = styled(Box)`
  border: 1px solid lightGray;
  margin-bottom: 15px;
  margin-left: 15px;
  border-radius: 15px;
`;
