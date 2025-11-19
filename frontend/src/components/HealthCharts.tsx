import React, { useState, useEffect } from 'react';
import { HealthMetric } from '../types';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface HealthChartsProps {
  metrics: HealthMetric[];
}

export const HealthCharts: React.FC<HealthChartsProps> = ({ metrics }) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (metrics.length > 0) {
      const data = metrics.map(m => ({
        time: new Date(m.timestamp).toLocaleDateString(),
        heartRate: m.heart_rate,
        glucose: m.blood_glucose,
        systolic: m.blood_pressure_systolic,
        diastolic: m.blood_pressure_diastolic,
        oxygen: m.oxygen_saturation,
        steps: m.steps,
        sleep: m.sleep_hours,
      }));
      setChartData(data);
    }
  }, [metrics]);

  return (
    <div className="grid grid-cols-1 gap-4 mb-6">
      {/* Heart Rate Chart */}
      <div className="bg-secondary rounded-lg p-4">
        <h3 className="text-sm font-semibold text-accent mb-3">Heart Rate (bpm)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="heartRate" stroke="#ef4444" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Blood Glucose Chart */}
      <div className="bg-secondary rounded-lg p-4">
        <h3 className="text-sm font-semibold text-accent mb-3">Blood Glucose (mg/dL)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="glucose" stroke="#f59e0b" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Blood Pressure Chart */}
      <div className="bg-secondary rounded-lg p-4">
        <h3 className="text-sm font-semibold text-accent mb-3">Blood Pressure (mmHg)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Legend />
            <Bar dataKey="systolic" fill="#3b82f6" />
            <Bar dataKey="diastolic" fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Steps & Sleep Chart */}
      <div className="bg-secondary rounded-lg p-4">
        <h3 className="text-sm font-semibold text-accent mb-3">Activity & Rest</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Legend />
            <Bar dataKey="steps" fill="#10b981" />
            <Bar dataKey="sleep" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
