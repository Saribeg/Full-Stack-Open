import { useState } from 'react';
import { createDiary } from '../services/diaries';
import { Weather, Visibility, Status as StatusOptions } from '../types';
import type { WeatherType, VisibilityType, DiaryEntry, Status, NewDiaryEntry } from '../types';

type Props = {
  setDiaries: React.Dispatch<React.SetStateAction<DiaryEntry[]>>;
  setStatus: React.Dispatch<React.SetStateAction<Status | null>>;
};

const DiaryForm = ({ setDiaries, setStatus }: Props) => {
  const [date, setDate] = useState<string>('');
  const [weather, setWeather] = useState<WeatherType | ''>('');
  const [visibility, setVisibility] = useState<VisibilityType | ''>('');
  const [comment, setComment] = useState('');

  const WEATHER_VALUES = Object.values(Weather) as WeatherType[];
  const VISIBILITY_VALUES = Object.values(Visibility) as VisibilityType[];

  const handleFormSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (!date || !weather || !visibility) {
      setStatus({ type: StatusOptions.Error, message: 'Fill in all necessary data' });
      return;
    }

    const newDiaryPayload: NewDiaryEntry = { date, weather, visibility, comment };

    createDiary(newDiaryPayload)
      .then((newDiaryEntry) => {
        setDate('');
        setWeather('');
        setVisibility('');
        setComment('');
        setDiaries((prev) => [...prev, newDiaryEntry]);
        setStatus({ type: StatusOptions.Success, message: 'Diary is successfully created' });
      }).catch(error => {
        // Typing is done in src\services\api.ts
        setStatus({ type: 'error', message: error.message });
      });
  };

  return (
    <div>
      <h2>Create a Diary</h2>
      <form onSubmit={handleFormSubmit} className="diary-form">
        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
          />
        </label>

        <fieldset>
          <legend>Weather</legend>
          {WEATHER_VALUES.map((w) => (
            <label key={w} style={{ display: 'inline-block', marginRight: 12 }}>
              <input
                type="radio"
                name="weather"
                value={w}
                checked={weather === w}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setWeather(e.target.value as WeatherType)
                }
              />
              {' '}{w}
            </label>
          ))}
        </fieldset>


        <fieldset>
          <legend>Visibility</legend>
          {VISIBILITY_VALUES.map((v) => (
            <label key={v} style={{ display: 'inline-block', marginRight: 12 }}>
              <input
                type="radio"
                name="visibility"
                value={v}
                checked={visibility === v}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setVisibility(e.target.value as VisibilityType)
                }
              />
              {' '}{v}
            </label>
          ))}
        </fieldset>

        <textarea
          name="comment"
          id="comment"
          className="diary-comment"
          placeholder="Type a comment"
          value={comment}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setComment(event.target.value)}
        />
        <button type="submit" className="diary-submit">Create Diary</button>
      </form>
    </div>
  );

};

export default DiaryForm;