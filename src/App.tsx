import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import createTheme from '@mui/material/styles/createTheme';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './dashboard/Dashboard';
import Login from './Login';
import { UserCreation } from './UserCreation';
import { UserForgot } from './UserForgot';
import { UserForgotRequest } from './UserForgotRequest';
import { UserVerify } from './UserVerify';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function isLoggedIn(): boolean {
  if (localStorage.getItem('jwt')) {
    return true;
  } else {
    return false;
  }
}

function App(): JSX.Element {
  return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={isLoggedIn() ? <Navigate to="dashboard" /> : <Navigate to="login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/privacy" element={<p>Privacy WIP</p>} />
              <Route path="/cgu" element={<p>CGU WIP</p>} />
              <Route path="/register" element={<UserCreation />} />
              <Route path="/verify/:id/:chain" element={<UserVerify />} />
              <Route path="/forgot" element={<UserForgotRequest />} />
              <Route path="/forgotpassword/:id/:chain" element={<UserForgot />} />
              <Route path="*" element={<p>Cette route n'existe pas</p>} />
            </Routes>
          </BrowserRouter>
        </div>
      </ThemeProvider>
  );
}

export default App;
