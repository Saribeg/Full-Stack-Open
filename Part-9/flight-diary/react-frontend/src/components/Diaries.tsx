import type { DiaryEntry } from '../types';

const Diaries = ({ diaries }: { diaries: DiaryEntry[]}) => {
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
};

export default Diaries;