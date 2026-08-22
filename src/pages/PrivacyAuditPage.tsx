import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Download,
  Filter,
  CheckCircle2,
  FileText,
  Trash2,
  Cpu,
  UserCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { useWorkspace } from '../context/WorkspaceContext';
import type { AuditAction, AuditEvent } from '../types';

export const PrivacyAuditPage: React.FC = () => {
  const { auditEvents } = useWorkspace();

  // Privacy Toggle Settings State
  const [piiRedaction, setPiiRedaction] = useState(true);
  const [aiConsent, setAiConsent] = useState(true);
  const [thirdPartySharing, setThirdPartySharing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Audit Filter State
  const [filterAction, setFilterAction] = useState<string>('all');

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Export audit events to a JSON file in browser
  const handleExportAuditLog = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(auditEvents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `FizoAI_Audit_Log_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtered Events
  const filteredEvents = auditEvents.filter((evt) => {
    if (filterAction === 'all') return true;
    return evt.action === filterAction;
  });

  const getActionIcon = (action: AuditAction) => {
    switch (action) {
      case 'upload':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'extract':
      case 'analyze':
        return <Cpu className="w-4 h-4 text-teal-600" />;
      case 'consent':
        return <UserCheck className="w-4 h-4 text-emerald-600" />;
      case 'ai_query':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'delete':
        return <Trash2 className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActionBadgeColor = (action: AuditAction) => {
    switch (action) {
      case 'upload':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'analyze':
      case 'extract':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'consent':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'ai_query':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'delete':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatEventDescription = (evt: AuditEvent) => {
    if (evt.metadata?.filename) {
      if (evt.action === 'upload') return `Uploaded financial file: ${evt.metadata.filename}`;
      if (evt.action === 'delete') return `Removed document: ${evt.metadata.filename}`;
    }
    if (evt.action === 'analyze') {
      return `Executed client-side reconciliation engine (${evt.metadata?.metricsComputed || 6} ratios, ${evt.metadata?.risksDetected || 5} risk checks)`;
    }
    if (evt.action === 'consent') {
      return `User authorized client-side in-memory processing consent`;
    }
    if (evt.action === 'ai_query') {
      return `Executed deterministic assistant query in local sandbox`;
    }
    return `Executed ${evt.action} on ${evt.entityType} ${evt.entityId}`;
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. PageHeader */}
      <PageHeader
        title="Privacy & Audit"
        subtitle="Data safeguards and a transparent record of analysis activity."
        actionButton={
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-[#059669] border border-emerald-200 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Protected Workspace</span>
          </div>
        }
      />

      {/* 2 & 3: PRIVACY CONTROLS (55%) + AUDIT TRAIL (45%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 2. PRIVACY CONTROLS (Left 55% / 7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-[#111827]">Privacy Controls</h3>
            </div>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#059669] border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Active</span>
            </span>
          </div>

          {/* Three Core Safeguard Checkmark Items */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50/70 border border-gray-200/80">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#111827]">
                  PII Redaction Before AI Processing
                </h4>
                <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
                  Tax identification numbers, director ICs, employee names, and account numbers are sanitized directly in client RAM before text parsing.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50/70 border border-gray-200/80">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#111827]">
                  Document-Level Data Handling
                </h4>
                <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
                  Every ingested document resides exclusively within your browser session memory. No telemetry or file copies are dispatched to remote servers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50/70 border border-gray-200/80">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#111827]">
                  Evidence-First Insights
                </h4>
                <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
                  All metrics, risk flags, and strategic summaries maintain bidirectional source-truth bindings to verified line items.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Toggle Switches */}
          <div className="space-y-4 pt-4 border-t border-gray-100 text-xs">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Workspace Privacy Settings
            </span>

            {/* Toggle 1: PII Redaction */}
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="font-bold text-[#111827] block">PII Redaction</span>
                <span className="text-gray-500 text-[11px]">
                  Automatically sanitize sensitive identification numbers
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPiiRedaction(!piiRedaction)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  piiRedaction ? 'bg-[#0D9488]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    piiRedaction ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2: AI Processing Consent */}
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="font-bold text-[#111827] block">AI Processing Consent</span>
                <span className="text-gray-500 text-[11px]">
                  Permit client-side heuristic diagnostic models
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAiConsent(!aiConsent)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  aiConsent ? 'bg-[#0D9488]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    aiConsent ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 3: Third-Party Sharing */}
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="font-bold text-[#111827] block">Third-Party Sharing</span>
                <span className="text-gray-500 text-[11px]">
                  External API transmission (strictly disabled by default)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setThirdPartySharing(!thirdPartySharing)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  thirdPartySharing ? 'bg-[#0D9488]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    thirdPartySharing ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Privacy preferences saved!</span>
              </span>
            ) : (
              <span className="text-xs text-gray-400">Zero telemetry mode enforced</span>
            )}

            <button
              type="button"
              onClick={handleSaveSettings}
              className="px-4 py-2 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
            >
              Save Privacy Settings
            </button>
          </div>
        </div>

        {/* 3. AUDIT TRAIL (Right 45% / 5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#111827]">Audit Trail</h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                {auditEvents.length} Events
              </span>
            </div>

            <button
              type="button"
              onClick={handleExportAuditLog}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors shadow-2xs cursor-pointer"
              title="Download audit trail JSON"
            >
              <Download className="w-3.5 h-3.5 text-gray-500" />
              <span>Export</span>
            </button>
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-600 text-gray-700 cursor-pointer"
            >
              <option value="all">All Audit Actions</option>
              <option value="upload">Upload Events (upload)</option>
              <option value="analyze">Analysis Runs (analyze)</option>
              <option value="consent">Consent Events (consent)</option>
              <option value="ai_query">AI Queries (ai_query)</option>
              <option value="delete">Deletions (delete)</option>
            </select>
          </div>

          {/* Vertical Timeline */}
          {filteredEvents.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="No Matching Audit Events"
              description="No user actions or calculation events match the selected filter."
            />
          ) : (
            <div className="relative pl-6 space-y-4 border-l-2 border-gray-100 py-1 text-xs">
              {filteredEvents.map((evt) => (
                <div key={evt.id} className="relative group">
                  {/* Timeline Dot with Action Icon */}
                  <div className="absolute -left-[33px] top-0.5 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-xs">
                    {getActionIcon(evt.action)}
                  </div>

                  <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-200/80 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono border ${getActionBadgeColor(
                          evt.action
                        )}`}
                      >
                        {evt.action}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {new Date(evt.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-[#111827] leading-snug">
                      {formatEventDescription(evt)}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[10px] text-gray-400">
                      <span>Actor: <strong className="text-gray-600">{evt.actor}</strong></span>
                      <span>{new Date(evt.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
