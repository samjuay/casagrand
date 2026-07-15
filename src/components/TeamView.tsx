import React, { useState } from "react";
import { User, UserRole } from "../types";
import { Plus, UserCheck, ShieldAlert, Phone, Mail, ToggleLeft, ToggleRight, Edit2, X, PlusCircle } from "lucide-react";

interface TeamViewProps {
  users: User[];
  currentUser: User;
  onUpdateUsers: (updatedUsers: User[]) => void;
}

export default function TeamView({ users, currentUser, onUpdateUsers }: TeamViewProps) {
  const role = currentUser.role;

  // Add agent form toggle
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState<UserRole>("FoS");
  const [formAgency, setFormAgency] = useState("");

  // Get users managed by the current acting role
  const getManagedUsers = (): User[] => {
    switch (role) {
      case "CP Admin":
        // CP Admin manages FoS under their agency
        return users.filter((u) => u.role === "FoS");
      case "Manager":
        // Manager manages Sales Executives
        return users.filter((u) => u.role === "Sales Executive");
      case "Builder Admin":
        // Builder Admin manages Managers, Sales Executives, Receptionists, and CRMs
        return users.filter((u) => u.role !== "Builder Admin");
      default:
        return [];
    }
  };

  const managedUsers = getManagedUsers();

  // Handle Create or Update User
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName || !formPhone || !formEmail) {
      alert("Please populate all fields");
      return;
    }

    if (editingUser) {
      // Edit mode
      const updated = users.map((u) => {
        if (u.id === editingUser.id) {
          return {
            ...u,
            name: formName,
            phone: formPhone,
            email: formEmail,
            role: formRole,
            agency: formAgency || undefined,
          };
        }
        return u;
      });
      onUpdateUsers(updated);
      alert("User details successfully updated.");
    } else {
      // Add mode
      const newUser: User = {
        id: `USR-${Math.floor(100 + Math.random() * 900)}`,
        name: formName,
        phone: formPhone,
        email: formEmail,
        role: role === "CP Admin" ? "FoS" : role === "Manager" ? "Sales Executive" : formRole,
        status: "Active",
        agency: role === "CP Admin" ? currentUser.agency : formAgency || undefined,
      };

      onUpdateUsers([...users, newUser]);
      alert("New team member successfully registered.");
    }

    // Reset Form
    setShowAddForm(false);
    setEditingUser(null);
    resetFormFields();
  };

  const resetFormFields = () => {
    setFormName("");
    setFormPhone("");
    setFormEmail("");
    setFormRole("FoS");
    setFormAgency("");
  };

  // Toggle user status (Activate / Deactivate)
  const handleToggleStatus = (targetUser: User) => {
    const updated = users.map((u) => {
      if (u.id === targetUser.id) {
        return {
          ...u,
          status: u.status === "Active" ? ("Inactive" as const) : ("Active" as const),
        };
      }
      return u;
    });
    onUpdateUsers(updated);
    alert(`Member ${targetUser.name} status updated.`);
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormPhone(user.phone);
    setFormEmail(user.email);
    setFormRole(user.role);
    setFormAgency(user.agency || "");
    setShowAddForm(true);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800">
            {role === "CP Admin" ? "Manage FoS Agents" : role === "Manager" ? "Manage Sales Team" : "Team & User Profiles"}
          </h2>
          <p className="text-xs text-slate-500">
            {role === "CP Admin"
              ? "Oversee registration, activity logs, and status locks of Feet on Street agents."
              : "Provision accounts, audit system roles, and toggle platform access."}
          </p>
        </div>

        <button
          onClick={() => {
            setEditingUser(null);
            resetFormFields();
            setShowAddForm(true);
          }}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-3.5 rounded-lg shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Add / Edit Form Modal Dialog */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingUser(null);
              }}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-1.5">
              <PlusCircle className="w-5 h-5 text-blue-600" />
              {editingUser ? `Edit details: ${editingUser.name}` : "Register New Team Member"}
            </h3>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-400 font-bold mb-1 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sen"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1 uppercase">Mobile Phone</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul@agency.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-none"
                />
              </div>

              {role === "Builder Admin" && (
                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase">System Role</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="Manager">Manager</option>
                    <option value="Sales Executive">Sales Executive</option>
                    <option value="Receptionist">Receptionist</option>
                    <option value="CRM">CRM</option>
                    <option value="CP Admin">Channel Partner Admin</option>
                    <option value="FoS">Feet on Street</option>
                  </select>
                </div>
              )}

              {role === "Builder Admin" && (
                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase">Brokerage Agency / Affiliation</label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Realty (Leave empty for Casagrand Staff)"
                    value={formAgency}
                    onChange={(e) => setFormAgency(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-none"
                  />
                </div>
              )}

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingUser(null);
                  }}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 py-2.5 rounded-lg text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-center font-bold"
                >
                  {editingUser ? "Save Details" : "Register Agent"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Team directory list */}
      <div className="space-y-4">
        {managedUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left shadow-xs hover:border-slate-300 transition-all"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-800 text-base">{user.name}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  user.status === "Active"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-rose-50 text-rose-700 border-rose-200"
                }`}>
                  {user.status}
                </span>
                {user.role && role === "Builder Admin" && (
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded">
                    {user.role}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-semibold">{user.agency || "Internal Corporate Staff"}</p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium pt-1.5">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {user.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {user.email}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 border-t border-slate-50 pt-3 sm:pt-0 sm:border-t-0">
              <button
                onClick={() => handleEditClick(user)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1 text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 py-1.5 px-3 rounded-lg transition-all"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => handleToggleStatus(user)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1 text-xs font-bold py-1.5 px-3 rounded-lg border transition-all ${
                  user.status === "Active"
                    ? "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
                    : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                }`}
              >
                {user.status === "Active" ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}

        {managedUsers.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl py-12 text-center text-xs text-slate-400">
            No registered staff managed under your current profile.
          </div>
        )}
      </div>
    </div>
  );
}
