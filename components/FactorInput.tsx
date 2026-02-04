
import React from 'react';
import { StrategicFactor } from '../types';
import { LEVELS } from '../constants';

interface Props {
  factor: StrategicFactor;
  onUpdate: (updated: StrategicFactor) => void;
  onRemove: (id: string) => void;
}

const FactorInput: React.FC<Props> = ({ factor, onUpdate, onRemove }) => {
  const handleChange = (field: keyof StrategicFactor, value: string | number) => {
    onUpdate({ ...factor, [field]: value });
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col gap-4 transition-colors">
      <div className="flex justify-between items-center gap-2">
        <input
          type="text"
          value={factor.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="flex-grow font-semibold text-slate-700 dark:text-slate-200 bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-indigo-500 outline-none px-1 py-0.5 transition-all"
          placeholder="Berührungspunkt Name..."
        />
        <button 
          onClick={() => onRemove(factor.id)}
          className="text-slate-400 hover:text-red-500 transition-colors p-1"
          title="Löschen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-orange-500 dark:text-orange-400 uppercase tracking-wider flex justify-between">
            <span>SOLL</span>
            <span className="font-bold">{factor.sollValue}</span>
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="1"
            value={factor.sollValue}
            onChange={(e) => handleChange('sollValue', parseInt(e.target.value))}
            className="w-full h-1.5 bg-orange-100 dark:bg-orange-950 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <div className="text-[10px] text-orange-400 dark:text-orange-500 truncate">
            {LEVELS[factor.sollValue].label}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex justify-between">
            <span>IST</span>
            <span className="font-bold">{factor.istValue}</span>
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="1"
            value={factor.istValue}
            onChange={(e) => handleChange('istValue', parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-500 dark:accent-slate-400"
          />
          <div className="text-[10px] text-slate-400 dark:text-slate-400 truncate">
            {LEVELS[factor.istValue].label}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 pt-2 border-t border-slate-50 dark:border-slate-800">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Zielformulierungen</label>
          <textarea
            value={factor.goalFormulation || ''}
            onChange={(e) => handleChange('goalFormulation', e.target.value)}
            rows={2}
            className="w-full text-xs p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:border-indigo-500 outline-none text-slate-600 dark:text-slate-300 resize-none transition-all"
            placeholder="Kund:innen Zitat: Was sollen deine Kund:innen über diesen Berührungspunkt im Idealfall sagen?"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Maßnahmen</label>
          <textarea
            value={factor.measures || ''}
            onChange={(e) => handleChange('measures', e.target.value)}
            rows={2}
            className="w-full text-xs p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:border-indigo-500 outline-none text-slate-600 dark:text-slate-300 resize-none transition-all"
            placeholder="Welche Schritte führen zum Ziel?"
          />
        </div>
      </div>
    </div>
  );
};

export default FactorInput;
