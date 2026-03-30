import React, { useState, useEffect } from 'react'
import { Bell, Send, User, Trash2, History, MessageSquare, Loader2, X } from 'lucide-react'
import { getNotifications, sendNotification } from '../services/dataService'

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [sendLoading, setSendLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const data = await getNotifications()
      setNotifications(data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!message.trim()) return
    
    setSendLoading(true)
    try {
      await sendNotification({
        message: message,
        target_role: 'teacher'
      })
      setMessage('')
      setIsModalOpen(false)
      fetchNotifications()
    } catch (error) {
      console.error('Error sending notification:', error)
    } finally {
      setSendLoading(false)
    }
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-manrope font-extrabold tracking-tight text-on-surface">Communication Hub</h2>
          <p className="text-on-surface-variant mt-1 text-sm font-medium tracking-tight">Direct institutional broadcast to faculty and staff.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-white px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-95 transition-all active:opacity-80 font-bold text-sm tracking-wide"
        >
          <Send size={18} />
          <span>New Broadcast</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Statistics */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-primary/5 p-6 rounded-2xl border-2 border-primary/10">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-6">Channel Status</h4>
            <div className="space-y-6">
              <ChannelItem label="Faculty Direct" count="48 Active" status="Normal" />
              <ChannelItem label="Administrative Staff" count="12 Active" status="Normal" />
              <ChannelItem label="System Auto-Alerts" count="Enabled" status="Standby" />
            </div>
            <div className="mt-8 pt-6 border-t border-primary/10">
              <button className="w-full py-3 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-md hover:bg-primary-container transition-all">
                Registry Sync
              </button>
            </div>
          </div>
          
          <div className="bg-surface-container-low p-6 rounded-2xl">
            <div className="flex items-center gap-3 text-on-surface-variant mb-4">
              <MessageSquare size={18} />
              <h5 className="text-xs font-bold uppercase tracking-widest">Broadcast Guidelines</h5>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed opacity-70">
              Announcements sent through the Communication Hub are delivered via the Internal Teacher Portal and mobile push notifications. Use clear, professional language for all institutional directives.
            </p>
          </div>
        </div>

        {/* History List */}
        <div className="lg:col-span-2">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-surface-container overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-surface-container bg-surface-container-low/30">
              <div className="flex items-center gap-2">
                <History size={16} className="text-outline" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface">Recent Broadcast History</h3>
              </div>
            </div>
            
            <div className="divide-y divide-surface-container">
              {loading ? (
                <div className="p-12 flex flex-col items-center justify-center gap-4 text-slate-400">
                  <Loader2 className="animate-spin" />
                  <p className="text-xs font-bold uppercase tracking-widest">Retrieving Logs...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-12 flex flex-col items-center justify-center gap-4 text-slate-400 text-center">
                  <Bell size={32} className="opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest">No previous broadcasts recorded</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className="p-6 hover:bg-surface-container-low/20 transition-all flex gap-4">
                    <div className="h-10 w-10 bg-primary-fixed rounded-xl flex items-center justify-center text-primary shrink-0">
                      <Send size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">To: {notif.target_role === 'all' ? 'All Staff' : 'Faculty Only'}</span>
                        <span className="text-[10px] font-medium text-outline">{new Date(notif.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-on-surface leading-normal font-medium">{notif.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="px-8 pt-8 pb-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-manrope font-extrabold text-on-surface">Draft Institution Broadcast</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-outline hover:text-on-surface transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSend} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-outline px-1">Message Content</label>
                  <textarea 
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-surface-container-high border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium text-slate-700 resize-none" 
                    placeholder="e.g. Please be advised: The scheduled morning assembly for tomorrow has been shifted to 10:00 AM..."
                  />
                </div>
                <div className="flex items-center gap-2 bg-surface-container-low p-3 rounded-xl">
                  <User size={16} className="text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Recipient: Registered Faculty List</span>
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-all"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit"
                    disabled={sendLoading}
                    className="flex-1 py-4 text-sm font-bold bg-gradient-to-br from-primary to-primary-container text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    {sendLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    <span>Deploy Message</span>
                  </button>
                </div>
              </form>
            </div>
            <div className="bg-primary/5 px-8 py-4 mt-4">
              <p className="text-[10px] text-primary/60 leading-tight font-medium uppercase tracking-[0.05em] italic">Confirmation: Broadcasts cannot be retracted once deployed to the endpoint device.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const ChannelItem = ({ label, count, status }) => (
  <div className="flex items-center justify-between group cursor-pointer">
    <div>
      <p className="text-xs font-bold text-on-surface-variant group-hover:text-primary transition-colors">{label}</p>
      <p className="text-[10px] text-outline font-medium">{count}</p>
    </div>
    <div className="flex items-center gap-1.5">
      <div className={`h-1.5 w-1.5 rounded-full ${status === 'Normal' ? 'bg-green-500' : 'bg-primary'}`}></div>
      <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">{status}</span>
    </div>
  </div>
)

export default Notifications
