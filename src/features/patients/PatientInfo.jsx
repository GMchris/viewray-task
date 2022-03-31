import React from 'react';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import HelpIcon from '@mui/icons-material/Help';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useSelector } from 'react-redux';
import {
  currentPatientSelector,
  setDiagnosis,
  setPrescription,
} from './patientsSlice';

const paperPadding = {
  padding: 1,
};

const tabContainerStyles = {
  borderRight: 1,
  paddingTop: 1,
  borderColor: 'divider',
};

const InfoBox = ({
  label,
  content,
}) => (
  <Grid item xs={12} md={6} xl={4}>
    <Paper sx={paperPadding}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
      >
        <Typography variant="overline">{label}</Typography>
        {content}
      </Stack>
    </Paper>
  </Grid>
);

const BooleanIcon = ({
  status,
}) => {
  switch (status) {
    case true:
      return (<CheckCircleIcon color="success" />);
    case false:
      return (<CancelIcon color="error" />);
    default:
      return (<HelpIcon color="info" />);
  }
};

const PatientInfo = () => {
  const {
    id,
    first_name,
    middle_name,
    last_name,
    registration_time,
    fractions_completed,
    fractions_total,
    date_of_birth,
    weight_kg,
    ready_for_treatment,
    mrn,
    sex,
    diagnoses,
    currentPatient,
    currentDiagnosis,
    currentPrescription,
  } = useSelector(currentPatientSelector);
  const dispatch = useDispatch();

  if (!currentPatient) return null;

  const prescriptions = _.get(diagnoses, `${currentDiagnosis}.prescriptions`);
  const plans = _.get(prescriptions, `${currentPrescription}.plans`);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
       <Paper
        sx={paperPadding}
       >
         <Stack
           direction="row"
           justifyContent="flex-start"
           alignItems="end"
           spacing={1}
         >
           <Typography variant="h4">{first_name} {last_name}</Typography>
           <Typography variant="subtitle1">{middle_name}</Typography>
         </Stack>
       </Paper>
     </Grid>
     <InfoBox
       label="MRN"
       content={mrn}
     />
     <InfoBox
       label="ID"
       content={id}
     />
     <InfoBox
       label="Sex"
       content={sex}
     />
     <InfoBox
       label="Date of Birth"
       content={date_of_birth}
     />
     <InfoBox
       label="Weight"
       content={weight_kg}
     />
     <InfoBox
       label="Registration Time"
       content={registration_time}
     />
     <InfoBox
       label="Completed Fractions"
       content={fractions_completed}
     />
     <InfoBox
       label="Total Fractions"
       content={fractions_total}
     />
     <InfoBox
       label="Interrupted Fractions"
       content={0}
     />
     <InfoBox
       label="Realview Image Data"
       content={<BooleanIcon />}
     />
     <InfoBox
       label="Ready for treatmeant"
       content={<BooleanIcon status={ready_for_treatment}/>}
     />
     <InfoBox
       label="Allow use of anonymized data"
       content={<BooleanIcon />}
     />
     {_.isEmpty(diagnoses) ? null : (
     <Grid item xs={12}>
      <Paper>
        <Stack direction="row">
        <Stack sx={tabContainerStyles} alignItems="center">
          <Typography variant="button">
            Diagnoses
          </Typography>
         <Tabs
          orientation="vertical"
          variant="scrollable"
          value={currentDiagnosis}
          onChange={(event, value) => {dispatch(setDiagnosis(value))}}
        >
          {diagnoses.map(({ label }, index) => (
            <Tab label={label} value={index} key={index} />
          ))}
        </Tabs>
      </Stack>
      {_.isEmpty(prescriptions) ? null : (
        <Stack sx={tabContainerStyles} alignItems="center">
          <Typography variant="button">
            Prescriptions
          </Typography>
        <Tabs
           orientation="vertical"
           variant="scrollable"
           value={currentPrescription}
           onChange={(event, value) => {dispatch(setPrescription(value))}}
         >
           {prescriptions.map(({ label }, index) => (
             <Tab label={label} value={index} key={`${currentDiagnosis}_${index}`} />
           ))}
         </Tabs>
         </Stack>
        )}
        {_.isEmpty(plans) ? null : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Name
                  </TableCell>
                  <TableCell>
                    Type
                  </TableCell>
                  <TableCell>
                    Scans
                  </TableCell>
                  <TableCell>
                    Structures
                  </TableCell>
                  <TableCell>
                    Last Edit
                  </TableCell>
                  <TableCell>
                    Creation Time
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {plans.map(({ label, type }) => (
                  <TableRow>
                    <TableCell>
                      {label}
                    </TableCell>
                    <TableCell>
                      {type}
                    </TableCell>
                    <TableCell>
                      #
                    </TableCell>
                    <TableCell>
                      #
                    </TableCell>
                    <TableCell>
                      ### ###
                    </TableCell>
                    <TableCell>
                      ### ###
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Stack>
      </Paper>
     </Grid>
      )}
   </Grid>
 );
};

export default PatientInfo;
