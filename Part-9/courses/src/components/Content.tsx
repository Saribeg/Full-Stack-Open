import type { CoursePart } from "../types";

type ContentProps = {
  courseParts: CoursePart[];
};

const Content = ({ courseParts }: ContentProps) => {
  return (
    <>
      {courseParts.map(cp => (
        <p key={cp.name}>
          {cp.name}: {cp.exerciseCount}
        </p>
      ))}
    </>
  );
};

export default Content;
