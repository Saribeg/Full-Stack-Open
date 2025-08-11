import { Card, CardContent, Typography, Stack, Chip, Divider } from "@mui/material";
import { Entry } from "../../types";

const PatienEntries = ({entries}: { entries: Entry[]}) => {
  return (
    <>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>
        Entries
      </Typography>
      {entries.map((entry) => (
        <Card key={entry.id} variant="outlined" sx={{ mb: 1.5 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1">{entry.date}</Typography>
              <Chip size="small" label={entry.type} />
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="body1"
              fontWeight="medium"
              sx={{ mt: 1 }}
            >
              {entry.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {!!entry.diagnosisCodes?.length && (
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mt: 1 }}>
                <Typography variant="subtitle2"><strong>Diagnosis Codes:</strong></Typography>
                {entry.diagnosisCodes.map((code) => (
                  <Chip key={code} label={code} variant="outlined" size="small" />
                ))}
              </Stack>
            )}

            {entry.type === "Hospital" && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Discharge:</strong> {entry.discharge.date} — {entry.discharge.criteria}
              </Typography>
            )}

            {entry.type === "OccupationalHealthcare" && (
              <Stack sx={{ mt: 1 }} spacing={0.5}>
                <Typography variant="body2">
                  <strong>Employer:</strong> {entry.employerName}
                </Typography>
                {entry.sickLeave && (
                  <Typography variant="body2">
                    <strong>Sick leave:</strong> {entry.sickLeave.startDate} – {entry.sickLeave.endDate}
                  </Typography>
                )}
              </Stack>
            )}

            {entry.type === "HealthCheck" && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Health check rating:</strong> {entry.healthCheckRating}
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default PatienEntries;