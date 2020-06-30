import React from 'react';
import {
  AppBar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Toolbar,
} from '@material-ui/core';
import Link from 'next/link';
import styled from 'styled-components';

const NavBar = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
  background-color: #49beaa;
`;

const AppBarMargin = styled(AppBar)`
  margin-bottom: 75px;
`;

const Nav = ({ user }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <AppBarMargin color="primary" position="static">
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
              <Link href="/profile">
                <a>Profile</a>
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link href="/dashboard">
                <a>Dashboard</a>
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link href="/calender">
                <a>Calender</a>
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </div>
      </NavBar>
    </AppBarMargin>
  );
};

export default Nav;
