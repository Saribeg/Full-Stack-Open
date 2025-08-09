export const Weather = {
  Sunny: 'sunny',
  Rainy: 'rainy',
  Cloudy: 'cloudy',
  Stormy: 'stormy',
  Windy: 'windy',
  Wrong: 'wrong option'
} as const;
export type WeatherType = typeof Weather[keyof typeof Weather];

export const Visibility = {
  Great: 'great',
  Good: 'good',
  Ok: 'ok',
  Poor: 'poor',
  Wrong: 'wrong option'
} as const;
export type VisibilityType = typeof Visibility[keyof typeof Visibility];

export const Status = {
  Success: 'success',
  Error: 'error'
} as const;
export type StatusType = typeof Status[keyof typeof Status];

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

export interface Status {
  type: StatusType
  message: string
}