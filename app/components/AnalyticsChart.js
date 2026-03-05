"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", clicks: 40 },
  { name: "Tue", clicks: 30 },
  { name: "Wed", clicks: 65 },
  { name: "Thu", clicks: 45 },
  { name: "Fri", clicks: 90 },
  { name: "Sat", clicks: 70 },
  { name: "Sun", clicks: 85 },
];

export default function AnalyticsChart({ statsData = [] }) {
  return (
    <div className="w-full h-[300px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={statsData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
          />
          <Tooltip 
            contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                borderRadius: '12px', 
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(4px)'
            }} 
          />
          <Area
            type="monotone"
            dataKey="clicks"
            stroke="#7c3aed"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorClicks)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
