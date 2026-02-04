
import React from 'react';
import { StrategicFactor } from '../types';

interface Props {
  factors: StrategicFactor[];
}

const TouchpointSummary: React.FC<Props> = ({ factors }) => {
  const activeFactors = factors.filter(f => f.goalFormulation || f.measures);

  if (activeFactors.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 transition-colors">
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        Strategie-Details & Maßnahmen
      </h3>
      
      <div className="space-y-6">
        {activeFactors.map(factor => (
          <div key={factor.id} className="border-l-4 border-indigo-500 pl-4 py-1">
            <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-2">{factor.name}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {factor.goalFormulation && (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-1">Ziel</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{factor.goalFormulation}"</p>
                </div>
              )}
              {factor.measures && (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-1">Maßnahmen</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{factor.measures}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TouchpointSummary;
