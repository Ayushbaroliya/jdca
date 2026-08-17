import React, { useState } from 'react';
import { Camera, User, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

export default function PlayerRegistrationScreen() {
  const { registerPlayer, goBack } = useCricket();

  const [name, setName] = useState('');
  const [role, setRole] = useState('Batter');
  const [battingStyle, setBattingStyle] = useState('Right-Hand Bat');
  const [bowlingStyle, setBowlingStyle] = useState('None (Pure Batter)');
  const [district, setDistrict] = useState('Indore District');
  const [category, setCategory] = useState('Under-16');
  const [age, setAge] = useState(15);
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80');

  const avatarPresets = [
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    registerPlayer({
      name,
      role,
      battingStyle,
      bowlingStyle,
      district,
      category,
      age: Number(age),
      avatar
    });
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-100/60 pb-24 px-4 pt-3 max-w-xl mx-auto space-y-4 animate-in fade-in duration-200">
      
      {/* Main Registration Form Card (Matches Image 3) */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-5">
        
        {/* Profile Avatar Upload Circle */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 p-1 flex items-center justify-center overflow-hidden bg-slate-50">
              <img
                src={avatar}
                alt="Upload preview"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>

          <span className="text-[11px] font-semibold text-slate-400 mt-2">
            Tap to upload (Max 2MB)
          </span>

          {/* Quick preset selector */}
          <div className="flex items-center space-x-2 mt-2">
            {avatarPresets.map((preset, i) => (
              <img
                key={i}
                src={preset}
                alt="preset"
                onClick={() => setAvatar(preset)}
                className={`w-6 h-6 rounded-full object-cover cursor-pointer border ${
                  avatar === preset ? 'border-blue-600 ring-2 ring-blue-300' : 'border-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Player Name Input */}
        <div>
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1.5">
            Player Full Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Virat Kohli"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-2xs"
          />
        </div>

        {/* Primary Role Selector Pills (Batter / Bowler / All-Rounder) */}
        <div>
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1.5">
            Primary Role
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['Batter', 'Bowler', 'All-Rounder'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  role === r
                    ? 'bg-[#0B57D0] text-white shadow-sm ring-2 ring-blue-200'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Batting Style Dropdown */}
        <div>
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1.5">
            Batting Style
          </label>
          <select
            value={battingStyle}
            onChange={(e) => setBattingStyle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 bg-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
          >
            <option value="Right-Hand Bat">Right-Hand Bat</option>
            <option value="Left-Hand Bat">Left-Hand Bat</option>
          </select>
        </div>

        {/* Bowling Style Dropdown */}
        <div>
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1.5">
            Bowling Style
          </label>
          <select
            value={bowlingStyle}
            onChange={(e) => setBowlingStyle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 bg-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
          >
            <option value="None (Pure Batter)">None (Pure Batter)</option>
            <option value="Right-Arm Fast">Right-Arm Fast</option>
            <option value="Right-Arm Medium">Right-Arm Medium</option>
            <option value="Right-Arm Off Spin">Right-Arm Off Spin</option>
            <option value="Right-Arm Leg Spin">Right-Arm Leg Spin</option>
            <option value="Left-Arm Fast">Left-Arm Fast</option>
            <option value="Left-Arm Orthodox Spin">Left-Arm Orthodox Spin</option>
          </select>
        </div>

        {/* Age Category & District Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1.5">
              Age Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white cursor-pointer"
            >
              <option value="Under-13">Under-13</option>
              <option value="Under-16">Under-16</option>
              <option value="Under-19">Under-19</option>
              <option value="Senior/Open">Senior/Open</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1.5">
              District
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white cursor-pointer"
            >
              <option value="Indore District">Indore District</option>
              <option value="Jabalpur">Jabalpur</option>
              <option value="Bhopal">Bhopal</option>
              <option value="Mumbai">Mumbai</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 bg-[#0B57D0] hover:bg-blue-700 active:scale-[0.99] text-white font-bold rounded-2xl shadow-lg flex items-center justify-center space-x-2 text-sm sm:text-base transition-all cursor-pointer"
        >
          <User className="w-5 h-5" />
          <span>Register Player</span>
        </button>

      </form>

    </div>
  );
}
