import React, { useState, useEffect } from "react";
import { User, Lead, LeadStatus, LeadQuality } from "./types";
import { MOCK_USERS, MOCK_LEADS } from "./mockData";
import RoleSwitcher from "./components/RoleSwitcher";
import Header from "./components/Header";
import Sidebar, { getNavigationTabs } from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import DashboardView from "./components/DashboardView";
import LeadsView from "./components/LeadsView";
import ProjectsView from "./components/ProjectsView";
import TeamView from "./components/TeamView";
import ChannelPartnersView from "./components/ChannelPartnersView";
import ContactBuilder from "./components/ContactBuilder";
import ProfileView from "./components/ProfileView";
import AddLeadModal from "./components/AddLeadModal";
import LoginView from "./components/LoginView";
import { AlertCircle, CheckCircle, HelpCircle, ShieldCheck, X, Sparkles, Download } from "lucide-react";

export default function App() {
  // Hydrate users state from localStorage or mockData
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("CG_CRM_USERS");
    return saved ? JSON.parse(saved) : MOCK_USERS;
  });

  // Hydrate leads state from localStorage or mockData
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem("CG_CRM_LEADS");
    return saved ? JSON.parse(saved) : MOCK_LEADS;
  });

  // Hydrate logged-in userId state from localStorage or default USR-001 (Builder Admin)
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem("CG_CRM_CURRENT_USER_ID") || "USR-001";
  });

  // Track if the user is authenticated in the session
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("CG_CRM_IS_LOGGED_IN") === "true";
  });

  // Current logged in user object
  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  // Active view tab state (default to Dashboard)
  const [activeTab, setActiveTab] = useState<string>("Dashboard");

  // Dynamic filter state passed from Dashboard stat cards to Leads view
  const [initialStatusFilter, setInitialStatusFilter] = useState<string | null>(null);
  const [initialQualityFilter, setInitialQualityFilter] = useState<string | null>(null);

  // Modal & Mobile layout toggles
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // PWA installation prompt reference and installable states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isInstallDismissed, setIsInstallDismissed] = useState<boolean>(() => {
    return localStorage.getItem("CG_CRM_INSTALL_DISMISSED") === "true";
  });

  // Catch PWA beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log("[PWA] Captured beforeinstallprompt event");
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      console.log("[PWA] App installed successfully");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] Install user choice outcome: ${outcome}`);
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const handleDismissInstall = () => {
    setIsInstallDismissed(true);
    localStorage.setItem("CG_CRM_INSTALL_DISMISSED", "true");
  };

  // Sync state changes with local storage for robust persistence
  useEffect(() => {
    localStorage.setItem("CG_CRM_USERS", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("CG_CRM_LEADS", JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem("CG_CRM_CURRENT_USER_ID", currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem("CG_CRM_IS_LOGGED_IN", isLoggedIn ? "true" : "false");
  }, [isLoggedIn]);

  // Handle active tab validation when roles are switched
  const handleUserChange = (user: User) => {
    setCurrentUserId(user.id);
    setMobileMenuOpen(false);

    // Get the valid tabs list for the newly switched role
    const allowedTabs = getNavigationTabs(user.role).map((t) => t.name);

    // If activeTab is not permitted for the new role, redirect to Dashboard
    if (allowedTabs.includes("Dashboard")) {
      setActiveTab("Dashboard");
    } else if (allowedTabs.length > 0) {
      setActiveTab(allowedTabs[0]);
    }
  };

  // Callback to set specific filters from Dashboard stat cards
  const handleSetLeadFilter = (status: string | null, quality: string | null) => {
    setInitialStatusFilter(status);
    setInitialQualityFilter(quality);
  };

  const handleClearInitialFilters = () => {
    setInitialStatusFilter(null);
    setInitialQualityFilter(null);
  };

  // Add lead handler
  const handleAddLead = (newLead: Lead) => {
    setLeads([newLead, ...leads]);
  };

  // Update lead handler (status progression or details edit)
  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads(leads.map((l) => (l.id === updatedLead.id ? updatedLead : l)));
  };

  // Sales Executive: Claim Lead Action
  const handleClaimLead = (leadId: string) => {
    const targetLead = leads.find((l) => l.id === leadId);
    if (!targetLead) return;

    const dateToday = new Date().toISOString().split("T")[0];
    const updated: Lead = {
      ...targetLead,
      claimedById: currentUser.id,
      claimedBy: currentUser.name,
      status: "Assigned To Sales Executive",
      statusUpdatedDate: dateToday,
      history: [
        ...targetLead.history,
        {
          id: `H-CLM-${Math.random().toString(36).substr(2, 5)}`,
          status: "Assigned To Sales Executive",
          updatedAt: dateToday,
          updatedBy: `${currentUser.role} - ${currentUser.name}`,
          notes: "Lead accepted and claimed by designated Sales Executive.",
        },
      ],
    };

    handleUpdateLead(updated);
    alert("Lead claimed successfully. You are now the assigned Sales Executive.");
  };

  // Sales Executive: Reject Lead Action
  const handleRejectLead = (leadId: string) => {
    const targetLead = leads.find((l) => l.id === leadId);
    if (!targetLead) return;

    const dateToday = new Date().toISOString().split("T")[0];
    const updated: Lead = {
      ...targetLead,
      claimedById: null,
      claimedBy: null,
      status: "Visit Confirmed", // revert to visit confirmed for receptionist to assign someone else
      statusUpdatedDate: dateToday,
      history: [
        ...targetLead.history,
        {
          id: `H-REJ-${Math.random().toString(36).substr(2, 5)}`,
          status: "Visit Confirmed",
          updatedAt: dateToday,
          updatedBy: `${currentUser.role} - ${currentUser.name}`,
          notes: "Lead assignment rejected by executive. Reverted to Visit Confirmed.",
        },
      ],
    };

    handleUpdateLead(updated);
    alert("Assignment rejected. Lead is now back in the reception queue for re-assignment.");
  };

  // Logout/Reset back to Role Switcher panel
  const handleLogout = () => {
    alert("You have logged out from your current session.");
    setIsLoggedIn(false);
  };

  // If not logged in, render the login view instead of the system panels
  if (!isLoggedIn) {
    return (
      <LoginView
        users={users}
        onLogin={(user) => {
          setCurrentUserId(user.id);
          setIsLoggedIn(true);
          // Auto route to first allowed view tab for the role
          const allowedTabs = getNavigationTabs(user.role).map((t) => t.name);
          if (allowedTabs.includes("Dashboard")) {
            setActiveTab("Dashboard");
          } else if (allowedTabs.length > 0) {
            setActiveTab(allowedTabs[0]);
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden select-none">
      
      {/* Simulation/Review Mode Ribbon */}
      <RoleSwitcher
        users={users}
        currentUser={currentUser}
        onUserChange={handleUserChange}
      />

      {/* Main Corporate Header */}
      <Header
        currentUser={currentUser}
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      {/* PWA Install Promo Banner */}
      {isInstallable && !isInstallDismissed && (
        <div className="bg-slate-900 text-white px-4 py-3 text-left shadow-md flex items-center justify-between gap-4 animate-fade-in z-45 relative border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="p-1.5 bg-blue-500/10 rounded-lg hidden sm:inline-block border border-blue-500/20 shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </span>
            <div>
              <p className="text-xs sm:text-sm font-bold tracking-tight">Install Casagrand CRM</p>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium leading-tight">Add to your home screen for clean fullscreen standalone layout, safe areas, and robust offline operations.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallApp}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black py-1.5 px-3 rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1 uppercase tracking-wider"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
            <button
              onClick={handleDismissInstall}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Center Layout Panel */}
      <div className="flex flex-1 relative min-h-0">
        
        {/* Left Sidebar (Desktop Viewport) */}
        <Sidebar
          currentUser={currentUser}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setMobileMenuOpen(false);
          }}
          onLogout={handleLogout}
          isInstallable={isInstallable}
          onInstall={handleInstallApp}
          leadsCount={
            currentUser.role === "FoS"
              ? leads.filter((l) => l.createdBy === currentUser.name).length
              : currentUser.role === "Sales Executive"
              ? leads.filter((l) => l.claimedById === currentUser.id).length
              : leads.length
          }
        />

        {/* Mobile Hamburger Navigation Menu Panel (Overlay style) */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Dark background clickout */}
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            ></div>

            {/* Sidebar content container */}
            <div className="relative w-64 bg-slate-950 text-slate-300 flex flex-col h-full shadow-2xl z-10 p-5 text-left animate-slide-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <span className="font-extrabold text-white text-base tracking-tight">Navigation</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 hover:bg-slate-800 rounded-lg text-slate-400"
                  title="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation list */}
              <nav className="flex-1 space-y-1.5">
                {getNavigationTabs(currentUser.role).map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.name;

                  return (
                    <button
                      key={tab.name}
                      onClick={() => {
                        setActiveTab(tab.name);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-amber-500 text-slate-950 shadow-md"
                          : "text-slate-400 hover:text-white hover:bg-slate-900"
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>

              {/* PWA Install Button in Drawer */}
              {isInstallable && (
                <div className="px-3 pt-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleInstallApp();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-amber-400 bg-slate-900 border border-amber-500/20 hover:bg-slate-850 hover:text-amber-300 transition-colors duration-150 font-bold"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>Install CRM Mobile App</span>
                  </button>
                </div>
              )}

              {/* Switch Account */}
              <div className="border-t border-slate-800 pt-4">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-rose-400 hover:bg-rose-950/20 font-bold"
                >
                  <X className="w-4 h-4" />
                  <span>Logout / Reset Session</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Primary Content Area Container */}
        <main
          id="main-app-content"
          className="flex-1 overflow-y-auto px-4 py-6 md:p-8 max-w-7xl mx-auto w-full pb-20 md:pb-8 flex flex-col"
        >
          {/* Dynamic Tab Renderer */}
          <div className="flex-1">
            {activeTab === "Dashboard" && (
              <DashboardView
                leads={leads}
                currentUser={currentUser}
                users={users}
                onAddLeadClick={() => setShowAddLeadModal(true)}
                onTabChange={setActiveTab}
                onSetLeadFilter={handleSetLeadFilter}
                onClaimLead={handleClaimLead}
                onRejectLead={handleRejectLead}
              />
            )}

            {(activeTab === "Leads" || activeTab === "Clients") && (
              <LeadsView
                leads={leads}
                currentUser={currentUser}
                users={users}
                onUpdateLead={handleUpdateLead}
                onAddLeadClick={() => setShowAddLeadModal(true)}
                initialStatusFilter={initialStatusFilter}
                initialQualityFilter={initialQualityFilter}
                onClearInitialFilters={handleClearInitialFilters}
              />
            )}

            {activeTab === "Projects" && <ProjectsView />}

            {(activeTab === "FoS" || activeTab === "Sales Team" || activeTab === "Team") && (
              <TeamView
                users={users}
                currentUser={currentUser}
                onUpdateUsers={setUsers}
              />
            )}

            {activeTab === "Channel Partners" && (
              <ChannelPartnersView users={users} leads={leads} />
            )}

            {activeTab === "Contact Builder" && <ContactBuilder />}

            {activeTab === "Profile" && (
              <ProfileView
                currentUser={currentUser}
                onLogout={handleLogout}
                isInstallable={isInstallable}
                onInstall={handleInstallApp}
              />
            )}
          </div>
        </main>
      </div>

      {/* Sticky Bottom Navigation (Mobile Viewports Only) */}
      <BottomNav
        currentUser={currentUser}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setMobileMenuOpen(false);
        }}
      />

      {/* Universal Add Lead Modal Popup Form */}
      {showAddLeadModal && (
        <AddLeadModal
          currentUser={currentUser}
          onClose={() => setShowAddLeadModal(false)}
          onAddLead={handleAddLead}
        />
      )}
    </div>
  );
}
