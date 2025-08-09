import { useState, useEffect } from 'react';
import type { DiaryEntry } from './types';
import Diaries from './components/Diaries';
import { getDiaries } from './services/diaries';
import DiaryForm from './components/DiaryForm';
import type { Status } from './types';
import Toast from './components/Toast';


function App() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    getDiaries().then(data => setDiaries(data));
  }, []);

  return (
    <div className="app">
      <Diaries diaries={diaries}/>
      { status && <Toast type={status.type} message={status.message}/>}
      <DiaryForm setDiaries={setDiaries} setStatus={setStatus}/>
    </div>
  );
}

export default App;
