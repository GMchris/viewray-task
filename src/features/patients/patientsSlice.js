import {
  createSlice,
  createSelector,
} from '@reduxjs/toolkit';
import _ from 'lodash';

const initialState = {
  list: [],
  records: {},
  filter: '',
  currentPatient: null,
  currentDiagnosis: 0,
  currentPrescription: 0,
};

export const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setFilter: (state, { payload }) => {
      state.filter = payload || '';
    },
    setCurrentPatient: (state, { payload }) => {
      state.currentPatient = payload || null;
      state.currentDiagnosis = 0;
      state.currentPrescription = 0;
    },
    setDiagnosis: (state, { payload }) => {
      if (state.currentDiagnosis === payload) return;

      state.currentDiagnosis = payload;
      state.currentPrescription = 0;
    },
    setPrescription: (state, { payload }) => {
      state.currentPrescription = payload;
    },
    fillWithNonsense: (state) => {
      state.list = _.times(10000, () => {
        const val = Math.random();
        return {
          id: val,
          first_name: val,
          middle_name: val,
          last_name: val,
          uri: val,
          fractions_completed: val,
          fractions_total: val,
          date_of_birth: val,
          mrn: val,
          sex: val,
        };
      }).concat(state.list);
    },
    receiveMessage: (state, { payload }) => {
      const updates = _.get(payload, 'updateSubscriptions');
      const newValuesMap = new Map();

      _.map(updates, ({ type, value, diagnoses }, updateKey) => {
        console.log(type, value);
        if (type === 'PatientList' && value) {
          // Cheap initial population
          if (_.isEmpty(state.list)) {
            state.list = value;
          }


          value.forEach((newValueItem) => {
            newValuesMap.set(newValueItem.uri, newValueItem);
          });
        }

        if (type === 'Patient' && diagnoses) {
          state.records[updateKey] = { diagnoses };
        }
      });

      const updatedValues = state.list.map((item) => {
        if (newValuesMap.has(item.uri)) {
          const newValue = newValuesMap.get(item.uri);
          newValuesMap.delete(item.uri);
          return newValue;
        }

        return item;
      });

      state.list = [...updatedValues, ...Array.from(newValuesMap.values())];
    },
  },
});

export const {
  receiveMessage,
  setFilter,
  setPrescription,
  setDiagnosis,
  fillWithNonsense,
  setCurrentPatient,
} = patientsSlice.actions;

const patientsSelector = state => state.patients;

const filterSelector = createSelector(
  patientsSelector,
  ({ filter }) => filter,
);

const recordsSelector = createSelector(
  patientsSelector,
  ({ records }) => records,
);

const formattedPatientListSelector = createSelector(
  patientsSelector,
  ({ list, currentPatient }) => list.map(({
    id,
    first_name,
    middle_name,
    last_name,
    uri,
    fractions_completed,
    fractions_total,
    date_of_birth,
    mrn,
    sex,
  }) => ({
    id,
    uri,
    mrn,
    sex,
    active: uri === currentPatient,
    name: `${first_name} ${middle_name} ${last_name}`,
    dateOfBirth: date_of_birth,
    fractions: `${fractions_completed} / ${fractions_total}`
  }))
);

export const filteredPatientListSelector = createSelector(
  filterSelector,
  recordsSelector,
  formattedPatientListSelector,
  (filter, records, list) => {
    const checkFilter = filter.toUpperCase();

    return {
      list: filter ? list.filter(({ name }) => name.toUpperCase().includes(checkFilter)) : list,
      filter,
      records,
    };
  }
);

export const currentPatientSelector = createSelector(
  patientsSelector,
  ({ list, currentPatient, records, currentDiagnosis, currentPrescription }) => ({
    ...(_.find(list, ({ uri }) => uri === currentPatient)),
    ...(records[currentPatient] || {}),
    currentPatient,
    currentDiagnosis,
    currentPrescription,
  }));

export default patientsSlice.reducer;
