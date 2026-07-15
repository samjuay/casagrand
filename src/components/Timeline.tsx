import React from "react";
import { Lead, LeadStatus, AuditLog } from "../types";
import { CheckCircle2, Circle, Clock, AlertTriangle, User, Calendar, MessageSquare } from "lucide-react";

interface TimelineProps {
  lead: Lead;
}

// Ordered list of positive flow statuses
const FLOW_STATUSES: LeadStatus[] = [
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

export default function Timeline({ lead }: TimelineProps) {
  const currentStatus = lead.status;
  const isNotInterested = currentStatus === "Not Interested";

  // Find index of the current status in the standard flow
  const currentIdx = FLOW_STATUSES.indexOf(currentStatus);

  return (
    <div className="space-y-6">
      {/* Lead Journey Vertical Timeline */}
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-slate-500" />
          Lead Journey Status
        </h4>

        {isNotInterested ? (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Not Interested</p>
              <p className="text-xs text-rose-600 mt-0.5">
                The lead has requested to terminate the active journey before booking.
              </p>
            </div>
          </div>
        ) : null}

        {/* Timeline Items */}
        <div className="relative pl-6 space-y-5">
          {/* Timeline Connector Line */}
          <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-200"></div>

          {FLOW_STATUSES.map((status, idx) => {
            let state: "completed" | "current" | "pending" | "canceled" = "pending";

            if (isNotInterested) {
              // If not interested, show whatever was completed prior to "Not Interested" (derived from history or currentIdx estimate, let's look at history)
              const wasCompleted = lead.history.some((h) => h.status === status);
              state = wasCompleted ? "completed" : "pending";
            } else {
              if (idx < currentIdx) {
                state = "completed";
              } else if (idx === currentIdx) {
                state = "current";
              } else {
                state = "pending";
              }
            }

            return (
              <div key={status} className="relative flex items-start gap-4 text-left">
                {/* Status Dot / Indicator */}
                <div className="absolute -left-6.5 mt-0.5 z-10 flex items-center justify-center bg-white rounded-full">
                  {state === "completed" ? (
                    <CheckCircle2 className="w-5.5 h-5.5 text-emerald-500 fill-emerald-50" />
                  ) : state === "current" ? (
                    <div className="relative flex items-center justify-center">
                      <span className="absolute inline-flex h-4.5 w-4.5 rounded-full bg-blue-400 opacity-75 animate-ping"></span>
                      <div className="relative rounded-full h-4.5 w-4.5 bg-blue-600 flex items-center justify-center">
                        <div className="h-1.5 w-1.5 bg-white rounded-full"></div>
                      </div>
                    </div>
                  ) : (
                    <Circle className="w-5.5 h-5.5 text-slate-300 bg-white" />
                  )}
                </div>

                {/* Status Details */}
                <div className="flex-1">
                  <p
                    className={`text-sm font-semibold transition-colors ${
                      state === "completed"
                        ? "text-slate-800"
                        : state === "current"
                        ? "text-blue-700 font-bold"
                        : "text-slate-400"
                    }`}
                  >
                    {status}
                  </p>

                  {state === "current" && (
                    <span className="inline-flex items-center text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-medium mt-1 uppercase tracking-wider">
                      Active State
                    </span>
                  )}

                  {/* Find history date if completed or current */}
                  {lead.history.find((h) => h.status === status) && (
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Completed on: {lead.history.find((h) => h.status === status)?.updatedAt}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {/* Render Not Interested as termination if active */}
          {isNotInterested && (
            <div className="relative flex items-start gap-4 text-left">
              <div className="absolute -left-6.5 mt-0.5 z-10 flex items-center justify-center bg-white rounded-full">
                <div className="rounded-full h-4.5 w-4.5 bg-rose-600 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-rose-700">Not Interested</p>
                <span className="inline-flex items-center text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-medium mt-1 uppercase tracking-wider">
                  Terminated Journey
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Updated on: {lead.statusUpdatedDate}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Internal Audit History Trail */}
      <div className="bg-white rounded-xl p-5 border border-slate-200">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Clock className="w-4 h-4 text-slate-600" />
          Internal Audit Trail ({lead.history.length})
        </h4>

        <div className="space-y-4">
          {lead.history
            .slice()
            .reverse()
            .map((log) => (
              <div
                key={log.id}
                className="p-3 bg-slate-50/50 rounded-lg border border-slate-100 text-left space-y-2"
              >
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span className="text-xs font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded-md shadow-xs">
                    {log.status}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                    <Calendar className="w-3 h-3" />
                    <span>{log.updatedAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>By: {log.updatedBy}</span>
                </div>

                {log.notes && (
                  <div className="flex items-start gap-1.5 text-xs text-slate-500 bg-white/70 p-1.5 rounded border border-slate-100 italic">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>"{log.notes}"</span>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
