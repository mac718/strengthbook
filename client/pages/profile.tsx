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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import Nav from '../components/Nav';
import { User } from '../types';
import styled from 'styled-components';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import moment from 'moment';
import { exerciseList } from '../static-data/excersiseList';

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

const SpacedSelect = styled(Select)`
  margin-bottom: 20px;
`;

const Profile: React.FC<ProfileProps> = ({ user }: ProfileProps) => {
  const [showForm, setShowForm] = useState(false);
  const [profile, setProfile] = useState(user.profile);
  const [trackedMovements, setTrackedMovements] = useState([]);

  const router = useRouter();

  const menuItems = exerciseList.map(exercise => {
    return (
      <MenuItem value={exercise} key={exercise}>
        {exercise}
      </MenuItem>
    );
  });

  const onChange = (e, order) => {
    let movements = trackedMovements;
    movements[order - 1] = e.target.value;
    setTrackedMovements(movements);
    console.log(trackedMovements);
  };

  const handleSaveChanges = e => {
    e.preventDefault();
    const token = Cookies.get('token');
    fetch('http://localhost:3001/users/edit-profile', {
      method: 'PATCH',
      body: JSON.stringify({
        firstName: profile.firstName,
        lastName: profile.lastName,
        bodyweight: profile.bodyweight,
        dob: profile.dob,
        trackedMovements,
      }),
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).then(res => {
      setShowForm(!showForm);
      if (res.status !== 200) {
        router.push('/login');
      }
    });
  };

  if (showForm) {
    return (
      <>
        <Nav user={user} />

        <ProfileContainer onSubmit={e => handleSaveChanges(e)}>
          <Button variant="outlined" onClick={() => setShowForm(!showForm)}>
            Back to Profile
          </Button>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="firstName"
                label="First Name"
                margin="normal"
                variant="outlined"
                defaultValue={profile.firstName}
                fullWidth
                onChange={e =>
                  setProfile({ ...profile, firstName: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="lastName"
                label="Last Name"
                margin="normal"
                variant="outlined"
                defaultValue={profile.lastName}
                fullWidth
                onChange={e =>
                  setProfile({ ...profile, lastName: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="bodyweight"
                label="Bodyweight"
                margin="normal"
                variant="outlined"
                defaultValue={profile.bodyweight}
                fullWidth
                onChange={e =>
                  setProfile({
                    ...profile,
                    bodyweight: parseFloat(e.target.value),
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="dob"
                label="Birthday"
                margin="normal"
                variant="outlined"
                defaultValue={moment(profile.dob).format('YYYY-MM-DD')}
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                onChange={e => {
                  console.log(e.target.value);
                  let dateArr = e.target.value.split('-');
                  let date = `${dateArr[1]}-${dateArr[2]}-${dateArr[0]}`;
                  setProfile({ ...profile, dob: new Date(date) });
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">
                Select Tracked/Competition Movements
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="movement1">Movement 1</InputLabel>
                <SpacedSelect
                  labelId="movement1"
                  variant="filled"
                  onChange={e => onChange(e, 1)}
                  // value={trackedMovements[0]}
                  defaultValue={profile.trackedMovements[0]}
                >
                  {menuItems}
                </SpacedSelect>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="movement2">Movement 2</InputLabel>
                <SpacedSelect
                  labelId="movement2"
                  variant="filled"
                  onChange={e => onChange(e, 2)}
                  defaultValue={profile.trackedMovements[1]}
                >
                  {menuItems}
                </SpacedSelect>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="movement3">Movement 3</InputLabel>
                <SpacedSelect
                  labelId="movement3"
                  variant="filled"
                  onChange={e => onChange(e, 3)}
                  defaultValue={profile.trackedMovements[2]}
                >
                  {menuItems}
                </SpacedSelect>
              </FormControl>
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
              Name: {profile.firstName} {profile.lastName}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="h5">
              Birthday: {moment(profile.dob).format('YYYY-MM-DD')} (Age:{' '}
              {moment().diff(moment(profile.dob).format('YYYY-MM-DD'), 'years')}
              )
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="h5">Sex: M</Typography>
          </ListItem>
          <ListItem>
            <Typography variant="h5">
              Bodyweight: {profile.bodyweight}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="h5">
              Tracked Movements: {profile.trackedMovements[0]},{' '}
              {profile.trackedMovements[1]}, {profile.trackedMovements[2]}
            </Typography>
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

export default Profile;
