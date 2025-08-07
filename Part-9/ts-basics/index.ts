import express, { Request, Response } from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req: Request, res: Response) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight)) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const bmi = calculateBmi(height, weight);

  return res.json({
    weight,
    height,
    bmi
  });
});

app.post('/exercises', (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { target, daily_exercises } = req.body;
  
  if (
    !target
    || !daily_exercises
  ) {
    return res.status(400).json({
      error: 'parameters missing'
    });
  }

  if (
    isNaN(Number(target))
    || !Array.isArray(daily_exercises)
    || !daily_exercises.length
    || daily_exercises.some(n => isNaN(Number(n)))
  ) {
    return res.status(400).json({
      error: 'malformatted parameters'
    });
  }

  const result = calculateExercises(Number(target), daily_exercises.map(Number));
  return res.status(200).json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});