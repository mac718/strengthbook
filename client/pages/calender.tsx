import React from 'react';
import Calender from '../components/Calender';
import { Container } from '@material-ui/core';
import cookies from 'next-cookies';
import { GetServerSideProps } from 'next';

const CalenderPage = ({ user }) => {
  return (
    <Container>
      <Calender user={user} />
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { email } = cookies(context);
  const { token } = cookies(context);

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
    .catch(err => console.error('not authorized ', err));

  return {
    props: { user },
  };
};

export default CalenderPage;
