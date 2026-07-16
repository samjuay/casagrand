import React, { useState } from "react";
import { User } from "../types";
import CasagrandLogo from "./CasagrandLogo";
import { Key, Mail, ShieldAlert, Sparkles, UserCheck, Eye, EyeOff } from "lucide-react";

interface LoginViewProps {
  users: User[];
  onLogin: (user: User) => void;
}

export default function LoginView({ users, onLogin }: LoginViewProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Grouped users list for quick demo select with badges and icons
  const demoProfiles = [
    {
      userId: "USR-001",
      roleLabel: "Builder Admin",
      desc: "Vikram Casagrand (Full Control)",
      color: "border-purple-200 hover:border-purple-500 bg-purple-50/40 text-purple-700",
      badgeColor: "bg-purple-600 text-white",
    },
    {
      userId: "USR-002",
      roleLabel: "Sales Manager",
      desc: "Suresh Kumar (Oversight)",
      color: "border-blue-200 hover:border-blue-500 bg-blue-50/40 text-blue-700",
      badgeColor: "bg-blue-600 text-white",
    },
    {
      userId: "USR-003",
      roleLabel: "Receptionist",
      desc: "Pooja Hegde (Check-ins)",
      color: "border-teal-200 hover:border-teal-500 bg-teal-50/40 text-teal-700",
      badgeColor: "bg-teal-600 text-white",
    },
    {
      userId: "USR-004",
      roleLabel: "Sales Executive",
      desc: "Amit Sharma (Leads & Booking)",
      color: "border-amber-200 hover:border-amber-500 bg-amber-50/40 text-amber-700",
      badgeColor: "bg-amber-600 text-slate-900",
    },
    {
      userId: "USR-006",
      roleLabel: "CRM Operations",
      desc: "Meera Krishnan (Contracts & CPs)",
      color: "border-rose-200 hover:border-rose-500 bg-rose-50/40 text-rose-700",
      badgeColor: "bg-rose-600 text-white",
    },
    {
      userId: "USR-007",
      roleLabel: "Channel Partner Admin",
      desc: "Ramesh Patel (Agency Boss)",
      color: "border-indigo-200 hover:border-indigo-500 bg-indigo-50/40 text-indigo-700",
      badgeColor: "bg-indigo-600 text-white",
    },
    {
      userId: "USR-008",
      roleLabel: "Feet on Street Agent",
      desc: "Karan Johar (Sourcing Pro)",
      color: "border-emerald-200 hover:border-emerald-500 bg-emerald-50/40 text-emerald-700",
      badgeColor: "bg-emerald-600 text-white",
    },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your registered corporate email address.");
      return;
    }

    // Lookup user in mock database by email (case-insensitive)
    const targetUser = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (targetUser) {
      onLogin(targetUser);
    } else {
      // Create a friendly message, but allow easy fallback or create a guest/new custom user
      setError(
        "Email not recognized in demo workspace. Please use one of the demo logins below or enter a valid mock email."
      );
    }
  };

  const handleQuickLogin = (userId: string) => {
    const foundUser = users.find((u) => u.id === userId);
    if (foundUser) {
      onLogin(foundUser);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans" id="login-container">
      {/* Left Column: Visual branding and system capabilities overview */}
      <div className="md:w-5/12 bg-slate-900 text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-slate-800 text-left">
        {/* Subtle architectural background accent */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative z-10 space-y-8 my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Casagrand Lead Journey CRM v2.0</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight font-display text-white">
              Smarter Lead Management.<br />
              <span className="text-amber-400">Higher Conversion.</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              A comprehensive mobile-first unified platform coordinating Sourcing Agencies, Feet-on-Street Agents, Receptionists, Sales Executives, managers, and CRM teams.
            </p>
          </div>

          {/* Feature Highlight Cards */}
          <div className="space-y-4">
            <div className="flex gap-3.5 items-start p-4 rounded-xl bg-slate-800/40 border border-slate-700/30">
              <span className="p-2 bg-blue-600/20 text-blue-400 rounded-lg shrink-0">
                <UserCheck className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Distinct Dashboards per Role</h4>
                <p className="text-xs text-slate-400 mt-1">Custom operations from cold sourcing up to legal contracts and CP payments.</p>
              </div>
            </div>

            <div className="flex gap-3.5 items-start p-4 rounded-xl bg-slate-800/40 border border-slate-700/30">
              <span className="p-2 bg-amber-500/20 text-amber-400 rounded-lg shrink-0">
                <Key className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Live Stage Tracker</h4>
                <p className="text-xs text-slate-400 mt-1">Claiming queues, physical checklist verifications, token collection, and billing audits.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Footer */}
        <div className="relative z-10 text-[11px] text-slate-400 mt-8 border-t border-slate-800 pt-4 flex justify-between items-center">
          <span>&copy; {new Date().getFullYear()} Casagrand Builder Ltd</span>
          <span className="font-mono">BUILDING ASPIRATIONS</span>
        </div>
      </div>

      {/* Right Column: Interaction, Form and instant demo buttons */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 md:p-16 bg-white overflow-y-auto">
        <div className="w-full max-w-lg space-y-8 text-left">
          {/* Logo center */}
          <div className="flex justify-center md:justify-start">
            <CasagrandLogo className="h-14 md:h-16" textColor="text-slate-900" subtextColor="text-slate-500" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-850 tracking-tight font-display">Staff & Partner Sign In</h2>
            <p className="text-xs text-slate-500">Enter your credentials or click any demo role below for rapid review.</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-rose-50 border-l-4 border-rose-500 p-3.5 rounded-r-xl flex gap-2 text-xs text-rose-700">
              <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Corporate Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail className="w-4.5 h-4.5" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="name@casagrand.co.in"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all shadow-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Password</label>
                <a href="#forgot" onClick={(e) => {e.preventDefault(); alert("Demo accounts do not require a password. Simply select a role below or use their mock email!");}} className="text-xs text-blue-600 hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Key className="w-4.5 h-4.5" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold tracking-wide shadow-md hover:shadow-lg transition-all cursor-pointer text-center"
            >
              Secure Portal Access
            </button>
          </form>

          {/* Quick Demo Access Grid */}
          <div className="space-y-3.5 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider font-display">Fast Review: Simulated Employee Personas</span>
              <div className="flex-1 h-px bg-slate-100"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {demoProfiles.map((profile) => {
                const targetUser = users.find((u) => u.id === profile.userId);
                if (!targetUser) return null;

                return (
                  <button
                    key={profile.userId}
                    type="button"
                    onClick={() => handleQuickLogin(profile.userId)}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all hover:shadow-xs group cursor-pointer ${profile.color}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-wider font-display text-slate-800">
                        {profile.roleLabel}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200">
                        Select
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium truncate">
                      {targetUser.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono font-medium truncate">
                      {targetUser.email}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
