import {action, computed, makeAutoObservable, ObservableMap} from 'mobx';

export type ExperimentType = 'test' | 'message_queue';

export interface ExperimentTreatment {
  id: number;
  name: string;
  description?: string;
}

export interface Experiment {
  id: ExperimentType;
  name: string;
  description: string;
  treatments: ExperimentTreatment[];
}

export const EXPERIMENT_LIST: Experiment[] = [
  {
    id: 'test',
    name: 'Test',
    description: 'This is a test experiment.',
    treatments: [
      {
        id: 0,
        name: 'Control',
      },
      {
        id: 1,
        name: 'Treatment 1',
      },
      {
        id: 2,
        name: 'Treatment 2',
      },
    ],
  },
  {
    id: 'message_queue',
    name: 'Message Queue Testing',
    description: 'Changes the behavior of messages.',
    treatments: [
      {
        id: 0,
        name: 'Control',
      },
      {
        id: 1,
        name: 'Treatment 1',
        description: 'Stuck in queue',
      },
      {
        id: 2,
        name: 'Treatment 2',
        description: 'Failed',
      },
    ],
  },
];

export interface Data {
  enabled?: Experiment[];
}

export default class ExperimentsStore {
  private experiments: ObservableMap<string, number>;

  constructor() {
    this.experiments = new ObservableMap();
    makeAutoObservable(this);
  }

  @computed
  isTreatmentEnabled(id: ExperimentType, treatment: number) {
    return this.experiments.get(id) === treatment;
  }

  @computed
  getTreatment(id: ExperimentType) {
    const treatment = this.experiments.get(id);
    const experiment = EXPERIMENT_LIST.find(x => x.id === id);
    return experiment?.treatments.find(x => x.id === treatment);
  }

  @action
  setTreatment(id: ExperimentType, treatment: number): void {
    this.experiments.set(id, treatment);
  }

  @computed
  isExperimentEnabled(id: ExperimentType) {
    return this.experiments.has(id) && this.experiments.get(id) !== 0;
  }

  @action
  reset() {
    this.experiments.clear();
  }
}
