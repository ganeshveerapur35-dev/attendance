import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

const StatCard = ({ title, value, subValue, trend, icon: Icon, colorClass }) => {
  return (
    <div className={`bg-surface-container-lowest p-6 rounded-xl shadow-sm border-b-4 ${colorClass} flex flex-col justify-between h-full`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-lg ${colorClass.replace('border-', 'bg-').replace('/20', '/10')} flex items-center justify-center ${colorClass.replace('border-', 'text-').replace('/20', '')}`}>
          <Icon size={24} />
        </div>
        <span className="text-xs font-bold text-slate-400 tracking-tighter uppercase whitespace-nowrap">{title}</span>
      </div>
      <div>
        <h3 className="text-3xl font-manrope font-extrabold text-on-surface">{value}</h3>
        {subValue && (
          <p className={`text-xs font-medium flex items-center gap-1 mt-1 ${trend === 'up' ? 'text-primary' : trend === 'down' ? 'text-error' : 'text-slate-500'}`}>
            {trend === 'up' && <TrendingUp size={14} />}
            {trend === 'down' && <TrendingDown size={14} />}
            {subValue}
          </p>
        )}
      </div>
    </div>
  )
}

export default StatCard
