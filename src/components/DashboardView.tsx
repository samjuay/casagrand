import React from "react";
import { Lead, User, Announcement, LeadStatus } from "../types";
import { MOCK_ANNOUNCEMENTS } from "../mockData";
import {
  Plus,
  TrendingUp,
  Users,
  Building,
  CheckCircle,
  Clock,
  ArrowRight,
  Phone,
  MessageSquare,
  Sparkles,
  DollarSign,
  Briefcase,
  AlertCircle,
  ThumbsUp,
  Calendar,
} from "lucide-react";

interface DashboardViewProps {
  leads: Lead[];
  currentUser: User;
  users: User[];
  onAddLeadClick: () => void;
  onTabChange: (tabName: string) => void;
  onSetLeadFilter: (filterStatus: string | null, filterQuality: string | null) => void;
  onClaimLead: (leadId: string) => void;
  onRejectLead: (leadId: string) => void;
}

export default function DashboardView({
  leads,
  currentUser,
  users,
  onAddLeadClick,
  onTabChange,
  onSetLeadFilter,
  onClaimLead,
  onRejectLead,
}: DashboardViewProps) {
  const role = currentUser.role;

  // Filter leads based on role visibility constraints
  const getRoleLeads = (): Lead[] => {
    switch (role) {
      case "FoS":
        return leads.filter((l) => l.createdBy === currentUser.name);
      case "CP Admin":
        // View all FOS Leads under this CP (mocking based on FoS created leads)
        return leads.filter((l) => l.createdByRole === "FoS" || l.createdByRole === "CP Admin");
      case "Sales Executive":
        return leads.filter((l) => l.claimedById === currentUser.id);
      case "Manager":
      case "Receptionist":
      case "CRM":
      case "Builder Admin":
      default:
        return leads;
    }
  };

  const roleLeads = getRoleLeads();

  // Helper to count leads matching specific status criteria
  const countStatusGroup = (statuses: LeadStatus[]): number => {
    return roleLeads.filter((l) => statuses.includes(l.status)).length;
  };

  // Helper to trigger navigation to Leads list with status/quality filter
  const handleStatCardClick = (
    targetTab: string,
    statusFilter: string | null = null,
    qualityFilter: string | null = null
  ) => {
    onSetLeadFilter(statusFilter, qualityFilter);
    onTabChange(targetTab);
  };

  // Render FoS Dashboard
  if (role === "FoS") {
    const totalLeads = roleLeads.length;
    const totalSiteVisits = countStatusGroup([
      "Site Visit Done",
      "Token Done",
      "Booking Done",
      "Agreement Pending",
      "Agreement Done",
      "Brokerage Pending",
      "Brokerage Released",
      "Completed",
    ]);
    const totalBookings = countStatusGroup([
      "Booking Done",
      "Agreement Pending",
      "Agreement Done",
      "Brokerage Pending",
      "Brokerage Released",
      "Completed",
    ]);
    const totalTokens = countStatusGroup(["Token Done"]);
    const totalAgreements = countStatusGroup([
      "Agreement Done",
      "Brokerage Pending",
      "Brokerage Released",
      "Completed",
    ]);

    return (
      <div className="space-y-6">
        {/* Header Hero card with Add Lead button */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-slate-800">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-black tracking-tight font-display">
              Welcome Back, {currentUser.name}!
            </h2>
            <p className="text-xs text-blue-200 font-medium">
              Agent Code: CG-FOS-809 • Agency: {currentUser.agency || "Apex Realty"}
            </p>
          </div>
          <button
            onClick={onAddLeadClick}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer text-xs"
          >
            <Plus className="w-4.5 h-4.5" />
            <span className="font-display">Add New Lead</span>
          </button>
        </div>

        {/* Dynamic Metric Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <button
            onClick={() => handleStatCardClick("Leads")}
            className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
          >
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Total Leads</p>
            <p className="text-2xl font-black text-slate-900 mt-2 font-display">{totalLeads}</p>
            <div className="h-1 w-12 bg-blue-500 mt-3 rounded-full"></div>
          </button>

          <button
            onClick={() => handleStatCardClick("Leads", "Site Visit Done")}
            className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
          >
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Site Visits</p>
            <p className="text-2xl font-black text-emerald-600 mt-2 font-display">{totalSiteVisits}</p>
            <div className="h-1 w-12 bg-emerald-500 mt-3 rounded-full"></div>
          </button>

          <button
            onClick={() => handleStatCardClick("Leads", "Booking Done")}
            className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
          >
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Bookings Done</p>
            <p className="text-2xl font-black text-purple-600 mt-2 font-display">{totalBookings}</p>
            <div className="h-1 w-12 bg-purple-500 mt-3 rounded-full"></div>
          </button>

          <button
            onClick={() => handleStatCardClick("Leads", "Token Done")}
            className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
          >
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Active Tokens</p>
            <p className="text-2xl font-black text-orange-600 mt-2 font-display">{totalTokens}</p>
            <div className="h-1 w-12 bg-orange-500 mt-3 rounded-full"></div>
          </button>

          <button
            onClick={() => handleStatCardClick("Leads", "Agreement Done")}
            className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
          >
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Agreements</p>
            <p className="text-2xl font-black text-indigo-600 mt-2 font-display">{totalAgreements}</p>
            <div className="h-1 w-12 bg-indigo-500 mt-3 rounded-full"></div>
          </button>
        </div>

        {/* Corporate Announcements Section */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-amber-500" />
            Corporate Announcements
          </h3>
          <div className="space-y-4">
            {MOCK_ANNOUNCEMENTS.map((ann) => (
              <div key={ann.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-left space-y-1">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-slate-800 text-sm leading-snug">{ann.title}</h4>
                  <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap bg-white px-2 py-0.5 rounded border border-slate-100">
                    {ann.date}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render CP Admin Dashboard
  if (role === "CP Admin") {
    const totalLeads = roleLeads.length;
    const totalSiteVisits = countStatusGroup([
      "Site Visit Done",
      "Token Done",
      "Booking Done",
      "Agreement Pending",
      "Agreement Done",
      "Brokerage Pending",
      "Brokerage Released",
      "Completed",
    ]);
    const totalBookings = countStatusGroup([
      "Booking Done",
      "Agreement Pending",
      "Agreement Done",
      "Brokerage Pending",
      "Brokerage Released",
      "Completed",
    ]);
    const totalTokens = countStatusGroup(["Token Done"]);
    const totalAgreements = countStatusGroup([
      "Agreement Done",
      "Brokerage Pending",
      "Brokerage Released",
      "Completed",
    ]);

    return (
      <div className="space-y-6">
        {/* Banner with Add Lead */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-slate-800">
          <div className="space-y-1 text-left">
            <h2 className="text-xl md:text-2xl font-black tracking-tight font-display">
              {currentUser.agency || "Apex Realty"} Portal
            </h2>
            <p className="text-xs text-amber-400 font-medium">
              CP Admin Profile • Full oversight of Feet on Street (FoS) performance
            </p>
          </div>
          <button
            onClick={onAddLeadClick}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer text-xs"
          >
            <Plus className="w-4.5 h-4.5" />
            <span className="font-display">Add Lead</span>
          </button>
        </div>

        {/* CP Admin Metric Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-7 gap-4">
          <div className="bg-gradient-to-b from-blue-50 to-blue-100/20 p-4 rounded-2xl border border-blue-100 text-left col-span-2 lg:col-span-2 flex flex-col justify-between">
            <div>
              <p className="text-[10px] text-blue-800 font-bold uppercase tracking-wider flex items-center gap-1 font-display">
                <DollarSign className="w-3.5 h-3.5" /> Total Earnings
              </p>
              <p className="text-2xl font-black text-slate-800 mt-2 font-display">
                ₹{(currentUser.earnings || 4500000).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="h-1 w-12 bg-blue-600 mt-3 rounded-full"></div>
          </div>

          <button
            onClick={() => handleStatCardClick("Leads")}
            className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
          >
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Total Leads</p>
            <p className="text-2xl font-black text-slate-900 mt-2 font-display">{totalLeads}</p>
            <div className="h-1 w-12 bg-blue-500 mt-3 rounded-full"></div>
          </button>

          <button
            onClick={() => handleStatCardClick("Leads", "Site Visit Done")}
            className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
          >
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Site Visits</p>
            <p className="text-2xl font-black text-emerald-600 mt-2 font-display">{totalSiteVisits}</p>
            <div className="h-1 w-12 bg-emerald-500 mt-3 rounded-full"></div>
          </button>

          <button
            onClick={() => handleStatCardClick("Leads", "Booking Done")}
            className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
          >
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Bookings</p>
            <p className="text-2xl font-black text-purple-600 mt-2 font-display">{totalBookings}</p>
            <div className="h-1 w-12 bg-purple-500 mt-3 rounded-full"></div>
          </button>

          <button
            onClick={() => handleStatCardClick("Leads", "Token Done")}
            className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
          >
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Tokens</p>
            <p className="text-2xl font-black text-orange-600 mt-2 font-display">{totalTokens}</p>
            <div className="h-1 w-12 bg-orange-500 mt-3 rounded-full"></div>
          </button>

          <button
            onClick={() => handleStatCardClick("Leads", "Agreement Done")}
            className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
          >
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Agreements</p>
            <p className="text-2xl font-black text-indigo-600 mt-2 font-display">{totalAgreements}</p>
            <div className="h-1 w-12 bg-indigo-500 mt-3 rounded-full"></div>
          </button>
        </div>

        {/* Corporate Announcements CP */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-amber-500" />
            Brokerage Incentives & announcements
          </h3>
          <div className="space-y-4">
            {MOCK_ANNOUNCEMENTS.map((ann) => (
              <div key={ann.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-left space-y-1">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-slate-800 text-sm leading-snug">{ann.title}</h4>
                  <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap bg-white px-2 py-0.5 rounded border border-slate-100">
                    {ann.date}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render Receptionist Dashboard
  if (role === "Receptionist") {
    // Receptionist sees Visits breakdown: Today's Visits, Weekly Visits, Monthly Visits
    const todayStr = new Date().toISOString().split('T')[0];
    const todayVisits = leads.filter((l) => l.statusUpdatedDate === todayStr && (l.status === "Visit Confirmed" || l.status === "Site Visit Done")).length;
    const weeklyVisits = leads.filter((l) => ["Visit Confirmed", "Site Visit Done", "Assigned To Sales Executive"].includes(l.status)).length;
    const monthlyVisits = leads.filter((l) => l.status !== "Lead Created" && l.status !== "Waiting For Visit").length;

    return (
      <div className="space-y-6">
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm text-left space-y-1.5 border border-slate-800">
          <h2 className="text-xl md:text-2xl font-black tracking-tight font-display">Reception Guest Desk</h2>
          <p className="text-xs text-blue-200 font-medium">
            Confirm customer visits, record walked-in leads, and assign designated site sales executives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => handleStatCardClick("Leads", "Visit Confirmed")}
            className="bg-white p-5 rounded-2xl border border-slate-200 text-left shadow-xs hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
          >
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">Today's Visits Confirmed</p>
            <p className="text-3xl font-black text-slate-900 mt-2 font-display">{todayVisits}</p>
            <div className="h-1 w-12 bg-blue-500 mt-3 rounded-full"></div>
          </button>

          <button
            onClick={() => handleStatCardClick("Leads")}
            className="bg-white p-5 rounded-2xl border border-slate-200 text-left shadow-xs hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
          >
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">Weekly Confirmed Visits</p>
            <p className="text-3xl font-black text-slate-900 mt-2 font-display">{weeklyVisits}</p>
            <div className="h-1 w-12 bg-emerald-500 mt-3 rounded-full"></div>
          </button>

          <button
            onClick={() => handleStatCardClick("Leads")}
            className="bg-white p-5 rounded-2xl border border-slate-200 text-left shadow-xs hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
          >
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">Total Monthly Visits</p>
            <p className="text-3xl font-black text-slate-900 mt-2 font-display">{monthlyVisits}</p>
            <div className="h-1 w-12 bg-purple-500 mt-3 rounded-full"></div>
          </button>
        </div>

        {/* Quick walk-in button */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-4">
          <p className="text-xs text-slate-600 font-bold uppercase tracking-wider font-display">Walk-In Management</p>
          <p className="text-xs text-slate-500">Have a direct customer walk-in with no prior CP broker?</p>
          <button
            onClick={onAddLeadClick}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-all cursor-pointer text-xs"
          >
            <Plus className="w-4.5 h-4.5" />
            <span className="font-display">Create Walk-In Client</span>
          </button>
        </div>
      </div>
    );
  }

  // Render Sales Executive Dashboard
  if (role === "Sales Executive") {
    // Sales Executive sees "New Assigned Leads", "Today's Clients", "Weekly", "Monthly", Hot, Warm, Cold
    const assignedLeads = leads.filter((l) => l.claimedById === currentUser.id && l.status === "Assigned To Sales Executive");
    const activeClients = roleLeads.length;
    const hotLeads = roleLeads.filter((l) => l.leadQuality === "Hot").length;
    const warmLeads = roleLeads.filter((l) => l.leadQuality === "Warm").length;
    const coldLeads = roleLeads.filter((l) => l.leadQuality === "Cold").length;

    return (
      <div className="space-y-6">
        {/* Header Hero */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm text-left space-y-1 border border-slate-800">
          <h2 className="text-xl md:text-2xl font-black tracking-tight font-display">Executive Workspace</h2>
          <p className="text-xs text-blue-200 font-medium">
            Assigned Sales Agent: {currentUser.name} • Casagrand Chennai Sourcing
          </p>
        </div>

        {/* New Assigned Leads (Claim/Reject Panel) */}
        {assignedLeads.length > 0 ? (
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 space-y-3">
            <h3 className="text-[10px] font-bold text-blue-900 uppercase tracking-widest flex items-center gap-1.5 font-display">
              <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
              New Assigned Leads Pending Acceptance ({assignedLeads.length})
            </h3>
            <div className="space-y-3">
              {assignedLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-white p-4 rounded-xl border border-blue-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-left"
                >
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm font-display">{lead.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      ID: {lead.id} • Project: {lead.project} • CP: {lead.createdBy}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <button
                      onClick={() => onClaimLead(lead.id)}
                      className="flex-1 sm:flex-none text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white py-1.5 px-3 rounded-lg shadow-sm transition-all cursor-pointer"
                    >
                      Accept / Claim
                    </button>
                    <button
                      onClick={() => onRejectLead(lead.id)}
                      className="flex-1 sm:flex-none text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 py-1.5 px-3 rounded-lg border border-rose-200 transition-all cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 p-4 rounded-2xl text-left text-xs text-slate-500 flex items-center gap-2 shadow-xs">
            <ThumbsUp className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>All assigned customer leads have been successfully processed. No pending claims.</span>
          </div>
        )}

        {/* Sales Performance Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => handleStatCardClick("Leads")}
            className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
          >
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">My Clients</p>
            <p className="text-2xl font-black text-slate-900 mt-2 font-display">{activeClients}</p>
            <div className="h-1 w-12 bg-blue-500 mt-3 rounded-full"></div>
          </button>

          <button
            onClick={() => handleStatCardClick("Leads", null, "Hot")}
            className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
          >
            <p className="text-[10px] text-rose-600 font-bold uppercase tracking-wider flex items-center gap-1 font-display">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping"></span>
              Hot Leads
            </p>
            <p className="text-2xl font-black text-rose-600 mt-2 font-display">{hotLeads}</p>
            <div className="h-1 w-12 bg-rose-500 mt-3 rounded-full"></div>
          </button>

          <button
            onClick={() => handleStatCardClick("Leads", null, "Warm")}
            className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
          >
            <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider flex items-center gap-1 font-display">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
              Warm Leads
            </p>
            <p className="text-2xl font-black text-amber-600 mt-2 font-display">{warmLeads}</p>
            <div className="h-1 w-12 bg-amber-500 mt-3 rounded-full"></div>
          </button>

          <button
            onClick={() => handleStatCardClick("Leads", null, "Cold")}
            className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
          >
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 font-display">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
              Cold Leads
            </p>
            <p className="text-2xl font-black text-slate-500 mt-2 font-display">{coldLeads}</p>
            <div className="h-1 w-12 bg-slate-400 mt-3 rounded-full"></div>
          </button>
        </div>
      </div>
    );
  }

  // Render Manager Dashboard
  if (role === "Manager") {
    // Manager Dashboard: Today's Clients, Weekly, Monthly, Hot, Warm, Cold
    const totalClients = leads.length;
    const hotLeads = leads.filter((l) => l.leadQuality === "Hot").length;
    const warmLeads = leads.filter((l) => l.leadQuality === "Warm").length;
    const coldLeads = leads.filter((l) => l.leadQuality === "Cold").length;

    return (
      <div className="space-y-6">
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm text-left space-y-1 border border-slate-800">
          <h2 className="text-xl md:text-2xl font-black tracking-tight font-display">Manager Dashboard</h2>
          <p className="text-xs text-blue-200 font-medium">
            Sourcing oversight, sales agent allocation, and pipeline analytics.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => handleStatCardClick("Leads")}
            className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
          >
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Total Pipeline Leads</p>
            <p className="text-2xl font-black text-slate-850 mt-2 font-display">{totalClients}</p>
            <div className="h-1 w-12 bg-blue-500 mt-3 rounded-full"></div>
          </button>

          <button
            onClick={() => handleStatCardClick("Leads", null, "Hot")}
            className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
          >
            <p className="text-[10px] text-rose-600 font-bold uppercase tracking-wider flex items-center gap-1 font-display">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping"></span>
              Hot Pipeline
            </p>
            <p className="text-2xl font-black text-rose-700 mt-2 font-display">{hotLeads}</p>
            <div className="h-1 w-12 bg-rose-500 mt-3 rounded-full"></div>
          </button>

          <button
            onClick={() => handleStatCardClick("Leads", null, "Warm")}
            className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
          >
            <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider font-display">Warm Pipeline</p>
            <p className="text-2xl font-black text-amber-700 mt-2 font-display">{warmLeads}</p>
            <div className="h-1 w-12 bg-amber-500 mt-3 rounded-full"></div>
          </button>

          <button
            onClick={() => handleStatCardClick("Leads", null, "Cold")}
            className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
          >
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-display">Cold Pipeline</p>
            <p className="text-2xl font-black text-slate-700 mt-2 font-display">{coldLeads}</p>
            <div className="h-1 w-12 bg-slate-400 mt-3 rounded-full"></div>
          </button>
        </div>

        {/* Sales Executives quick list */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 text-left">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2 mb-3">
            Assigned Sales Agents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {users
              .filter((u) => u.role === "Sales Executive")
              .map((se) => {
                const countAssigned = leads.filter((l) => l.claimedById === se.id).length;
                return (
                  <div key={se.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{se.name}</h4>
                      <p className="text-xs text-slate-400">{se.email} • {se.phone}</p>
                    </div>
                    <button
                      onClick={() => handleStatCardClick("Leads")}
                      className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 shadow-xs hover:bg-slate-50"
                    >
                      {countAssigned} Leads Active
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }

  // Render CRM Dashboard
  if (role === "CRM") {
    // CRM Dashboard: Tokens, Bookings, Agreement Done, Agreement Pending stats
    const totalTokens = leads.filter((l) => l.status === "Token Done").length;
    const totalBookings = leads.filter((l) => l.status === "Booking Done").length;
    const agreementPending = leads.filter((l) => l.status === "Agreement Pending").length;
    const agreementDone = leads.filter((l) => l.status === "Agreement Done").length;

    return (
      <div className="space-y-6">
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm text-left space-y-1.5 border border-slate-800">
          <h2 className="text-xl md:text-2xl font-black tracking-tight font-display">CRM Back-Office Console</h2>
          <p className="text-xs text-blue-200 font-medium">
            Process sales agreements, handle billing tokens, manage registry contracts and release channel partner brokerage payouts.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => handleStatCardClick("Clients", "Token Done")}
            className="bg-white p-5 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
          >
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Active Tokens Pending</p>
            <p className="text-3xl font-black text-purple-600 mt-2 font-display">{totalTokens}</p>
            <div className="h-1 w-12 bg-purple-500 mt-3 rounded-full"></div>
          </button>

          <button
            onClick={() => handleStatCardClick("Clients", "Booking Done")}
            className="bg-white p-5 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
          >
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Recent Bookings</p>
            <p className="text-3xl font-black text-blue-600 mt-2 font-display">{totalBookings}</p>
            <div className="h-1 w-12 bg-blue-500 mt-3 rounded-full"></div>
          </button>

          <button
            onClick={() => handleStatCardClick("Clients", "Agreement Pending")}
            className="bg-white p-5 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
          >
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Agreement Pending</p>
            <p className="text-3xl font-black text-rose-600 mt-2 font-display">{agreementPending}</p>
            <div className="h-1 w-12 bg-rose-500 mt-3 rounded-full"></div>
          </button>

          <button
            onClick={() => handleStatCardClick("Clients", "Agreement Done")}
            className="bg-white p-5 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
          >
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Agreement Done</p>
            <p className="text-3xl font-black text-emerald-600 mt-2 font-display">{agreementDone}</p>
            <div className="h-1 w-12 bg-emerald-500 mt-3 rounded-full"></div>
          </button>
        </div>
      </div>
    );
  }

  // Render Builder Admin Dashboard
  if (role === "Builder Admin") {
    // Builder Admin Dashboard:
    // Registered CP, Active CP, Inactive CP, Registered FOS
    // Leads, Site Visits, Tokens, Bookings, Agreement Done, Agreement Pending, Brokerage Released, Brokerage Pending
    const registeredCP = users.filter((u) => u.role === "CP Admin").length;
    const activeCP = users.filter((u) => u.role === "CP Admin" && u.status === "Active").length;
    const inactiveCP = users.filter((u) => u.role === "CP Admin" && u.status === "Inactive").length;
    const registeredFOS = users.filter((u) => u.role === "FoS").length;

    const totalLeads = leads.length;
    const siteVisits = leads.filter((l) => ["Site Visit Done", "Token Done", "Booking Done", "Agreement Pending", "Agreement Done", "Brokerage Pending", "Brokerage Released", "Completed"].includes(l.status)).length;
    const tokens = leads.filter((l) => l.status === "Token Done").length;
    const bookings = leads.filter((l) => l.status === "Booking Done").length;
    const agreementPending = leads.filter((l) => l.status === "Agreement Pending").length;
    const agreementDone = leads.filter((l) => l.status === "Agreement Done").length;
    const brokeragePending = leads.filter((l) => l.status === "Brokerage Pending").length;
    const brokerageReleased = leads.filter((l) => l.status === "Brokerage Released").length;

    return (
      <div className="space-y-6">
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-slate-800">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight font-display">Builder Admin Control Center</h2>
            <p className="text-xs text-slate-400 font-medium">
              Enterprise Sourcing Analytics & Full Database Administration.
            </p>
          </div>
          <button
            onClick={() => handleStatCardClick("Channel Partners")}
            className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all cursor-pointer"
          >
            Manage Partners
          </button>
        </div>

        {/* CP Overview Stats */}
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left mb-3 font-display">
            Sourcing Agency Network
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => handleStatCardClick("Channel Partners")}
              className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
            >
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Registered CP</p>
              <p className="text-2xl font-black text-slate-800 mt-2 font-display">{registeredCP}</p>
              <div className="h-1 w-12 bg-blue-500 mt-3 rounded-full"></div>
            </button>

            <button
              onClick={() => handleStatCardClick("Channel Partners")}
              className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
            >
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Active CP Brokers</p>
              <p className="text-2xl font-black text-emerald-600 mt-2 font-display">{activeCP}</p>
              <div className="h-1 w-12 bg-emerald-500 mt-3 rounded-full"></div>
            </button>

            <button
              onClick={() => handleStatCardClick("Channel Partners")}
              className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
            >
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Inactive CP Brokers</p>
              <p className="text-2xl font-black text-slate-400 mt-2 font-display">{inactiveCP}</p>
              <div className="h-1 w-12 bg-slate-400 mt-3 rounded-full"></div>
            </button>

            <button
              onClick={() => handleStatCardClick("Channel Partners")}
              className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
            >
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Registered FoS Agents</p>
              <p className="text-2xl font-black text-indigo-600 mt-2 font-display">{registeredFOS}</p>
              <div className="h-1 w-12 bg-indigo-500 mt-3 rounded-full"></div>
            </button>
          </div>
        </div>

        {/* Lead Journey Funnel Metrics */}
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left mb-3 font-display">
            Entire Lead Journey Funnel Pipeline
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => handleStatCardClick("Clients")}
              className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
            >
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Total Leads</p>
              <p className="text-2xl font-black text-slate-800 mt-1 font-display">{totalLeads}</p>
              <div className="h-1 w-12 bg-blue-500 mt-3 rounded-full"></div>
            </button>

            <button
              onClick={() => handleStatCardClick("Clients", "Site Visit Done")}
              className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
            >
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Site Visits</p>
              <p className="text-2xl font-black text-emerald-600 mt-1 font-display">{siteVisits}</p>
              <div className="h-1 w-12 bg-emerald-500 mt-3 rounded-full"></div>
            </button>

            <button
              onClick={() => handleStatCardClick("Clients", "Token Done")}
              className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
            >
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Tokens Received</p>
              <p className="text-2xl font-black text-orange-600 mt-1 font-display">{tokens}</p>
              <div className="h-1 w-12 bg-orange-500 mt-3 rounded-full"></div>
            </button>

            <button
              onClick={() => handleStatCardClick("Clients", "Booking Done")}
              className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
            >
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Bookings Completed</p>
              <p className="text-2xl font-black text-purple-600 mt-1 font-display">{bookings}</p>
              <div className="h-1 w-12 bg-purple-500 mt-3 rounded-full"></div>
            </button>

            <button
              onClick={() => handleStatCardClick("Clients", "Agreement Pending")}
              className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
            >
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Agreement Pending</p>
              <p className="text-2xl font-black text-rose-500 mt-1 font-display">{agreementPending}</p>
              <div className="h-1 w-12 bg-rose-500 mt-3 rounded-full"></div>
            </button>

            <button
              onClick={() => handleStatCardClick("Clients", "Agreement Done")}
              className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
            >
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Agreement Done</p>
              <p className="text-2xl font-black text-teal-600 mt-1 font-display">{agreementDone}</p>
              <div className="h-1 w-12 bg-teal-500 mt-3 rounded-full"></div>
            </button>

            <button
              onClick={() => handleStatCardClick("Clients", "Brokerage Pending")}
              className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
            >
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Brokerage Pending</p>
              <p className="text-2xl font-black text-amber-600 mt-1 font-display">{brokeragePending}</p>
              <div className="h-1 w-12 bg-amber-500 mt-3 rounded-full"></div>
            </button>

            <button
              onClick={() => handleStatCardClick("Clients", "Brokerage Released")}
              className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
            >
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Brokerage Released</p>
              <p className="text-2xl font-black text-emerald-700 mt-1 font-display">{brokerageReleased}</p>
              <div className="h-1 w-12 bg-emerald-600 mt-3 rounded-full"></div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
