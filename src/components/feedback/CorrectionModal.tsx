"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { dataStore } from "@/lib/data/store";
import { X, CheckCircle2, Send, AlertCircle } from "lucide-react";
import { SubmissionType } from "@/types";

interface CorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  pandalId?: string;
  defaultPandalName?: string;
}

export function CorrectionModal({
  isOpen,
  onClose,
  pandalId,
  defaultPandalName = "",
}: CorrectionModalProps) {
  const { t } = useLanguage();
  const [submissionType, setSubmissionType] = useState<SubmissionType>(
    pandalId ? "correction" : "new_pandal"
  );
  const [pandalName, setPandalName] = useState(defaultPandalName);
  const [reporterName, setReporterName] = useState("");
  const [reporterContact, setReporterContact] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    setIsSubmitting(true);
    try {
      dataStore.addSubmission({
        submission_type: submissionType,
        pandal_id: pandalId || null,
        pandal_name: pandalName || defaultPandalName || "Community Submission",
        submitted_data: {
          reporter_name: reporterName.trim() || "Anonymous Contributor",
          reporter_contact: reporterContact.trim(),
          description: notes.trim(),
        },
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsSubmitting(false);
        onClose();
      }, 2200);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#fcfaf5] rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#d99b26]/40 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#78716c] hover:text-[#1c1917] hover:bg-[#ede4d1] transition-colors"
          aria-label={t.correctionModal.close}
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1c1917]">
              {t.correctionModal.success}
            </h3>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-xl font-serif font-bold text-[#4a1810]">
                {t.correctionModal.title}
              </h3>
              <p className="text-xs text-[#57534e] mt-1">
                {t.correctionModal.subtitle}
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                  {t.correctionModal.typeLabel}
                </label>
                <select
                  value={submissionType}
                  onChange={(e) =>
                    setSubmissionType(e.target.value as SubmissionType)
                  }
                  className="w-full text-sm px-3 py-2 rounded-lg border border-[#ede4d1] bg-white text-[#1c1917] focus:ring-2 focus:ring-[#8b2f1e]"
                >
                  <option value="correction">Pandal Detail / Location Correction</option>
                  <option value="timing_update">Darshan Timing / Event Update</option>
                  <option value="new_pandal">Suggest New / Unlisted Pandal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                  {t.correctionModal.pandalLabel}
                </label>
                <input
                  type="text"
                  value={pandalName}
                  onChange={(e) => setPandalName(e.target.value)}
                  placeholder="e.g. Chasapara Buri Maa"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-[#ede4d1] bg-white text-[#1c1917] focus:ring-2 focus:ring-[#8b2f1e]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                    {t.correctionModal.nameLabel}
                  </label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="Your name"
                    className="w-full text-sm px-3 py-2 rounded-lg border border-[#ede4d1] bg-white text-[#1c1917] focus:ring-2 focus:ring-[#8b2f1e]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                    {t.correctionModal.contactLabel}
                  </label>
                  <input
                    type="text"
                    value={reporterContact}
                    onChange={(e) => setReporterContact(e.target.value)}
                    placeholder="Phone or email"
                    className="w-full text-sm px-3 py-2 rounded-lg border border-[#ede4d1] bg-white text-[#1c1917] focus:ring-2 focus:ring-[#8b2f1e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                  {t.correctionModal.notesLabel} *
                </label>
                <textarea
                  required
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Please state the verified detail, correct address, or official committee notification source..."
                  className="w-full text-sm px-3 py-2 rounded-lg border border-[#ede4d1] bg-white text-[#1c1917] focus:ring-2 focus:ring-[#8b2f1e]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-[#57534e] hover:text-[#1c1917]"
              >
                {t.correctionModal.close}
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !notes.trim()}
                className="btn-maroon-action px-5 py-2 rounded-lg text-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? t.correctionModal.submitting
                    : t.correctionModal.submitBtn}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

