import React from 'react';
import { BotanicalDivider } from './BotanicalDivider';

interface BrandStoryModalProps {
  onClose: () => void;
}

export const BrandStoryModal: React.FC<BrandStoryModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#fbf9f5] rounded-3xl p-6 sm:p-8 w-full max-w-md border border-[#efeeea] shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#271310] text-2xl material-symbols-filled">
              local_florist
            </span>
            <span className="font-literata text-xl font-bold text-[#271310]">Brew &amp; Bloom</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#827472] hover:text-[#271310] hover:bg-[#efeeea] cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <BotanicalDivider className="my-2" />

        <div className="space-y-3.5 text-xs sm:text-sm text-[#504442] font-jakarta leading-relaxed my-4">
          <p>
            <strong className="text-[#271310] font-literata text-base block mb-1">
              Where Specialty Coffee Meets Botanical Tranquility
            </strong>
            Brew &amp; Bloom was born from a passion for organic specialty coffee beans and locally harvested botanical syrups — including wildflower honey, French lavender, and garden rosemary.
          </p>
          <p>
            Every espresso shot is pulled from ethically sourced, fair-trade micro-lots. Our milk is 100% organic and crafted for the creamiest micro-foam.
          </p>
          <div className="bg-[#ece0dc]/60 rounded-2xl p-4 border border-[#d3c3c0]/60 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#271310]">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span>Sanctuary Hours</span>
            </div>
            <p className="text-xs text-[#504442]">Mon – Fri: 6:30 AM – 7:00 PM</p>
            <p className="text-xs text-[#504442]">Sat – Sun: 7:30 AM – 8:00 PM</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-2 bg-[#271310] text-white py-3.5 rounded-full font-jakarta text-xs font-bold uppercase tracking-wider hover:bg-[#3e2723] cursor-pointer"
        >
          Return to Menu
        </button>
      </div>
    </div>
  );
};
