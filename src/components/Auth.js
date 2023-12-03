import React, { useContext, useEffect, useState } from 'react';
import { FormControl, FormLabel, TextField, Button, Typography } from '@material-ui/core'
import { useHistory } from 'react-router-dom';
import authContext from '../contexts/auth/authContext';

const Auth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [username_new, setUsername_new] = useState('');
  const [password_new, setPassword_new] = useState('');
  const [token, setToken] = useState(null);
  const [signinFailed, setSigninFailed] = useState(false)

  const history = useHistory()
  const context = useContext(authContext)

  useEffect(() => {
    const checkAuth = async () => {
      (context.isLoggedIn) && history.push('/searchBrewery')
    };
    checkAuth();
  }, [context.isLoggedIn, history]);

  const handleSignUp = async () => {
    try {
      const response = await fetch(`${process.env.REACT_SERVER_BASE_URL || "http://localhost:3000"}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username_new, password: password_new }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("regestered successfully")
      } else {
        alert(`sign-up failed: ${data.message}`)
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      alert('Error during sign-up')
    }
  };


  const handleSignIn = async () => {
    try {
      const response = await fetch(`${process.env.REACT_SERVER_BASE_URL || "http://localhost:3000"}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token)
        context.setIsLoggedIn(true)
      } else {
        setSigninFailed(true)
      }
    } catch (error) {
      setSigninFailed(true)
      console.error('Error during sign-in:', error);
    }
  };



  return (
    <div>
      <div>
        <FormControl style={{ margin: '8px', width: '30%' }}>
          <FormLabel style={{ marginBottom: '20px' }}>Please sign-in to your account</FormLabel>
          <Typography style={{color: 'red'}}>{signinFailed ? "no user exists for this combination of email and password" : ""}</Typography>
          <TextField
            variant='filled'
            label="Email Id"
            value={username}
            onChange={(event) => { setUsername(event.target.value); setSigninFailed(false) }}
            style={{ margin: '8px' }}
            required
            type='email'
          />
          <TextField
            variant='filled'
            label="Password"
            value={password}
            onChange={(event) => { setPassword(event.target.value); setSigninFailed(false) }}
            style={{ margin: '8px' }}
            required
            type='password'
          />
          <Button variant='contained' onClick={handleSignIn} style={{ margin: '8px' }}>
            Sign In
          </Button>
        </FormControl>
      </div>
      <div>
        <FormControl style={{ margin: '8px', width: '30%' }}>
          <FormLabel style={{ marginBottom: '20px' }}>Don't have account? Sign up now!</FormLabel>
          <TextField
            variant='filled'
            label="Email Id"
            value={username_new}
            onChange={(event) => { setUsername_new(event.target.value) }}
            style={{ margin: '8px' }}
            required
            type='email'
          />
          <TextField
            variant='filled'
            label="Password"
            value={password_new}
            onChange={(event) => { setPassword_new(event.target.value) }}
            style={{ margin: '8px' }}
            required
            type='password'
          />
          <Button variant='contained' onClick={handleSignUp} style={{ margin: '8px' }}>
            Sign Up
          </Button>
        </FormControl>
      </div>
    </div>
  )
};

export default Auth;