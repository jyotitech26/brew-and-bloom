import React, { useState } from 'react';
import { FestivalPromotion } from '../types';

interface FestivalPromoBannerProps {
  promotions: FestivalPromotion[];
  activePromo: FestivalPromotion;
  onSelectPromo: (promo: FestivalPromotion) => void;
  onApplyPromoCode: (code: string) => void;
  appliedPromoCode?: string;
}

export const FestivalPromoBanner: React.FC<FestivalPromoBannerProps> = ({
  promotions,
  activePromo,
  onSelectPromo,
  onApplyPromoCode,
  appliedPromoCode,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isApplied = appliedPromoCode?.toUpperCase() === activePromo.promoCode.toUpperCase();

  return (
    <section className="mb-8 overflow-hidden rounded-3xl border border-[#d3c3c0]/80 shadow-[0_8px_30px_rgba(39,19,16,0.08)] relative">
      {/* Festival Selector Header Bar */}
      <div className="bg-[#efeeea] px-4 py-2.5 border-b border-[#d3c3c0]/60 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 shrink-0 text-xs font-bold font-jakarta text-[#271310]">
          <span className="material-symbols-outlined text-base text-[#059669]">celebration</span>
          <span>Festival Editions:</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {promotions.map((promo) => {
            const isCurrent = promo.id === activePromo.id;
            return (
              <button
                key={promo.id}
                onClick={() => onSelectPromo(promo)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold font-jakarta transition-all flex items-center gap-1 cursor-pointer ${
                  isCurrent
                    ? 'bg-[#271310] text-[#ffffff] shadow-xs scale-[1.02]'
                    : 'bg-[#ffffff] text-[#504442] hover:bg-[#eae8e4] border border-[#d3c3c0]/50'
                }`}
              >
                <span>{promo.badge.split(' ')[0]}</span>
                <span>{promo.themeTitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Festive Hero Card */}
      <div
        className={`${activePromo.themeColor.bg} ${activePromo.themeColor.text} p-5 sm:p-7 relative overflow-hidden transition-all duration-300`}
      >
        {/* Background decorative botanical watermark */}
        <div className="absolute -right-6 -bottom-10 opacity-10 pointer-events-none select-none text-9xl">
          🌸
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left info column */}
          <div className="max-w-xl space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`${activePromo.themeColor.badgeBg} ${activePromo.themeColor.badgeText} text-xs font-bold font-jakarta px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5`}
              >
                <span className="material-symbols-outlined text-sm">{activePromo.icon}</span>
                {activePromo.badge}
              </span>
              <span className="bg-white/15 backdrop-blur-xs text-white text-[11px] font-semibold font-jakarta px-2.5 py-0.5 rounded-full border border-white/20">
                {activePromo.discountPercent}% OFF Festive Special
              </span>
            </div>

            <h3 className="font-literata text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              {activePromo.name}
            </h3>

            <p className="font-jakarta text-xs sm:text-sm text-white/90 leading-relaxed">
              {activePromo.tagline}
            </p>

            <div className="text-[11px] text-white/70 font-jakarta flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">info</span>
              <span>{activePromo.expiryNote}</span>
            </div>
          </div>

          {/* Right action column: Promo Code Box */}
          <div className="shrink-0 bg-white/10 backdrop-blur-md border border-white/20 p-4 sm:p-5 rounded-2xl flex flex-col sm:items-end gap-3 shadow-inner">
            <span className="text-[11px] uppercase tracking-wider text-white/80 font-bold font-jakarta">
              Festival Promo Coupon
            </span>

            {/* Coupon Code Pill */}
            <div className="flex items-center gap-2 bg-[#ffffff] text-[#271310] px-3.5 py-2 rounded-xl border-2 border-dashed border-[#271310]/30 shadow-xs">
              <span className="material-symbols-outlined text-base text-[#059669]">local_offer</span>
              <span className="font-mono font-black text-base sm:text-lg tracking-wider">
                {activePromo.promoCode}
              </span>
              <button
                onClick={() => handleCopyCode(activePromo.promoCode)}
                className="ml-2 text-xs font-bold text-[#655d5a] hover:text-[#271310] transition-colors p-1"
                title="Copy promo code"
              >
                <span className="material-symbols-outlined text-sm">
                  {copied ? 'check' : 'content_copy'}
                </span>
              </button>
            </div>

            {/* 1-Click Apply Button */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => onApplyPromoCode(activePromo.promoCode)}
                className={`w-full sm:w-auto font-jakarta text-xs font-bold px-4 py-2.5 rounded-full transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer ${
                  isApplied
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-[#ffffff] text-[#271310] hover:bg-white/90 shadow-xs active:scale-95'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {isApplied ? 'check_circle' : 'bolt'}
                </span>
                <span>{isApplied ? 'Applied to Checkout' : `Apply ${activePromo.discountPercent}% Off`}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
