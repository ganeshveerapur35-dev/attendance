import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, School, X, Loader2 } from 'lucide-react'
import DataTable from '../components/Common/DataTable'
import { getTeachers, addTeacher, deleteTeacher, updateTeacher } from '../services/dataService'

const Teachers = () => {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', subject: '' })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    setLoading(true)
    try {
      const data = await getTeachers()
      setTeachers(data)
    } catch (error) {
      console.error('Error fetching teachers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setModalLoading(true)
    try {
      if (editingId) {
        await updateTeacher(editingId, formData)
      } else {
        await addTeacher(formData)
      }
      setIsModalOpen(false)
      setFormData({ name: '', email: '', subject: '' })
      setEditingId(null)
      fetchTeachers()
    } catch (error) {
      console.error('Error saving teacher:', error)
    } finally {
      setModalLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await deleteTeacher(id)
        fetchTeachers()
      } catch (error) {
        console.error('Error deleting teacher:', error)
      }
    }
  }

  const openEditModal = (teacher) => {
    setFormData({ name: teacher.name, email: teacher.email, subject: teacher.subject })
    setEditingId(teacher.id)
    setIsModalOpen(true)
  }

  const columns = [
    {
      key: 'name',
      label: 'Teacher Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden border border-outline-variant/10">
            <img 
              src={`https://ui-avatars.com/api/?name=${row.name}&background=dde1ff&color=00288e&bold=true`}
              alt={row.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-semibold text-on-surface">{row.name}</div>
            <div className="text-xs text-on-surface-variant font-medium">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'id',
      label: 'Employee ID',
      render: (row) => <span className="font-manrope font-medium text-slate-600 uppercase text-xs tracking-wider">{row.id.slice(0, 8)}</span>
    },
    {
      key: 'subject',
      label: 'Subject Specialist',
      render: (row) => (
        <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant rounded-full text-[10px] font-bold uppercase tracking-widest">
          {row.subject || 'Unassigned'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: () => (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary-container animate-pulse"></div>
          <span className="text-xs font-semibold text-primary">Active</span>
        </div>
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

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-manrope font-extrabold tracking-tight text-on-surface">Teachers</h2>
          <p className="text-on-surface-variant mt-1 text-sm font-medium">Managing {teachers.length} faculty members across departments.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null)
            setFormData({ name: '', email: '', subject: '' })
            setIsModalOpen(true)
          }}
          className="flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-white px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-95 transition-all active:opacity-80 font-bold text-sm tracking-wide"
        >
          <Plus size={18} />
          <span>Add Teacher</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatItem label="Total Faculty" value={teachers.length} color="text-primary" bgColor="bg-primary-fixed" />
        <StatItem label="Departments" value="12" color="text-secondary" bgColor="bg-secondary-fixed" />
        <StatItem label="Present Today" value="45" color="text-on-surface" subValue="94% Rate" />
        <StatItem label="Vacancies" value="3" color="text-error" bgColor="bg-error-container" />
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div className="relative group w-full max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search faculty by name, email or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-lowest border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/10 shadow-sm transition-all"
          />
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredTeachers} 
        loading={loading} 
        emptyMessage="No faculty members found"
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="px-8 pt-8 pb-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-manrope font-extrabold text-on-surface">{editingId ? 'Edit Faculty' : 'Register New Faculty'}</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-outline hover:text-on-surface transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-outline px-1">Full Name</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-surface-container-high border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium" 
                    placeholder="e.g. Dr. Robert Miller" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-outline px-1">Employee Email</label>
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-surface-container-high border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium" 
                    placeholder="robert.m@digitalregistrar.edu" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-outline px-1">Specialization</label>
                  <select 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-surface-container-high border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none font-medium"
                  >
                    <option value="">Select Subject</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="History">History</option>
                    <option value="Literature">Literature</option>
                    <option value="Arts">Arts</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
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
                    {modalLoading ? <Loader2 size={18} className="animate-spin" /> : 'Complete Registration'}
                  </button>
                </div>
              </form>
            </div>
            <div className="bg-surface-container-low px-8 py-4 mt-4">
              <p className="text-[10px] text-outline leading-tight italic font-medium uppercase tracking-tighter">All faculty registrations are logged and subject to administrative approval for payroll integration.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const StatItem = ({ label, value, color, bgColor, subValue }) => (
  <div className="bg-surface-container-low p-6 rounded-xl border-l-4 border-slate-200 transition-all hover:border-primary/40 group">
    <span className="text-xs font-bold uppercase tracking-widest text-outline mb-2 block">{label}</span>
    <div className="flex items-end justify-between">
      <span className={`text-3xl font-manrope font-extrabold ${color}`}>{value}</span>
      {subValue ? (
        <span className="text-tertiary font-bold text-xs uppercase tracking-tighter">{subValue}</span>
      ) : (
        <div className={`h-8 w-8 rounded-lg ${bgColor} opacity-20 group-hover:scale-110 transition-transform`}></div>
      )}
    </div>
  </div>
)

export default Teachers
