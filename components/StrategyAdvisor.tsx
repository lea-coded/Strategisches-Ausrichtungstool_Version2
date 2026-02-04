
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { StrategicFactor } from '../types';

interface Props {
  factors: StrategicFactor[];
}

const StrategyAdvisor: React.FC<Props> = ({ factors }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Helper to generate a stable key based on factors for caching
  const getCacheKey = () => {
    return 'blue_ocean_advice_v3_' + btoa(JSON.stringify(factors.map(f => ({ n: f.name, i: f.istValue, s: f.sollValue }))));
  };

  useEffect(() => {
    const cached = sessionStorage.getItem(getCacheKey());
    if (cached) {
      setAdvice(cached);
    } else {
      setAdvice(null);
    }
  }, [factors]);

  const analyzeStrategy = async () => {
    const cacheKey = getCacheKey();
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      setAdvice(cached);
      return;
    }

    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Analysiere diese Blue Ocean Strategie-Konturen. 
        Hier sind die Berührungspunkte mit (IST, SOLL) Werten (Skala 0-5):
        ${factors.map(f => `- ${f.name}: Aktuell ${f.istValue}, Ziel ${f.sollValue}`).join('\n')}
        
        Bitte gib eine kurze, prägnante Einschätzung (max 150 Wörter):
        1. Wo entsteht der größte neue Wert (Value Innovation)?
        2. Ist die Differenzierung gegenüber dem Branchenstandard (Niveau 3) deutlich genug?
        3. Empfehlung für den nächsten Schritt.
        
        Antworte auf Deutsch und verwende eine professionelle Berater-Tonalität. Nutze den Begriff "Berührungspunkte" statt "Faktoren".
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const resultText = response.text || '';
      setAdvice(resultText);
      sessionStorage.setItem(cacheKey, resultText);
    } catch (error) {
      console.error('Error getting advice:', error);
      setAdvice('Entschuldigung, die Analyse konnte nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 rounded-xl p-6 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 dark:text-indigo-400"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          KI Strategie-Berater
        </h3>
        <button
          onClick={analyzeStrategy}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 shadow-md active:scale-95"
        >
          {loading ? 'Analysiere...' : 'Strategie analysieren'}
        </button>
      </div>

      {advice ? (
        <div className="prose prose-sm prose-indigo dark:prose-invert text-indigo-800 dark:text-indigo-200 leading-relaxed bg-white/50 dark:bg-slate-900/50 p-4 rounded-lg">
          {advice.split('\n').map((line, i) => (
            <p key={i} className="mb-2 last:mb-0">{line}</p>
          ))}
        </div>
      ) : (
        <p className="text-sm text-indigo-600 dark:text-indigo-400 italic">
          Klicke auf den Button, um eine KI-basierte Einschätzung deines Blue Ocean Potenzials zu erhalten.
        </p>
      )}
      
      <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
        Green Tech: Ergebnisse werden lokal zwischengespeichert, um Energie zu sparen.
      </div>
    </div>
  );
};

export default StrategyAdvisor;
