import React from 'react';
import { NavigationTab } from './BottomNavBar';

interface TopAppBarProps {
  title?: string;
  activeTab?: NavigationTab;
  onSelectTab?: (tab: NavigationTab) => void;
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
  activeTab = 'home',
  onSelectTab,
  cartCount,
  isCloudConnected = true,
  onOpenCart,
  onOpenBrandStory,
  onBack,
  showBack = false,
}) => {
  const navLinks: { id: NavigationTab; label: string; icon: string }[] = [
    { id: 'home', label: 'Brews & Menu', icon: 'coffee' },
    { id: 'order', label: 'My Cart', icon: 'shopping_bag' },
    { id: 'rewards', label: 'Rewards', icon: 'card_membership' },
    { id: 'profile', label: 'Orders & Profile', icon: 'person' },
  ];

  return (
    <header className="bg-[#fbf9f5]/95 backdrop-blur-md border-b border-[#efeeea] text-[#271310] fixed top-0 left-0 right-0 z-40 transition-shadow shadow-xs">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
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
              onClick={() => onSelectTab && onSelectTab('home')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-[#271310] text-[#fbf9f5] flex items-center justify-center shadow-xs group-hover:rotate-12 transition-transform duration-300">
                <span className="material-symbols-outlined text-xl text-[#fbf9f5]">local_cafe</span>
              </div>
              <div>
                <h1 className="font-literata text-xl sm:text-2xl font-bold tracking-tight text-[#271310] leading-none">
                  {title}
                </h1>
                <span className="text-[10px] tracking-widest text-[#827472] uppercase font-jakarta font-semibold">
                  Botanical Boutique
                </span>
              </div>
            </button>
          )}

          {isCloudConnected && (
            <div
              title="Connected to Firebase Firestore Cloud Database"
              className="hidden lg:flex items-center gap-1.5 bg-[#ece0dc]/70 text-[#271310] text-[10px] font-semibold px-2.5 py-1 rounded-full border border-[#d3c3c0]/60 font-jakarta ml-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Cloud Sync</span>
            </div>
          )}
        </div>

        {/* Center: Desktop Navigation Bar (md and above) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#efeeea]/80 p-1 rounded-full border border-[#e4e2de]">
          {navLinks.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab && onSelectTab(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold font-jakarta transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#271310] text-[#ffffff] shadow-xs'
                    : 'text-[#504442] hover:text-[#271310] hover:bg-[#ffffff]/60'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.id === 'order' && cartCount > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-[#ffffff] text-[#271310]' : 'bg-[#271310] text-[#ffffff]'
                    }`}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Story Modal trigger & Quick Cart button */}
        <div className="flex items-center gap-2">
          {onOpenBrandStory && (
            <button
              onClick={onOpenBrandStory}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#504442] hover:text-[#271310] px-3 py-1.5 rounded-full border border-[#d3c3c0]/60 hover:bg-[#eae8e4] transition-all cursor-pointer font-jakarta"
            >
              <span className="material-symbols-outlined text-sm text-[#059669]">eco</span>
              <span>Our Story</span>
            </button>
          )}

          <button
            onClick={onOpenCart}
            className="hover:opacity-80 transition-opacity active:scale-95 duration-150 p-2.5 rounded-full text-[#271310] hover:bg-[#eae8e4] flex items-center justify-center relative cursor-pointer"
            aria-label="Shopping Cart"
          >
            <span className="material-symbols-outlined text-2xl">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#ba1a1a] text-[#ffffff] text-[10px] font-bold h-4.5 min-w-4.5 px-1 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-50 duration-200">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
