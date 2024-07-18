import { observer } from "mobx-react-lite";
import { useState } from "react";
import styled from "styled-components";
import { useAppStore } from "../../../hooks/useAppStore";
import { EXPERIMENT_LIST, Experiment as ExperimentType } from "../../../stores/ExperimentsStore";
import SectionTitle from "../../SectionTitle";

const Content = styled.div`
	display: flex;
	flex-direction: column;
`;

const ExperimentList = styled.ul`
	display: grid;
	list-style: none;
	padding: 0;
	margin: 0;
	gap: 10px;
`;

const Experiment = styled.li`
	display: flex;
	flex-direction: column;
`;

const Title = styled.span`
	font-size: 16px;
	font-weight: var(--font-weight-medium);
	color: var(--text);
`;

const Subtitle = styled.div`
	color: var(--text-disabled);
	font-size: 14px;
	font-weight: var(--font-weight-regular);
`;

const OverrideText = styled.div`
	color: var(--text.muted);
	margin-bottom: 10px;
	font-size: 12px;
	font-weight: var(--font-weight-bold);
`;

const Select = styled.select`
	appearance: none;
	/* safari */
	-webkit-appearance: none;
	background-color: var(--background-tertiary);
	border-color: var(--background-tertiary);
	color: var(--text);
	font-weight: var(--font-weight-medium);
	border: 1px solid transparent;
	padding: 8px 8px 8px 12px;
	cursor: pointer;
	display: grid;
	grid-template-columns: 1fr auto;
	align-items: center;
	border-radius: 4px;
`;

function ExperimentItem({ experiment }: { experiment: ExperimentType }) {
	const app = useAppStore();
	const isActive = app.experiments.isExperimentEnabled(experiment.id);
	const activeTreatment = app.experiments.getTreatment(experiment.id);
	const [isExpanded, setExpanded] = useState(isActive);

	const toggle = () => setExpanded(!isExpanded);

	const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = Number.parseInt(e.target.value);
		app.experiments.setTreatment(experiment.id, value);
	};

	return (
		<Experiment key={experiment.id}>
			<div style={{ marginBottom: "10px", cursor: "pointer" }} onClick={toggle}>
				<Title>{experiment.name}</Title>
				<Subtitle>{experiment.description}</Subtitle>
			</div>
			{isExpanded && (
				<div style={{ display: "flex", flexDirection: "column" }}>
					<OverrideText>Treatment Override</OverrideText>
					<Select onChange={onChange}>
						{experiment.treatments.map((treatment) => (
							<option
								key={treatment.id}
								value={treatment.id}
								selected={(!isActive && treatment.id === 0) || activeTreatment?.id === treatment.id}
							>
								{`${treatment.name}${treatment.description ? ": " + treatment.description : ""}`}
							</option>
						))}
					</Select>
				</div>
			)}
		</Experiment>
	);
}

function ExperimentsPage() {
	const app = useAppStore();

	return (
		<div>
			<SectionTitle>Experiments</SectionTitle>
			<Content>
				<ExperimentList>
					{EXPERIMENT_LIST.map((experiment) => (
						<ExperimentItem experiment={experiment} />
					))}
				</ExperimentList>
			</Content>
		</div>
	);
}

export default observer(ExperimentsPage);
