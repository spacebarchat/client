import React, { Component } from "react";
import SelectSearch from "react-select-search";
import styled from "styled-components";
import { Input } from "./AuthComponents";
import "./DOBInput.css";

// const MIN_AGE = 13;
const MIN_AGE = 3; // we do this instead so we can show an age gate if they are under 13
const MAX_AGE = 120;

const Container = styled.div`
	display: flex;
`;

const CustomInput = styled(Input)`
	box-sizing: border-box;
	width: 100%;
`;

const MONTHS = [
	{
		value: "01",
		name: "January",
	},
	{
		value: "02",
		name: "February",
	},
	{
		value: "03",
		name: "March",
	},
	{
		value: "04",
		name: "April",
	},
	{
		value: "05",
		name: "May",
	},
	{
		value: "06",
		name: "June",
	},
	{
		value: "07",
		name: "July",
	},
	{
		value: "08",
		name: "August",
	},
	{
		value: "09",
		name: "September",
	},
	{
		value: "10",
		name: "October",
	},
	{
		value: "11",
		name: "November",
	},
	{
		value: "12",
		name: "December",
	},
];

interface Props {
	onChange: (value: string) => void;
	onErrorChange: (errors: { month?: string; day?: string; year?: string }) => void;
	error: boolean;
	disabled?: boolean;
}

interface State {
	month?: string;
	day?: string;
	year?: string;
	errors: { month?: string; day?: string; year?: string };
}

export class DOBInput extends Component<Props, State> {
	state = {
		month: "",
		day: "",
		year: "",
		errors: {
			month: undefined,
			day: undefined,
			year: undefined,
		},
	};

	componentDidUpdate(prevProps: Props, prevState: State) {
		if (prevState !== this.state) {
			this.props.onErrorChange(this.state.errors);

			this.props.onChange(
				this.constructDate({
					month: this.state.month,
					day: this.state.day,
					year: this.state.year,
				}),
			);
		}
	}

	onInputChange = (type: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;

		// clear error for field
		this.setState(
			{
				...this.state,
				errors: { ...this.state.errors, [type]: undefined },
			},
			() => {
				// ensure only numbers
				if (isNaN(Number(value))) {
					this.setState({
						...this.state,
						errors: {
							...this.state.errors,
							[type]: "Invalid Date",
						},
					});
					return;
				}

				if (type === "day") {
					// day should be a number between 1-31 and not more than 2 digits
					if (value !== "" && (value.length > 2 || Number(value) > 31 || Number(value) < 1)) {
						this.setState({
							...this.state,
							day: value,
							errors: {
								...this.state.errors,
								[type]: "Invalid Date",
							},
						});
						return;
					}

					this.setState({ ...this.state, day: value });
				}

				if (type === "year") {
					// year must be between now-min and now-max
					if (
						value.length === 4 &&
						(Number(value) > new Date().getFullYear() - MIN_AGE ||
							Number(value) < new Date().getFullYear() - MAX_AGE)
					) {
						this.setState({
							...this.state,
							year: value,
							errors: {
								...this.state.errors,
								[type]: "Invalid Date",
							},
						});
						return;
					}

					this.setState({ ...this.state, year: value });
				}
			},
		);
	};

	constructDate = (values: { month: string; day: string; year: string }) => {
		const { month, day, year } = values;
		// pad day with 0 if needed
		const dayPadded = day?.length === 1 ? `0${day}` : day;
		return `${year}-${month}-${dayPadded}`;
	};

	render() {
		return (
			<Container>
				<SelectSearch
					placeholder="Month"
					search
					options={MONTHS}
					onChange={(e) => this.setState({ ...this.state, month: e as string })}
					value={this.state.month}
					disabled={this.props.disabled}
					onBlur={() => {}}
					onFocus={() => {}}
				/>
				<CustomInput
					placeholder="Day"
					onChange={this.onInputChange("day")}
					value={this.state.day}
					error={this.state.errors.day || this.props.error}
					maxLength={2}
					disabled={this.props.disabled}
				/>
				<CustomInput
					placeholder="Year"
					onChange={this.onInputChange("year")}
					value={this.state.year}
					error={this.state.errors.year || this.props.error}
					maxLength={4}
					disabled={this.props.disabled}
				/>
			</Container>
		);
	}
}

export default DOBInput;
