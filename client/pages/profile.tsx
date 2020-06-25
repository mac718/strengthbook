import React, { FunctionComponent } from 'react';
import cookies from 'next-cookies';
import { GetServerSideProps } from 'next';
import { Typography } from '@material-ui/core';
import Nav from '../components/Nav';
import { User } from '../types';

interface ProfileProps {
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }: ProfileProps) => {
  return (
    <React.Fragment>
      <Nav user={user} />
      <Typography variant="h1">Profile for {user.profile.firstName}</Typography>
    </React.Fragment>
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
