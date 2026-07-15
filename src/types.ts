export type UserRole =
  | "Builder Admin"
  | "Manager"
  | "Receptionist"
  | "Sales Executive"
  | "CRM"
  | "CP Admin"
  | "FoS";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  email: string;
  status: "Active" | "Inactive";
  agency?: string;
  earnings?: number; // for CP Admin
}

export type LeadStatus =
  | "Lead Created"
  | "Waiting For Visit"
  | "Visit Confirmed"
  | "Assigned To Sales Executive"
  | "Site Visit Done"
  | "Token Done"
  | "Booking Done"
  | "Agreement Pending"
  | "Agreement Done"
  | "Brokerage Pending"
  | "Brokerage Released"
  | "Completed"
  | "Not Interested";

export type LeadQuality = "Hot" | "Warm" | "Cold";

export interface AuditLog {
  id: string;
  status: LeadStatus;
  updatedAt: string;
  updatedBy: string; // "Role - Name"
  notes: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: LeadStatus;
  statusUpdatedDate: string;
  createdDate: string;
  createdBy: string; // Name of person
  createdByRole: UserRole;
  claimedBy: string | null; // Name of Sales Executive
  claimedById: string | null; // ID of Sales Executive
  leadQuality: LeadQuality | null;
  project: string;
  history: AuditLog[];
  // Client details (e.g. flat number, booking details etc. can be stored if edited by Receptionist or CRM)
  unitDetails?: string;
  paymentReceived?: number;
  paymentPending?: number;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  priceRange: string;
  type: string;
  unitsAvailable: number;
  image: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}
