import React, { useState } from 'react';
import { TextField, Button, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { useRouter } from 'next/router';
const Cookies = require('js-cookie');

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid;
  border-radius: 5px;
  width: 20%;
  padding-top: 25px;
  padding-bottom: 25px;
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginRedirect, setLoginRedirect] = useState(false);
  const router = useRouter();

  function logIn(e) {
    e.preventDefault();
    console.log('myerp');
    fetch('http://localhost:3001/auth', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
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
      });
  }

  return (
    <PageContainer>
      <FormContainer onSubmit={e => logIn(e)}>
        <Typography variant="h4">Strengthbook</Typography>
        <TextField
          variant="outlined"
          label="email"
          placeholder="email"
          type="email"
          margin="normal"
          autoFocus
          onChange={e => setEmail(e.target.value)}
        ></TextField>

        <TextField
          variant="outlined"
          label="password"
          placeholder="password"
          type="password"
          margin="normal"
          onChange={e => setPassword(e.target.value)}
        ></TextField>

        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>
      </FormContainer>
    </PageContainer>
  );
};

export default Login;
