import {action, computed, makeAutoObservable, ObservableMap} from 'mobx';

export type ExperimentType = 'test';

export interface ExperimentTreatment {
  id: number;
  name: string;
  description?: string;
}

export interface Experiment {
  id: ExperimentType;
  name: string;
  description: string;
  defaultTreatment: number;
  treatments: ExperimentTreatment[];
}

export const EXPERIMENT_LIST: Experiment[] = [
  {
    id: 'test',
    name: 'Test',
    description: 'This is a test experiment.',
    defaultTreatment: -1,
    treatments: [
      {
        id: 0,
        name: 'Treatment 1',
      },
      {
        id: 1,
        name: 'Treatment 2',
      },
    ],
  },
];

export interface Data {
  enabled?: Experiment[];
}

export default class ExperimentsStore {
  private experiments: ObservableMap<string, ExperimentTreatment> =
    new ObservableMap();

  constructor() {
    makeAutoObservable(this);

    for (const experiment of EXPERIMENT_LIST) {
      this.setTreatment(experiment.id, experiment.defaultTreatment);
    }
  }

  @computed
  isTreatmentEnabled(id: ExperimentType, treatment: number) {
    return this.experiments.get(id)?.id === treatment;
  }

  @computed
  getTreatment(id: ExperimentType) {
    return this.experiments.get(id);
  }

  @action
  setTreatment(id: ExperimentType, treatment: number): void {
    const experiment = EXPERIMENT_LIST.find(e => e.id === id);
    if (experiment) {
      this.experiments.set(id, experiment.treatments[treatment]);
    }
  }

  @action
  reset() {
    this.experiments.clear();
  }
}
