import axios from 'axios';
import { useState, useEffect } from 'react';
import type { DiaryEntry } from './types';


function App() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    axios.get<DiaryEntry[]>('http://localhost:3000/api/diaries')
      .then(response => {
        setDiaries(response.data);
      });
  }, []);

  return (
    <main>
      <h1>Diary entries</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Weather</th>
            <th>Visibility</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {diaries.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>
                <time dateTime={d.date}>{d.date}</time>
              </td>
              <td>{d.weather}</td>
              <td>{d.visibility}</td>
              <td>{d.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default App;
