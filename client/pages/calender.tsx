import React from 'react';
import Calender from '../components/Calender';
import { Container } from '@material-ui/core';
import cookies from 'next-cookies';
import { GetServerSideProps } from 'next';
import Nav from '../components/Nav';

const CalenderPage = ({ user }) => {
  return (
    <>
      <Nav user={user} />
      <Calender user={user} />
    </>
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
      console.log(res.status);
      if (res.status === 401 || res === undefined) {
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

  return {
    props: { user },
  };
};

export default CalenderPage;
