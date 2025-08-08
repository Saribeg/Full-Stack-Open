import type { CoursePart } from "../types";
import { assertNever } from "../utils";

const renderValue = (key: string, value: unknown) => {
  if (key === "backgroundMaterial" && typeof value === "string") {
    return (
      <a href={value} target="_blank" rel="noreferrer">
        {value}
      </a>
    );
  }
  if (key === "requirements" && Array.isArray(value)) {
    return value.join(", ");
  }
  return String(value);
};

const Part = ({ coursePart }: { coursePart: CoursePart }) => {
  switch (coursePart.kind) {
    case "basic":
    case "group":
    case "background":
    case "special": {
      const entries = Object.entries(coursePart).filter(([k]) => k !== "name")
      return (
        <>
          <h4>{coursePart.name}</h4>
          <ul>
            {entries.map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {renderValue(key, value)}
              </li>
            ))}
          </ul>
        </>
      );
    }
    default:
      return assertNever(coursePart);
  }
};

export default Part;
