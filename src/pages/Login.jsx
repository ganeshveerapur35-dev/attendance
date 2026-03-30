import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn, getUserRole } from '../services/authService'
import { LogIn, Lock, Mail, Verified, School, Loader2 } from 'lucide-react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = await signIn(email, password)
      if (data.user) {
        const role = await getUserRole(data.user.id)
        if (role !== 'principal') {
          setError('Access denied. Only principals can access this portal.')
          // Auto logout if not principal
          await supabase.auth.signOut()
        } else {
          navigate('/')
        }
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface min-h-screen flex items-center justify-center p-4 overflow-x-hidden">
      {/* Main Container Asymmetric Layout */}
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-8 items-center">
        
        {/* Left Side: Editorial Content */}
        <div className="hidden md:flex md:col-span-7 flex-col space-y-6 pr-12 animate-in fade-in slide-in-from-left duration-700">
          <div className="space-y-2">
            <span className="text-primary font-label text-sm font-bold tracking-[0.2em] uppercase">Academic Excellence</span>
            <h1 className="headline-font text-5xl font-extrabold text-on-surface leading-tight tracking-tight">
              The Modern Standard for <span className="text-primary">Institutional Records.</span>
            </h1>
          </div>
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">
            Experience the precision of the Digital Registrar. An authoritative environment designed for administrative calm and data integrity.
          </p>
          <div className="pt-8 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
              <Verified size={24} />
            </div>
            <div>
              <p className="font-bold text-on-surface">Secure Infrastructure</p>
              <p className="text-sm text-on-surface-variant">Enterprise-grade encryption for student data.</p>
            </div>
          </div>
        </div>

        {/* Right Side: The Login Card */}
        <div className="md:col-span-5 w-full animate-in fade-in slide-in-from-right duration-700">
          <div className="bg-surface-container-lowest p-8 md:p-10 rounded-xl shadow-[0_24px_48px_-12px_rgba(25,28,30,0.04)] border border-outline-variant/10 relative overflow-hidden">
            
            {/* Brand Identity */}
            <div className="flex flex-col items-center mb-10">
              <div className="h-16 w-16 bg-surface-container-low rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <School size={36} className="text-primary fill-current opacity-20" />
                <School size={36} className="text-primary absolute" />
              </div>
              <h2 className="headline-font text-2xl font-bold text-on-surface tracking-tight font-manrope">Digital Registrar</h2>
              <p className="text-on-surface-variant text-sm mt-1">Institutional Portal Access</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-error-container text-on-error-container p-3 rounded-lg text-xs font-semibold animate-in shake duration-300">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-outline ml-1">Email or Staff ID</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-outline group-focus-within:text-primary transition-colors" />
                  </div>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-surface-container-highest border-none rounded-lg text-on-surface placeholder:text-outline/60 focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all outline-none text-sm"
                    placeholder="registrar@academy.edu"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-outline ml-1">Secure Password</label>
                  <a href="#" className="text-xs font-semibold text-primary hover:underline">Forgot?</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-outline group-focus-within:text-primary transition-colors" />
                  </div>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-surface-container-highest border-none rounded-lg text-on-surface placeholder:text-outline/60 focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all outline-none text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 py-1">
                <input 
                  type="checkbox" 
                  id="remember"
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20"
                />
                <label htmlFor="remember" className="text-sm text-on-surface-variant">Remember this workstation</label>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full login-gradient-btn text-on-primary py-4 rounded-lg font-bold shadow-md hover:shadow-lg hover:opacity-95 transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
                Secure Login
              </button>
            </form>

            {/* Help Link */}
            <div className="mt-10 pt-6 border-t border-outline-variant/10 text-center">
              <p className="text-xs text-on-surface-variant">
                Technical issues? <a href="#" className="text-primary font-bold hover:underline">Contact System Administrator</a>
              </p>
            </div>
          </div>

          {/* Footer Meta */}
          <div className="mt-8 flex justify-between items-center px-2">
            <span className="text-[10px] uppercase tracking-widest text-outline/60 font-bold">V 2.4.0 Stable</span>
            <div className="flex gap-4">
              <span className="text-[10px] uppercase tracking-widest text-outline/60 font-bold hover:underline cursor-pointer">Privacy Policy</span>
              <span className="text-[10px] uppercase tracking-widest text-outline/60 font-bold hover:underline cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-secondary-container/5 rounded-full blur-[100px]"></div>
      </div>
    </div>
  )
}

export default Login
