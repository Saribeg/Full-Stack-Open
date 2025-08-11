import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, Typography, Stack, Chip } from "@mui/material";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import TransgenderIcon from "@mui/icons-material/Transgender";

import PatienEntries from "./PatienEntries";
import { Patient } from "../../types";
import patientService from "../../services/patients";
import { handleApiError } from "../../utils";

const PatientDetailsPage = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate('/404', { replace: true });
      return;
    }

    patientService
      .getById(id)
      .then(setPatient)
      .catch((e) => {
        handleApiError(e, navigate, setError);
      });
  }, [id, navigate]);

  if (error) return <div role="alert">{error}</div>;
  if (!patient) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h5">{patient.name}</Typography>
            {patient.gender === "female" && <FemaleIcon fontSize="small" color="primary" />}
            {patient.gender === "male" && <MaleIcon fontSize="small" color="primary" />}
            {patient.gender === "other" && <TransgenderIcon fontSize="small" color="primary" />}
          </Stack>
        }
        subheader={patient.occupation}
      />
      <CardContent>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {patient.dateOfBirth && <Chip label={`DOB: ${patient.dateOfBirth}`} variant="outlined" />}
          {patient.ssn && <Chip label={`SSN: ${patient.ssn}`} variant="outlined" />}
        </Stack>

        {patient.entries?.length ? <PatienEntries entries={patient.entries}/> : null}
      </CardContent>
    </Card>
  );
};

export default PatientDetailsPage;