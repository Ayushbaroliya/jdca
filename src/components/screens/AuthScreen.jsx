import React, { useState } from 'react';
import { useCricket } from '../../context/CricketContext';
import { Shield, CheckCircle2, Lock, UserCheck, ArrowRight, Award, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ROLE_HOME } from '../ProtectedRoute';

const ROLES = [
  { id: 'SuperAdmin', label: 'Super Admin', desc: 'Apex Council & Full Access' },
  { id: 'Admin', label: 'District Admin', desc: 'District Operations & Tournaments' },
  { id: 'Scorer', label: 'Official Scorer', desc: 'Live Ball-by-Ball Match Console' },
  { id: 'Selector', label: 'Selection Staff', desc: 'District Teams & Player Selection' },
  { id: 'Player', label: 'Player / Viewer', desc: 'Public Live Scores & Profiles' },
];

export default function AuthScreen() {
  const { navigateTo, setUserEmail, setUserRole, setIsAuthenticated } = useCricket();
  const [emailInput, setEmailInput] = useState('');
  const [selectedRole, setSelectedRole] = useState('SuperAdmin');
  const [isLoading, setIsLoading] = useState(false);

  const completeLogin = (email, role) => {
    setUserEmail(email || `${role.toLowerCase()}@jdca.mp.in`);
    setUserRole(role);
    setIsAuthenticated(true);
    
    // Navigate to role-appropriate home
    if (role === 'Scorer') {
      navigateTo('matches');
    } else if (role === 'Selector') {
      navigateTo('selection');
    } else if (role === 'Player') {
      navigateTo('home');
    } else {
      navigateTo('home');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Fake loading delay for branding motion graphic
    setTimeout(() => {
      setIsLoading(false);
      completeLogin(emailInput, selectedRole);
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
      
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-lg flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotateY: [0, 180, 360]
              }}
              transition={{ 
                duration: 2, 
                ease: "easeInOut",
                repeat: Infinity 
              }}
              className="mb-8 relative"
            >
              <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-40 rounded-full animate-pulse" />
              <img
                src="/jdca-logo.png"
                alt="JDCA Official Emblem"
                className="w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-[0_0_20px_rgba(36,87,214,0.6)] relative z-10"
              />
            </motion.div>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white text-xl sm:text-2xl font-black tracking-widest uppercase mb-3"
            >
              Authenticating
            </motion.h2>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-blue-300 text-sm font-medium flex items-center gap-2 bg-blue-900/40 px-4 py-2 rounded-full border border-blue-500/30"
            >
              <Loader2 size={16} className="animate-spin text-blue-400" />
              Establishing Secure Connection...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-md relative z-10">
        
        {/* Official Association Header */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="flex items-center justify-center mx-auto mb-4"
          >
            <img
              src="/jdca-logo.png"
              alt="JDCA Official Emblem"
              className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
            />
          </motion.div>

          <motion.h1 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight"
          >
            JDCA Hub
          </motion.h1>
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-blue-200 mt-1 font-medium"
          >
            Jabalpur District Cricket Association
          </motion.p>
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-block mt-3 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wider uppercase backdrop-blur-sm"
          >
            Official Management Portal
          </motion.div>
        </div>

        {/* Login Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20"
        >
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Role Selection Grid */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between mb-3">
                <span>Select Official Role</span>
              </label>

              <div className="space-y-2.5">
                {ROLES.map((r) => {
                  const isSelected = selectedRole === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedRole(r.id)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/80 shadow-md transform scale-[1.02]'
                          : 'border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                          {r.label}
                          {isSelected && (
                            <CheckCircle2 size={15} className="text-blue-600" />
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 font-medium">{r.desc}</div>
                      </div>
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                        isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                      }`}>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Official Email or Phone</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={`${selectedRole.toLowerCase()}@jdca.mp.in`}
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3.5 pl-10 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white transition-colors placeholder:text-slate-400"
                />
                <UserCheck size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl p-4 text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 mt-2"
            >
              <span>{isLoading ? 'Authenticating...' : 'Secure Login'}</span>
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Quick Demo Access Note */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Demo Mode enabled. You can click <strong className="text-slate-700">Secure Login</strong> directly to access the workspace as <strong className="text-slate-700">{selectedRole}</strong>.
            </p>
          </div>
        </motion.div>

        {/* Association Footer Credential */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8 text-xs text-blue-200/60 font-medium"
        >
          <div>Governed by Jabalpur District Cricket Association</div>
          <div className="text-xs mt-1">Wright Town Stadium, Jabalpur, Madhya Pradesh 482002</div>
        </motion.div>

      </div>
    </div>
  );
}
