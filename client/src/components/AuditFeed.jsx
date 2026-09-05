import React from 'react';
import { FileText } from 'lucide-react';

export default function AuditFeed({ memo }) {
  return (
    <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-5 h-5 text-blue-400" />
        <h3 className="text-base font-semibold text-white">AI Chief Risk Officer Audit Trail</h3>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 font-mono text-xs text-gray-300 whitespace-pre-line leading-relaxed">
        {memo || `[SYSTEM INITIALIZED]
Monitoring $10,000,000 corporate balance sheet.
All risk thresholds within 95% confidence tolerance.
Turnover friction filter engaged.`}
      </div>
    </div>
  );
}
