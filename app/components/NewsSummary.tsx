import { FileText } from "lucide-react";

interface NewsSummaryProps {
  summary: string;
  className?: string;
}

export default function NewsSummary({ summary, className = "" }: NewsSummaryProps) {
  if (!summary) return null;

  return (
    <div className={`p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center mb-3">
        <FileText className="w-4 h-4 mr-2 text-gray-700 dark:text-gray-300" />
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          Summary
        </span>
      </div>
      <div className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-line leading-relaxed">
        {summary}
      </div>
    </div>
  );
}
