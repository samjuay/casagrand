import React, { useState, useEffect } from "react";
import { X, Download, Smartphone, Monitor, Share2, MoreVertical, PlusSquare, Check, Sparkles, HelpCircle } from "lucide-react";

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onInstall: () => void;
}

export default function PWAInstallModal({
  isOpen,
  onClose,
  deferredPrompt,
  onInstall,
}: PWAInstallModalProps) {
  const [activeTab, setActiveTab] = useState<"android" | "ios" | "desktop">("android");
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Auto-detect OS on mount to set initial tab
  useEffect(() => {
    const ua = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(ua)) {
      setActiveTab("ios");
    } else if (/Android/.test(ua)) {
      setActiveTab("android");
    } else {
      setActiveTab("desktop");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCloseAndRemember = () => {
    if (dontShowAgain) {
      localStorage.setItem("CG_CRM_INSTALL_MODAL_NEVER_SHOW", "true");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in" id="pwa-install-modal-overlay">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-scale-in text-left flex flex-col max-h-[90vh]">
        
        {/* Header with Background Pattern */}
        <div className="bg-slate-900 text-white p-6 relative overflow-hidden shrink-0">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
          
          <button
            onClick={handleCloseAndRemember}
            className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 relative z-10">
            <span className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-black tracking-tight">Install Casagrand CRM</h3>
              <p className="text-xs text-slate-400 font-medium leading-normal">Access your unified operational hub with native speeds, safearas, and offline support.</p>
            </div>
          </div>
        </div>

        {/* Content Area - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Main Direct Action Block */}
          {deferredPrompt ? (
            <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-5 space-y-3.5">
              <div className="flex items-start gap-3">
                <span className="p-2 bg-amber-100 rounded-xl text-amber-800 shrink-0">
                  <Download className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">One-Click Direct Installation</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Your device fully supports direct automatic app installation. Tap the button below to install instantly.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  onInstall();
                  onClose();
                }}
                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black tracking-wider uppercase shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-4.5 h-4.5" />
                <span>Install CRM App Now</span>
              </button>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 flex gap-3 text-xs text-slate-600">
              <HelpCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">Direct installation not available?</p>
                <p className="mt-0.5 leading-relaxed">
                  No worries! You can easily install the app manually in less than 10 seconds using your browser's native options below.
                </p>
              </div>
            </div>
          )}

          {/* OS Selector Tabs */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Manual Installation Instructions</label>
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
              <button
                onClick={() => setActiveTab("android")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "android"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android / Chrome</span>
              </button>
              <button
                onClick={() => setActiveTab("ios")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "ios"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-blue-500" />
                <span>iOS / Safari</span>
              </button>
              <button
                onClick={() => setActiveTab("desktop")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "desktop"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>PC / Laptop</span>
              </button>
            </div>

            {/* Instruction Panels */}
            <div className="p-1">
              {activeTab === "android" && (
                <div className="space-y-3.5 animate-fade-in">
                  <p className="text-xs text-slate-500 font-medium">To install Casagrand CRM on your Android device using Google Chrome:</p>
                  <ol className="space-y-3">
                    <li className="flex gap-3 items-start text-xs text-slate-700">
                      <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-600 shrink-0 mt-0.5">1</span>
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900">Open Browser Options</span>
                        <p className="text-slate-500 leading-normal">
                          Tap the <span className="font-bold text-slate-800 inline-flex items-center gap-0.5 px-1 bg-slate-100 rounded border border-slate-200">menu button <MoreVertical className="w-3 h-3 inline" /></span> (three vertical dots) in the top-right corner of Chrome.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3 items-start text-xs text-slate-700">
                      <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-600 shrink-0 mt-0.5">2</span>
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900">Select Install Option</span>
                        <p className="text-slate-500 leading-normal">
                          Look down the menu list and tap <span className="font-bold text-slate-900 underline">"Install app"</span> or <span className="font-bold text-slate-900">"Add to Home screen"</span>.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3 items-start text-xs text-slate-700">
                      <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-600 shrink-0 mt-0.5">3</span>
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900">Confirm and Create App</span>
                        <p className="text-slate-500 leading-normal">
                          A prompt will appear. Confirm by tapping <span className="font-bold text-slate-900">"Install"</span> or <span className="font-bold text-slate-900">"Add"</span>. The app icon will be created on your phone home screen immediately.
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>
              )}

              {activeTab === "ios" && (
                <div className="space-y-3.5 animate-fade-in">
                  <p className="text-xs text-slate-500 font-medium">To install Casagrand CRM on your iPhone or iPad using Safari:</p>
                  <ol className="space-y-3">
                    <li className="flex gap-3 items-start text-xs text-slate-700">
                      <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-600 shrink-0 mt-0.5">1</span>
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900">Tap the Share Icon</span>
                        <p className="text-slate-500 leading-normal">
                          Tap the <span className="font-bold text-slate-800 inline-flex items-center gap-0.5 px-1 bg-slate-100 rounded border border-slate-200">Share button <Share2 className="w-3 h-3 inline text-blue-500" /></span> in the browser toolbar at the bottom.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3 items-start text-xs text-slate-700">
                      <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-600 shrink-0 mt-0.5">2</span>
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900">Choose 'Add to Home Screen'</span>
                        <p className="text-slate-500 leading-normal">
                          Scroll down the share sheet options and tap <span className="font-bold text-slate-800 inline-flex items-center gap-0.5 px-1 bg-slate-100 rounded border border-slate-200">"Add to Home Screen" <PlusSquare className="w-3.5 h-3.5 inline" /></span>.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3 items-start text-xs text-slate-700">
                      <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-600 shrink-0 mt-0.5">3</span>
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900">Done! Open full-screen</span>
                        <p className="text-slate-500 leading-normal">
                          Tap <span className="font-bold text-blue-600">"Add"</span> in the top-right corner. The Casagrand CRM app will instantly appear on your home screen ready to use!
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>
              )}

              {activeTab === "desktop" && (
                <div className="space-y-3.5 animate-fade-in">
                  <p className="text-xs text-slate-500 font-medium">To install on your PC/Mac or Laptop using Google Chrome, Edge or Brave:</p>
                  <ol className="space-y-3">
                    <li className="flex gap-3 items-start text-xs text-slate-700">
                      <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-600 shrink-0 mt-0.5">1</span>
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900">Locate URL Install Icon</span>
                        <p className="text-slate-500 leading-normal">
                          Look at the right side of the address bar at the top of your browser. You will see a small <span className="font-bold text-slate-800 inline-flex items-center gap-0.5 px-1 bg-slate-100 rounded border border-slate-200">Install icon <Download className="w-3 h-3 inline" /></span>.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3 items-start text-xs text-slate-700">
                      <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-600 shrink-0 mt-0.5">2</span>
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900">Click Install</span>
                        <p className="text-slate-500 leading-normal">
                          Click that icon and select <span className="font-bold text-slate-900">"Install"</span> from the confirmation bubble.
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 border-t border-slate-100 p-4 shrink-0 flex flex-col sm:flex-row justify-between items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded text-blue-600 border-slate-300 focus:ring-blue-500 w-4 h-4"
            />
            <span className="text-xs text-slate-500 font-bold">Don't show this popup again</span>
          </label>
          <button
            onClick={handleCloseAndRemember}
            className="w-full sm:w-auto py-2 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer text-center"
          >
            Got It, Close
          </button>
        </div>
      </div>
    </div>
  );
}
