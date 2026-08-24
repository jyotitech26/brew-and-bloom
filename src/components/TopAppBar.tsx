import React from 'react';

interface TopAppBarProps {
  title?: string;
  cartCount: number;
  isCloudConnected?: boolean;
  onOpenCart: () => void;
  onOpenBrandStory?: () => void;
  onBack?: () => void;
  showBack?: boolean;
  isScrolled?: boolean;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title = 'Brew & Bloom',
  cartCount,
  isCloudConnected = true,
  onOpenCart,
  onOpenBrandStory,
  onBack,
  showBack = false,
}) => {
  return (
    <header className="bg-[#fbf9f5] border-b border-[#efeeea] text-[#271310] flex justify-between items-center px-4 sm:px-8 h-16 w-full fixed top-0 left-0 right-0 z-40 transition-shadow shadow-xs">
      <div className="flex items-center gap-2">
        {showBack ? (
          <button
            onClick={onBack}
            className="hover:opacity-80 transition-opacity active:scale-95 duration-150 p-2 -ml-2 rounded-full text-[#504442] hover:bg-[#eae8e4] flex items-center justify-center cursor-pointer"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
        ) : (
          <button
            onClick={onOpenBrandStory}
            className="hover:opacity-80 transition-opacity active:scale-95 duration-150 p-2 -ml-2 rounded-full text-[#271310] hover:bg-[#eae8e4] flex items-center justify-center cursor-pointer"
            aria-label="About Brew & Bloom"
            title="About Brew & Bloom"
          >
            <span className="material-symbols-outlined text-2xl">local_florist</span>
          </button>
        )}

        {isCloudConnected && (
          <div
            title="Connected to Firebase Firestore Cloud Database"
            className="hidden sm:flex items-center gap-1.5 bg-[#ece0dc]/70 text-[#271310] text-[10px] font-semibold px-2.5 py-1 rounded-full border border-[#d3c3c0]/60 font-jakarta"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>Cloud Sync Active</span>
          </div>
        )}
      </div>

      <h1 className="font-literata text-2xl sm:text-3xl font-bold tracking-tight text-[#271310] text-center select-none cursor-pointer">
        {title}
      </h1>

      <div className="flex items-center">
        <button
          onClick={onOpenCart}
          className="hover:opacity-80 transition-opacity active:scale-95 duration-150 p-2 -mr-2 rounded-full text-[#271310] hover:bg-[#eae8e4] flex items-center justify-center relative cursor-pointer"
          aria-label="Shopping Cart"
        >
          <span className="material-symbols-outlined text-2xl">shopping_bag</span>
          {cartCount > 0 && (
            <span className="absolute top-1.5 right-1.5 bg-[#271310] text-[#ffffff] text-[11px] font-bold h-4.5 min-w-4.5 px-1 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-50 duration-200">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
