import React from 'react';
import Head from 'next/head';
import {
  Typography,
  Button,
  Container,
  Grid,
  FormControl,
  Input,
  TextField,
} from '@material-ui/core';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Cookies = require('js-cookie');

const SignInContainer = styled(Container)`
  background-color: #333;
`;

const FullLengthGrid = styled(Grid)`
  height: 100vh;
`;

const FormContainer = styled.div`
  border: 1px solid grey;
  border-radius: 10px;
  width: 65%;
  padding: 20px;

  background-color: white;
`;

const SignInForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const GradientLogo = styled(Typography)`
  background: -webkit-linear-gradient(45deg, #2196f3 30%, #21cbf3 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
`;

const FirstLast = styled.div`
  display: flex;
`;

export default function Home() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginRedirect, setLoginRedirect] = useState(false);
  const router = useRouter();

  function signUp(e) {
    e.preventDefault();
    console.log('myerp');
    fetch('http://localhost:3001/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName }),
      headers: {
        'content-type': 'application/json',
      },
    })
      .then(res => {
        if (res.status === 201) {
          setLoginRedirect(true);
        }
        return res.json();
      })
      .then(json => {
        Cookies.set('email', json.user.email);
        Cookies.set('token', json.token);
      });
  }

  if (loginRedirect) {
    router.push('/dashboard');
  }

  return (
    <SignInContainer disableGutters={true} maxWidth="xl">
      <Head>
        <title>Strength Book</title>
      </Head>

      <FullLengthGrid container alignItems="center">
        <Grid item xs={8}>
          <GradientLogo variant="h1">Strength Book</GradientLogo>
        </Grid>
        <Grid item xs={4}>
          <FormContainer>
            <SignInForm onSubmit={e => signUp(e)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="firstName"
                    label="First Name"
                    placeholder="First Name"
                    margin="normal"
                    variant="outlined"
                    autoFocus
                    onChange={e => setFirstName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="lastName"
                    label="Last Name"
                    placeholder="Last Name"
                    margin="normal"
                    variant="outlined"
                    onChange={e => setLastName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="username"
                    type="email"
                    label="email"
                    placeholder="username"
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    onChange={e => {
                      setEmail(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="password"
                    placeholder="password"
                    type="password"
                    label="password"
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    onChange={e => setPassword(e.target.value)}
                  />
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Sign Up
                </Button>
              </Grid>
            </SignInForm>
          </FormContainer>
        </Grid>
      </FullLengthGrid>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </SignInContainer>
  );
}
