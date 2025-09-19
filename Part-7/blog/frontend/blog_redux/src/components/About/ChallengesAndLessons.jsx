import { FaLightbulb } from 'react-icons/fa';
import Code from './Code';
import Section from './Section';

const ChallengesAndLessons = () => {
  return (
    <Section icon={FaLightbulb} title="Implementation Highlights">
      <div className="space-y-6 text-cyan-100/80">
        <div>
          <h3 className="mb-2 text-xl font-semibold text-cyan-300">Deep Dive into Redux</h3>
          <p className="mb-2">
            Although the course covered basic usage of Redux Toolkit, I decided to go a bit further
            and explore <Code>createAsyncThunk</Code>, <Code>extraReducers</Code>, and how to reduce
            repetitive boilerplate. In Redux, each async operation typically requires three states —
            pending, fulfilled, and rejected — which often results in long{' '}
            <Code>.addCase().addCase()</Code> chains.
          </p>
          <p className="mb-2">
            To solve this, I created a utility abstraction in{' '}
            <Code>src/store/utils/addCases.js</Code> that allows chaining actions in a more
            declarative way, like:
          </p>
          <Code>addCases().for('fetch').for('add').for('edit').for('delete').also('cleanup');</Code>
          <p className="mt-2">
            This allowed me to keep reducers clean and DRY, while scaling easily across different
            slices. I also maintained a consistent and modular folder structure for Redux logic.
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-xl font-semibold text-cyan-300">
            Centralized Notification System
          </h3>
          <p className="mb-2">
            One of the more satisfying parts was building a fully centralized, configurable
            notification system — something I really wanted to avoid handling manually inside
            components.
          </p>
          <p className="mb-2">
            Instead, I used <Code>createAsyncThunk</Code> + middleware to inject a{' '}
            <Code>notify</Code> function through the <Code>extraArgument</Code>. From there:
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li>
              I defined a config file: <Code>src/store/utils/notificationRules.js</Code>, where each
              thunk action (by <Code>typePrefix</Code>) maps to a set of rules for success/error
              notifications: enabled/disabled, inline or toast, placement, duration, and custom
              messages (including interpolation of server responses).
            </li>
            <li>
              Then I created a utility: <Code>createThunkWithNotify</Code>, which looks up those
              rules and automatically dispatches notifications based on the current thunk state
              using <Code>thunkAPI.extra.notify</Code>.
            </li>
            <li>
              On the component side: <Code>Notification.jsx</Code> listens to the store and renders
              either toast or inline notifications depending on config.
            </li>
            <li>
              <Code>InlineNotification.jsx</Code> wraps <Code>Notification</Code> for use in
              components like login forms (<Code>placement="LoginForm"</Code>).
            </li>
          </ul>
          <p className="mt-2">
            The result was a fully declarative notification layer that required no manual{' '}
            <Code>dispatch(notify(...))</Code> calls inside views.
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-xl font-semibold text-cyan-300">Atomic Table Design</h3>
          <p className="mb-2">
            To make UI more maintainable and reusable, I implemented a small atomic table system in{' '}
            <Code>src/components/ui/Table</Code>. It mirrors how component libraries like MUI or
            Chakra often work behind the scenes — with components like <Code>Table</Code>,{' '}
            <Code>TableHead</Code>, <Code>TableRow</Code>, etc.
          </p>
          <p className="mb-2">
            On top of that, I built <Code>AutoTable.jsx</Code>, a dynamic table generator that
            consumes data + column definitions and composes itself out of the atomic parts. This
            allows for both power and flexibility — developers can either use <Code>AutoTable</Code>{' '}
            for quick rendering or manually build tables with atomic components.
          </p>
          <p className="mb-2">
            More broadly, I kept reusable UI components in <Code>src/components/ui/</Code>,
            including buttons, form inputs, links, modal primitives, and spinners — aiming for
            consistency and clean abstraction.
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-xl font-semibold text-cyan-300">
            Replacing <Code>window.confirm</Code> with Modals
          </h3>
          <p className="mb-2">
            While building a cleaner UI, I replaced <Code>window.confirm</Code> dialogs with proper
            modals. I implemented a centralized <Code>ModalHost</Code> system inspired by
            portal-based modal managers.
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li>
              <Code>ModalHost.jsx</Code> listens to Redux state and renders appropriate modals based
              on modal <Code>type</Code> — for example, <Code>type: "confirmBlogDelete"</Code>{' '}
              renders <Code>DeleteBlogModal</Code>.
            </li>
            <li>Data like blog ID can be passed through modal state.</li>
            <li>
              <Code>Modal.jsx</Code> is the UI wrapper for modals — minimal, composable, and
              content-agnostic.
            </li>
          </ul>
          <p className="mt-2">
            This approach keeps logic centralized, declarative, and extendable — I can easily add
            new modal types in the future without rewriting modal infrastructure.
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-xl font-semibold text-cyan-300">Visual Design & Styling</h3>
          <p className="mb-2">
            I'm generally more interested in logic and architecture than in CSS, but I wanted the
            app to look clean and polished. I used Tailwind CSS to write custom styles where needed,
            but avoided spending too much time browsing class names.
          </p>
          <p className="mb-2">
            To balance this, I actively used ChatGPT as a design assistant — asking it to help with
            Tailwind classes, generate layouts, and even brainstorm visual direction. In some
            places, especially dummy screens (like 404 pages), I let AI propose the structure, then
            adapted or styled them myself.
          </p>
          <p className="mb-2">I created:</p>
          <ul className="list-inside list-disc space-y-1">
            <li>
              Unique 404 pages for both unknown routes and known but missing entities (like a
              deleted blog or user);
            </li>
            <li>
              A simple but reusable <Code>Spinner</Code> component;
            </li>
            <li>
              A dark-themed layout that made me want to replace native dialogs with proper modals —
              and so I did. 😄
            </li>
          </ul>
        </div>
      </div>
    </Section>
  );
};

export default ChallengesAndLessons;
