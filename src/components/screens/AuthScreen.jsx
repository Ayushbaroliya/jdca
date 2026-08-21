import React, { useState } from 'react';
import { useCricket } from '../../context/CricketContext';
import { CricketAppLogo } from '../CricketIcons';
import { CricketBatsmanActionIllustration } from '../CricketIllustrations';
import { ROLE_HOME } from '../ProtectedRoute';

export default function AuthScreen() {
  const { navigateTo, setUserEmail, setUserRole, setIsAuthenticated } = useCricket();
  const [emailInput, setEmailInput] = useState('');
  const [selectedRole, setSelectedRole] = useState('Admin');

  const completeLogin = (email, role) => {
    setUserEmail(email);
    setUserRole(role);
    setIsAuthenticated(true);
    // Navigate to the role's designated home screen
    const homeRoute = ROLE_HOME[role] || '/matches';
    const routeToScreen = {
      '/matches': 'matches',
      '/scouting': 'scouting',
      '/player-profile': 'player-profile',
    };
    navigateTo(routeToScreen[homeRoute] || 'matches');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (emailInput.includes('@')) {
      completeLogin(emailInput, selectedRole);
    }
  };

  const handleSocialLogin = (provider) => {
    completeLogin(`${provider} User`, selectedRole);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between items-center px-6 py-10 max-w-md mx-auto animate-in fade-in duration-300">
      
      {/* Top spacing */}
      <div className="w-full" />

      {/* Main Form Center */}
      <div className="w-full flex flex-col items-center text-center">
        
        {/* Cricket Hero Action Illustration & Scorer Logo */}
        <div className="mb-6 flex flex-col items-center justify-center">
          <div className="relative">
            <CricketBatsmanActionIllustration className="w-36 h-36 drop-shadow-xl" />
            <div className="absolute -bottom-2 -right-2">
              <CricketAppLogo className="w-10 h-10" isMini={true} />
            </div>
          </div>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2 font-display">
          Welcome to Cricket Scorer
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-xs mb-10 leading-relaxed">
          Enter your email ID to start scoring matches.
        </p>

        {/* Form Box */}
        <form onSubmit={handleLogin} className="w-full space-y-4">
          
          {/* Role Selector */}
          <div>
            <label className="block text-left text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {['Admin', 'Scorer', 'Selector', 'Player'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    selectedRole === role 
                      ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-left text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Email Address
            </label>
            
            <div className="flex rounded-xl border border-slate-300 bg-white overflow-hidden shadow-2xs focus-within:ring-2 focus-within:ring-emerald-600 focus-within:border-emerald-600">
              <input
                type="email"
                placeholder="Enter your email ID"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
                required
              />
            </div>
          </div>

          {/* Green CTA Button */}
          <button
            type="submit"
            className="w-full py-4 bg-[#0a5e24] hover:bg-[#084e1e] active:scale-[0.99] text-white font-bold rounded-xl shadow-md transition-all text-base cursor-pointer"
          >
            Login
          </button>
        </form>

        {/* OR CONTINUE WITH Divider */}
        <div className="w-full flex items-center my-6">
          <div className="flex-1 border-t border-slate-200" />
          <span className="px-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Or continue with
          </span>
          <div className="flex-1 border-t border-slate-200" />
        </div>

        {/* Social Buttons */}
        <div className="w-full space-y-3">
          {/* Google Button */}
          <button
            type="button"
            onClick={() => handleSocialLogin('Google')}
            className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-full font-semibold text-sm text-slate-700 flex items-center justify-center space-x-3 shadow-2xs active:scale-[0.99] transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Google</span>
          </button>

          {/* Facebook Button */}
          <button
            type="button"
            onClick={() => handleSocialLogin('Facebook')}
            className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-full font-semibold text-sm text-slate-700 flex items-center justify-center space-x-3 shadow-2xs active:scale-[0.99] transition-all cursor-pointer"
          >
            <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Facebook</span>
          </button>
        </div>

      </div>

      {/* Terms and Policy Footer */}
      <div className="w-full pt-8 text-center text-xs text-slate-500">
        By continuing, you agree to our{' '}
        <span className="text-[#0a5e24] font-bold hover:underline cursor-pointer">
          Terms of Service
        </span>{' '}
        &{' '}
        <span className="text-[#0a5e24] font-bold hover:underline cursor-pointer">
          Privacy Policy
        </span>
      </div>

    </div>
  );
}
