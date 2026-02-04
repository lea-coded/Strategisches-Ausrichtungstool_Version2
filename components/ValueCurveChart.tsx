
import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { StrategicFactor } from '../types';
import { LEVELS } from '../constants';

interface Props {
  factors: StrategicFactor[];
  isDark?: boolean;
}

const ValueCurveChart: React.FC<Props> = React.memo(({ factors, isDark }) => {
  // Memoize data mapping
  const data = useMemo(() => factors.map(f => ({
    name: f.name,
    ist: f.istValue,
    soll: f.sollValue,
  })), [factors]);

  const formatYAxis = (value: number) => {
    return LEVELS.find(l => l.value === value)?.label || value.toString();
  };

  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#1e293b' : '#e2e8f0';

  return (
    <div className="w-full h-[500px] bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: textColor, fontSize: 12, fontWeight: 500 }}
            padding={{ left: 20, right: 20 }}
          />
          <YAxis 
            domain={[0, 5]} 
            ticks={[0, 1, 2, 3, 4, 5]} 
            axisLine={false}
            tickLine={false}
            tickFormatter={formatYAxis}
            tick={{ fill: textColor, fontSize: 11 }}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '8px', 
              border: 'none', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              backgroundColor: isDark ? '#1e293b' : '#fff',
              color: isDark ? '#f1f5f9' : '#0f172a'
            }}
            itemStyle={{ color: isDark ? '#f1f5f9' : '#0f172a' }}
            formatter={(value: number) => [value, 'Niveau']}
          />
          <Legend 
            verticalAlign="top" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ paddingTop: '0px' }}
          />
          
          <ReferenceLine y={3} stroke={isDark ? '#334155' : '#94a3b8'} strokeDasharray="3 3" label={{ position: 'right', value: 'Branchenstandard', fill: textColor, fontSize: 10 }} />

          <Line
            type="monotone"
            dataKey="ist"
            name="IST-Kurve (Aktuell)"
            stroke={isDark ? '#94a3b8' : '#64748b'}
            strokeWidth={3}
            dot={{ r: 5, fill: isDark ? '#94a3b8' : '#64748b', strokeWidth: 0 }}
            activeDot={{ r: 7 }}
            animationDuration={300}
          />
          <Line
            type="monotone"
            dataKey="soll"
            name="SOLL-Kurve (Strategie)"
            stroke="#f97316"
            strokeWidth={4}
            dot={{ r: 5, fill: '#f97316', strokeWidth: 0 }}
            activeDot={{ r: 7 }}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

export default ValueCurveChart;
