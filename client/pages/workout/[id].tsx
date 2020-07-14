import React from 'react';
import Nav from '../../components/Nav';
import cookies from 'next-cookies';
import { GetServerSideProps } from 'next';
import {
  MovementContainer,
  SetsContainer,
  ExerciseBox,
} from '../../components/ExerciseEntry/styles';
import ExerciseEntry from '../../components/ExerciseEntry';
import {
  TableContainer,
  Table,
  TableBody,
  Paper,
  TableHead,
  TableRow,
  Typography,
  TableCell,
  Button,
  Box,
} from '@material-ui/core';
import styled from 'styled-components';
import moment from 'moment';

const StyledTableContainer = styled(TableContainer)`
  margin-left: 15px;
  margin-bottom: 15px;
`;

const WorkoutHeading = styled(Box)`
  display: flex;
  justify-content: space-between;
`;

const WorkoutShow = ({ workout, user }) => {
  const movements = [];
  let currentMovement;

  //grab movements in workout
  workout.sets.forEach(set => {
    if (set.movement != currentMovement) {
      movements.push(set.movement);
      currentMovement = set.movement;
    }
  });

  console.log(movements);

  const setsArr = [];

  //create array of arrays for sets of each moevemnt
  movements.forEach(movement => {
    setsArr.unshift(
      workout.sets.filter(set => {
        console.log(set.movement, movement);
        return set.movement === movement;
      }),
    );
  });

  console.log('setsArr', setsArr);

  let setRows = [];

  setsArr.forEach((sets, i) => {
    setRows.push(
      sets.map(set => {
        return (
          <TableRow key={set._id}>
            <TableCell>
              <Typography>{set.setOrder}</Typography>
            </TableCell>
            <TableCell>
              <Typography>{set.weight}</Typography>
            </TableCell>
            <TableCell>
              <Typography>{set.reps}</Typography>
            </TableCell>
            <TableCell>
              <Typography>{set.rpe}</Typography>
            </TableCell>
          </TableRow>
        );
      }),
    );
  });

  const tableHeadings = movements.map(movement => {
    return (
      <TableRow>
        <Typography variant="h4">{movement}</Typography>
      </TableRow>
    );
  });

  let movementHeadings = movements.map((movement, i) => {
    return (
      <div>
        <ExerciseEntry
          exercise={movement}
          exerciseNumber={i}
          date={workout.date}
        />
        <StyledTableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Set</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Weight</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Reps</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">RPE</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{setRows[i]}</TableBody>
          </Table>
        </StyledTableContainer>
      </div>
    );
  });

  return (
    <>
      <Nav user={user} />
      <WorkoutHeading color="#555">
        <h1>{moment(workout.date).format('dddd, MMMM Do YYYY')} </h1>
        <Button>Edit Workout</Button>
      </WorkoutHeading>

      {movementHeadings}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { email } = cookies(context);
  const { token } = cookies(context);

  console.log(email);
  console.log(token);

  let user = await fetch('http://localhost:3001/users/getuser', {
    method: 'POST',
    body: JSON.stringify({ email }),
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => {
      if (res.status === 401) {
        context.res.setHeader('Location', '/login');
        context.res.statusCode = 302;
        context.res.end();
        return;
      }
      return res.json();
    })
    .then(json => json)
    .catch(err => {
      console.error('not authorized ', err);
      context.res.setHeader('Location', '/login');
      context.res.statusCode = 302;
      context.res.end();
      return;
    });

  console.log(context.params);
  console.log(user.workouts);

  const workout = user.workouts.filter(
    workout => workout._id === context.params.id,
  )[0];

  return {
    props: { user, workout },
  };
};

export default WorkoutShow;
