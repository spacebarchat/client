import React from "react";
import SelectSearch from "react-select-search";
import styled from "styled-components";
import "./DOBInput.css";

// const MIN_AGE = 13;
const MIN_AGE = 3; // we do this instead so we can show an age gate if they are under 13
const MAX_AGE = 120;

const Container = styled.div`
  display: flex;
`;

const Input = styled.input<{ error?: boolean }>`
  outline: none;
  background: var(--secondary);
  padding: 10px;
  font-size: 16px;
  border-radius: 12px;
  color: var(--text);
  margin: 0 0 0 5px;
  border: none;
  aria-invalid: ${(props) => (props.error ? "true" : "false")};
  border: ${(props) => (props.error ? "1px solid red" : "none")};
  box-sizing: border-box;
  width: 100%;
`;

const MONTHS = [
  {
    value: "january",
    name: "January",
  },
  {
    value: "february",
    name: "February",
  },
  {
    value: "march",
    name: "March",
  },
  {
    value: "april",
    name: "April",
  },
  {
    value: "may",
    name: "May",
  },
  {
    value: "june",
    name: "June",
  },
  {
    value: "july",
    name: "July",
  },
  {
    value: "august",
    name: "August",
  },
  {
    value: "september",
    name: "September",
  },
  {
    value: "october",
    name: "October",
  },
  {
    value: "november",
    name: "November",
  },
  {
    value: "december",
    name: "December",
  },
];

function DOBInput() {
  const [month, setMonth] = React.useState<string>();
  const [day, setDay] = React.useState("");
  const [year, setYear] = React.useState("");
  const [errors, setErrors] = React.useState<{
    month?: string;
    day?: string;
    year?: string;
  }>({
    month: undefined,
    day: undefined,
    year: undefined,
  });

  const onInputChange =
    (type: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      // clear error for field
      setErrors({ ...errors, [type]: undefined });

      // ensure only numbers
      if (isNaN(Number(value))) {
        setErrors({ ...errors, [type]: "Invalid input" });
        return;
      }

      if (type === "day") {
        // day should be a number between 1-31 and not more than 2 digits
        if (
          value !== "" &&
          (value.length > 2 || Number(value) > 31 || Number(value) < 1)
        ) {
          setErrors({ ...errors, day: "Invalid day" });
          // return;
        }

        setDay(value);
      }

      if (type === "year") {
        // year must be between now-min and now-max
        if (
          value.length === 4 &&
          (Number(value) > new Date().getFullYear() - MIN_AGE ||
            Number(value) < new Date().getFullYear() - MAX_AGE)
        ) {
          setErrors({ ...errors, year: "Invalid year" });
          // return;
        }

        setYear(value);
      }
    };

  return (
    <Container>
      <SelectSearch
        placeholder="Month"
        search
        options={MONTHS}
        onChange={(e) => setMonth(e as string)}
        value={month}
      />
      <Input
        placeholder="Day"
        onChange={onInputChange("day")}
        value={day}
        error={!!errors.day}
        maxLength={2}
      />
      <Input
        placeholder="Year"
        onChange={onInputChange("year")}
        value={year}
        error={!!errors.year}
        maxLength={4}
      />
    </Container>
  );
}

export default DOBInput;
