import { getArguments, validateArguments } from './helpers';

interface ExerciseReport {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

const calculateExercises = (target: number, dailyHours: number[]) : ExerciseReport => {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter(h => h > 0).length;
  const average = dailyHours.reduce((acc, h) => acc + h, 0) / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average >= target) {
    rating = 3;
    ratingDescription = 'great job, target achieved!';
  } else if (average >= target * 0.75) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  } else {
    rating = 1;
    ratingDescription = 'you need to work harder';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

try {
  const args  = getArguments(process.argv);
  validateArguments(args, { min: 2, max: 8 });
  const [target, ...dailyHours] = args;
  const result = calculateExercises(target, dailyHours);
  console.log('\x1b[32m', JSON.stringify(result, null, 2));
} catch (error) {
  let errorMessage = 'Something bad happened.'

  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }

  console.log('\x1b[31m', errorMessage);
}

// npm run calculateExercises -- 2 1 0 2 4.5 0 3 1 0 4