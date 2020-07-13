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
          <tr>
            <td>{set.weight}</td>
            <td>{set.reps}</td>
            <td>{set.rpe}</td>
          </tr>
        );
      }),
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
        <table>{setRows[i]}</table>
      </div>
    );
  });

  return (
    <>
      <Nav user={user} />
      <h1>{workout.date}</h1>
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
