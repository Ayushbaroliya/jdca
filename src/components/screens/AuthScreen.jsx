import React, { useState } from 'react';
import { useCricket } from '../../context/CricketContext';
import { Shield, CheckCircle2, Lock, UserCheck, ArrowRight, Award } from 'lucide-react';
import { ROLE_HOME } from '../ProtectedRoute';

const ROLES = [
  { id: 'SuperAdmin', label: 'Super Admin', desc: 'Apex Council & Full Access' },
  { id: 'Admin', label: 'District Admin', desc: 'District Operations & Tournaments' },
  { id: 'Scorer', label: 'Official Scorer', desc: 'Live Ball-by-Ball Match Console' },
  { id: 'Selector', label: 'Selection Staff', desc: 'District Squads & Trial Trials' },
  { id: 'Player', label: 'Player / Viewer', desc: 'Public Live Scores & Profiles' },
];

export default function AuthScreen() {
  const { navigateTo, setUserEmail, setUserRole, setIsAuthenticated } = useCricket();
  const [emailInput, setEmailInput] = useState('');
  const [selectedRole, setSelectedRole] = useState('SuperAdmin');

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
    completeLogin(emailInput, selectedRole);
  };

  return (
    <div className="min-h-screen bg-[#F7F8F4] flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-md">
        
        {/* Official Association Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#101827] border-2 border-amber-400 flex items-center justify-center mx-auto mb-3 shadow-md">
            <span className="font-extrabold text-xl tracking-wider text-[#ff6100] font-mono">
              JDCA
            </span>
          </div>

          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Jabalpur District Cricket Association
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Affiliated to Madhya Pradesh Cricket Association (MPCA)
          </p>
          <div className="inline-block mt-2 px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-[#2457D6] text-[11px] font-bold">
            Official Management & Live Scoring Portal
          </div>
        </div>

        {/* Login Card */}
        <div className="jdca-card p-6 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Role Selection Grid */}
            <div>
              <label className="jdca-label mb-2 flex items-center justify-between">
                <span>Select Official Role</span>
                <span className="text-[10px] text-slate-400 font-normal">Switch anytime for demo</span>
              </label>

              <div className="space-y-2">
                {ROLES.map((r) => {
                  const isSelected = selectedRole === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedRole(r.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#2457D6] bg-blue-50/50 shadow-xs ring-1 ring-[#2457D6]'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          {r.label}
                          {isSelected && (
                            <CheckCircle2 size={13} className="text-[#2457D6]" />
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{r.desc}</div>
                      </div>
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-[#2457D6] bg-[#2457D6]' : 'border-slate-300'
                      }`}>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="jdca-label">Official Email or Phone</label>
              <input
                type="text"
                placeholder={`${selectedRole.toLowerCase()}@jdca.mp.in`}
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="jdca-input text-xs"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="auth-submit-btn"
              className="btn-primary w-full justify-center text-xs"
              style={{ padding: '12px 16px', marginTop: 16 }}
            >
              <span>Access JDCA Workspace</span>
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Quick Demo Access Note */}
          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">
              Demo Mode enabled. You can click <strong>Access JDCA Workspace</strong> directly to log in as <strong>{selectedRole}</strong>.
            </p>
          </div>
        </div>

        {/* Association Footer Credential */}
        <div className="text-center mt-6 text-xs text-slate-500">
          <div>Governed by Jabalpur District Cricket Association</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Wright Town Stadium, Jabalpur, Madhya Pradesh 482002</div>
        </div>

      </div>
    </div>
  );
}
