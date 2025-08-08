import type { CoursePart } from "../types";
import Part from "./Part";

type ContentProps = {
  courseParts: CoursePart[];
};

const Content = ({ courseParts }: ContentProps) => {
  return (
    <>
      {courseParts.map(cp => <Part key={cp.name} coursePart={cp}/>)}
    </>
  );
};

export default Content;
