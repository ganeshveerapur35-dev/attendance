import React, { useState, useEffect } from 'react'
import { 
  BarChart3, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle, 
  CheckCircle2, 
  Filter, 
  Calendar 
} from 'lucide-react'
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell,
  PieChart,
  Pie
} from 'recharts'
import DataTable from '../components/Common/DataTable'

const Reports = () => {
  const [loading, setLoading] = useState(false)

  const barData = [
    { name: 'Mathematics', attendance: 94, target: 95 },
    { name: 'Physics', attendance: 88, target: 95 },
    { name: 'History', attendance: 96, target: 95 },
    { name: 'Literature', attendance: 91, target: 95 },
    { name: 'Arts', attendance: 98, target: 95 },
    { name: 'CompSci', attendance: 85, target: 95 },
  ]

  const pieData = [
    { name: 'Present', value: 88, color: '#1e40af' },
    { name: 'Absent', value: 8, color: '#ba1a1a' },
    { name: 'Late', value: 4, color: '#872d00' },
  ]

  const lowAttendanceStudents = [
    { id: 'ST-0021', name: 'Jordan Hayes', class: 'Grade 10', rate: '68%', status: 'Critical' },
    { id: 'ST-0145', name: 'Mia Wong', class: 'Grade 8', rate: '72%', status: 'Warning' },
    { id: 'ST-0229', name: 'Alex Rivera', class: 'Grade 12', rate: '75%', status: 'Warning' },
  ]

  const columns = [
    { key: 'id', label: 'Record ID' },
    { key: 'name', label: 'Student Name', render: (row) => <span className="font-bold">{row.name}</span> },
    { key: 'class', label: 'Academic Grade' },
    { 
      key: 'rate', 
      label: 'Attendance Rate', 
      render: (row) => (
        <span className={`font-bold ${parseInt(row.rate) < 70 ? 'text-error' : 'text-tertiary'}`}>
          {row.rate}
        </span>
      ) 
    },
    { 
      key: 'status', 
      label: 'System Status', 
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
          row.status === 'Critical' ? 'bg-error-container text-on-error-container' : 'bg-tertiary-fixed text-on-tertiary-fixed'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      key: 'action',
      label: 'Intervention',
      className: 'text-right',
      render: () => (
        <button className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">
          Notify Parent
        </button>
      )
    }
  ]

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-manrope font-extrabold tracking-tight text-on-surface">Reports & Analytics</h2>
          <p className="text-on-surface-variant mt-1 text-sm font-medium tracking-tight">Comprehensive institutional diagnostic metrics.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-surface-container-high text-on-surface-variant px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-surface-container-highest transition-all">
            <Download size={16} />
            Export CSV
          </button>
          <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-95 transition-all">
            <Download size={16} />
            PDF Summary
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <MetricCard label="Avg. Academic Presence" value="92.4%" trend="up" trendValue="+1.2%" />
        <MetricCard label="Teacher Attendance" value="98.2%" trend="up" trendValue="+0.4%" />
        <MetricCard label="Critical Alerts" value="3" trend="down" trendValue="-2 cases" color="text-error" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        
        {/* Departmental Comparison */}
        <div className="bg-surface-container-low p-8 rounded-2xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-manrope font-extrabold text-on-surface">Subject Attendance</h3>
            <div className="flex gap-2 text-[10px] font-bold text-outline">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary"></div> Actual</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-surface-container-highest"></div> Target</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartFilter(barData)}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip cursor={{ fill: '#e1e2e4', opacity: 0.4 }} />
                <Bar dataKey="attendance" fill="#1e40af" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="target" fill="#e1e2e4" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-surface-container-low p-8 rounded-2xl">
          <h3 className="text-lg font-manrope font-extrabold text-on-surface mb-8">Distribution of Records</h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="h-48 w-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-4">
              {pieData.map(item => (
                <div key={item.name} className="flex items-center justify-between border-b border-surface-container pb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs font-bold text-on-surface-variant">{item.name}</span>
                  </div>
                  <span className="text-sm font-manrope font-extrabold text-on-surface">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Critical Students Table */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-error">
          <AlertTriangle size={20} />
          <h3 className="text-lg font-manrope font-extrabold font-manrope uppercase tracking-widest text-xs">At-Risk Intervention List</h3>
        </div>
        <DataTable columns={columns} data={lowAttendanceStudents} />
      </div>
    </div>
  )
}

const barChartFilter = (data) => data

const MetricCard = ({ label, value, trend, trendValue, color = 'text-on-surface' }) => (
  <div className="bg-surface-container-low p-6 rounded-2xl shadow-sm border border-outline-variant/10">
    <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-3">{label}</p>
    <div className="flex items-end justify-between">
      <h4 className={`text-4xl font-manrope font-extrabold ${color}`}>{value}</h4>
      <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${
        trend === 'up' ? 'bg-primary-fixed text-primary' : 'bg-error-container text-error'
      }`}>
        {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {trendValue}
      </div>
    </div>
  </div>
)

export default Reports
