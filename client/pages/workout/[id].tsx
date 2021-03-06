import React from 'react';
import Nav from '../../components/Nav';
import cookies from 'next-cookies';
import { GetServerSideProps } from 'next';
import MovementHeading from '../../components/MovementHeading';
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
  TextField,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DescriptionIcon from '@material-ui/icons/Description';
import styled from 'styled-components';
import moment from 'moment';
import Link from 'next/link';
import Cookies from 'js-cookie';

const StyledTableContainer = styled(TableContainer)`
  margin-left: 15px;
  margin-bottom: 15px;
`;

const WorkoutHeading = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 15px;
`;

const ExerciseBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  background-color: #49dcb1;
  padding-left: 25px;
  border-radius: 15px 15px 0 0;
`;

const ActionContainer = styled(Box)`
  display: flex;
  justify-content: center;
`;

const ActionButton = styled(Button)`
  margin: 5px !important;
`;

const WorkoutShow = ({ workout, user }) => {
  console.log('workout', workout);
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
    setsArr.push(
      workout.sets.filter(set => {
        console.log(set.movement, movement);
        return set.movement === movement;
      }),
    );
  });

  console.log('setsArr', setsArr);

  let setRows = [];

  //create table rows for each set
  setsArr.forEach((sets, i) => {
    setRows.unshift(
      sets.map(set => {
        console.log('setid', set._id);

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

  let movementHeadings = movements.reverse().map((movement, i) => {
    return (
      <div key={movement + i}>
        <MovementHeading movement={movement} />
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

  function exportToCsv(e, workout) {
    e.preventDefault();
    const token = Cookies.get('token');

    console.log('thingy thingy', workout);

    fetch('http://localhost:3001/users/export', {
      method: 'POST',
      body: JSON.stringify({
        id: workout._id,
        date: workout.date,
        sets: workout.sets,
      }),
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        return res.json();
      })
      .then(json => {
        var blob = new Blob(json);
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveBlob(blob, `workout_${workout.date}.csv`);
        } else {
          var a = window.document.createElement('a');

          a.href = window.URL.createObjectURL(blob);
          a.download = `workout_${workout.date}.csv`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      })
      .catch(err => {
        alert(`Not Authorized: ${err}`);
        console.error('not authorized ', err);
        return;
      });
  }

  if (typeof window !== 'undefined') {
    localStorage.clear();
  }

  return (
    <>
      <Nav user={user} />
      <WorkoutHeading color="#555">
        <h1>{moment(workout.date).format('dddd, MMMM Do YYYY')} </h1>
        <ActionContainer>
          <Link href="/workout/edit/[id]" as={`/workout/edit/${workout._id}`}>
            <a>
              <ActionButton variant="contained" color="primary">
                <EditIcon /> Edit
              </ActionButton>
            </a>
          </Link>
          <ActionButton
            variant="contained"
            color="secondary"
            onClick={e => exportToCsv(e, workout)}
          >
            <DescriptionIcon /> Export
          </ActionButton>
        </ActionContainer>
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

  console.log('params', context.params);
  console.log(user.workouts);

  const workout = user.workouts.filter(
    workout => workout._id === context.params.id,
  )[0];

  return {
    props: { user, workout },
  };
};

export default WorkoutShow;
