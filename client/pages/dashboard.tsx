import React from 'react';
import { GetServerSideProps } from 'next';
import { User } from '../types';
import cookies from 'next-cookies';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Grid,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import styled from 'styled-components';
import Link from 'next/link';

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

const ProfileDiv = styled(Grid)`
  height: 15vh;
  border: 1px solid;
`;

const DashboardGrid = styled(Grid)`
  margin-top: 75px;
`;

const Dashboard = ({ user }: DashboardProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <AppBar color="primary">
        <NavBar>
          <Typography variant="h5">Strengthbook</Typography>
          <Typography>Hi, {user.profile.firstName}!</Typography>
          <div>
            <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
              variant="contained"
            >
              Open Menu
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <Link href="/profile">Profile</Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
          </div>
        </NavBar>
      </AppBar>
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
    .then(res => res.json())
    .then(json => json)
    .catch(err => console.error('not authorized ', err));

  return {
    props: { user },
  };
};

export default Dashboard;
