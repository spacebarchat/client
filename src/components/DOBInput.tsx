import SelectSearch from "react-select-search";
import styled from "styled-components";
import "./DOBInput.css";

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
  return (
    <Container>
      <SelectSearch placeholder="Month" search options={MONTHS} />
      <Input />
      <Input />
    </Container>
  );
}

export default DOBInput;
