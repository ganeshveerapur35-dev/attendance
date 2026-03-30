import React, { useState, useEffect } from 'react'
import { Calendar, Filter, Save, CheckCircle2, XCircle, Clock, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import DataTable from '../components/Common/DataTable'
import { getStudents, getAttendance, markAttendance } from '../services/dataService'

const Attendance = () => {
  const [students, setStudents] = useState([])
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [classFilter, setClassFilter] = useState('10') // Default to Grade 10

  useEffect(() => {
    fetchData()
  }, [date, classFilter])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [allStudents, existingAttendance] = await Promise.all([
        getStudents(),
        getAttendance(date)
      ])
      
      const filteredStudents = allStudents.filter(s => s.class === classFilter)
      setStudents(filteredStudents)
      
      // Map existing attendance to students
      const initialAttendance = filteredStudents.map(student => {
        const record = existingAttendance.find(a => a.student_id === student.id)
        return {
          student_id: student.id,
          date: date,
          status: record ? record.status : 'present' // Default to present if not marked
        }
      })
      setAttendanceRecords(initialAttendance)
    } catch (error) {
      console.error('Error fetching attendance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords(prev => prev.map(rec => 
      rec.student_id === studentId ? { ...rec, status } : rec
    ))
  }

  const handleSave = async () => {
    setSaveLoading(true)
    try {
      await markAttendance(attendanceRecords)
      alert('Attendance saved successfully')
    } catch (error) {
      console.error('Error saving attendance:', error)
      alert('Failed to save attendance')
    } finally {
      setSaveLoading(false)
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Student Name',
      render: (student) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden border border-outline-variant/10">
            <img 
              src={`https://ui-avatars.com/api/?name=${student.name}&background=dde1ff&color=00288e&bold=true`}
              alt={student.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="font-semibold text-on-surface text-sm">{student.name}</div>
        </div>
      )
    },
    {
      key: 'section',
      label: 'Section',
      render: (student) => <span className="font-bold text-[10px] uppercase tracking-widest text-outline">SEC {student.section}</span>
    },
    {
      key: 'status',
      label: 'Attendance Status',
      className: 'min-w-[300px]',
      render: (student) => {
        const record = attendanceRecords.find(r => r.student_id === student.id)
        const status = record?.status || 'present'
        
        return (
          <div className="flex items-center gap-2">
            <StatusButton 
              active={status === 'present'} 
              onClick={() => handleStatusChange(student.id, 'present')}
              color="bg-primary-container text-on-primary-container"
              icon={CheckCircle2}
              label="Present"
            />
            <StatusButton 
              active={status === 'absent'} 
              onClick={() => handleStatusChange(student.id, 'absent')}
              color="bg-error-container text-on-error-container"
              icon={XCircle}
              label="Absent"
            />
            <StatusButton 
              active={status === 'late'} 
              onClick={() => handleStatusChange(student.id, 'late')}
              color="bg-tertiary-fixed text-on-tertiary-fixed"
              icon={Clock}
              label="Late"
            />
          </div>
        )
      }
    }
  ]

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-manrope font-extrabold tracking-tight text-on-surface">Mark Attendance</h2>
          <p className="text-on-surface-variant mt-1 text-sm font-medium tracking-tight">Legislative records for today's academic session.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2.5 rounded-xl shadow-sm border border-outline-variant/10 text-xs font-bold text-outline">
            <Calendar size={16} />
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent border-none p-0 focus:ring-0 text-primary font-bold uppercase tracking-widest"
            />
          </div>
          <button 
            onClick={handleSave}
            disabled={saveLoading || loading}
            className="flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-white px-6 py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-95 transition-all active:opacity-80 font-bold text-sm tracking-wide disabled:opacity-50"
          >
            {saveLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span>Commit Record</span>
          </button>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 bg-surface-container-high rounded-full p-1.5 px-4 text-xs font-bold text-outline">
          <Filter size={14} />
          <span>Active Registry:</span>
          <div className="flex gap-1 ml-2">
            {['7', '8', '9', '10', '11', '12'].map(grade => (
              <button
                key={grade}
                onClick={() => setClassFilter(grade)}
                className={`w-10 h-7 rounded-full flex items-center justify-center transition-all ${
                  classFilter === grade ? 'bg-primary text-white scale-110 shadow-md' : 'hover:bg-surface-container-low'
                }`}
              >
                G{grade}
              </button>
            ))}
          </div>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={students} 
        loading={loading} 
        emptyMessage={`No student records found for Grade ${classFilter}`}
      />

      {/* Persistence Note */}
      <div className="mt-8 bg-surface-container-low p-6 rounded-2xl border-l-[6px] border-primary/20">
        <div className="flex gap-4 items-start">
          <div className="h-10 w-10 bg-primary-container/20 rounded-xl flex items-center justify-center text-primary-container shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h4 className="text-sm font-manrope font-extrabold text-on-surface">Data Integrity Verification</h4>
            <p className="text-[11px] text-on-surface-variant font-medium mt-1 leading-relaxed opacity-80 uppercase tracking-tighter">
              Once committed, attendance records are locked for the official registrar. Any changes post-submission require administrative override logs. Attendance rate impacts the academic year's final reporting.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const StatusButton = ({ active, onClick, color, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-bold uppercase tracking-[0.1em] transition-all border-2 border-transparent ${
      active 
        ? `${color} border-current ring-4 ring-current/5` 
        : 'bg-surface-container-low text-outline opacity-40 hover:opacity-100 hover:bg-surface-container-high'
    }`}
  >
    <Icon size={14} />
    <span className="hidden sm:inline">{label}</span>
  </button>
)

export default Attendance
