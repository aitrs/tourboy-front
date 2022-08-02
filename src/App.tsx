import { ThemeProvider } from '@emotion/react';
import { CssBaseline, TextareaAutosize } from '@mui/material';
import createTheme from '@mui/material/styles/createTheme';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './dashboard/Dashboard';
import Login from './Login';
import { GoogleApiProvider } from 'react-gapi';

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
    <GoogleApiProvider clientId='241192926696-g95ces22pifqqa0u77lue9h6h6ct33cn.apps.googleusercontent.com'>
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
            </Routes>
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </GoogleApiProvider>
  );
}

export default App;
