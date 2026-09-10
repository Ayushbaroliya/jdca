import React from 'react';
import { useCricket } from '../../context/CricketContext';
import { ShieldCheck, User, Key, Settings } from 'lucide-react';

export default function AccessControlScreen() {
  const { registeredUsers } = useCricket();

  return (
    <div className="p-4 sm:p-6 pb-24 animate-in fade-in duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Access & Control</h1>
          <p className="text-sm text-slate-500">Super Admin User Management</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">User ID</th>
                <th className="p-4">Name / Email</th>
                <th className="p-4">Access Level</th>
                <th className="p-4">Password</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {registeredUsers?.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-slate-700">
                    {user.id}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{user.name}</span>
                      <span className="text-xs text-slate-500">{user.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      user.role === 'SuperAdmin' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'Admin' ? 'bg-blue-100 text-blue-700' :
                      user.role === 'Scorer' ? 'bg-emerald-100 text-emerald-700' :
                      user.role === 'Selector' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2 text-slate-500">
                      <Key className="w-4 h-4" />
                      <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded">
                        {user.password.replace(/./g, '*')}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              {(!registeredUsers || registeredUsers.length === 0) && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500 text-sm">
                    No users registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
