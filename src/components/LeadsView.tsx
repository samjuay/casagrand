import React, { useState } from "react";
import { Lead, User, LeadStatus, LeadQuality, AuditLog } from "../types";
import { MOCK_PROJECTS } from "../mockData";
import Timeline from "./Timeline";
import {
  Search,
  Filter,
  Phone,
  MessageSquare,
  Mail,
  UserCheck,
  Calendar,
  AlertCircle,
  Tag,
  Building,
  CheckCircle,
  XCircle,
  ChevronRight,
  Plus,
  X,
  PlusCircle,
  DollarSign,
  UserCog,
  Share2,
} from "lucide-react";

interface LeadsViewProps {
  leads: Lead[];
  currentUser: User;
  users: User[];
  onUpdateLead: (updatedLead: Lead) => void;
  onAddLeadClick: () => void;
  initialStatusFilter: string | null;
  initialQualityFilter: string | null;
  onClearInitialFilters: () => void;
}

// Ordered allowed statuses
const ALLOWED_FLOW_ORDER: LeadStatus[] = [
  "Lead Created",
  "Waiting For Visit",
  "Visit Confirmed",
  "Assigned To Sales Executive",
  "Site Visit Done",
  "Token Done",
  "Booking Done",
  "Agreement Pending",
  "Agreement Done",
  "Brokerage Pending",
  "Brokerage Released",
  "Completed",
];

export default function LeadsView({
  leads,
  currentUser,
  users,
  onUpdateLead,
  onAddLeadClick,
  initialStatusFilter,
  initialQualityFilter,
  onClearInitialFilters,
}: LeadsViewProps) {
  const role = currentUser.role;

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedQuality, setSelectedQuality] = useState<string>(initialQualityFilter || "");
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatusFilter || "");
  const [claimFilter, setClaimFilter] = useState<"all" | "claimed" | "unclaimed">("all");

  // Lead detail modal state
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Transition form state
  const [transitionNotes, setTransitionNotes] = useState("");
  const [editClientName, setEditClientName] = useState("");
  const [editClientPhone, setEditClientPhone] = useState("");
  const [editClientEmail, setEditClientEmail] = useState("");
  const [selectedAssigneeId, setSelectedAssigneeId] = useState("");
  const [selectedNewQuality, setSelectedNewQuality] = useState<LeadQuality | "">("");

  // CRM billing inputs
  const [crmUnitDetails, setCrmUnitDetails] = useState("");
  const [crmPaymentReceived, setCrmPaymentReceived] = useState("");
  const [crmPaymentPending, setCrmPaymentPending] = useState("");

  // Filter leads based on logged-in role
  const getRoleFilteredLeads = () => {
    let result = leads;

    // FoS can only see their own created leads
    if (role === "FoS") {
      result = leads.filter((l) => l.createdBy === currentUser.name);
    }
    // CP Admin can see all FOS Leads under this CP (mocking FOS created leads)
    else if (role === "CP Admin") {
      result = leads.filter(
        (l) => l.createdByRole === "FoS" || l.createdByRole === "CP Admin"
      );
    }
    // Sales Executive can only see leads assigned to them
    else if (role === "Sales Executive") {
      result = leads.filter((l) => l.claimedById === currentUser.id);
    }

    // Now apply user's search query (Search by Lead ID, Client Name, or Mobile Phone)
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (l) =>
          l.id.toLowerCase().includes(query) ||
          l.name.toLowerCase().includes(query) ||
          l.phone.includes(query)
      );
    }

    // Apply project filter
    if (selectedProject !== "") {
      result = result.filter((l) => l.project === selectedProject);
    }

    // Apply quality filter
    if (selectedQuality !== "") {
      result = result.filter((l) => l.leadQuality === selectedQuality);
    }

    // Apply status filter
    if (selectedStatus !== "") {
      result = result.filter((l) => l.status === selectedStatus);
    }

    // Apply claim state filter (for FoS)
    if (claimFilter === "claimed") {
      result = result.filter((l) => l.claimedBy !== null);
    } else if (claimFilter === "unclaimed") {
      result = result.filter((l) => l.claimedBy === null);
    }

    return result;
  };

  const filteredLeads = getRoleFilteredLeads();

  // Determine allowed status transitions based on current status
  const getNextAllowedStatuses = (currentStatus: LeadStatus): LeadStatus[] => {
    if (currentStatus === "Completed" || currentStatus === "Not Interested") {
      return [];
    }

    const currentIdx = ALLOWED_FLOW_ORDER.indexOf(currentStatus);
    if (currentIdx === -1) return [];

    const nextStatuses: LeadStatus[] = [];

    // The next linear step in the flow is allowed
    if (currentIdx + 1 < ALLOWED_FLOW_ORDER.length) {
      nextStatuses.push(ALLOWED_FLOW_ORDER[currentIdx + 1]);
    }

    // "Not Interested" is allowed at any point BEFORE "Booking Done"
    const bookingIdx = ALLOWED_FLOW_ORDER.indexOf("Booking Done");
    if (currentIdx < bookingIdx) {
      nextStatuses.push("Not Interested");
    }

    return nextStatuses;
  };

  // Open lead detail slide-over
  const handleOpenDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setEditClientName(lead.name);
    setEditClientPhone(lead.phone);
    setEditClientEmail(lead.email);
    setTransitionNotes("");
    setSelectedAssigneeId(lead.claimedById || "");
    setSelectedNewQuality(lead.leadQuality || "");
    setCrmUnitDetails(lead.unitDetails || "");
    setCrmPaymentReceived(lead.paymentReceived?.toString() || "");
    setCrmPaymentPending(lead.paymentPending?.toString() || "");
  };

  // Save general client details edit (permitted for Receptionist and Builder Admin)
  const handleSaveClientDetails = () => {
    if (!selectedLead) return;

    const updated: Lead = {
      ...selectedLead,
      name: editClientName,
      phone: editClientPhone,
      email: editClientEmail,
      history: [
        ...selectedLead.history,
        {
          id: `H-EDIT-${Math.random().toString(36).substr(2, 5)}`,
          status: selectedLead.status,
          updatedAt: new Date().toISOString().split("T")[0],
          updatedBy: `${currentUser.role} - ${currentUser.name}`,
          notes: "Updated client contact details in CRM profile",
        },
      ],
    };

    onUpdateLead(updated);
    setSelectedLead(updated);
    alert("Client contact details successfully updated.");
  };

  // Perform lead status transition
  const handleTransitionStatus = (nextStatus: LeadStatus) => {
    if (!selectedLead) return;

    const dateToday = new Date().toISOString().split("T")[0];
    const log: AuditLog = {
      id: `H-TR-${Math.random().toString(36).substr(2, 5)}`,
      status: nextStatus,
      updatedAt: dateToday,
      updatedBy: `${currentUser.role} - ${currentUser.name}`,
      notes: transitionNotes.trim() || `Status updated to ${nextStatus}`,
    };

    const updated: Lead = {
      ...selectedLead,
      status: nextStatus,
      statusUpdatedDate: dateToday,
      history: [...selectedLead.history, log],
    };

    // If transition includes CRM payment details
    if (role === "CRM" || role === "Builder Admin") {
      if (crmUnitDetails) updated.unitDetails = crmUnitDetails;
      if (crmPaymentReceived) updated.paymentReceived = Number(crmPaymentReceived);
      if (crmPaymentPending) updated.paymentPending = Number(crmPaymentPending);
    }

    onUpdateLead(updated);
    setSelectedLead(updated);
    setTransitionNotes("");
    alert(`Lead successfully transitioned to: ${nextStatus}`);
  };

  // Assign Sales Executive (Receptionist or Builder Admin or Manager)
  const handleAssignSalesExecutive = () => {
    if (!selectedLead || !selectedAssigneeId) return;

    const exec = users.find((u) => u.id === selectedAssigneeId);
    if (!exec) return;

    const dateToday = new Date().toISOString().split("T")[0];
    const nextStatus: LeadStatus = "Assigned To Sales Executive";

    const log: AuditLog = {
      id: `H-ASN-${Math.random().toString(36).substr(2, 5)}`,
      status: nextStatus,
      updatedAt: dateToday,
      updatedBy: `${currentUser.role} - ${currentUser.name}`,
      notes: `Assigned sales executive ${exec.name}. ${transitionNotes}`.trim(),
    };

    const updated: Lead = {
      ...selectedLead,
      claimedById: exec.id,
      claimedBy: exec.name,
      status: nextStatus,
      statusUpdatedDate: dateToday,
      history: [...selectedLead.history, log],
    };

    onUpdateLead(updated);
    setSelectedLead(updated);
    setTransitionNotes("");
    alert(`Successfully assigned sales executive: ${exec.name}`);
  };

  // Update lead quality (Hot / Warm / Cold) for SE or Manager or Admin
  const handleUpdateQuality = () => {
    if (!selectedLead || !selectedNewQuality) return;

    const dateToday = new Date().toISOString().split("T")[0];
    const log: AuditLog = {
      id: `H-QL-${Math.random().toString(36).substr(2, 5)}`,
      status: selectedLead.status,
      updatedAt: dateToday,
      updatedBy: `${currentUser.role} - ${currentUser.name}`,
      notes: `Updated lead quality profile to ${selectedNewQuality}`,
    };

    const updated: Lead = {
      ...selectedLead,
      leadQuality: selectedNewQuality as LeadQuality,
      history: [...selectedLead.history, log],
    };

    onUpdateLead(updated);
    setSelectedLead(updated);
    alert(`Lead quality classified as: ${selectedNewQuality}`);
  };

  // Reset search filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedProject("");
    setSelectedQuality("");
    setSelectedStatus("");
    setClaimFilter("all");
    onClearInitialFilters();
  };

  // Check role-based permission locks for status transitions
  const isUserAllowedToUpdateStatus = (status: LeadStatus): boolean => {
    if (role === "Builder Admin") return true;

    if (role === "FoS" || role === "CP Admin") {
      return false; // strictly forbidden from updating status
    }

    if (role === "Receptionist") {
      // Receptionist can confirm visits or assign sales executives
      return status === "Visit Confirmed" || status === "Assigned To Sales Executive";
    }

    if (role === "Sales Executive") {
      // SE can update site visit done, token done, booking done, and not interested
      const seAllowed: LeadStatus[] = [
        "Site Visit Done",
        "Token Done",
        "Booking Done",
        "Not Interested",
      ];
      return seAllowed.includes(status);
    }

    if (role === "Manager") {
      // Manager can update site visit done, token done, booking done, and not interested
      const managerAllowed: LeadStatus[] = [
        "Site Visit Done",
        "Token Done",
        "Booking Done",
        "Not Interested",
      ];
      return managerAllowed.includes(status);
    }

    if (role === "CRM") {
      // CRM can update agreements & brokerage status
      const crmAllowed: LeadStatus[] = [
        "Agreement Pending",
        "Agreement Done",
        "Brokerage Pending",
        "Brokerage Released",
        "Completed",
      ];
      return crmAllowed.includes(status);
    }

    return false;
  };

  const nextAllowed = selectedLead ? getNextAllowedStatuses(selectedLead.status) : [];
  const permittedNextAllowed = nextAllowed.filter(isUserAllowedToUpdateStatus);

  return (
    <div className="space-y-6 text-left">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800">
            {role === "CRM" ? "CRM Client Records" : "Lead Journey Directory"}
          </h2>
          <p className="text-xs text-slate-500">
            Track client progress, audit histories, and manage step-by-step pipeline transitions.
          </p>
        </div>

        {/* Add Lead button if permitted */}
        {["FoS", "CP Admin", "Receptionist", "Builder Admin"].includes(role) && (
          <button
            onClick={onAddLeadClick}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-3.5 rounded-lg shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        )}
      </div>

      {/* Filter panel */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Omni Search */}
          <div className="relative flex-1">
            <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                role === "Receptionist"
                  ? "Search by Client Mobile or Lead ID..."
                  : "Search Name, Phone or ID..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-slate-700"
            />
          </div>

          {/* Project Selector */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold focus:bg-white focus:outline-none text-slate-700 cursor-pointer"
          >
            <option value="">All Projects</option>
            {MOCK_PROJECTS.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Status Selector */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold focus:bg-white focus:outline-none text-slate-700 cursor-pointer"
          >
            <option value="">All Statuses</option>
            {ALLOWED_FLOW_ORDER.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
            <option value="Not Interested">Not Interested</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            {/* Lead Quality Filters */}
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-1">
              Quality:
            </span>
            {["Hot", "Warm", "Cold"].map((q) => (
              <button
                key={q}
                onClick={() => setSelectedQuality(selectedQuality === q ? "" : q)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-md border transition-all ${
                  selectedQuality === q
                    ? q === "Hot"
                      ? "bg-rose-50 text-rose-700 border-rose-300 shadow-xs"
                      : q === "Warm"
                      ? "bg-amber-50 text-amber-700 border-amber-300 shadow-xs"
                      : "bg-slate-100 text-slate-700 border-slate-300 shadow-xs"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {q}
              </button>
            ))}

            {/* CP/FoS Claim Filter */}
            {role === "FoS" && (
              <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3 ml-1.5">
                <button
                  onClick={() => setClaimFilter("all")}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    claimFilter === "all" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setClaimFilter("claimed")}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    claimFilter === "claimed" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Claimed
                </button>
                <button
                  onClick={() => setClaimFilter("unclaimed")}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    claimFilter === "unclaimed" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Unclaimed
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleResetFilters}
            className="text-[10px] text-rose-600 font-bold hover:underline"
          >
            Reset All Filters
          </button>
        </div>
      </div>

      {/* Leads counter indicator */}
      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
        Showing {filteredLeads.length} of {leads.length} Records
      </p>

      {/* Leads/Clients List (One-Column layout on mobile, touch responsive) */}
      <div className="space-y-4">
        {filteredLeads.length > 0 ? (
          filteredLeads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => handleOpenDetails(lead)}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left shadow-xs relative overflow-hidden"
            >
              {/* Left Column: Client Details */}
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                    {lead.id}
                  </span>
                  <h3 className="font-extrabold text-slate-800 text-base tracking-tight truncate">
                    {lead.name}
                  </h3>
                  {lead.leadQuality && (
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border uppercase tracking-wider ${
                        lead.leadQuality === "Hot"
                          ? "bg-rose-50 text-rose-700 border-rose-100"
                          : lead.leadQuality === "Warm"
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : "bg-slate-50 text-slate-600 border-slate-100"
                      }`}
                    >
                      {lead.leadQuality}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-1 gap-x-4 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5 truncate">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{lead.project}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Created: {lead.createdDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      Claimed: {lead.claimedBy || "Unassigned"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Status & Timeline redirect */}
              <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto border-t border-slate-100 pt-3.5 md:pt-0 md:border-t-0 shrink-0">
                <div className="text-left md:text-right">
                  {/* Premium Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${
                      lead.status === "Completed"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : lead.status === "Not Interested"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : lead.status === "Token Done" || lead.status === "Booking Done"
                        ? "bg-purple-50 text-purple-700 border border-purple-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        lead.status === "Completed"
                          ? "bg-emerald-600"
                          : lead.status === "Not Interested"
                          ? "bg-rose-600"
                          : lead.status === "Token Done" || lead.status === "Booking Done"
                          ? "bg-purple-600"
                          : "bg-blue-600 animate-pulse"
                      }`}
                    ></span>
                    {lead.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                    Updated: {lead.statusUpdatedDate}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 hidden md:block group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl py-12 px-4 text-center space-y-2">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No Leads Found</p>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Try adjusting your query, project selection, status filters, or quality tags.
            </p>
          </div>
        )}
      </div>

      {/* Slide-over details drawer modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-end z-50 text-left">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col animate-slide-in overflow-hidden relative">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded border border-slate-300">
                  {selectedLead.id}
                </span>
                <h3 className="font-extrabold text-slate-800 text-lg mt-1">{selectedLead.name}</h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                title="Close Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6">
              {/* Contact Actions Row */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 text-xs font-bold py-2.5 px-4 rounded-xl text-slate-700 transition-all flex-1 justify-center"
                >
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>Call Sourcing</span>
                </a>
                <a
                  href={`https://wa.me/${selectedLead.phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 text-xs font-bold py-2.5 px-4 rounded-xl text-slate-700 transition-all flex-1 justify-center"
                >
                  <MessageSquare className="w-4.5 h-4.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
                {selectedLead.email && (
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="flex items-center gap-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 border border-slate-200 text-xs font-bold py-2.5 px-4 rounded-xl text-slate-700 transition-all flex-1 justify-center"
                  >
                    <Mail className="w-4 h-4 text-rose-500" />
                    <span>Email</span>
                  </a>
                )}
              </div>

              {/* Core Journey Timeline Component */}
              <Timeline lead={selectedLead} />

              {/* Lead Information Card */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-3">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-1">
                  Metadata Profiles
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <span className="text-slate-400 font-medium">Sourcing Project:</span>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedLead.project}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Registered By:</span>
                    <p className="font-bold text-slate-800 mt-0.5">
                      {selectedLead.createdBy} ({selectedLead.createdByRole})
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Assigned Executive:</span>
                    <p className="font-bold text-slate-800 mt-0.5">
                      {selectedLead.claimedBy || "Awaiting Assignment"}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Registration Date:</span>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedLead.createdDate}</p>
                  </div>
                </div>
              </div>

              {/* Edit client details (Receptionist & Admin only) */}
              {["Receptionist", "Builder Admin"].includes(role) && (
                <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Edit Client Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase">
                        Client Name
                      </label>
                      <input
                        type="text"
                        value={editClientName}
                        onChange={(e) => setEditClientName(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={editClientPhone}
                        onChange={(e) => setEditClientPhone(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={editClientEmail}
                        onChange={(e) => setEditClientEmail(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:bg-white focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={handleSaveClientDetails}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 rounded-lg transition-all"
                    >
                      Save Contact Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Assign Sales Executive Panel (Receptionist / Manager / Admin only) */}
              {["Receptionist", "Manager", "Builder Admin"].includes(role) &&
                selectedLead.status !== "Completed" &&
                selectedLead.status !== "Not Interested" && (
                  <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                      <UserCog className="w-4 h-4 text-blue-600" />
                      Assign Designated Sales Executive
                    </h4>
                    <div className="space-y-3">
                      <select
                        value={selectedAssigneeId}
                        onChange={(e) => setSelectedAssigneeId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold focus:bg-white focus:outline-none"
                      >
                        <option value="">Choose Executive...</option>
                        {users
                          .filter((u) => u.role === "Sales Executive" && u.status === "Active")
                          .map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.name}
                            </option>
                          ))}
                      </select>
                      <button
                        disabled={!selectedAssigneeId}
                        onClick={handleAssignSalesExecutive}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white text-xs font-bold py-2 rounded-lg transition-all"
                      >
                        Confirm Assignment & Confirm Visit
                      </button>
                    </div>
                  </div>
                )}

              {/* Lead Quality Classification (SE / Manager / Admin only) */}
              {["Sales Executive", "Manager", "Builder Admin"].includes(role) && (
                <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <Tag className="w-4 h-4 text-amber-500" />
                    Classify Sourcing Lead Quality
                  </h4>
                  <div className="flex gap-2">
                    {["Hot", "Warm", "Cold"].map((q) => (
                      <button
                        key={q}
                        onClick={() => setSelectedNewQuality(q as LeadQuality)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                          selectedNewQuality === q
                            ? q === "Hot"
                              ? "bg-rose-50 text-rose-700 border-rose-300"
                              : q === "Warm"
                              ? "bg-amber-50 text-amber-700 border-amber-300"
                              : "bg-slate-100 text-slate-700 border-slate-300"
                            : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                  {selectedNewQuality !== selectedLead.leadQuality && (
                    <button
                      onClick={handleUpdateQuality}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 rounded-lg transition-all"
                    >
                      Update Quality Tag
                    </button>
                  )}
                </div>
              )}

              {/* CRM Billing & Payment section (CRM & Admin only) */}
              {["CRM", "Builder Admin"].includes(role) && (
                <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-4.5 h-4.5" />
                    Unit Allocation & Payment Tracking
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase">
                        Allocated Unit Details
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Block A - 402"
                        value={crmUnitDetails}
                        onChange={(e) => setCrmUnitDetails(e.target.value)}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase">
                          Payment Received (₹)
                        </label>
                        <input
                          type="number"
                          placeholder="Amount in ₹"
                          value={crmPaymentReceived}
                          onChange={(e) => setCrmPaymentReceived(e.target.value)}
                          className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase">
                          Pending Payment (₹)
                        </label>
                        <input
                          type="number"
                          placeholder="Amount in ₹"
                          value={crmPaymentPending}
                          onChange={(e) => setCrmPaymentPending(e.target.value)}
                          className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Authorized Status Transitions Section */}
              {permittedNextAllowed.length > 0 && (
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-blue-800 uppercase tracking-widest flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    Authorized Journey Transition Action
                  </h4>

                  <div className="space-y-2">
                    <textarea
                      placeholder="Add system audit notes for this transition..."
                      value={transitionNotes}
                      onChange={(e) => setTransitionNotes(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 h-16 text-slate-700"
                    />

                    <div className="flex flex-col gap-2">
                      {permittedNextAllowed.map((status) => (
                        <button
                          key={status}
                          onClick={() => handleTransitionStatus(status)}
                          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-between group ${
                            status === "Not Interested"
                              ? "bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100"
                              : "bg-blue-600 hover:bg-blue-500 text-white"
                          }`}
                        >
                          <span>Move Journey Status to: {status}</span>
                          <ChevronRight className="w-4 h-4 text-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
