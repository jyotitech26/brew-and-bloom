import React from 'react';

interface BotanicalDividerProps {
  className?: string;
  variant?: 'leaf' | 'wave' | 'flourish';
}

export const BotanicalDivider: React.FC<BotanicalDividerProps> = ({ className = '', variant = 'leaf' }) => {
  if (variant === 'wave') {
    return (
      <div className={`w-full flex justify-center py-4 opacity-40 text-[#827472] ${className}`}>
        <svg width="100%" height="16" viewBox="0 0 100 16" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 8 C 20 0, 30 16, 50 8 C 70 0, 80 16, 100 8" stroke="currentColor" strokeWidth="0.75" fill="none" />
        </svg>
      </div>
    );
  }

  if (variant === 'flourish') {
    return (
      <div className={`flex justify-center my-6 text-[#8d9884] opacity-50 ${className}`}>
        <svg fill="none" height="20" viewBox="0 0 40 20" width="40" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 0C20 11.0457 11.0457 20 0 20C11.0457 20 20 11.0457 20 0ZM20 0C20 11.0457 28.9543 20 40 20C28.9543 20 20 11.0457 20 0Z" fill="currentColor"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className={`w-full flex justify-center py-4 opacity-30 text-[#271310] ${className}`}>
      <svg fill="none" height="14" viewBox="0 0 40 12" width="40" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M20 6C17 2 12 0 7 0C12 2 15 5 15 6C15 7 12 10 7 12C12 10 17 10 20 6ZM20 6C23 10 28 12 33 12C28 10 25 7 25 6C25 5 28 2 33 0C28 2 23 2 20 6Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};
