/**
 * Reusable AI Card Component
 * Highlights AI-driven insights,Next Best Actions, and automated call recommendations.
 */

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface AICardProps {
  title: string;
  description: string;
  actionText?: string;
  badgeText?: string;
  onAction?: () => void;
  variant?: 'indigo' | 'slate' | 'emerald';
}

export const AICard: React.FC<AICardProps> = React.memo(({
  title,
  description,
  actionText,
  badgeText = 'AI Smart Insight',
  onAction,
  variant = 'indigo'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'emerald':
        return 'bg-gradient-to-r from-emerald-900 to-slate-900 text-white border-emerald-700/50';
      case 'slate':
        return 'bg-gradient-to-r from-slate-900 to-indigo-950 text-white border-slate-800';
      default:
        return 'bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white border-indigo-800/60';
    }
  };

  return (
    <div className={`p-4 rounded-2xl border shadow-lg space-y-2.5 ${getVariantStyles()}`}>
      <div className="flex items-center justify-between">
        <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-indigo-300 fill-indigo-300/30" />
          <span>{badgeText}</span>
        </span>
      </div>

      <div>
        <h4 className="font-bold text-sm text-white">{title}</h4>
        <p className="text-xs text-slate-300 leading-relaxed mt-1">{description}</p>
      </div>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-md flex items-center space-x-1 transition-all"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
});

AICard.displayName = 'AICard';
