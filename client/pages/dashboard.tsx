import React from 'react';
import { GetServerSideProps } from 'next';
import { User } from '../types';
import cookies from 'next-cookies';
import { Typography, Grid } from '@material-ui/core';
import styled from 'styled-components';
import Nav from '../components/Nav';

interface DashboardProps {
  user: User;
}

const ProfileDiv = styled(Grid)`
  height: 15vh;
  border: 1px solid;
`;

const DashboardGrid = styled(Grid)`
  margin-top: 75px;
`;

const Dashboard = ({ user }: DashboardProps) => {
  return (
    <div>
      <Nav user={user} />
      <DashboardGrid container>
        <ProfileDiv item xs={3}>
          <Typography variant="h4">Profile</Typography>
        </ProfileDiv>
      </DashboardGrid>
    </div>
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
      console.log('thing', res.status);
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

export default Dashboard;
