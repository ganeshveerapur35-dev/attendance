import React from 'react'

const DataTable = ({ columns, data, loading, emptyMessage = 'No records found' }) => {
  if (loading) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl p-12 flex flex-col items-center justify-center gap-4 text-slate-400 shadow-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm font-medium">Fetching registry records...</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl p-12 text-center text-slate-400 shadow-sm">
        <p className="text-sm font-medium">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden p-2">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low/50">
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  className={`px-6 py-4 text-xs font-bold uppercase tracking-widest text-outline ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/50">
            {data.map((row, index) => (
              <tr key={row.id || index} className="hover:bg-surface-container-low/50 transition-colors group">
                {columns.map((column) => (
                  <td 
                    key={column.key} 
                    className={`px-6 py-4 ${column.className || ''}`}
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable
