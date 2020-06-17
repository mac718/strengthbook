import React, { useState } from 'react';
import { TextField, Button, Typography } from '@material-ui/core';
import styled from 'styled-components';

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

  return (
    <PageContainer>
      <FormContainer>
        <Typography variant="h4">Strengthbook</Typography>
        <TextField
          variant="outlined"
          label="email"
          placeholder="email"
          type="email"
          margin="normal"
          autoFocus
        ></TextField>

        <TextField
          variant="outlined"
          label="password"
          placeholder="password"
          type="password"
          margin="normal"
        ></TextField>

        <Button type="submit" variant="outlined" color="primary">
          Login
        </Button>
      </FormContainer>
    </PageContainer>
  );
};

export default Login;
