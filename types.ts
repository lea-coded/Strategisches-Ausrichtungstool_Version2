
export interface StrategicFactor {
  id: string;
  name: string;
  istValue: number;
  sollValue: number;
  goalFormulation?: string;
  measures?: string;
}

export interface StrategicContour {
  id: string;
  name: string;
  factors: StrategicFactor[];
}

export interface LevelDefinition {
  value: number;
  label: string;
  color: string;
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  factors: StrategicFactor[];
}
