import React, { useState } from "react";
import { User, Lead } from "../types";
import { Search, Filter, Download, Phone, Mail, Building, Users, Wallet, Handshake } from "lucide-react";

interface ChannelPartnersViewProps {
  users: User[];
  leads: Lead[];
}

export default function ChannelPartnersView({ users, leads }: ChannelPartnersViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Inactive">("all");

  // Filter CP admins
  const cps = users.filter((u) => u.role === "CP Admin");

  const filteredCPs = cps.filter((cp) => {
    const matchesSearch =
      cp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cp.agency && cp.agency.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || cp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Export Channel Partners as a CSV
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "CP ID,Agency Name,Proprietor,Contact,Email,Status,Earnings (INR)\n";

    filteredCPs.forEach((cp) => {
      csvContent += `${cp.id},"${cp.agency || ""}","${cp.name}",${cp.phone},${cp.email},${cp.status},${cp.earnings || 0}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Casagrand_Channel_Partners_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert("Channel Partner directories exported successfully as CSV.");
  };

  return (
    <div className="space-y-6 text-left">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800">Channel Partner Directory</h2>
          <p className="text-xs text-slate-500">
            Audit registered brokerage agencies, view their active street agents and track cumulative earnings.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 px-3.5 rounded-lg shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export Directory (CSV)</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Agency Name or Proprietor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold focus:bg-white focus:outline-none text-slate-700 cursor-pointer"
        >
          <option value="all">All Verification Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Agency list cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCPs.map((cp) => {
          // Calculate stats for this agency
          const agencyFos = users.filter((u) => u.role === "FoS" && u.agency === cp.agency);
          const agencyLeads = leads.filter(
            (l) => l.createdBy === cp.name || agencyFos.some((f) => f.name === l.createdBy)
          );
          const agencyBookings = agencyLeads.filter((l) =>
            ["Booking Done", "Agreement Pending", "Agreement Done", "Brokerage Pending", "Brokerage Released", "Completed"].includes(l.status)
          ).length;

          return (
            <div
              key={cp.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 text-left hover:border-slate-300 transition-all"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Handshake className="w-5 h-5 text-amber-500 shrink-0" />
                    <h3 className="font-extrabold text-slate-800 text-base">{cp.agency || "Independent Agency"}</h3>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold">Proprietor: {cp.name}</p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                    cp.status === "Active"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}
                >
                  {cp.status}
                </span>
              </div>

              {/* Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-2 border-y border-slate-100 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {cp.phone}
                </span>
                <span className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{cp.email}</span>
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 pt-1 text-center">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Agents (FOS)</p>
                  <p className="text-sm font-black text-slate-800 mt-1">{agencyFos.length}</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total Leads</p>
                  <p className="text-sm font-black text-slate-800 mt-1">{agencyLeads.length}</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Earnings (Payout)</p>
                  <p className="text-xs font-black text-emerald-600 mt-1.5">
                    ₹{(cp.earnings || 4500000).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
