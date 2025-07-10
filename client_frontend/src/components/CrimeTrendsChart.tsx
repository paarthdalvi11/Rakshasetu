
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for crime trends
const mockCrimeData = [
  { month: 'Jan', theft: 65, accident: 28, suspicious: 40 },
  { month: 'Feb', theft: 59, accident: 32, suspicious: 36 },
  { month: 'Mar', theft: 80, accident: 40, suspicious: 45 },
  { month: 'Apr', theft: 81, accident: 37, suspicious: 30 },
  { month: 'May', theft: 56, accident: 25, suspicious: 38 },
  { month: 'Jun', theft: 55, accident: 29, suspicious: 43 }
];

const CrimeTrendsChart: React.FC = () => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={mockCrimeData}
          margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Legend />
          <Bar dataKey="theft" name="Theft" fill="#f43f5e" />
          <Bar dataKey="accident" name="Accident" fill="#3b82f6" />
          <Bar dataKey="suspicious" name="Suspicious" fill="#f59e0b" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CrimeTrendsChart;
