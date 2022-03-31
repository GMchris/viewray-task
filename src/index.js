import React from 'react';
import { Provider } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Patients from './features/patients/Patients';
import ReactDOMClient from 'react-dom/client';
import { store } from './app/store';
import './index.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    text: {
      primary: '#517f90',
    },
    primary: {
      main: '#00AFB6',
    },
    secondary: {
      main: '#fcf340',
    },
    background: {
      default: '#001722',
      paper: '#002938',
    },
    divider: '#004A66',
  },
});

const root = ReactDOMClient.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ margin: 2 }}>
        <Patients />
      </Box>
    </ThemeProvider>
  </Provider>
);
