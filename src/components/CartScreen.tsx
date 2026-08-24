import React from 'react';
import { CartItem, FestivalPromotion } from '../types';
import { BotanicalDivider } from './BotanicalDivider';

interface CartScreenProps {
  cartItems: CartItem[];
  activePromo?: FestivalPromotion;
  appliedPromoCode?: string;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  onBrowseMenu: () => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  cartItems,
  activePromo,
  appliedPromoCode,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onBrowseMenu,
}) => {
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const discountPercent =
    appliedPromoCode && activePromo?.promoCode.toUpperCase() === appliedPromoCode.toUpperCase()
      ? activePromo.discountPercent
      : 0;
  const discountAmount = Number(((subtotal * discountPercent) / 100).toFixed(2));
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const estimatedTax = Number((discountedSubtotal * 0.08).toFixed(2));
  const total = Number((discountedSubtotal + estimatedTax).toFixed(2));

  return (
    <div className="w-full min-h-screen bg-[#fbf9f5] pt-6 pb-32">
      <main className="max-w-[1200px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Cart Items Section */}
          <section className="flex-1 w-full flex flex-col gap-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-literata text-2xl font-bold text-[#271310]">
                Your Order
              </h2>
              {cartItems.length > 0 && (
                <span className="text-xs font-semibold text-[#655d5a] uppercase tracking-wider font-jakarta">
                  {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>

            {cartItems.length === 0 ? (
              <div className="bg-[#ffffff] rounded-2xl p-8 text-center border border-[#efeeea] shadow-[0_4px_20px_rgba(62,39,35,0.04)]">
                <span className="material-symbols-outlined text-5xl text-[#827472] mb-3">
                  shopping_bag
                </span>
                <h3 className="font-literata text-xl font-bold text-[#271310] mb-2">
                  Your basket is empty
                </h3>
                <p className="font-jakarta text-sm text-[#504442] mb-6 max-w-md mx-auto">
                  Explore our selection of signature botanical coffee, cold brews, and fresh artisanal pastries.
                </p>
                <button
                  onClick={onBrowseMenu}
                  className="bg-[#271310] text-[#ffffff] font-jakarta text-sm font-semibold py-3 px-6 rounded-full hover:bg-[#3e2723] transition-colors cursor-pointer"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {cartItems.map((item) => (
                  <article
                    key={item.id}
                    className="bg-[#ffffff] rounded-2xl p-4 sm:p-5 flex gap-4 items-center relative group border border-[#efeeea] shadow-[0_4px_20px_rgba(62,39,35,0.04)] hover:-translate-y-0.5 transition-all"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-[#eae8e4]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-grow flex flex-col justify-between h-full py-0.5">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-literata text-base sm:text-lg font-bold text-[#271310]">
                            {item.name}
                          </h3>
                          <span className="font-literata text-base sm:text-lg font-bold text-[#271310] ml-3 whitespace-nowrap">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        <p className="font-jakarta text-xs sm:text-sm text-[#504442] mt-0.5">
                          {item.notes || `${item.size} size`}
                        </p>
                      </div>

                      {/* Quantity & Remove Buttons */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center bg-[#efeeea] rounded-full px-2 py-1 border border-[#d3c3c0]/60">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center text-[#655d5a] hover:text-[#271310] transition-colors rounded-full hover:bg-[#eae8e4] cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <span className="material-symbols-outlined text-sm">remove</span>
                          </button>
                          <span className="font-jakarta text-sm text-[#271310] w-6 text-center font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="w-7 h-7 flex items-center justify-center text-[#655d5a] hover:text-[#271310] transition-colors rounded-full hover:bg-[#eae8e4] cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <span className="material-symbols-outlined text-sm">add</span>
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#827472] hover:text-[#ba1a1a] transition-colors p-2 rounded-full hover:bg-[#ffdad6]/40 ml-auto cursor-pointer"
                          aria-label="Remove item"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}

                {/* Botanical Divider */}
                <BotanicalDivider variant="flourish" className="my-4" />

                {/* Add More Items Link */}
                <button
                  onClick={onBrowseMenu}
                  className="self-start text-xs font-semibold uppercase tracking-wider text-[#655d5a] hover:text-[#271310] flex items-center gap-1 cursor-pointer font-jakarta py-1"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  Add more items from menu
                </button>
              </div>
            )}
          </section>

          {/* Order Summary Aside */}
          {cartItems.length > 0 && (
            <aside className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-24 space-y-4">
              {/* Festival Promo Card in Aside */}
              {activePromo && (
                <div className="bg-emerald-900 text-emerald-50 rounded-2xl p-4 shadow-sm border border-emerald-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-base text-emerald-300">celebration</span>
                    <span className="font-bold text-xs font-jakarta tracking-wide">
                      {activePromo.themeTitle}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-200 font-jakarta leading-relaxed mb-2.5">
                    Use code <span className="font-mono font-bold bg-emerald-800 text-white px-1.5 py-0.5 rounded border border-emerald-600">{activePromo.promoCode}</span> for {activePromo.discountPercent}% off at checkout!
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-emerald-300 font-jakarta">
                    <span>{activePromo.badge}</span>
                    <span className="font-semibold">{activePromo.expiryNote}</span>
                  </div>
                </div>
              )}

              <div className="bg-[#f5f3ef] rounded-2xl p-6 border border-[#efeeea] shadow-[0_4px_20px_rgba(62,39,35,0.05)]">
                <h3 className="font-literata text-xl font-bold text-[#271310] mb-5">
                  Order Summary
                </h3>

                <div className="space-y-3.5 font-jakarta text-sm">
                  <div className="flex justify-between text-[#504442]">
                    <span>Subtotal ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})</span>
                    <span className="font-medium text-[#1b1c1a]">${subtotal.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">local_offer</span>
                        Festival Discount ({appliedPromoCode})
                      </span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#504442]">
                    <span>Estimated Tax</span>
                    <span className="font-medium text-[#1b1c1a]">${estimatedTax.toFixed(2)}</span>
                  </div>

                  <div className="pt-4 border-t border-[#d3c3c0] mt-4 flex justify-between items-end">
                    <span className="font-literata text-xl font-bold text-[#271310]">Total</span>
                    <span className="font-literata text-2xl font-bold text-[#271310]">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onProceedToCheckout}
                  className="w-full mt-6 bg-[#271310] text-[#ffffff] font-jakarta text-xs font-bold py-4 rounded-full uppercase tracking-wider hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 relative overflow-hidden group shadow-[0_4px_16px_rgba(39,19,16,0.18)] cursor-pointer"
                >
                  <span>Checkout</span>
                  <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </button>

                <p className="text-center text-[11px] text-[#504442] mt-3 font-jakarta opacity-75">
                  Taxes and fees calculated at checkout
                </p>
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
};

