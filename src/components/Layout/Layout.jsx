import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

const Layout = ({ children, user }) => {
  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <Sidebar />
      <div className="ml-64 min-h-screen flex flex-col">
        <Header user={user} />
        <main className="mt-16 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
