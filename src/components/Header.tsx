import React from "react";
import { User } from "../types";
import { Bell, Menu, UserCheck } from "lucide-react";

interface HeaderProps {
  currentUser: User;
  onMobileMenuToggle: () => void;
}

export default function Header({ currentUser, onMobileMenuToggle }: HeaderProps) {
  return (
    <header
      id="app-header"
      className="bg-white border-b border-slate-200 h-16 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm shrink-0"
    >
      {/* Brand Logo & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 md:hidden focus:outline-none"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5.5 h-5.5" />
        </button>

        {/* Casagrand Styled Logo */}
        <div className="flex items-center gap-2">
          {/* Logo Graphic (Geometric Balance Blue Square & White Circle) */}
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 shadow-xs">
            <div className="w-4 h-4 border-2 border-white rounded-full"></div>
          </div>

          <div className="flex flex-col text-left">
            <span className="font-black text-blue-900 tracking-tight text-lg leading-none font-display">
              CASAGRAND
            </span>
            <span className="text-[9px] text-slate-400 tracking-widest font-bold uppercase leading-none mt-1 font-display">
              BUILDING ASPIRATIONS
            </span>
          </div>
        </div>
      </div>

      {/* User Information & Notification Dot */}
      <div className="flex items-center gap-3 md:gap-4 text-left">
        {/* Active Role Badge (Desktop Only) */}
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-100">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
          {currentUser.role}
        </span>

        {/* Notification Bell */}
        <button
          className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 relative transition-colors focus:outline-none"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
        </button>

        {/* User Card */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center border border-slate-200 text-xs shadow-inner">
            {currentUser.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-sm font-semibold text-slate-800 leading-tight">
              {currentUser.name}
            </span>
            <span className="text-[11px] text-slate-400 font-medium leading-none">
              {currentUser.agency || "Casagrand Builder Ltd"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
