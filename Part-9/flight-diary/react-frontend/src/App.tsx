import { useState, useEffect } from 'react';
import type { DiaryEntry } from './types';
import Diaries from './components/Diaries';
import { getDiaries } from './services/diaries';
import DiaryForm from './components/DiaryForm';


function App() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    getDiaries().then(data => setDiaries(data));
  }, []);

  return (
    <div>
      <Diaries diaries={diaries}/>
      <DiaryForm setDiaries={setDiaries}/>
    </div>
  );
}

export default App;
