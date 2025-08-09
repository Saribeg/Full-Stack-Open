export const Weather = {
  Sunny: 'sunny',
  Rainy: 'rainy',
  Cloudy: 'cloudy',
  Stormy: 'stormy',
  Windy: 'windy',
} as const;
export type WeatherType = typeof Weather[keyof typeof Weather];

export const Visibility = {
  Great: 'great',
  Good: 'good',
  Ok: 'ok',
  Poor: 'poor',
} as const;
export type VisibilityType = typeof Visibility[keyof typeof Visibility];

export interface DiaryEntry {
  id: number;
  date: string;
  weather: WeatherType;
  visibility: VisibilityType;
  comment: string;
}

export type NewDiaryEntry = Omit<DiaryEntry, 'id'>;
export type NonSensitiveDiaryEntry = Omit<DiaryEntry, 'comment'>;

export interface Option<T> {
  value: T,
  label: string
}