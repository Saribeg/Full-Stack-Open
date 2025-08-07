import { getArguments, validateArguments } from './helpers';

const calculateBmi = (height: number, weight: number) : string => {
  const bmi = weight / (height / 100) ** 2;

  if (bmi < 18.5) {
    return 'Underweight'
  } else if (bmi >= 18.5 && bmi < 25) {
    return 'Normal Weight'
  } else if (bmi >= 25 && bmi < 30) {
    return 'Overweight'
  } else {
    return 'Obese'
  }
}

try {
  const args  = getArguments(process.argv);
  validateArguments(args, { min: 2, max: 2 });
  const [height, weight] = args;
  console.log('\x1b[32m', `Result is: "${calculateBmi(height, weight)}"`);
} catch (error) {
  let errorMessage = 'Something bad happened.'

  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }

  console.log('\x1b[31m', errorMessage);
}

// npm run calculateBmi -- 180 91