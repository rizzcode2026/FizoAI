import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  FileText,
  Clock,
  Info,
  CheckCircle2,
  Database,
  Calculator,
  Lightbulb,
  ChevronRight,
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { ConfidenceBadge } from '../components/ui/ConfidenceBadge';
import { EmptyState } from '../components/ui/EmptyState';
import { useWorkspace } from '../context/WorkspaceContext';
import { generateHeuristicInsight } from '../services/riskService';
import type { DataSource, AIInsight } from '../types';

export const InsightsPage: React.FC = () => {
  const { insights, metrics, risks, documents, loadDemo } = useWorkspace();
  const [activeEvidencePopover, setActiveEvidencePopover] = useState<{
    insightId: string;
    evidence: DataSource;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [localInsights, setLocalInsights] = useState<AIInsight[]>(insights);

  // Keep localInsights in sync with context
  React.useEffect(() => {
    setLocalInsights(insights);
  }, [insights]);

  const handleGenerateInsights = () => {
    setIsGenerating(true);
    setTimeout(() => {
      if (documents.length === 0 && metrics.length === 0) {
        loadDemo();
      } else {
        const synthesized = generateHeuristicInsight(metrics, risks, {
          period: 'FY2025',
        });
        setLocalInsights([synthesized]);
      }
      setIsGenerating(false);
    }, 800);
  };

  const hasData = localInsights.length > 0;

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'ai-generated':
        return {
          label: 'AI-Generated',
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      case 'manual':
        return {
          label: 'Manual Review',
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      default:
        return {
          label: 'Rule-Based',
          bg: 'bg-teal-50 text-teal-800 border-teal-200',
        };
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. PageHeader */}
      <PageHeader
        title="AI Insights & Strategic Actions"
        subtitle="Recommendations grounded in analysed documents, verified calculations, and PDPA-safe data streams."
      />

      {/* 2. RECOMMENDED MANAGEMENT ACTIONS */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#0D9488] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-[#111827]">
                Recommended Management Actions
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 ml-10.5">
              Prepared for executive decision-making
            </p>
          </div>

          <div className="flex items-center gap-3">
            {hasData ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#059669] border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{localInsights.length} Insight{localInsights.length > 1 ? 's' : ''} Available</span>
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                Awaiting Ingestion
              </span>
            )}

            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerateInsights}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer disabled:bg-gray-300"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Synthesizing...' : 'Generate Insights'}</span>
            </button>
          </div>
        </div>

        {/* Insights Cards List */}
        {!hasData ? (
          <EmptyState
            icon={Lightbulb}
            title="No Strategic Insights Available"
            description="Upload multi-period financial statements or click 'Generate Insights' to run automated CFO diagnostic models."
            actionButton={
              <button
                type="button"
                onClick={handleGenerateInsights}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0D9488] text-white text-xs font-semibold hover:bg-[#0F766E] transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Demo Insights</span>
              </button>
            }
          />
        ) : (
          <div className="space-y-5">
            {localInsights.map((insight) => {
              const srcConfig = getSourceBadge(insight.source);

              return (
                <div
                  key={insight.id}
                  className="bg-gray-50/50 rounded-2xl border border-gray-200 p-6 space-y-4 hover:shadow-md transition-shadow relative"
                >
                  {/* Top Metadata Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${srcConfig.bg}`}
                      >
                        {srcConfig.label}
                      </span>
                      <ConfidenceBadge tier={insight.confidence || 'verified'} />
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {insight.generatedAt
                          ? new Date(insight.generatedAt).toLocaleString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '22 Aug 2026, 12:00 PM'}
                      </span>
                    </div>
                  </div>

                  {/* Title & CFO Narrative */}
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#111827] mb-2">
                      {insight.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#374151] leading-relaxed bg-white p-4.5 rounded-xl border border-gray-200/80 shadow-2xs font-normal">
                      {insight.narrative}
                    </p>
                  </div>

                  {/* Grounded Evidence Chips */}
                  {insight.evidence && insight.evidence.length > 0 && (
                    <div>
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                        Grounded Source Citations (Click to inspect)
                      </span>

                      <div className="flex flex-wrap items-center gap-2">
                        {insight.evidence.map((ev, idx) => {
                          const isSelected =
                            activeEvidencePopover?.insightId === insight.id &&
                            activeEvidencePopover?.evidence.documentName === ev.documentName;

                          return (
                            <div key={idx} className="relative">
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveEvidencePopover(
                                    isSelected
                                      ? null
                                      : { insightId: insight.id, evidence: ev }
                                  )
                                }
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all border cursor-pointer ${
                                  isSelected
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                    : 'bg-white text-gray-700 hover:bg-blue-50 border-gray-300'
                                }`}
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>{ev.documentName}</span>
                                <ChevronRight className="w-3 h-3 opacity-60" />
                              </button>

                              {/* Evidence Popover Card */}
                              <AnimatePresence>
                                {isSelected && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    className="absolute left-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 p-3.5 z-20 text-xs text-left"
                                  >
                                    <div className="flex items-center justify-between font-bold text-gray-900 border-b border-gray-100 pb-1.5 mb-2">
                                      <span className="truncate">{ev.documentName}</span>
                                      <span className="text-[10px] text-teal-700 font-mono bg-teal-50 px-1.5 py-0.5 rounded">
                                        Source
                                      </span>
                                    </div>
                                    <div className="space-y-1 text-gray-600 text-[11px]">
                                      {ev.page && <p>• <strong>Page:</strong> {ev.page}</p>}
                                      {ev.row && <p>• <strong>Row Index:</strong> {ev.row}</p>}
                                      {ev.section && <p>• <strong>Section:</strong> {ev.section}</p>}
                                      <p className="text-[10px] text-gray-400 pt-1">
                                        Deterministic line-item cross-reference.
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Scope & Limitations Italic Text */}
                  {insight.limitations && (
                    <div className="flex items-start gap-2 pt-2 text-xs text-gray-500 italic">
                      <Info className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5 not-italic" />
                      <p>
                        <strong>Scope & Limitations: </strong>
                        {insight.limitations}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. EXPLAINABLE AI ARCHITECTURE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111827]">
                How this was generated (Explainable AI Architecture)
              </h3>
              <p className="text-xs text-gray-500">
                End-to-end transparent reasoning pipeline with zero opaque black-boxes
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#059669] border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Explainable</span>
          </span>
        </div>

        {/* 3 Numbered Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Step 1 */}
          <div className="bg-gray-50/70 border border-gray-200/80 rounded-2xl p-5 space-y-3 relative hover:bg-emerald-50/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
                1
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#111827] mb-1">
                Extracted Financial Data & OCR Normalization
              </h4>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Raw PDF, CSV, and XLSX statements are ingested directly into the browser WebAssembly sandbox with client-side PDPA PII redaction.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-gray-50/70 border border-gray-200/80 rounded-2xl p-5 space-y-3 relative hover:bg-emerald-50/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
                2
              </div>
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                <Calculator className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#111827] mb-1">
                Calculated Key Metrics & Anomaly Proofs
              </h4>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Pure mathematical functions deterministically compute liquidity, solvency, and margins, highlighting variance divergences against historical baselines.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-gray-50/70 border border-gray-200/80 rounded-2xl p-5 space-y-3 relative hover:bg-emerald-50/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
                3
              </div>
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#111827] mb-1">
                Generated Grounded Action Recommendations
              </h4>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Rule-based heuristic analyzers synthesize executive action items with strict document row and page evidence citations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
