import { configureStore } from '@reduxjs/toolkit';
import patients from '../features/patients/patientsSlice';

export const store = configureStore({
  reducer: {
    patients,
  },
});
