import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import { useSelector, useDispatch } from 'react-redux';
import {
  setFilter,
  setCurrentPatient,
  fillWithNonsense,
  filteredPatientListSelector,
} from './patientsSlice';
import VirtualizedTable from './VirtualizedTable';
import styles from './PatientsList.module.css';

const PATIENT_COLUMNS = [
  {
    width: 250,
    label: 'Name',
    dataKey: 'name',
  },
  {
    width: 120,
    label: 'Fractions',
    dataKey: 'fractions',
    numeric: true,
  },
  {
    width: 120,
    label: 'MRN',
    dataKey: 'mrn',
  },
  {
    width: 60,
    label: 'ID',
    dataKey: 'id',
  },
  {
    width: 50,
    label: 'Sex',
    dataKey: 'sex',
  },
  {
    width: 120,
    label: 'Date Of Birth',
    dataKey: 'dateOfBirth',
  },
];

const PatientsList = ({
  subscribe
}) => {
  const dispatch = useDispatch();
  const { filter, list, records } = useSelector(filteredPatientListSelector);

  return (
   <Paper className={styles.PatientList}>
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      spacing={2}
    >
      <TextField
        label="Search"
        value={filter}
        onChange={(e) => dispatch(setFilter(e.target.value))}
      />
      <Tooltip
        title="Click to add 10000 rows of nonsense"
        placement="top-start"
      >
        <IconButton
          onClick={() => dispatch(fillWithNonsense())}
        >
          <ChildCareIcon />
        </IconButton>
      </Tooltip>
    </Stack>
    <div className={styles.TableContainer}>
      <VirtualizedTable
         rowCount={list.length}
         rowGetter={({ index }) => list[index]}
         columns={PATIENT_COLUMNS}
         onRowClick={({ rowData }) => {
           dispatch(setCurrentPatient(rowData.uri));
           // Dont resubscribe to patient data
           if (records[rowData.uri]) return;
           subscribe(rowData.uri);
         }}
       />
     </div>
   </Paper>
  )
}

export default PatientsList;
