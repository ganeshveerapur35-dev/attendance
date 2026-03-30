import React, { useState, useEffect } from 'react'
import { 
  Users, 
  School, 
  CalendarCheck, 
  TrendingUp, 
  ArrowRight,
  History,
  CheckCircle2,
  AlertCircle,
  FileEdit,
  UserPlus,
  BarChart3
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts'
import StatCard from '../components/Common/StatCard'
import { getStudents, getTeachers, getAttendance } from '../services/dataService'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    attendanceRate: 0,
    lateArrivals: 0
  })
  const [loading, setLoading] = useState(true)

  const lineData = [
    { name: 'Mon', rate: 92 },
    { name: 'Tue', rate: 94 },
    { name: 'Wed', rate: 95 },
    { name: 'Thu', rate: 93 },
    { name: 'Fri', rate: 96 },
    { name: 'Sat', rate: 88 },
    { name: 'Sun', rate: 45 },
  ]

  const barData = [
    { name: 'GR 12', value: 85 },
    { name: 'GR 11', value: 92 },
    { name: 'GR 10', value: 70 },
    { name: 'GR 9', value: 88 },
    { name: 'GR 8', value: 95 },
    { name: 'GR 7', value: 78 },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [students, teachers, attendance] = await Promise.all([
          getStudents(),
          getTeachers(),
          getAttendance(new Date().toISOString().split('T')[0])
        ])

        setStats({
          totalStudents: students.length,
          totalTeachers: teachers.length,
          attendanceRate: attendance.length > 0 ? (attendance.filter(a => a.status === 'present').length / students.length * 100).toFixed(1) : 0,
          lateArrivals: attendance.filter(a => a.status === 'late').length
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="animate-in fade-in duration-500">
      {/* Summary Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-manrope font-extrabold tracking-tight text-on-surface">Overview</h2>
        <p className="text-on-surface-variant text-sm">Here is what is happening across the academy today.</p>
      </div>

      {/* Summary Cards: Bento Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Students" 
          value={loading ? '...' : stats.totalStudents.toLocaleString()} 
          subValue="+12 this term" 
          trend="up"
          icon={Users}
          colorClass="border-primary/20"
        />
        <StatCard 
          title="Total Teachers" 
          value={loading ? '...' : stats.totalTeachers} 
          subValue="4 new faculty members" 
          icon={School}
          colorClass="border-secondary/20"
        />
        <StatCard 
          title="Today's Attendance" 
          value={loading ? '...' : `${stats.attendanceRate}%`} 
          subValue="+0.8% from yesterday" 
          trend="up"
          icon={CalendarCheck}
          colorClass="border-primary-container/20"
        />
        <div className="bg-primary bg-gradient-to-br from-primary to-primary-container p-6 rounded-xl shadow-md text-white flex flex-col justify-between">
          <p className="text-sm font-manrope font-bold leading-tight mb-4">Need to generate a new report?</p>
          <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2">
            <BarChart3 size={16} />
            Create Report
          </button>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Attendance Trends */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-lg font-manrope font-bold text-on-surface">Attendance Trends</h3>
                <p className="text-xs text-on-surface-variant">Daily student presence over the last 7 days</p>
              </div>
              <select className="bg-surface-container-lowest border-none text-xs font-bold rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/10">
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e40af" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#1e40af" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" hide />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#191c1e', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '10px'
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#1e40af" 
                    strokeWidth={4} 
                    dot={{ r: 4, fill: '#1e40af', strokeWidth: 0 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-between mt-4 px-2">
              {lineData.map(d => (
                <span key={d.name} className="text-[10px] font-bold text-slate-400 uppercase">{d.name}</span>
              ))}
            </div>
          </div>

          {/* Class-wise Comparison */}
          <div className="bg-surface-container-low p-8 rounded-xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-manrope font-bold text-on-surface">Performance by Grade</h3>
              <button className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
                View details <ArrowRight size={14} />
              </button>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#1e40af' : '#1e40af'} fillOpacity={index % 2 === 0 ? 0.3 : 1} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-surface-container flex flex-col flex-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-manrope font-bold text-on-surface">Recent Activity</h3>
              <History size={18} className="text-slate-400" />
            </div>
            
            <div className="space-y-6 flex-1">
              {/* Activity Items */}
              <ActivityItem 
                icon={CheckCircle2}
                color="bg-primary-fixed text-primary"
                title="Teacher Smith"
                action="marked attendance for"
                target="Class 10A"
                time="12 minutes ago • Morning Session"
              />
              <ActivityItem 
                icon={AlertCircle}
                color="bg-tertiary-fixed text-tertiary"
                title="Alert:"
                action="5 students reported absent without excuse in"
                target="Class 8C"
                time="45 minutes ago • Notification sent"
              />
              <ActivityItem 
                icon={FileEdit}
                color="bg-secondary-fixed text-secondary"
                title="Principal Jenkins"
                action="approved the Academic Year"
                target="budget report"
                time="2 hours ago • Financial"
              />
              <ActivityItem 
                icon={UserPlus}
                color="bg-surface-container-highest text-slate-500"
                title="New student"
                action="registration:"
                target="Leo Martinez"
                time="Yesterday, 4:30 PM • Registrar"
              />
            </div>
            
            <button className="w-full mt-8 pt-6 text-primary text-xs font-bold hover:bg-primary/5 py-3 rounded-lg transition-all border-t border-slate-50">
              View All Activity
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-surface-container-high p-6 rounded-xl">
            <h4 className="text-xs font-extrabold font-manrope text-slate-600 uppercase tracking-widest mb-4">Quick Stats</h4>
            <div className="space-y-4">
              <QuickStat label="Avg. Grade Points" value="3.8 / 4.0" />
              <QuickStat label="Library Books Out" value="142" />
              <QuickStat label="Late Arrivals Today" value="12" valueColor="text-error" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ActivityItem = ({ icon: Icon, color, title, action, target, time }) => (
  <div className="flex gap-4 relative">
    <div className="z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm transition-transform hover:scale-110 cursor-pointer">
      <div className={`absolute inset-0 rounded-full opacity-20 ${color.split(' ')[0]}`}></div>
      <Icon size={14} className={color.split(' ')[1]} />
    </div>
    <div className="pb-2">
      <p className="text-sm text-on-surface leading-tight">
        <span className="font-bold">{title}</span> {action} <span className="font-bold text-primary">{target}</span>
      </p>
      <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight">{time}</p>
    </div>
  </div>
)

const QuickStat = ({ label, value, valueColor = 'text-on-surface' }) => (
  <div className="flex justify-between items-center">
    <span className="text-xs text-on-surface-variant font-medium">{label}</span>
    <span className={`text-xs font-bold ${valueColor}`}>{value}</span>
  </div>
)

export default Dashboard
