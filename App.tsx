
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { StrategicFactor, Preset, StrategicContour } from './types';
import { INITIAL_FACTORS, PRESETS, DEFAULT_CONTOUR } from './constants';
import ValueCurveChart from './components/ValueCurveChart';
import FactorInput from './components/FactorInput';
import StrategyAdvisor from './components/StrategyAdvisor';
import TouchpointSummary from './components/TouchpointSummary';

const STORAGE_KEY_CONTOURS = 'strategic_contours_v2';
const STORAGE_KEY_ACTIVE_ID = 'strategic_active_id_v2';

const App: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [contours, setContours] = useState<StrategicContour[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CONTOURS);
    return saved ? JSON.parse(saved) : [DEFAULT_CONTOUR];
  });

  const [activeContourId, setActiveContourId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
    return saved || DEFAULT_CONTOUR.id;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CONTOURS, JSON.stringify(contours));
  }, [contours]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activeContourId);
  }, [activeContourId]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // --- DERIVED STATE ---
  const activeContour = useMemo(() => {
    return contours.find(c => c.id === activeContourId) || contours[0];
  }, [contours, activeContourId]);

  // --- ACTIONS ---
  const createNewContour = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newContour: StrategicContour = {
      id: newId,
      name: `Neuer Entwurf ${contours.length + 1}`,
      factors: [...INITIAL_FACTORS],
    };
    setContours([...contours, newContour]);
    setActiveContourId(newId);
  };

  const deleteContour = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (contours.length <= 1) return;
    const newContours = contours.filter(c => c.id !== id);
    setContours(newContours);
    if (activeContourId === id) {
      setActiveContourId(newContours[0].id);
    }
  };

  const renameActiveContour = (newName: string) => {
    setContours(prev => prev.map(c => c.id === activeContourId ? { ...c, name: newName } : c));
  };

  const updateFactor = useCallback((updated: StrategicFactor) => {
    setContours(prev => prev.map(c => 
      c.id === activeContourId 
        ? { ...c, factors: c.factors.map(f => f.id === updated.id ? updated : f) }
        : c
    ));
  }, [activeContourId]);

  const addFactor = () => {
    const newFactor: StrategicFactor = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Neuer Berührungspunkt',
      istValue: 3,
      sollValue: 3,
    };
    setContours(prev => prev.map(c => 
      c.id === activeContourId ? { ...c, factors: [...c.factors, newFactor] } : c
    ));
  };

  const removeFactor = (id: string) => {
    setContours(prev => prev.map(c => 
      c.id === activeContourId ? { ...c, factors: c.factors.filter(f => f.id !== id) } : c
    ));
  };

  const applyPreset = (preset: Preset) => {
    setContours(prev => prev.map(c => 
      c.id === activeContourId ? { ...c, factors: preset.factors } : c
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 min-h-screen">
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Strategisches <span className="text-indigo-600 dark:text-indigo-400">Ausrichtungstool</span>
          </h1>
        </div>
        
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:scale-110 active:scale-90 flex items-center gap-2 text-sm font-medium"
          aria-label="Toggle Theme"
        >
          {isDarkMode ? (
            <><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg> <span className="text-slate-300">Light</span></>
          ) : (
            <><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg> <span className="text-slate-600">Dark</span></>
          )}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Management & Controls */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Section: Saved Contours */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Meine Entwürfe</h2>
              <button 
                onClick={createNewContour}
                className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 px-2 py-1 rounded transition-colors flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Neu
              </button>
            </div>
            <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar">
              {contours.map(c => (
                <div 
                  key={c.id}
                  onClick={() => setActiveContourId(c.id)}
                  className={`group flex justify-between items-center p-2.5 rounded-lg cursor-pointer border transition-all ${
                    activeContourId === c.id 
                    ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-800' 
                    : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className={`text-sm font-medium truncate flex-grow ${activeContourId === c.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400'}`}>
                    {c.name}
                  </span>
                  {contours.length > 1 && (
                    <button 
                      onClick={(e) => deleteContour(c.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section: Active Contour Details */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Name des aktiven Entwurfs</label>
              <input 
                type="text"
                value={activeContour.name}
                onChange={(e) => renameActiveContour(e.target.value)}
                className="w-full bg-transparent text-xl font-bold text-slate-800 dark:text-white border-b-2 border-slate-200 dark:border-slate-800 focus:border-indigo-500 outline-none px-1 py-2 transition-all"
              />
            </div>

            <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-900 p-2 rounded-lg transition-colors">
              <h2 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest px-2">Berührungspunkte</h2>
              <button 
                onClick={addFactor}
                className="text-xs bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-1.5 rounded-md shadow-sm transition-all font-medium flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Hinzufügen
              </button>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {activeContour.factors.map(factor => (
                <FactorInput 
                  key={factor.id} 
                  factor={factor} 
                  onUpdate={updateFactor} 
                  onRemove={removeFactor}
                />
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-1">Presets / Beispiele</h3>
              <div className="grid grid-cols-1 gap-2">
                {PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset)}
                    className="text-left p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all group"
                  >
                    <div className="font-bold text-slate-700 dark:text-slate-200 text-sm group-hover:text-indigo-700 dark:group-hover:text-indigo-400">{preset.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{preset.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visualization */}
        <div className="lg:col-span-8 lg:sticky lg:top-8">
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 px-2 gap-4">
                <div className="flex flex-col">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">Strategische Konturen-Matrix</h2>
                  <span className="text-xs text-slate-400 font-medium">{activeContour.name}</span>
                </div>
                <div className="flex gap-4 text-xs font-medium dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-slate-500"></span> IST
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-orange-500"></span> SOLL
                  </span>
                </div>
              </div>
              <ValueCurveChart factors={activeContour.factors} isDark={isDarkMode} />
            </div>

            <TouchpointSummary factors={activeContour.factors} />
            
            <StrategyAdvisor factors={activeContour.factors} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
              <div>
                <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Methodik</h4>
                <p>Nutzen Sie die zusätzliche Ziel- und Maßnahmenplanung, um Ihre Blue Ocean Strategie konkret umsetzbar zu machen.</p>
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Hinweis</h4>
                  <p>Ihre Daten werden lokal im Browser persistiert. Nutzen Sie verschiedene Entwürfe, um Szenarien zu vergleichen.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
