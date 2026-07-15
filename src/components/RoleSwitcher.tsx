import React from "react";
import { User, UserRole } from "../types";
import { Shield, User as UserIcon, RefreshCw } from "lucide-react";

interface RoleSwitcherProps {
  users: User[];
  currentUser: User;
  onUserChange: (user: User) => void;
}

export default function RoleSwitcher({
  users,
  currentUser,
  onUserChange,
}: RoleSwitcherProps) {
  // Group users by role
  const roles: { role: UserRole; label: string; description: string; userId: string }[] = [
    {
      role: "Builder Admin",
      label: "Builder Admin",
      description: "Full access to reports, team, clients & channel partners",
      userId: "USR-001",
    },
    {
      role: "Manager",
      label: "Sales Manager",
      description: "Views team leads & manages Sales Executives",
      userId: "USR-002",
    },
    {
      role: "Receptionist",
      label: "Receptionist",
      description: "Searches leads & confirms check-ins / visits",
      userId: "USR-003",
    },
    {
      role: "Sales Executive",
      label: "Sales Executive (Amit)",
      description: "Claims leads, updates site visits, tokens & bookings",
      userId: "USR-004",
    },
    {
      role: "CRM",
      label: "CRM Team",
      description: "Handles agreement pending/done & brokerage release",
      userId: "USR-006",
    },
    {
      role: "CP Admin",
      label: "Channel Partner Admin",
      description: "Manages FoS agents & views submissions",
      userId: "USR-007",
    },
    {
      role: "FoS",
      label: "Feet on Street (Karan)",
      description: "Submits new leads & tracks progress",
      userId: "USR-008",
    },
  ];

  return (
    <div
      id="role-simulation-banner"
      className="bg-slate-900 text-white px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-2 text-xs border-b border-slate-800 shrink-0"
    >
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="font-mono text-slate-300">
          <strong>Review Mode:</strong> Switch roles to test distinct dashboards and status flow restrictions
        </span>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        <div className="flex items-center gap-1.5 shrink-0 text-slate-400 font-medium">
          <Shield className="w-3.5 h-3.5 text-amber-500" />
          <span>Acting as:</span>
        </div>
        <select
          value={currentUser.id}
          onChange={(e) => {
            const found = users.find((u) => u.id === e.target.value);
            if (found) onUserChange(found);
          }}
          className="bg-slate-800 text-amber-400 border border-slate-700 rounded-md py-1 px-2.5 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer text-xs"
        >
          {roles.map((r) => {
            const userObj = users.find((u) => u.id === r.userId) || currentUser;
            return (
              <option key={r.userId} value={userObj.id}>
                {r.role} - {userObj.name}
              </option>
            );
          })}
        </select>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 border-l border-slate-800 pl-2 ml-1 shrink-0">
          <UserIcon className="w-3 h-3" />
          <span>{currentUser.email}</span>
        </div>
      </div>
    </div>
  );
}
