import React, { useEffect, useRef } from 'react';
import Sockette from 'sockette';
import Grid from '@mui/material/Grid';
import { useDispatch } from 'react-redux';
import {
  receiveMessage,
} from './patientsSlice';
import PatientsList from './PatientsList';
import PatientInfo from './PatientInfo';

const Patients = () => {
  const dispatch = useDispatch();
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new Sockette('ws://apply.viewray.ai:4645', {
      timeout: 5e3,
      maxAttempts: 10,
      onopen: e => {
        ws.current.json({
          setSubscriptions: {
            'public:patients': 'request'
          }
        });
      },
      onmessage: ({ data }) => dispatch(receiveMessage(JSON.parse(data))),
    });
  }, [dispatch]);

  const subscribeToPatient = (uri) => {
    ws.current.json({
      setSubscriptions: {
        [uri]: 'request',
      }
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={5}>
        <PatientsList subscribe={subscribeToPatient} />
      </Grid>
      <Grid
        item
        xs={7}
      >
        <PatientInfo />
      </Grid>
    </Grid>
  );
}

export default Patients;
