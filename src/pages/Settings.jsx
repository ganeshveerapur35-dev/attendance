import React, { useState, useEffect } from 'react'
import { 
  Settings as SettingsIcon, 
  School, 
  Calendar, 
  Shield, 
  MapPin, 
  Globe, 
  Phone, 
  Save, 
  Loader2, 
  CheckCircle2 
} from 'lucide-react'
import { getSettings, updateSettings } from '../services/dataService'

const Settings = () => {
  const [formData, setFormData] = useState({
    school_name: 'Academic Excellence Academy',
    academic_year: '2023-24',
    address: '123 Educational Drive, Tech City',
    phone: '+1 555-0123',
    website: 'www.academy-excellence.edu'
  })
  const [loading, setLoading] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const data = await getSettings()
      if (data) {
        setFormData({
          ...formData,
          school_name: data.school_name || formData.school_name,
          academic_year: data.academic_year || formData.academic_year
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaveLoading(true)
    try {
      await updateSettings({
        school_name: formData.school_name,
        academic_year: formData.academic_year
      })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error updating settings:', error)
    } finally {
      setSaveLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-outline">Loading Config...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-manrope font-extrabold tracking-tight text-on-surface">Institutional Settings</h2>
          <p className="text-on-surface-variant mt-1 text-sm font-medium tracking-tight">Configuration of the Digital Registrar ecosystem.</p>
        </div>
        {success && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl border border-green-200 animate-in slide-in-from-top duration-300">
            <CheckCircle2 size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Settings Persisted</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Navigation / Sections */}
        <div className="md:col-span-1 space-y-2">
          <SettingNavLink label="School Profile" active icon={School} />
          <SettingNavLink label="Academic Session" icon={Calendar} />
          <SettingNavLink label="Security & Auth" icon={Shield} />
          <SettingNavLink label="System Logs" icon={SettingsIcon} />
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          <form onSubmit={handleSave} className="space-y-10">
            
            {/* School Profile Section */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary border-b border-surface-container pb-4">Institutional Identity</h3>
              
              <div className="space-y-4">
                <SettingInput 
                  label="Institute Name" 
                  value={formData.school_name}
                  onChange={(val) => setFormData({...formData, school_name: val})}
                  icon={School} 
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SettingInput 
                    label="Academic Session" 
                    value={formData.academic_year}
                    onChange={(val) => setFormData({...formData, academic_year: val})}
                    icon={Calendar} 
                  />
                  <SettingInput label="Institutional Phone" value={formData.phone} icon={Phone} />
                </div>
                <SettingInput label="Postal Address" value={formData.address} icon={MapPin} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SettingInput label="Official Website" value={formData.website} icon={Globe} />
                </div>
              </div>
            </div>

            {/* Logo Configuration */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary border-b border-surface-container pb-4">Brand Assets</h3>
              <div className="flex items-center gap-8">
                <div className="h-24 w-24 rounded-2xl bg-surface-container-high flex flex-col items-center justify-center gap-1 border-2 border-dashed border-outline-variant/30 text-outline hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer">
                  <SettingsIcon size={24} className="opacity-40" />
                  <span className="text-[9px] font-bold uppercase tracking-tighter">Upload Seal</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-on-surface mb-1">Official Academy Seal</p>
                  <p className="text-[10px] text-on-surface-variant font-medium leading-relaxed opacity-70">
                    This seal will appear on all exported attendance reports, academic transcripts, and institutional memos. High resolution PNG or SVG recommended.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-surface-container flex justify-end gap-3">
              <button 
                type="button" 
                className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-all"
              >
                Reset Default
              </button>
              <button 
                type="submit"
                disabled={saveLoading}
                className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-95 transition-all active:opacity-80 flex items-center gap-2"
              >
                {saveLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Persist Configuration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const SettingNavLink = ({ label, active, icon: Icon }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer group ${
    active ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container-low'
  }`}>
    <Icon size={16} className={active ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'} />
    <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
  </div>
)

const SettingInput = ({ label, value, onChange, icon: Icon }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold uppercase tracking-widest text-outline px-1">{label}</label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon size={16} className="text-outline group-focus-within:text-primary transition-colors" />
      </div>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        readOnly={!onChange}
        className="w-full bg-surface-container-low border-none rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-primary/10 transition-all outline-none"
      />
    </div>
  </div>
)

export default Settings
