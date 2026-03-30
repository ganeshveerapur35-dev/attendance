import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  School, 
  Users, 
  CalendarCheck, 
  BarChart3, 
  Bell, 
  Settings, 
  LogOut 
} from 'lucide-react'
import { signOut } from '../../services/authService'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Teachers', path: '/teachers', icon: School },
    { name: 'Students', path: '/students', icon: Users },
    { name: 'Attendance', path: '/attendance', icon: CalendarCheck },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Settings', path: '/settings', icon: Settings },
  ]

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 flex flex-col bg-slate-100 dark:bg-slate-950 p-4 gap-2 z-40">
      <div className="mb-8 px-2">
        <h1 className="font-manrope font-extrabold text-blue-900 dark:text-white text-xl tracking-tight">Principal's Portal</h1>
        <p className="font-manrope font-medium text-xs text-slate-500 mt-1 uppercase tracking-wider">Academic Year 2023-24</p>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-manrope font-medium text-sm ${
                isActive 
                  ? 'bg-blue-900 text-white shadow-md shadow-blue-900/10' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-900 dark:hover:text-blue-200 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={18} className={isActive ? 'fill-current' : ''} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-200/50">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-error hover:bg-error-container/20 transition-all rounded-lg font-manrope font-medium text-sm"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
