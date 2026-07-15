import React from "react";
import { User } from "../types";
import { getNavigationTabs } from "./Sidebar";

interface BottomNavProps {
  currentUser: User;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNav({
  currentUser,
  activeTab,
  onTabChange,
}: BottomNavProps) {
  const tabs = getNavigationTabs(currentUser.role);

  return (
    <nav
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg px-2 py-1.5 flex items-center justify-around z-50 sticky-bottom-safety shrink-0"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.name;

        return (
          <button
            key={tab.name}
            onClick={() => onTabChange(tab.name)}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 min-h-[48px] rounded-lg transition-all duration-150 relative ${
              isActive ? "text-blue-600 font-semibold scale-105" : "text-slate-400"
            }`}
            style={{ touchAction: "manipulation" }}
          >
            {/* Active Indicator Bar on top */}
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full"></span>
            )}
            
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
            
            <span className="text-[10px] tracking-tight truncate max-w-full text-center leading-none mt-0.5">
              {tab.name}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
