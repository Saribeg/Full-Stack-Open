import { Box, Typography, Link as MuiLink } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import {
  SiReact,
  SiReactquery,
  SiReactrouter,
  SiMui,
  SiVite,
  SiAxios,
  SiJavascript,
  SiEslint,
  SiPrettier
} from 'react-icons/si';

const technologies = [
  { icon: SiReact, label: 'React', url: 'https://github.com/facebook/react' },
  { icon: SiReactquery, label: 'React Query', url: 'https://tanstack.com/query/latest' },
  { icon: SiReactrouter, label: 'React Router', url: 'https://github.com/remix-run/react-router' },
  { icon: SiMui, label: 'MUI', url: 'https://github.com/mui/material-ui' },
  { icon: SiVite, label: 'Vite', url: 'https://github.com/vitejs/vite' },
  { icon: SiAxios, label: 'Axios', url: 'https://github.com/axios/axios' },
  { icon: SiJavascript, label: 'JavaScript', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
  { icon: SiEslint, label: 'ESLint', url: 'https://github.com/eslint/eslint' },
  { icon: SiPrettier, label: 'Prettier', url: 'https://github.com/prettier/prettier' }
];

const Technologies = () => {
  return (
    <Box component="section" sx={{ mb: 6 }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <BuildIcon color="primary" />
        <Typography variant="h5" fontWeight={600}>
          Technologies used
        </Typography>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(3, 1fr)',
          sm: 'repeat(4, 1fr)',
          md: 'repeat(5, 1fr)'
        }}
        gap={3}
      >
        {technologies.map(({ icon: Icon, label, url }) => (
          <MuiLink
            key={label}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            color="inherit"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.08)',
                color: 'primary.main'
              }
            }}
          >
            <Icon size={42} />
            <Typography variant="body2" mt={1}>
              {label}
            </Typography>
          </MuiLink>
        ))}
      </Box>
    </Box>
  );
};

export default Technologies;
