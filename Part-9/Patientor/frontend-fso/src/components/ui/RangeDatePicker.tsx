// This is done by ChatGPT 5. The task was to use react-calendar along with MUI
// to show range date picker in MUI style. Because MUI does not provide such for free.
import { useMemo, useState } from 'react';
import Calendar from 'react-calendar';
import dayjs from 'dayjs';
import {
  TextField,
  Popover,
  IconButton,
  InputAdornment,
  GlobalStyles,
  Box,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ClearIcon from '@mui/icons-material/Clear';

export interface DateRange {
  startDate: string;
  endDate: string;
}

type Props = {
  label?: string;
  value: DateRange;
  onChange: (v: DateRange) => void;
};

export default function RangeDateField({ label, value, onChange }: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const text = useMemo(() => {
    const s = value.startDate ? dayjs(value.startDate).format('YYYY-MM-DD') : '';
    const e = value.endDate ? dayjs(value.endDate).format('YYYY-MM-DD') : '';
    return s && e ? `${s} — ${e}` : s || e || '';
  }, [value]);

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ startDate: '', endDate: '' });
  };

  return (
    <>
      <GlobalStyles
        styles={(theme) => ({
          '.react-calendar': {
            width: 340,
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: theme.shape.borderRadius,
            fontFamily: theme.typography.fontFamily,
            color: theme.palette.text.primary,
            overflow: 'hidden',
            boxShadow: theme.shadows[1],
          },

          '.react-calendar__navigation': {
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: 8,
            borderBottom: `1px solid ${theme.palette.divider}`,
            '& button': {
              minWidth: 36,
              height: 36,
              padding: '6px 8px',
              borderRadius: theme.shape.borderRadius,
              border: 0,
              background: 'transparent',
              cursor: 'pointer',
              ...theme.typography.button,
              '&:hover': { background: theme.palette.action.hover },
              '&:disabled': { opacity: 0.5, cursor: 'default' },
            },
          },
          '.react-calendar__navigation__label': {
            flex: 1,
            fontWeight: 600,
          },

          '.react-calendar__month-view__weekdays': {
            padding: '6px 8px 4px',
            '& abbr': {
              textDecoration: 'none',
              color: theme.palette.text.secondary,
              ...theme.typography.caption,
            },
          },

          '.react-calendar__month-view__weekNumbers': { border: 'none' },
          '.react-calendar__month-view__days': {
            padding: 8,
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 6,
          },

          '.react-calendar__tile': {
            margin: 0,
            height: 40,
            padding: 0,
            borderRadius: 10,
            border: 'none',
            background: theme.palette.action.selected,
            color: theme.palette.text.primary,
            transition: 'background 120ms, color 120ms, box-shadow 120ms',
            '&:hover': { background: theme.palette.action.hover },
          },

          '.react-calendar__tile--now': {
            outline: `2px solid ${theme.palette.primary.light}`,
            outlineOffset: -2,
            background: theme.palette.action.selected,
          },

          '.react-calendar__tile--active': {
            background: `${theme.palette.primary.main} !important`,
            color: `${theme.palette.primary.contrastText} !important`,
            boxShadow: 'none',
          },

          '.react-calendar__tile--range': {
            background: `${theme.palette.primary.main}22`,
            color: theme.palette.text.primary,
            borderRadius: 10,
          },

          '.react-calendar__tile--rangeStart, .react-calendar__tile--rangeEnd': {
            background: `${theme.palette.primary.main} !important`,
            color: `${theme.palette.primary.contrastText} !important`,
            borderRadius: 10,
          },

          '.react-calendar__tile:disabled, .react-calendar__tile--disabled': {
            opacity: 0.38,
            background: 'transparent',
            cursor: 'default',
          },

          '.react-calendar__tile:focus-visible': {
            outline: 'none',
            boxShadow: `0 0 0 3px ${theme.palette.primary.main}33`,
          },
        })}
      />

      <TextField
        label={label}
        value={text}
        placeholder='YYYY-MM-DD — YYYY-MM-DD'
        onClick={(e) => setAnchorEl(e.currentTarget)}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position='end'>
              {(value.startDate || value.endDate) && (
                <IconButton size='small' onClick={clear} aria-label='clear'>
                  <ClearIcon fontSize='small' />
                </IconButton>
              )}
              <IconButton size='small'>
                <CalendarMonthIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        fullWidth
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Box sx={{ p: 1 }}>
          <Calendar
            selectRange
            allowPartialRange
            calendarType='iso8601'
            value={[
              value.startDate ? new Date(value.startDate) : null,
              value.endDate ? new Date(value.endDate) : null,
            ]}
            onChange={(val) => {
              if (Array.isArray(val)) {
                const [start, end] = val;
                onChange({
                  startDate: start ? dayjs(start).format('YYYY-MM-DD') : '',
                  endDate: end ? dayjs(end).format('YYYY-MM-DD') : '',
                });
                if (start && end) setAnchorEl(null);
              }
            }}
          />
        </Box>
      </Popover>
    </>
  );
}
