import Head from 'next/head';
import {
  Typography,
  Button,
  Container,
  Grid,
  FormControl,
  Input,
} from '@material-ui/core';
import styled from 'styled-components';
//import { useSelector, useDispatch } from 'react-redux';
//import { logIn, setEmail, setPassword } from '../redux/actions/auth-actions';
import { useRouter } from 'next/router';
import { useState } from 'react';

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
  display: flex;
  justify-content: center;
  background-color: white;
  opacity: 0.8;
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

// export async function getStaticProps() {
//   const store = await initializeStore();

//   console.log(store);

//   return {
//     props: { ...store },
//   };
// }

export default function Home() {
  //const dispatch = useDispatch();
  //const state = useSelector(state => state);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginRedirect, setLoginRedirect] = useState(false);
  const router = useRouter();

  function logIn(e) {
    fetch('http://localhost:3001/auth', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'content-type': 'application/json',
      },
    })
      .then(res => {
        return res.json();
      })
      .then(json => {
        setLoginRedirect(true);
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
            <SignInForm onSubmit={e => logIn(e)}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <FormControl>
                    <label htmlFor="username">
                      <Typography variant="h5">username</Typography>
                    </label>
                    <Input
                      id="username"
                      //type="email"
                      placeholder="username"
                      onChange={e => {
                        setEmail(e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl>
                    <label htmlFor="password">
                      <Typography variant="h5">password</Typography>
                    </label>
                    <Input
                      id="password"
                      placeholder="password"
                      type="password"
                      onChange={e => setPassword(e.target.value)}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Button type="submit">Sign In</Button>
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
