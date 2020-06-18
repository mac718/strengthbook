import React from 'react';
import { GetServerSideProps } from 'next';
import { User } from '../types';
import cookies from 'next-cookies';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import styled from 'styled-components';

interface DashboardProps {
  user: User;
}

const NavBar = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
`;

const Greeting = styled(Typography)`
  margin-right: 50px;
`;

const Dashboard = ({ user }: DashboardProps) => {
  return (
    <AppBar color="primary" position="fixed">
      <NavBar>
        <Typography variant="h5">Strengthbook</Typography>
        <Typography>Hi, {user.profile.firstName}!</Typography>
      </NavBar>
    </AppBar>
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
    .then(res => res.json())
    .then(json => json)
    .catch(err => console.error('not authorized ', err));

  return {
    props: { user },
  };
};

export default Dashboard;
