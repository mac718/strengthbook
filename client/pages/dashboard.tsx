import React from 'react';
import { GetServerSideProps } from 'next';
import { User } from '../types';
import cookies from 'next-cookies';
import { Typography, Grid, List, ListItem } from '@material-ui/core';
import styled from 'styled-components';
import Nav from '../components/Nav';
import moment from 'moment';

interface DashboardProps {
  user: User;
}

const PrDiv = styled(Grid)`
  height: 25%;
  border: 1px solid;
  border-radius: 10px;
  overflow: scroll;
  background-color: #c3e9e3;
  padding-top: 10px;
`;

const DashboardGrid = styled(Grid)`
  margin-top: 50px;
`;

const Dashboard = ({ user }) => {
  console.log(user.prs);

  let sortedPrs = user.prs.sort((a, b) => {
    if (a.date > b.date) {
      return 1;
    } else if (a.date === b.date) {
      return 0;
    } else {
      return -1;
    }
  });

  let recentPrs = sortedPrs.slice(0, 10);

  let prsListItems = recentPrs.map(pr => {
    return (
      <ListItem key={pr._id}>
        <Typography>
          {moment(pr.date).format('MM-DD-YYYY')} {pr.set.movement}:{' '}
          {Math.round(pr.set.e1rm)}
        </Typography>
      </ListItem>
    );
  });

  return (
    <div>
      <Nav user={user} />
      <DashboardGrid container>
        <PrDiv item xs={3}>
          <Typography variant="h4" align="center">
            Recent PRs
          </Typography>
          <List>{prsListItems}</List>
        </PrDiv>
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

  return {
    props: { user },
  };
};

export default Dashboard;
