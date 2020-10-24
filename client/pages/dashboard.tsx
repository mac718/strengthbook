import React from 'react';
import { GetServerSideProps } from 'next';
import { User } from '../types';
import cookies from 'next-cookies';
import Link from 'next/link';
import {
  Typography,
  Grid,
  List,
  ListItem,
  TableContainer,
  TableCell,
  Table,
  TableHead,
  Paper,
  TableRow,
} from '@material-ui/core';
import styled from 'styled-components';
import Nav from '../components/Nav';
import moment from 'moment';

interface DashboardProps {
  user: User;
}

const PrDiv = styled(TableContainer)`
  border: 1px solid;
  border-radius: 10px;
  overflow: scroll;
  background-color: #c3e9e3;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.035), 0 6px 35px rgba(0, 0, 0, 0.2) !important;
`;

const DashboardGrid = styled(Grid)`
  margin-top: 0px;
`;

const TableHeading = styled.div`
  border-bottom: 1px solid;
  background-color: #c3e9e3;
`;

const TableRowLink = styled(TableRow)`
  cursor: pointer;
  &:hover {
    background-color: #e2ebf3;
  }
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
      <Link href={`/workout/${pr.workout}`}>
        <TableRowLink key={pr._id}>
          <TableCell>
            <Typography>{pr.set.movement}</Typography>
          </TableCell>
          <TableCell>
            <Typography>{Math.round(pr.set.e1rm)}</Typography>
          </TableCell>
          <TableCell>
            <Typography>{moment(pr.date).format('MM-DD-YYYY')}</Typography>
          </TableCell>
        </TableRowLink>
      </Link>
    );
  });

  return (
    <div>
      <Nav user={user} />
      <DashboardGrid container>
        <Grid item xs={4}>
          <PrDiv component={Paper}>
            <TableHeading>
              <Typography variant="h4" align="center">
                Recent PRs
              </Typography>
            </TableHeading>
            <Table size="small">
              <TableHead>
                <TableCell>
                  <Typography variant="h5">Movement</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h5">E1RM</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h5">Date</Typography>
                </TableCell>
              </TableHead>

              {prsListItems}
            </Table>
          </PrDiv>
        </Grid>
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
