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
  );
};

export default Nav;
