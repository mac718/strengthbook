import React from 'react';
import Nav from '../../components/Nav';
import cookies from 'next-cookies';
import { GetServerSideProps } from 'next';

const WorkoutShow = ({ workout, user }) => {
  return (
    <>
      <Nav user={user} />
      <h1>{workout.date}</h1>
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
