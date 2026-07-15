import React from "react";
import { Project } from "../types";
import { MOCK_PROJECTS } from "../mockData";
import { MapPin, Building, Sparkles, CheckCircle } from "lucide-react";

export default function ProjectsView() {
  return (
    <div className="space-y-6 text-left">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-800">Casagrand Projects</h2>
        <p className="text-xs text-slate-500">
          Browse luxury inventory currently active for channel partner sourcing and registration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {MOCK_PROJECTS.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col group"
          >
            {/* Project Image */}
            <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
              <img
                src={project.image}
                alt={project.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3 bg-slate-900/85 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-xs">
                <Building className="w-3.5 h-3.5 text-amber-400" />
                <span>{project.unitsAvailable} Units Available</span>
              </div>
            </div>

            {/* Project Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{project.location}</span>
                </div>
                <h3 className="font-bold text-slate-800 text-base tracking-tight leading-tight group-hover:text-blue-700 transition-colors">
                  {project.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{project.type}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Starting Price</p>
                  <p className="text-sm font-black text-amber-600">{project.priceRange}</p>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-100">
                  Active
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
