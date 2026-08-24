import React, { useState } from 'react';
import { REWARDS_DATA } from '../data/mockData';
import { RewardItem } from '../types';
import { BotanicalDivider } from './BotanicalDivider';

interface RewardsScreenProps {
  onRedeemReward?: (reward: RewardItem) => void;
}

export const RewardsScreen: React.FC<RewardsScreenProps> = () => {
  const [points, setPoints] = useState(140);
  const [rewards, setRewards] = useState<RewardItem[]>(REWARDS_DATA);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const maxPointsForNextTier = 200;
  const stamps = [true, true, true, true, true, true, true, false, false, false];

  const handleClaim = (reward: RewardItem) => {
    if (points >= reward.cost && !reward.claimed) {
      setPoints(points - reward.cost);
      setRewards(
        rewards.map((r) => (r.id === reward.id ? { ...r, claimed: true } : r))
      );
      setToastMessage(`Voucher for "${reward.title}" added to your wallet!`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <main className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-6 pb-28">
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#271310] text-white px-5 py-2.5 rounded-full shadow-lg text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="material-symbols-outlined text-base text-[#dbe6cf]">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Rewards Header Card */}
      <section className="bg-[#ece0dc]/70 rounded-3xl p-6 sm:p-8 border border-[#d3c3c0]/60 shadow-[0_4px_20px_rgba(62,39,35,0.05)] mb-8 relative overflow-hidden">
        <svg
          className="absolute -right-6 -bottom-6 w-48 h-48 text-[#655d5a]/10 pointer-events-none"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6Z"></path>
        </svg>

        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[#271310]">local_florist</span>
            <span className="text-xs font-bold uppercase tracking-widest text-[#655d5a] font-jakarta">
              Bloom Tier Member
            </span>
          </div>

          <div className="flex justify-between items-baseline mb-3">
            <h2 className="font-literata text-3xl sm:text-4xl font-bold text-[#271310]">
              {points} <span className="text-xl font-normal text-[#655d5a]">Bloom Seeds</span>
            </h2>
            <span className="text-xs font-semibold text-[#504442] font-jakarta">
              {maxPointsForNextTier - points} seeds to free signature brew
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#efeeea] h-3 rounded-full overflow-hidden mb-6 border border-[#d3c3c0]/40">
            <div
              className="bg-[#271310] h-full rounded-full transition-all duration-700"
              style={{ width: `${(points / maxPointsForNextTier) * 100}%` }}
            ></div>
          </div>

          {/* Botanical Stamp Card (10 Cups to Free Drink) */}
          <div className="bg-[#fbf9f5] rounded-2xl p-4 sm:p-5 border border-[#efeeea] shadow-xs">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#271310] font-jakarta">
                Artisanal Cup Stamp Card
              </span>
              <span className="text-xs text-[#655d5a] font-jakarta">7 / 10 stamps</span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {stamps.map((isStamped, idx) => (
                <div
                  key={idx}
                  className={`aspect-square rounded-xl flex items-center justify-center border transition-all ${
                    isStamped
                      ? 'bg-[#271310] text-[#ffffff] border-[#271310]'
                      : 'bg-[#efeeea] text-[#827472] border-[#d3c3c0]/60'
                  }`}
                  title={`Stamp ${idx + 1}`}
                >
                  <span
                    className={`material-symbols-outlined text-sm ${
                      isStamped ? 'material-symbols-filled' : ''
                    }`}
                  >
                    {idx === 9 ? 'stars' : 'coffee'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <BotanicalDivider className="my-6" />

      {/* Available Rewards Collection */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="font-literata text-2xl font-bold text-[#271310]">
              Botanical Rewards &amp; Vouchers
            </h3>
            <p className="text-xs text-[#655d5a] font-jakarta">
              Redeem your accumulated seeds for handcrafted perks
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map((item) => {
            const canAfford = points >= item.cost;
            return (
              <div
                key={item.id}
                className="bg-[#ffffff] rounded-2xl p-5 border border-[#efeeea] shadow-[0_2px_8px_rgba(62,39,35,0.04)] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#ece0dc] text-[#271310] rounded-xl flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#655d5a] block font-jakarta">
                      {item.category}
                    </span>
                    <h4 className="font-literata text-base font-bold text-[#271310] leading-snug">
                      {item.title}
                    </h4>
                    <span className="text-xs font-semibold text-[#8d9884] font-jakarta">
                      {item.cost} Seeds
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleClaim(item)}
                  disabled={!canAfford || item.claimed}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider font-jakarta transition-all shrink-0 cursor-pointer ${
                    item.claimed
                      ? 'bg-[#efeeea] text-[#827472] cursor-not-allowed'
                      : canAfford
                      ? 'bg-[#271310] text-[#ffffff] hover:bg-[#3e2723] shadow-xs active:scale-95'
                      : 'bg-[#efeeea] text-[#827472] cursor-not-allowed'
                  }`}
                >
                  {item.claimed ? 'Claimed' : canAfford ? 'Redeem' : `${item.cost} Seeds`}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};
