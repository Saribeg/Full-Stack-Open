import { useState } from 'react';
import { useMutation } from '@apollo/client';
import Select from 'react-select';
import { SET_BIRTH_YEAR, ALL_AUTHORS } from '../graphql/operations';

const AuthorBirthForm = ({ authors }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [born, setBorn] = useState('');

  const [setBirthYear] = useMutation(SET_BIRTH_YEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: () => {}
  });

  const options = authors.map(a => ({ value: a.name, label: a.name }));

  const submit = (e) => {
    e.preventDefault();
    setBirthYear({
      variables: {
        name: selectedOption.value,
        setBornTo: Number(born)
      }
    });
    setSelectedOption(null);
    setBorn('');
  };

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          name
          <Select
            defaultValue={selectedOption}
            onChange={setSelectedOption}
            options={options}
          />
        </div>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={(e) => setBorn(e.target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default AuthorBirthForm;