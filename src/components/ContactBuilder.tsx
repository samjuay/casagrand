import React from "react";
import { PhoneCall, ShieldCheck, UserCheck } from "lucide-react";

export default function ContactBuilder() {
  return (
    <div className="max-w-md mx-auto py-8 px-4 text-center">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="relative w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <PhoneCall className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-800">Contact Casagrand Builder</h2>
          <p className="text-sm text-slate-500">
            Reach out directly to corporate representatives for channel partner assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-4">
          {/* Call Sourcing Manager */}
          <a
            href="tel:+919876543201"
            className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl transition-all group"
          >
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                  Call Sourcing Manager
                </p>
                <p className="text-xs text-slate-400">Escalations, inventory & approval assistance</p>
              </div>
            </div>
            <PhoneCall className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:scale-110 transition-all" />
          </a>

          {/* Call Manager */}
          <a
            href="tel:+919876543202"
            className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl transition-all group"
          >
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                  Call Manager
                </p>
                <p className="text-xs text-slate-400">Regular visits, claims & status assistance</p>
              </div>
            </div>
            <PhoneCall className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:scale-110 transition-all" />
          </a>
        </div>
      </div>
    </div>
  );
}
