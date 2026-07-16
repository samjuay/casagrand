import React, { useState } from "react";
import { User } from "../types";
import CasagrandLogo from "./CasagrandLogo";
import { Key, Mail, ShieldAlert, Sparkles, UserCheck, Eye, EyeOff, Lock, ArrowRight, Info } from "lucide-react";

interface LoginViewProps {
  users: User[];
  onLogin: (user: User) => void;
  onOpenInstall?: () => void;
}

export default function LoginView({ users, onLogin, onOpenInstall }: LoginViewProps) {
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
      color: "border-purple-200 hover:border-purple-500 bg-purple-50/40 text-purple-700 hover:bg-purple-50",
    },
    {
      userId: "USR-002",
      roleLabel: "Sales Manager",
      desc: "Suresh Kumar (Oversight)",
      color: "border-blue-200 hover:border-blue-500 bg-blue-50/40 text-blue-700 hover:bg-blue-50",
    },
    {
      userId: "USR-003",
      roleLabel: "Receptionist",
      desc: "Pooja Hegde (Check-ins)",
      color: "border-teal-200 hover:border-teal-500 bg-teal-50/40 text-teal-700 hover:bg-teal-50",
    },
    {
      userId: "USR-004",
      roleLabel: "Sales Executive",
      desc: "Amit Sharma (Leads & Booking)",
      color: "border-amber-200 hover:border-amber-500 bg-amber-50/40 text-amber-700 hover:bg-amber-50",
    },
    {
      userId: "USR-006",
      roleLabel: "CRM Operations",
      desc: "Meera Krishnan (Contracts & CPs)",
      color: "border-rose-200 hover:border-rose-500 bg-rose-50/40 text-rose-700 hover:bg-rose-50",
    },
    {
      userId: "USR-007",
      roleLabel: "CP Admin",
      desc: "Ramesh Patel (Agency Boss)",
      color: "border-indigo-200 hover:border-indigo-500 bg-indigo-50/40 text-indigo-700 hover:bg-indigo-50",
    },
    {
      userId: "USR-008",
      roleLabel: "FoS Agent",
      desc: "Karan Johar (Sourcing Pro)",
      color: "border-emerald-200 hover:border-emerald-500 bg-emerald-50/40 text-emerald-700 hover:bg-emerald-50",
    },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailValue = email.trim().toLowerCase();

    if (!emailValue) {
      setError("Please enter your registered corporate email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    // Lookup user in mock database by email (case-insensitive)
    const targetUser = users.find(
      (u) => u.email.toLowerCase() === emailValue
    );

    if (targetUser) {
      onLogin(targetUser);
    } else {
      setError(
        "Email address not recognized in this workspace. Please click one of the quick-load accounts below to automatically fill valid credentials."
      );
    }
  };

  const handleQuickFill = (userId: string) => {
    const foundUser = users.find((u) => u.id === userId);
    if (foundUser) {
      setEmail(foundUser.email);
      // Generate a realistic looking mock password
      const nameKey = foundUser.name.toLowerCase().split(" ")[0];
      setPassword(`${nameKey}@casagrand2026`);
      setError(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 font-sans relative overflow-hidden" id="login-container">
      {/* Floating Install App Option */}
      {onOpenInstall && (
        <button
          type="button"
          onClick={onOpenInstall}
          className="absolute top-4 right-4 z-20 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-800 text-white border border-slate-700/60 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-lg backdrop-blur-xs hover:border-amber-500/50 hover:text-amber-300"
        >
          <Key className="w-3.5 h-3.5 text-amber-400 rotate-45" />
          <span>Install CRM App</span>
        </button>
      )}

      {/* Subtle background matrix overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
      
      <div className="w-full max-w-xl relative z-10 space-y-6">
        
        {/* Main Centered Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-10 space-y-6 text-left relative overflow-hidden">
          {/* Accent lighting dots inside the card */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl -ml-12 -mb-12 pointer-events-none"></div>

          {/* Logo center */}
          <div className="flex flex-col items-center justify-center text-center space-y-2 border-b border-slate-100 pb-5">
            <CasagrandLogo className="h-12 md:h-14" textColor="text-slate-900" subtextColor="text-slate-500" />
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Unified CRM Portal v2.0</span>
            </div>
          </div>

          <div className="space-y-1.5 text-center">
            <h2 className="text-xl sm:text-2xl font-black text-slate-850 tracking-tight font-display">Staff & Partner Sign In</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Please enter your corporate credentials to access your dedicated role-based operational dashboard.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-rose-50 border-l-4 border-rose-500 p-3.5 rounded-r-xl flex gap-2.5 text-xs text-rose-700 animate-shake">
              <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Corporate Email Address / Login ID</label>
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
                  placeholder="username@casagrand.co.in"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all shadow-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Password</label>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault(); 
                    alert("To log in, please choose a quick-fill employee account from below to automatically populate correct credentials, or enter your mock email and password!");
                  }} 
                  className="text-xs text-blue-600 hover:underline hover:text-blue-700 font-semibold"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="w-4.5 h-4.5" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
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
              className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold tracking-wide shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 group mt-2"
            >
              <span>Secure Portal Access</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Quick Autofill Selector */}
          <div className="space-y-3 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-2.5">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-display">Click to Autofill Credentials</span>
              <div className="flex-1 h-px bg-slate-100"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {demoProfiles.map((profile) => {
                const targetUser = users.find((u) => u.id === profile.userId);
                if (!targetUser) return null;

                const isCurrentlySelected = email.toLowerCase() === targetUser.email.toLowerCase();

                return (
                  <button
                    key={profile.userId}
                    type="button"
                    onClick={() => handleQuickFill(profile.userId)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col gap-0.5 transition-all hover:shadow-xs group cursor-pointer ${
                      isCurrentlySelected 
                        ? "border-amber-500 bg-amber-50/30 ring-1 ring-amber-500 text-slate-900" 
                        : profile.color
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider font-display text-slate-800">
                        {profile.roleLabel}
                      </span>
                      {isCurrentlySelected ? (
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 uppercase tracking-widest">
                          Active
                        </span>
                      ) : (
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-400 group-hover:text-slate-700">
                          Autofill
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-700 font-medium truncate">
                      {targetUser.name}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono truncate">
                      {targetUser.email}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Corporate Footer */}
        <div className="text-[10px] text-slate-400 flex flex-col sm:flex-row justify-between items-center px-4 gap-2">
          <span>&copy; {new Date().getFullYear()} Casagrand Builder Ltd. All rights reserved.</span>
          <span className="font-mono tracking-widest uppercase">Building Aspirations</span>
        </div>
      </div>
    </div>
  );
}
