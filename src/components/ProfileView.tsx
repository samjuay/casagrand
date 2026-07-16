import React from "react";
import { User, UserRole } from "../types";
import { User as UserIcon, Shield, Phone, Mail, FileText, CheckCircle2, AlertOctagon, LogOut, Sparkles, Download } from "lucide-react";

interface ProfileViewProps {
  currentUser: User;
  onLogout: () => void;
  isInstallable?: boolean;
  onInstall?: () => void;
  onOpenInstall?: () => void;
}

// Map permissions matrix text based on role
function getRolePermissions(role: UserRole): { can: string[]; cannot: string[] } {
  switch (role) {
    case "FoS":
      return {
        can: ["Add Lead", "View Own Leads", "View Lead Status", "View Projects", "Contact Builder", "View Profile"],
        cannot: ["Edit Lead after submission", "Delete Lead", "Update Lead Status"],
      };
    case "CP Admin":
      return {
        can: ["Add Lead", "View All FOS Leads", "Add/Edit FoS Agents", "Deactivate FoS Agents", "View Status", "View Projects", "Contact Builder"],
        cannot: ["Update Lead Status", "Delete Lead"],
      };
    case "Receptionist":
      return {
        can: ["Search Lead by ID/Mobile", "Edit Client details", "Confirm Client Site Visit", "Assign Sales Executives"],
        cannot: ["Book Units", "Update Sales Status (Site Visit Done, Token, etc.)"],
      };
    case "Sales Executive":
      return {
        can: ["Accept Assigned Lead", "Update Site Visit Done", "Update Token Done", "Update Booking Done", "Mark Not Interested", "Update Lead Quality (Hot/Warm/Cold)"],
        cannot: ["Release Brokerage", "Approve Agreements", "Update CRM Billing details"],
      };
    case "Manager":
      return {
        can: ["View All Team Leads", "Update Site Visit Done", "Update Token Done", "Update Booking Done", "Mark Not Interested", "Manage Sales Executives"],
        cannot: ["Update CRM Billing details", "Approve Agreements"],
      };
    case "CRM":
      return {
        can: ["Process Agreement Pending", "Process Agreement Done", "Update Client Payments", "Process Brokerage Pending", "Process Brokerage Released"],
        cannot: ["Modify Core Sales Status"],
      };
    case "Builder Admin":
      return {
        can: ["Full Database Access", "Create/Deactivate Managers & Sales executives", "Audit Channel Partners & Clients", "Update Any Journey Status", "Export CSV Records"],
        cannot: [],
      };
    default:
      return { can: [], cannot: [] };
  }
}

export default function ProfileView({
  currentUser,
  onLogout,
  isInstallable = false,
  onInstall,
  onOpenInstall,
}: ProfileViewProps) {
  const permissions = getRolePermissions(currentUser.role);

  return (
    <div className="max-w-xl mx-auto py-6 px-4 text-left space-y-6">
      {/* Title */}
      <div className="space-y-1 text-center md:text-left">
        <h2 className="text-xl font-bold text-slate-800">My Sourcing Workspace</h2>
        <p className="text-xs text-slate-500">
          Manage your personal credentials and inspect system permissions.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-slate-900 text-amber-500 flex items-center justify-center font-black text-xl shadow-inner shrink-0">
            {currentUser.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>

          <div className="space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
              <h3 className="font-extrabold text-slate-800 text-lg leading-tight">{currentUser.name}</h3>
              <span className="inline-flex items-center w-fit mx-auto sm:mx-0 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-semibold">{currentUser.agency || "Casagrand Sourcing Staff"}</p>
          </div>
        </div>

        {/* Contacts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-400" />
            <span>{currentUser.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-400" />
            <span>{currentUser.email}</span>
          </div>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Shield className="w-4.5 h-4.5 text-blue-600" />
          Role Permission Matrix
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Can do */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Authorized Scope (Can)
            </h4>
            <ul className="space-y-1.5 pl-4 list-disc text-slate-600 font-medium">
              {permissions.can.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Cannot do */}
          {permissions.cannot.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
                Locked Actions (Cannot)
              </h4>
              <ul className="space-y-1.5 pl-4 list-disc text-slate-500 font-medium line-through">
                {permissions.cannot.map((item, idx) => (
                  <li key={idx} className="text-slate-400">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* PWA Section */}
      {!(() => {
        try {
          return window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true;
        } catch {
          return false;
        }
      })() && onOpenInstall && (
        <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4 border border-slate-800">
          <div className="flex items-start gap-3">
            <span className="p-2 bg-blue-500/10 text-amber-400 border border-blue-500/20 rounded-xl shrink-0">
              <Sparkles className="w-5 h-5" />
            </span>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Casagrand CRM Mobile App</h4>
              <p className="text-xs text-slate-400 leading-normal font-medium">
                Add Casagrand CRM directly to your mobile home screen or computer desktop. Enjoy native safe-areas, high-contrast visual styles, and full standalone PWA performance.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenInstall}
            className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black tracking-wider uppercase shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Download className="w-4.5 h-4.5 text-slate-950" />
            <span>Open PWA App Installer</span>
          </button>
        </div>
      )}

      {/* Switch User Session Button */}
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 py-3 rounded-2xl transition-all text-sm"
      >
        <LogOut className="w-4.5 h-4.5" />
        <span>Switch User Account</span>
      </button>
    </div>
  );
}
