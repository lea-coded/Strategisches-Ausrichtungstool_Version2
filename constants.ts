
import { StrategicFactor, LevelDefinition, Preset, StrategicContour } from './types';

export const LEVELS: LevelDefinition[] = [
  { value: 0, label: 'Eliminate', color: 'bg-red-500' },
  { value: 1, label: 'Reduce', color: 'bg-orange-500' },
  { value: 2, label: 'Unter Branchenniveau', color: 'bg-yellow-500' },
  { value: 3, label: 'Branchenniveau', color: 'bg-blue-500' },
  { value: 4, label: 'Raise (Über Branchenniveau)', color: 'bg-indigo-500' },
  { value: 5, label: 'Champion / Innovation', color: 'bg-emerald-500' },
];

export const INITIAL_FACTORS: StrategicFactor[] = [
  { id: '1', name: 'Preis', istValue: 4, sollValue: 2 },
  { id: '2', name: 'Prestige', istValue: 3, sollValue: 1 },
  { id: '3', name: 'Funktionsumfang', istValue: 4, sollValue: 2 },
  { id: '4', name: 'Benutzerfreundlichkeit', istValue: 2, sollValue: 5 },
  { id: '5', name: 'Geschwindigkeit', istValue: 3, sollValue: 4 },
  { id: '6', name: 'Emotionale Bindung', istValue: 1, sollValue: 5 },
];

export const DEFAULT_CONTOUR: StrategicContour = {
  id: 'initial-contour',
  name: 'Mein erster Strategie-Entwurf',
  factors: INITIAL_FACTORS
};

export const PRESETS: Preset[] = [
  {
    id: 'it-standard',
    name: 'Standard Softwaremarkt',
    description: 'Typischer Wettbewerb über Preis und Feature-Listen.',
    factors: [
      { id: 'p1', name: 'Preis', istValue: 5, sollValue: 2 },
      { id: 'p2', name: 'Anzahl Features', istValue: 4, sollValue: 1 },
      { id: 'p3', name: 'Customizing', istValue: 3, sollValue: 1 },
      { id: 'p4', name: 'UI Design', istValue: 1, sollValue: 5 },
      { id: 'p5', name: 'Onboarding Zeit', istValue: 4, sollValue: 1 },
    ]
  },
  {
    id: 'retail',
    name: 'Einzelhandel Fokus',
    description: 'Vom Preis- zum Erlebnis-Fokus.',
    factors: [
      { id: 'r1', name: 'Sortimentstiefe', istValue: 4, sollValue: 2 },
      { id: 'r2', name: 'Parkplätze', istValue: 3, sollValue: 1 },
      { id: 'r3', name: 'Beratung', istValue: 3, sollValue: 5 },
      { id: 'r4', name: 'Atmosphäre', istValue: 2, sollValue: 5 },
      { id: 'r5', name: 'Digitale Vernetzung', istValue: 1, sollValue: 4 },
    ]
  }
];
