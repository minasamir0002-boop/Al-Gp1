/**
 * Reusable Product Card Component
 * Highlights clinical evidence, indication highlights, and sample inventory.
 */

import React from 'react';
import { Product } from '../../models';
import { Package, BookOpen, ChevronRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect?: (prod: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(({ product, onSelect }) => {
  return (
    <div
      onClick={() => onSelect?.(product)}
      className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-600 transition-all space-y-3 cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{product.name}</h3>
              {product.badge && (
                <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                  {product.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{product.genericName} • {product.category}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center space-x-1 justify-end">
            <Package className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{product.sampleStock} Units</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Sample Inventory</span>
        </div>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 italic">
        "{product.clinicalHighlights}"
      </p>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
        <span>Dosage: {product.dosage}</span>
        <span className="text-indigo-600 dark:text-indigo-400 flex items-center space-x-1">
          <span>View Detailing Guide</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
