import React from 'react';

export type NavigationTab = 'home' | 'order' | 'rewards' | 'profile';

interface BottomNavBarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  cartCount: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  cartCount,
}) => {
  const navItems: { id: NavigationTab; label: string; icon: string; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'order', label: 'Order', icon: 'coffee', badge: cartCount },
    { id: 'rewards', label: 'Rewards', icon: 'card_membership' },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <nav className="bg-[#efeeea] border-t border-[#d3c3c0]/40 shadow-[0_-4px_16px_rgba(62,39,35,0.06)] fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center py-2 px-3 sm:px-6 rounded-t-2xl max-w-md mx-auto sm:max-w-xl md:max-w-2xl">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer relative py-1 px-4 rounded-full ${
              isActive
                ? 'bg-[#ece0dc] text-[#271310] font-semibold scale-95 shadow-inner'
                : 'text-[#655d5a] hover:text-[#271310] hover:bg-[#eae8e4]/60 active:scale-90'
            }`}
          >
            <div className="relative flex items-center justify-center">
              <span
                className={`material-symbols-outlined text-[22px] ${
                  isActive ? 'material-symbols-filled text-[#271310]' : ''
                }`}
              >
                {item.icon}
              </span>
              {item.badge && item.badge > 0 && !isActive && (
                <span className="absolute -top-1 -right-2 bg-[#271310] text-[#ffffff] text-[9px] font-bold h-3.5 min-w-3.5 px-1 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium tracking-wide mt-0.5 font-jakarta">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
