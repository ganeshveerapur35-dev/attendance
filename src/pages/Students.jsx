import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Users, X, Loader2, Filter } from 'lucide-react'
import DataTable from '../components/Common/DataTable'
import { getStudents, addStudent, deleteStudent, updateStudent } from '../services/dataService'

const Students = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', class: '', section: '' })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const data = await getStudents()
      setStudents(data)
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setModalLoading(true)
    try {
      if (editingId) {
        await updateStudent(editingId, formData)
      } else {
        await addStudent(formData)
      }
      setIsModalOpen(false)
      setFormData({ name: '', class: '', section: '' })
      setEditingId(null)
      fetchStudents()
    } catch (error) {
      console.error('Error saving student:', error)
    } finally {
      setModalLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id)
        fetchStudents()
      } catch (error) {
        console.error('Error deleting student:', error)
      }
    }
  }

  const openEditModal = (student) => {
    setFormData({ name: student.name, class: student.class, section: student.section })
    setEditingId(student.id)
    setIsModalOpen(true)
  }

  const columns = [
    {
      key: 'name',
      label: 'Student Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-100 overflow-hidden border border-outline-variant/10">
            <img 
              src={`https://ui-avatars.com/api/?name=${row.name}&background=dde1ff&color=00288e&bold=true`}
              alt={row.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-semibold text-on-surface">{row.name}</div>
            <div className="text-[10px] text-outline font-bold uppercase tracking-widest">{row.id.slice(0, 8)}</div>
          </div>
        </div>
      )
    },
    {
      key: 'class',
      label: 'Academic Year / Class',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-manrope font-bold text-slate-700 text-xs uppercase tracking-tight">Grade {row.class}</span>
          <span className="text-[10px] text-outline font-medium tracking-wider">Sec {row.section || 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'attendance',
      label: 'Attendance Rate',
      render: () => (
        <div className="flex items-center gap-3 min-w-[120px]">
          <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '92%' }}></div>
          </div>
          <span className="text-xs font-bold text-primary">92%</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Administrative Status',
      render: () => (
        <span className="px-3 py-1 bg-primary-container text-on-primary-container rounded-full text-[10px] font-bold uppercase tracking-widest">
          Enrolled
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => openEditModal(row)}
            className="p-2 text-outline hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
          >
            <Edit size={18} />
          </button>
          <button 
            onClick={() => handleDelete(row.id)}
            className="p-2 text-outline hover:text-error hover:bg-error/10 rounded-lg transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ]

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.class?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesClass = classFilter === '' || s.class === classFilter
    return matchesSearch && matchesClass
  })

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-manrope font-extrabold tracking-tight text-on-surface">Students</h2>
          <p className="text-on-surface-variant mt-1 text-sm font-medium tracking-tight">Accessing the registry for {students.length} students across 6 grades.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null)
            setFormData({ name: '', class: '', section: '' })
            setIsModalOpen(true)
          }}
          className="flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-white px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-95 transition-all active:opacity-80 font-bold text-sm tracking-wide"
        >
          <Plus size={18} />
          <span>Add Student</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatItem label="Active Registry" value={students.length} color="text-primary" />
        <StatItem label="Late Arrivals Today" value="12" color="text-error" subValue="Requires Action" />
        <StatItem label="Avg. Attendance" value="94.2%" color="text-on-surface" />
        <StatItem label="Pending Registrations" value="4" color="text-slate-400" />
      </div>

      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative group w-full max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search by student name or record ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-lowest border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/10 shadow-sm transition-all outline-none"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-outline-variant/10 text-xs font-bold text-outline">
            <Filter size={14} />
            <span>Class Filter:</span>
            <select 
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="bg-transparent border-none p-0 focus:ring-0 text-primary uppercase"
            >
              <option value="">All Grades</option>
              <option value="12">Grade 12</option>
              <option value="11">Grade 11</option>
              <option value="10">Grade 10</option>
              <option value="9">Grade 9</option>
              <option value="8">Grade 8</option>
              <option value="7">Grade 7</option>
            </select>
          </div>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredStudents} 
        loading={loading} 
        emptyMessage="No student records found in current registry"
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="px-8 pt-8 pb-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-manrope font-extrabold text-on-surface">{editingId ? 'Edit Student Record' : 'Register New Student'}</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-outline hover:text-on-surface transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-outline px-1">Full Legal Name</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-surface-container-high border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium text-slate-700" 
                    placeholder="e.g. Leo Martinez" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-outline px-1">Academic Grade</label>
                    <select 
                      required
                      value={formData.class}
                      onChange={(e) => setFormData({...formData, class: e.target.value})}
                      className="w-full bg-surface-container-high border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none font-medium text-slate-700"
                    >
                      <option value="">Select Grade</option>
                      <option value="12">Grade 12</option>
                      <option value="11">Grade 11</option>
                      <option value="10">Grade 10</option>
                      <option value="9">Grade 9</option>
                      <option value="8">Grade 8</option>
                      <option value="7">Grade 7</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-outline px-1">Section</label>
                    <input 
                      required
                      value={formData.section}
                      onChange={(e) => setFormData({...formData, section: e.target.value})}
                      className="w-full bg-surface-container-high border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium text-slate-700" 
                      placeholder="e.g. A, B, or C" 
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={modalLoading}
                    className="flex-1 py-3 text-sm font-bold bg-gradient-to-br from-primary to-primary-container text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    {modalLoading ? <Loader2 size={18} className="animate-spin" /> : 'Apply To Registry'}
                  </button>
                </div>
              </form>
            </div>
            <div className="bg-surface-container-low px-8 py-4 mt-4">
              <p className="text-[10px] text-outline leading-tight font-medium uppercase tracking-[0.05em] opacity-80 italic">Administrative Note: New student records require a verified home address and previous academic transcript on file.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const StatItem = ({ label, value, color, subValue = 'Stable' }) => (
  <div className="bg-surface-container-low p-6 rounded-xl border-l-[6px] border-slate-200 transition-all hover:border-primary/40 group relative overflow-hidden">
    <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-outline mb-2 block font-manrope">{label}</span>
    <div className="flex items-end justify-between">
      <span className={`text-3xl font-manrope font-extrabold ${color}`}>{value}</span>
      <span className="text-slate-400 font-bold text-[9px] uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">{subValue}</span>
    </div>
  </div>
)

export default Students
