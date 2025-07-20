import { FaClock } from 'react-icons/fa';

const Timelog = () => {
  return (
    <section className="w-full bg-white px-4 py-12 md:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="mb-6 flex items-center justify-center gap-2 text-2xl font-bold text-[#004a55]">
          <FaClock size={24} className="text-[#004a55]" />
          Timelog
        </h2>

        <div className="space-y-4 text-left text-base leading-relaxed text-gray-700 md:text-lg">
          <p>
            This time, I decided to track my time using <strong>Toggl</strong>. Part 7 was completed
            between <strong>July 11th and July 21st, 2025</strong>, totaling{' '}
            <strong>73 hours</strong>. Average daily hours – <strong>7.19 hours</strong> – almost
            like a full-time job, mainly because I'm currently <em>funemployed</em>. 😄
          </p>
          <p>
            If we only count the core curriculum requirements, the time spent would be around{' '}
            <strong>25 hours</strong>. The rest reflects my enthusiasm to go further, explore
            deeper, and build better.
          </p>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full table-auto border-collapse text-left text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100 text-[#004a55]">
                <th className="border-b px-4 py-2 font-semibold">Task</th>
                <th className="border-b px-4 py-2 font-semibold">Duration</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Parts 7a - React Router and 7b - Custom hooks', '3 hours 58 min'],
                ['Part-7c. More about styles.', '0 hours 20 min'],
                ['Part-7d. Webpack.', '0 hours 28 min'],
                ['Part-7e. Class components, Miscellaneous.', '0 hours 44 min'],
                ['Part-7f. Exercises: extending the bloglist.', '14 hours 3 min'],
                [
                  'Learn and switch to create async thunk, make centralized notifications',
                  '7 hours 29 min'
                ],
                [
                  'Refactoring of components in redux version to use thunk approach',
                  '2 hours 34 min'
                ],
                [
                  'Refactoring query version, add some abstractions and separations',
                  '0 hours 55 min'
                ],
                [
                  'Use Tailwind CSS in redux-version, refactor Components, add UI components, adopt all to Tailwind CSS usage, change window.confirm to confirmation dialog, etc.',
                  '16 hours 39 min'
                ],
                ['Manual testing, refactoring and bug-fixing of redux version.', '4 hours 9 min'],
                ['Use Material UI for query version', '10 hours 47 min'],
                ['Add About Us Pages to both projects', '4 hours 6 min'],
                ['Deploy. Backend to fly.io and frontends to Vercel', '2 hours 47 min'],
                [
                  'Create separate presentation project for semi-final FSO course (Part-7) and deploy',
                  '3 hours 56 min'
                ],
                ['Total', '72 hours 55 min']
              ].map(([task, duration], index, arr) => (
                <tr
                  key={task}
                  className={
                    index === arr.length - 1
                      ? 'bg-gray-100 text-[#004a55]'
                      : 'border-b last:border-none hover:bg-gray-50'
                  }
                >
                  <td
                    className={
                      index === arr.length - 1
                        ? 'border-b px-4 py-2 font-semibold'
                        : 'px-4 py-2 align-top'
                    }
                  >
                    {task}
                  </td>
                  <td
                    className={
                      index === arr.length - 1
                        ? 'border-b px-4 py-2 font-semibold'
                        : 'px-4 py-2 text-nowrap'
                    }
                  >
                    {duration}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Timelog;
