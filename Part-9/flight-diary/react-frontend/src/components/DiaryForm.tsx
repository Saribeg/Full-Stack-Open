import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { createDiary } from '../services/diaries';
import Select from 'react-select';
import { Weather, Visibility, Status as StatusOptions } from '../types';
import type { Option, WeatherType, VisibilityType, DiaryEntry, Status } from '../types';

type Props = {
  setDiaries: React.Dispatch<React.SetStateAction<DiaryEntry[]>>;
  setStatus: React.Dispatch<React.SetStateAction<Status | null>>;
};

const DiaryForm = ({ setDiaries, setStatus }: Props) => {
  const [date, setDate] = useState<Date | null>(null);
  const [weatherOption, setWeatherOption] = useState<Option<WeatherType> | null>(null);
  const [visibilityOption, setVisibilityOption] = useState<Option<VisibilityType> | null>(null);
  const [comment, setComment] = useState('');

  const handleFormSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (
      !date
      || !weatherOption
      || !weatherOption.value
      || !visibilityOption
      || !visibilityOption.value
    ) {
      setStatus({ type: StatusOptions.Error, message: 'Fill in all necessary data' });
      return;
    }

    createDiary({
      date: date.toISOString().split('T')[0],
      weather: weatherOption.value,
      visibility: visibilityOption.value,
      comment
    }).then((newDiaryEntry) => {
      setDate(null);
      setWeatherOption(null);
      setVisibilityOption(null);
      setComment('');
      setDiaries((prev) => [...prev, newDiaryEntry]);
      setStatus({ type: StatusOptions.Success, message: 'Diary is successfully created' });
    }).catch(error => {
      // Typing is done in src\services\api.ts
      setStatus({ type: 'error', message: error.message });
    });
  };

  const weatherOptions: Option<WeatherType>[] = Object.entries(Weather).map(([label, value]) => ({
    label,
    value,
  }));

  const visibilityOptions: Option<VisibilityType>[] = Object.entries(Visibility).map(([label, value]) => ({
    label,
    value,
  }));

  return (
    <div>
      <h2>Create a Diary</h2>
      <form onSubmit={handleFormSubmit} className="diary-form">
        <DatePicker selected={date} onChange={(d: Date | null) => setDate(d)} />
        <Select options={weatherOptions} value={weatherOption} onChange={setWeatherOption}/>
        <Select options={visibilityOptions} value={visibilityOption} onChange={setVisibilityOption}/>
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