import React, { useState } from "react";
import { User, Lead, LeadStatus, Project } from "../types";
import { MOCK_PROJECTS } from "../mockData";
import { PlusCircle, X, ClipboardPlus } from "lucide-react";

interface AddLeadModalProps {
  currentUser: User;
  onClose: () => void;
  onAddLead: (newLead: Lead) => void;
}

export default function AddLeadModal({
  currentUser,
  onClose,
  onAddLead,
}: AddLeadModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedProject, setSelectedProject] = useState(MOCK_PROJECTS[0].name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !email.trim()) {
      alert("Please populate all fields");
      return;
    }

    if (phone.length < 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    const dateToday = new Date().toISOString().split("T")[0];
    const newId = `CG-${Math.floor(1041 + Math.random() * 900)}`;

    const initialStatus: LeadStatus = "Lead Created";

    const newLead: Lead = {
      id: newId,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      status: initialStatus,
      statusUpdatedDate: dateToday,
      createdDate: dateToday,
      createdBy: currentUser.name,
      createdByRole: currentUser.role,
      claimedBy: null,
      claimedById: null,
      leadQuality: null,
      project: selectedProject,
      history: [
        {
          id: `H-INIT-${Math.random().toString(36).substr(2, 5)}`,
          status: initialStatus,
          updatedAt: dateToday,
          updatedBy: `${currentUser.role} - ${currentUser.name}`,
          notes: "Lead registered in Casagrand Channel Partner portal",
        },
      ],
    };

    onAddLead(newLead);
    alert(`Lead ${name} successfully registered with Reference ID: ${newId}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 text-left">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-1.5">
          <ClipboardPlus className="w-5 h-5 text-blue-600" />
          Register New Customer Lead
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
          <div>
            <label className="block text-slate-400 font-bold mb-1 uppercase">Customer Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Priyan Sen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1 uppercase">Mobile Number (10 Digits)</label>
            <input
              type="tel"
              required
              maxLength={10}
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => {
                // only digits
                const val = e.target.value.replace(/\D/g, "");
                setPhone(val);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1 uppercase">Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. priyan.sen@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1 uppercase">Interested Project</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-none cursor-pointer"
            >
              {MOCK_PROJECTS.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 py-2.5 rounded-lg text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-center font-bold"
            >
              Submit Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
