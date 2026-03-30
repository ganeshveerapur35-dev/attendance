import React from 'react'
import { Search, Bell } from 'lucide-react'

const Header = ({ user }) => {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-30 shadow-sm flex items-center justify-between px-8 border-b border-slate-200/50">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search students, records, or files..."
            className="w-full bg-surface-container-low border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200/50">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold font-manrope text-blue-900">{user?.email?.split('@')[0] || 'Administrator'}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{user?.role || 'Principal'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden border border-outline-variant/10">
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.email || 'Admin'}&background=dde1ff&color=00288e&bold=true`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
