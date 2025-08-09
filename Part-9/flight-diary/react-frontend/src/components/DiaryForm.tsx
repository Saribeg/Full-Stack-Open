import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { createDiary } from '../services/diaries';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import { Weather, Visibility } from '../types';
import type { Option, WeatherType, VisibilityType, DiaryEntry } from '../types';

type Props = {
  setDiaries: React.Dispatch<React.SetStateAction<DiaryEntry[]>>;
};

const DiaryForm = ({ setDiaries }: Props) => {
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
      <form onSubmit={handleFormSubmit}>
        <DatePicker selected={date} onChange={(d: Date | null) => setDate(d)} />
        <Select options={weatherOptions} value={weatherOption} onChange={setWeatherOption}/>
        <Select options={visibilityOptions} value={visibilityOption} onChange={setVisibilityOption}/>
        <textarea name="commnet" id="commnet" placeholder="Type a comment" onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setComment(event.target.value)}></textarea>
        <button type="submit">Create Diary</button>
      </form>
    </div>
  );

};

export default DiaryForm;