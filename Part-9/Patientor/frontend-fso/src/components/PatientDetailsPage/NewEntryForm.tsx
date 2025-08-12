import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Autocomplete, Button } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

import RangeDatePicker from '../ui/RangeDatePicker';

import { HealthCheckRating } from '../../types';
import type { Diagnosis, SickLeave, EntryWithoutId, Patient, Entry } from '../../types';
import { handleApiError, isNonEmptyString, assertNever } from '../../utils';

import patientService from '../../services/patients';

type NewEntryFormProps = {
  patientId: string,
  diagnoses: Diagnosis[],
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setPatient: React.Dispatch<React.SetStateAction<Patient | null>>,
  setSidePanelOpen: React.Dispatch<React.SetStateAction<boolean>>,
};

const RATINGS = Object.values(HealthCheckRating) as readonly HealthCheckRating[];
const isHealthCheckRating = (
  value: unknown
): value is HealthCheckRating =>
  typeof value === 'number' &&
  RATINGS.includes(value as HealthCheckRating);

type EntryType = EntryWithoutId['type'];

const NewEntryForm = ({ patientId, diagnoses, setError, setPatient, setSidePanelOpen }: NewEntryFormProps) => {
  const [type, setType] = useState<EntryType>('HealthCheck');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [specialist, setSpecialist] = useState<string>('');
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<string[]>([]);
  const [rating, setRating] = useState<string>('0');
  const [employerName, setEmployerName] = useState<string>('');
  const [sickLeave, setSickLeave] = useState<SickLeave>({
    startDate: '',
    endDate: ''
  });
  const [dischargeDate, setDischargeDate] = useState<string>('');
  const [dischargeCriteria, setDischargeCriteria] = useState<string>('');
  const navigate = useNavigate();

  const onChange = (setValue: React.Dispatch<React.SetStateAction<string>>) =>(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(e.target.value);
  const onSelectChange = (setValue: React.Dispatch<React.SetStateAction<string>>) => (e: SelectChangeEvent<string>) => setValue(e.target.value);
  const onEntryTypeChange = (e: SelectChangeEvent<EntryType>) => setType(e.target.value as EntryType);

  // For Autocomplete
  const selectedDiagnosisObjects = diagnoses.filter(d =>
    selectedDiagnoses.includes(d.code)
  );

  const healthCheckOptions = Object.entries(HealthCheckRating).map(([label, value]) => ({
    value: String(value),
    label,
  }));

  const resetForm = (): void => {
    setType('HealthCheck');
    setDescription('');
    setDate('');
    setSpecialist('');
    setSelectedDiagnoses([]);
    setRating('0');
    setEmployerName('');
    setSickLeave({ startDate: '', endDate: '' });
    setDischargeDate('');
    setDischargeCriteria('');
  };

  const getNewEntryData = (): EntryWithoutId => {
    const base: Omit<EntryWithoutId, 'type'> = {
      description,
      date,
      specialist,
      ...(selectedDiagnoses.length ? { diagnosisCodes: selectedDiagnoses } : {}),
    };

    switch (type) {
      case 'HealthCheck': {
        const numRating = Number(rating);

        if (!isHealthCheckRating(numRating)) {
          throw new Error('Invalid healthCheckRating');
        }

        return {
          ...base,
          type: 'HealthCheck',
          healthCheckRating: numRating
        };
      }

      case 'OccupationalHealthcare':
        return {
          ...base,
          type: 'OccupationalHealthcare',
          employerName,
          ...(isNonEmptyString(sickLeave.startDate) && isNonEmptyString(sickLeave.endDate)
            ? { sickLeave }
            : {}),
        };

      case 'Hospital':
        return {
          ...base,
          type: 'Hospital',
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria,
          },
        };

      default:
        return assertNever(type);
    }
  };

  const handleEntryCreation = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    try {
      const newEntryData: EntryWithoutId = getNewEntryData();
      const addedEntry: Entry = await patientService.addEntry(patientId, newEntryData);
      resetForm();
      setError('');
      setPatient(prev =>
        prev
          ? {
            ...prev,
            entries: [...(prev.entries ?? []), addedEntry],
          }
          : prev
      );
      setSidePanelOpen(false);
    } catch(error) {
      handleApiError(error, navigate, setError);
      setSidePanelOpen(false);
    }
  };

  return (
    <Box
      component='form'
      onSubmit={handleEntryCreation}
      sx={{display: 'flex', flexDirection: 'column', gap: '20px'}}
    >
      <FormControl fullWidth>
        <InputLabel id='entryType'>Entry Type</InputLabel>
        <Select
          variant='standard'
          labelId='entryType'
          value={type}
          label='Entry Type'
          onChange={onEntryTypeChange}
        >
          <MenuItem value='HealthCheck'>Health Check</MenuItem>
          <MenuItem value='OccupationalHealthcare'>Occupational Healthcare</MenuItem>
          <MenuItem value='Hospital'>Hospital</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label='Description'
        variant='standard'
        multiline
        rows={3}
        onChange={onChange(setDescription)}
        value={description}
      />

      <DatePicker
        label='Date'
        value={date ? dayjs(date) : null}
        onChange={(newValue: Dayjs | null) =>
          setDate(newValue ? newValue.format('YYYY-MM-DD') : '')
        }
        slotProps={{ textField: { variant: 'standard', fullWidth: true } }}
      />

      <TextField
        label='Specialist'
        variant='standard'
        onChange={onChange(setSpecialist)}
        value={specialist}
      />

      <Autocomplete
        multiple
        options={diagnoses}
        value={selectedDiagnosisObjects}
        onChange={(_, newValue) =>
          setSelectedDiagnoses(newValue.map(d => d.code))
        }
        getOptionLabel={(option) => `${option.code} — ${option.name}`}
        isOptionEqualToValue={(opt, val) => opt.code === val.code}
        filterSelectedOptions
        disableCloseOnSelect
        renderInput={(params) => (
          <TextField {...params} variant='standard' label='Diagnoses' fullWidth/>
        )}
        ListboxProps={{ style: { paddingTop: 0, paddingBottom: 0 } }}
        componentsProps={{
          paper: {
            elevation: 6,
            sx: { mt: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2 },
          },
        }}
      />

      {type === 'HealthCheck' && (
        <Select
          variant='standard'
          value={rating}
          onChange={onSelectChange(setRating)}
        >
          {healthCheckOptions.map(rating => (
            <MenuItem key={rating.value} value={rating.value}>{rating.label}</MenuItem>
          ))}
        </Select>
      )}

      {type === 'OccupationalHealthcare' && (
        <>
          <TextField
            label='Employer Name'
            variant='standard'
            onChange={onChange(setEmployerName)}
            value={employerName}
          />

          <RangeDatePicker label='Sick Leave' value={sickLeave} onChange={setSickLeave} />
        </>
      )}

      {type === 'Hospital' && (
        <>
          <DatePicker
            label='Discharge Date'
            value={dischargeDate ? dayjs(dischargeDate) : null}
            onChange={(newValue: Dayjs | null) =>
              setDischargeDate(newValue ? newValue.format('YYYY-MM-DD') : '')
            }
            slotProps={{ textField: { variant: 'standard', fullWidth: true } }}
          />

          <TextField
            label='Discharge Criteria'
            variant='standard'
            onChange={onChange(setDischargeCriteria)}
            value={dischargeCriteria}
          />
        </>
      )}

      <Button variant='contained' type='submit'>Create Entry</Button>
    </Box>
  );
};

export default NewEntryForm;