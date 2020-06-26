import React, { useState } from 'react';
import cookies from 'next-cookies';
import { GetServerSideProps } from 'next';
import {
  Typography,
  List,
  ListItem,
  Button,
  TextField,
  Grid,
} from '@material-ui/core';
import Nav from '../components/Nav';
import { User } from '../types';
import styled from 'styled-components';

interface ProfileProps {
  user: User;
}

const ProfileContainer = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  width: 40%;
  margin: auto;
`;

const Profile: React.FC<ProfileProps> = ({ user }: ProfileProps) => {
  const [showForm, setShowForm] = useState(false);

  const handleSaveChanges = e => {
    e.preventDefault();
    console.log('thing');
  };

  if (showForm) {
    return (
      <>
        <Nav user={user} />

        <ProfileContainer onSubmit={e => handleSaveChanges(e)}>
          <Button variant="outlined" onClick={() => setShowForm(!showForm)}>
            Edit Profile
          </Button>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="firstName"
                label="First Name"
                margin="normal"
                variant="outlined"
                defaultValue={user.profile.firstName}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="lastName"
                label="Last Name"
                margin="normal"
                variant="outlined"
                defaultValue={user.profile.lastName}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="bodyweight"
                label="Bodyweight"
                margin="normal"
                variant="outlined"
                defaultValue={user.profile.bodyWeight}
                fullWidth
              />
            </Grid>
          </Grid>
          <Button type="submit">Save Changes</Button>
        </ProfileContainer>
      </>
    );
  }
  return (
    <>
      <Nav user={user} />
      <ProfileContainer>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => setShowForm(!showForm)}
        >
          Edit Profile
        </Button>
        <List>
          <ListItem>
            <Typography variant="h5">
              Name: {user.profile.firstName} {user.profile.lastName}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="h5">Age: 3000</Typography>
          </ListItem>
          <ListItem>
            <Typography variant="h5">Sex: M</Typography>
          </ListItem>
          <ListItem>
            <Typography variant="h5">Bodyweight: 220 lbs</Typography>
          </ListItem>
        </List>
      </ProfileContainer>
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
    .then(res => res.json())
    .then(json => json)
    .catch(err => console.error('not authorized ', err));

  return {
    props: { user },
  };
};

export default Profile;
