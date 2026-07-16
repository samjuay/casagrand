import React from "react";
import { User, UserRole } from "../types";
import {
  LayoutDashboard,
  ClipboardList,
  Building2,
  PhoneCall,
  User as UserIcon,
  Users,
  Handshake,
  UserCog,
  Briefcase,
  LogOut,
  ShieldAlert,
  Download,
} from "lucide-react";

interface SidebarProps {
  currentUser: User;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  leadsCount?: number;
  isInstallable?: boolean;
  onInstall?: () => void;
}

// Helper to get role-specific navigation tabs
export function getNavigationTabs(role: UserRole): { name: string; icon: any }[] {
  switch (role) {
    case "FoS":
      return [
        { name: "Dashboard", icon: LayoutDashboard },
        { name: "Leads", icon: ClipboardList },
        { name: "Projects", icon: Building2 },
        { name: "Contact Builder", icon: PhoneCall },
        { name: "Profile", icon: UserIcon },
      ];
    case "CP Admin":
      return [
        { name: "Dashboard", icon: LayoutDashboard },
        { name: "Leads", icon: ClipboardList },
        { name: "FoS", icon: Users },
        { name: "Projects", icon: Building2 },
        { name: "Contact Builder", icon: PhoneCall },
        { name: "Profile", icon: UserIcon },
      ];
    case "Receptionist":
      return [
        { name: "Dashboard", icon: LayoutDashboard },
        { name: "Leads", icon: ClipboardList },
        { name: "Profile", icon: UserIcon },
      ];
    case "Sales Executive":
      return [
        { name: "Dashboard", icon: LayoutDashboard },
        { name: "Leads", icon: ClipboardList },
        { name: "Profile", icon: UserIcon },
      ];
    case "Manager":
      return [
        { name: "Dashboard", icon: LayoutDashboard },
        { name: "Leads", icon: ClipboardList },
        { name: "Sales Team", icon: UserCog },
        { name: "Profile", icon: UserIcon },
      ];
    case "CRM":
      return [
        { name: "Dashboard", icon: LayoutDashboard },
        { name: "Clients", icon: Briefcase },
        { name: "Profile", icon: UserIcon },
      ];
    case "Builder Admin":
      return [
        { name: "Dashboard", icon: LayoutDashboard },
        { name: "Channel Partners", icon: Handshake },
        { name: "Clients", icon: Briefcase },
        { name: "Team", icon: Users },
        { name: "Profile", icon: UserIcon },
      ];
    default:
      return [{ name: "Profile", icon: UserIcon }];
  }
}

export default function Sidebar({
  currentUser,
  activeTab,
  onTabChange,
  onLogout,
  leadsCount = 0,
  isInstallable = false,
  onInstall,
}: SidebarProps) {
  const tabs = getNavigationTabs(currentUser.role);

  return (
    <aside
      id="desktop-sidebar"
      className="hidden md:flex flex-col w-64 bg-white text-slate-700 border-r border-slate-200 h-full shrink-0"
    >
      {/* Current User Status / Agency card */}
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col gap-1 text-left">
        <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider font-display">
          PORTAL ROLE
        </span>
        <h4 className="font-extrabold text-slate-800 text-sm">{currentUser.role}</h4>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          {currentUser.agency || "Casagrand Official"}
        </p>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold px-3 mb-2 font-display">
          Menu
        </div>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;

          return (
            <button
              key={tab.name}
              onClick={() => onTabChange(tab.name)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-100 ring-1 ring-blue-200/50 ring-inset font-bold"
                  : "text-slate-600 hover:text-blue-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4.5 h-4.5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                <span className="font-display">{tab.name}</span>
              </div>
              
              {/* Optional badges */}
              {tab.name === "Leads" && leadsCount > 0 && !isActive && (
                <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {leadsCount}
                </span>
              )}
              {tab.name === "Clients" && leadsCount > 0 && !isActive && (
                <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {leadsCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-100 shrink-0 bg-slate-50/50 space-y-2">
        {isInstallable && onInstall && (
          <button
            onClick={onInstall}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-colors duration-150 font-extrabold cursor-pointer uppercase tracking-wider"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span className="font-display">Install Desktop App</span>
          </button>
        )}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors duration-150 font-bold cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span className="font-display">Logout / Switch User</span>
        </button>
      </div>
    </aside>
  );
}
