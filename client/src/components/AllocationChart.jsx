import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function AllocationChart({ holdings }) {
  const chartData = holdings.map(h => ({
    name: h.symbol,
    'Current %': Math.round(h.weight * 100),
    'Target %': Math.round((h.targetWeight || h.weight) * 100)
  }));

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 mb-6">
      <h3 className="text-base font-semibold text-white mb-4">Capital Allocation vs Policy Target</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#6B7280" />
            <YAxis stroke="#6B7280" unit="%" />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
            <Legend />
            <Bar dataKey="Current %" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Target %" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
