import { ThemeProvider } from '@emotion/react';
import { CssBaseline, TextareaAutosize } from '@mui/material';
import createTheme from '@mui/material/styles/createTheme';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './dashboard/Dashboard';
import Login from './Login';

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
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
