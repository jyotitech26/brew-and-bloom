import React, { useState } from 'react';
import { CartItem, PickupLocation, PaymentMethod, PlacedOrder, FestivalPromotion } from '../types';
import { CHECKOUT_MAP_IMAGE, PICKUP_LOCATIONS, PAYMENT_METHODS, FESTIVAL_PROMOTIONS } from '../data/mockData';

interface CheckoutScreenProps {
  cartItems: CartItem[];
  initialPromoCode?: string;
  onBack: () => void;
  onOrderCompleted: (order: PlacedOrder) => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  cartItems,
  initialPromoCode = '',
  onBack,
  onOrderCompleted,
}) => {
  const [orderType, setOrderType] = useState<'Pickup' | 'Delivery'>('Pickup');
  const [selectedLocation, setSelectedLocation] = useState<PickupLocation>(PICKUP_LOCATIONS[0]);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>('pm-1');
  const [paymentList, setPaymentList] = useState<PaymentMethod[]>(PAYMENT_METHODS);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  // Festival Promo Code State
  const [promoCodeInput, setPromoCodeInput] = useState(initialPromoCode);
  const [appliedPromo, setAppliedPromo] = useState<FestivalPromotion | null>(() => {
    if (!initialPromoCode) return null;
    return (
      FESTIVAL_PROMOTIONS.find(
        (p) => p.promoCode.toUpperCase() === initialPromoCode.toUpperCase()
      ) || null
    );
  });
  const [promoError, setPromoError] = useState<string>('');
  const [promoSuccessMessage, setPromoSuccessMessage] = useState<string>(
    initialPromoCode ? 'Festival promo applied!' : ''
  );

  // Delivery Address State
  const [deliveryAddress, setDeliveryAddress] = useState('742 Evergreen Terrace, Apt 4B');

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // Calculate discount percentage from applied promo
  const discountAmount = appliedPromo
    ? Number(((subtotal * appliedPromo.discountPercent) / 100).toFixed(2))
    : 0;

  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const estimatedTax = Number((discountedSubtotal * 0.08).toFixed(2));
  const deliveryFee = orderType === 'Delivery' ? 2.50 : 0;
  const total = Number((discountedSubtotal + estimatedTax + deliveryFee).toFixed(2));

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || promoCodeInput).trim().toUpperCase();
    setPromoError('');
    setPromoSuccessMessage('');

    if (!code) {
      setPromoError('Please enter a promo code');
      return;
    }

    const matchedPromo = FESTIVAL_PROMOTIONS.find(
      (p) => p.promoCode.toUpperCase() === code
    );

    if (matchedPromo) {
      setAppliedPromo(matchedPromo);
      setPromoCodeInput(matchedPromo.promoCode);
      setPromoSuccessMessage(
        `🎉 ${matchedPromo.name} applied! You saved ${matchedPromo.discountPercent}%!`
      );
    } else if (code === 'WELCOME10') {
      const genericPromo: FestivalPromotion = {
        id: 'generic-welcome',
        name: 'Welcome Special',
        themeTitle: 'Welcome Discount',
        tagline: 'Special 10% discount on your artisanal coffee order.',
        promoCode: 'WELCOME10',
        discountPercent: 10,
        icon: 'local_cafe',
        badge: '☕ Welcome Perk',
        themeColor: {
          bg: 'bg-stone-900',
          border: 'border-stone-700',
          text: 'text-stone-100',
          badgeBg: 'bg-stone-800',
          badgeText: 'text-stone-200',
          accent: '#78350f',
        },
        featuredDrinkIds: [],
        bannerImage: '',
        expiryNote: 'Single use discount',
        isActive: true,
      };
      setAppliedPromo(genericPromo);
      setPromoCodeInput('WELCOME10');
      setPromoSuccessMessage('🎉 Welcome perk applied! 10% discount.');
    } else {
      setPromoError('Invalid promo code. Try EIDMUBARAK, SPRINGBLOOM, or BOISHAKH25');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedPromo(null);
    setPromoCodeInput('');
    setPromoError('');
    setPromoSuccessMessage('');
  };

  const handlePlaceOrder = () => {
    setIsProcessingOrder(true);
    setTimeout(() => {
      setIsProcessingOrder(false);
      const selectedPayment = paymentList.find((p) => p.id === selectedPaymentId) || paymentList[0];
      const randomOrderNum = Math.floor(1000 + Math.random() * 9000);
      const now = new Date();
      const readyTime = new Date(now.getTime() + selectedLocation.estimatedMinutes * 60000);

      const placedOrder: PlacedOrder = {
        id: `ord-${Date.now()}`,
        orderNumber: `#BB-${randomOrderNum}`,
        items: [...cartItems],
        subtotal,
        discount: discountAmount,
        promoCode: appliedPromo ? appliedPromo.promoCode : undefined,
        tax: estimatedTax,
        total,
        orderType,
        location: selectedLocation,
        paymentMethod: selectedPayment,
        status: 'Brewing',
        createdAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        estimatedPickupTime: readyTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      onOrderCompleted(placedOrder);
    }, 1200);
  };

  const handleAddNewPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardNumber) return;
    const lastFour = newCardNumber.slice(-4) || '8888';
    const newPm: PaymentMethod = {
      id: `pm-${Date.now()}`,
      type: 'card',
      label: `•••• ${lastFour}`,
      expiry: `Expires ${newCardExpiry || '08/28'}`,
      detail: 'Mastercard',
      icon: 'credit_card',
    };
    setPaymentList([...paymentList, newPm]);
    setSelectedPaymentId(newPm.id);
    setIsAddPaymentModalOpen(false);
    setNewCardNumber('');
    setNewCardExpiry('');
  };

  return (
    <div className="w-full min-h-screen bg-[#fbf9f5] pb-32 pt-16">
      {/* Header */}
      <header className="bg-[#fbf9f5] border-b border-[#efeeea] text-[#271310] flex justify-between items-center px-4 sm:px-8 h-16 w-full fixed top-0 left-0 right-0 z-40 shadow-xs">
        <button
          onClick={onBack}
          className="hover:opacity-80 transition-opacity active:scale-95 duration-150 p-2 -ml-2 rounded-full text-[#504442] hover:bg-[#eae8e4] flex items-center justify-center cursor-pointer"
          aria-label="Go back to cart"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>

        <h1 className="font-literata text-xl sm:text-2xl font-bold tracking-tight text-[#271310]">
          Checkout
        </h1>

        <div className="w-8"></div>
      </header>

      <main className="max-w-[800px] mx-auto px-4 sm:px-6 pt-4 space-y-6">
        {/* Order Type Toggle (Delivery / Pickup) */}
        <div className="bg-[#efeeea] rounded-full p-1 flex relative shadow-inner">
          <div
            className={`absolute inset-y-1 w-[calc(50%-4px)] bg-[#fbf9f5] rounded-full shadow-xs transition-transform duration-300 ${
              orderType === 'Delivery' ? 'translate-x-0 left-1' : 'translate-x-full left-1'
            }`}
          ></div>
          <button
            onClick={() => setOrderType('Delivery')}
            className={`relative z-10 flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider font-jakarta transition-colors cursor-pointer ${
              orderType === 'Delivery' ? 'text-[#271310]' : 'text-[#655d5a]'
            }`}
          >
            Delivery
          </button>
          <button
            onClick={() => setOrderType('Pickup')}
            className={`relative z-10 flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider font-jakarta transition-colors cursor-pointer ${
              orderType === 'Pickup' ? 'text-[#271310]' : 'text-[#655d5a]'
            }`}
          >
            Pickup
          </button>
        </div>

        {/* Location Section */}
        {orderType === 'Pickup' ? (
          <section className="space-y-3">
            <div className="flex justify-between items-center border-b border-[#e4e2de] pb-2">
              <h2 className="font-literata text-xl font-bold text-[#271310]">
                Pickup Location
              </h2>
              <span className="text-xs text-[#655d5a] font-jakarta">
                Ready in ~{selectedLocation.estimatedMinutes} mins
              </span>
            </div>

            {/* Store Card */}
            <div className="bg-[#ece0dc]/50 rounded-2xl p-4 sm:p-5 flex gap-4 items-start relative overflow-hidden group border border-[#d3c3c0]/60 shadow-[0_2px_8px_rgba(62,39,35,0.03)]">
              {/* Botanical SVG Background Accent */}
              <svg
                className="absolute -right-4 -bottom-4 w-28 h-28 text-[#655d5a]/10 pointer-events-none rotate-12"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"></path>
              </svg>

              <div className="bg-[#ffffff] rounded-full p-2.5 text-[#271310] shadow-xs z-10">
                <span className="material-symbols-outlined text-xl">storefront</span>
              </div>

              <div className="flex-1 z-10">
                <p className="font-jakarta text-sm font-bold text-[#271310] mb-0.5">
                  {selectedLocation.name}
                </p>
                <p className="text-xs sm:text-sm text-[#504442] font-jakarta">
                  {selectedLocation.address}
                </p>
                <p className="text-xs text-[#655d5a] font-jakarta mt-0.5">
                  {selectedLocation.distance} • {selectedLocation.hours}
                </p>
              </div>

              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="text-[#271310] hover:opacity-80 p-2 rounded-full hover:bg-white/60 transition-colors z-10 cursor-pointer"
                title="Change pickup location"
              >
                <span className="material-symbols-outlined text-xl">edit</span>
              </button>
            </div>

            {/* Map Preview Card */}
            <div className="rounded-2xl overflow-hidden h-36 relative shadow-[0_4px_12px_rgba(62,39,35,0.06)] border border-[#e4e2de] group">
              <img
                src={CHECKOUT_MAP_IMAGE}
                alt="Map Route to Brew & Bloom Downtown"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#271310]/30 via-transparent to-transparent"></div>
              <div className="absolute bottom-2.5 left-3 bg-[#fbf9f5]/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#271310] shadow-xs flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#271310]">navigation</span>
                <span>{selectedLocation.address}</span>
              </div>
            </div>
          </section>
        ) : (
          <section className="space-y-3">
            <div className="flex justify-between items-center border-b border-[#e4e2de] pb-2">
              <h2 className="font-literata text-xl font-bold text-[#271310]">
                Delivery Address
              </h2>
              <span className="text-xs text-[#655d5a] font-jakarta">Est. 25-35 mins</span>
            </div>

            <div className="bg-[#ece0dc]/50 rounded-2xl p-4 sm:p-5 flex gap-4 items-center border border-[#d3c3c0]/60">
              <div className="bg-[#ffffff] rounded-full p-2.5 text-[#271310] shadow-xs">
                <span className="material-symbols-outlined text-xl">local_shipping</span>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full bg-white border border-[#d3c3c0] rounded-xl px-3 py-2 text-sm text-[#1b1c1a] focus:ring-1 focus:ring-[#271310] outline-none"
                  placeholder="Enter street address..."
                />
              </div>
            </div>
          </section>
        )}

        {/* Festival Promo Code & Coupon Section */}
        <section className="space-y-3">
          <div className="flex justify-between items-center border-b border-[#e4e2de] pb-2">
            <h2 className="font-literata text-xl font-bold text-[#271310] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#059669]">local_offer</span>
              Festival Promo & Voucher
            </h2>
            <span className="text-xs text-[#655d5a] font-jakarta">Festive savings</span>
          </div>

          <div className="bg-[#ffffff] p-4 sm:p-5 rounded-2xl border border-[#efeeea] shadow-[0_2px_8px_rgba(62,39,35,0.03)] space-y-3.5">
            {/* Input Row */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={promoCodeInput}
                  onChange={(e) => {
                    setPromoCodeInput(e.target.value);
                    if (promoError) setPromoError('');
                  }}
                  placeholder="Enter code (e.g. EIDMUBARAK, SPRINGBLOOM)"
                  className="w-full uppercase font-mono text-sm font-bold bg-[#fbf9f5] border border-[#d3c3c0] rounded-xl px-3.5 py-2.5 text-[#271310] focus:ring-2 focus:ring-[#271310] outline-none tracking-wider placeholder:font-normal placeholder:normal-case placeholder:font-jakarta"
                />
                {appliedPromo && (
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 text-lg">
                    check_circle
                  </span>
                )}
              </div>

              {appliedPromo ? (
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="px-4 py-2.5 rounded-xl border border-[#ba1a1a]/40 text-[#ba1a1a] font-jakarta text-xs font-bold hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  Remove
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleApplyCoupon()}
                  className="px-5 py-2.5 rounded-xl bg-[#271310] text-[#ffffff] font-jakarta text-xs font-bold hover:bg-[#3e2723] transition-colors cursor-pointer shadow-xs active:scale-95"
                >
                  Apply
                </button>
              )}
            </div>

            {/* Error or Success Feedback */}
            {promoError && (
              <p className="text-xs text-[#ba1a1a] font-jakarta font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span>
                {promoError}
              </p>
            )}

            {promoSuccessMessage && appliedPromo && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs font-jakarta text-emerald-900">
                <span className="font-semibold">{promoSuccessMessage}</span>
                <span className="font-bold font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                  -{appliedPromo.discountPercent}%
                </span>
              </div>
            )}

            {/* Quick Available Festival Codes */}
            <div className="pt-1">
              <p className="text-[11px] text-[#655d5a] font-jakarta font-medium mb-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">celebration</span>
                Tap to apply active festival codes:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {FESTIVAL_PROMOTIONS.map((fest) => {
                  const isCurrent = appliedPromo?.promoCode === fest.promoCode;
                  return (
                    <button
                      key={fest.id}
                      type="button"
                      onClick={() => handleApplyCoupon(fest.promoCode)}
                      className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                        isCurrent
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                          : 'bg-[#efeeea] text-[#271310] hover:bg-[#eae8e4] border-[#d3c3c0]/60'
                      }`}
                    >
                      <span>{fest.promoCode}</span>
                      <span className="text-[10px] opacity-80">({fest.discountPercent}% off)</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Order Summary Preview (Compact) */}
        <section className="space-y-3">
          <h2 className="font-literata text-xl font-bold text-[#271310] border-b border-[#e4e2de] pb-2">
            Order Summary
          </h2>

          <div className="space-y-2.5 bg-[#ffffff] p-4 rounded-2xl border border-[#efeeea] shadow-[0_2px_8px_rgba(62,39,35,0.03)]">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#ece0dc] rounded-xl flex items-center justify-center text-[#271310] font-bold text-xs font-jakarta">
                    {item.quantity}x
                  </div>
                  <div>
                    <p className="text-[#271310] font-semibold text-sm font-jakarta">
                      {item.name}
                    </p>
                    <p className="text-xs text-[#655d5a] font-jakarta">
                      {item.notes || `${item.size} size`}
                    </p>
                  </div>
                </div>
                <p className="text-[#271310] font-bold text-sm font-jakarta">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}

            <div className="pt-2 border-t border-[#efeeea] space-y-1.5 text-xs text-[#504442] font-jakarta">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="font-semibold text-[#271310]">${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-emerald-700 font-bold">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">local_offer</span>
                    Festival Discount ({appliedPromo?.promoCode})
                  </span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-[#271310]">${estimatedTax.toFixed(2)}</span>
              </div>

              {orderType === 'Delivery' && (
                <div className="flex justify-between items-center">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-[#271310]">$2.50</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Payment Method Section */}
        <section className="space-y-3">
          <h2 className="font-literata text-xl font-bold text-[#271310] border-b border-[#e4e2de] pb-2">
            Payment Method
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {paymentList.map((pm) => {
              const isSelected = selectedPaymentId === pm.id;
              return (
                <label
                  key={pm.id}
                  onClick={() => setSelectedPaymentId(pm.id)}
                  className={`rounded-2xl p-4 flex items-center justify-between cursor-pointer border-2 transition-all shadow-[0_2px_8px_rgba(62,39,35,0.03)] ${
                    isSelected
                      ? 'bg-[#ece0dc]/60 border-[#271310] shadow-md -translate-y-0.5'
                      : 'bg-[#ffffff] border-transparent hover:border-[#d3c3c0] hover:bg-[#f5f3ef]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-2xl ${
                        isSelected ? 'text-[#271310]' : 'text-[#655d5a]'
                      }`}
                    >
                      {pm.icon}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-[#1b1c1a] font-jakarta">
                        {pm.label}
                      </span>
                      {pm.expiry ? (
                        <span className="text-xs text-[#655d5a] font-jakarta">{pm.expiry}</span>
                      ) : (
                        <span className="text-xs text-[#655d5a] font-jakarta">{pm.detail}</span>
                      )}
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-[#271310] bg-[#271310]' : 'border-[#827472]'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-[#ffffff]"></div>}
                  </div>
                </label>
              );
            })}

            {/* Add New Payment Method Button */}
            <button
              onClick={() => setIsAddPaymentModalOpen(true)}
              className="sm:col-span-2 bg-transparent border border-dashed border-[#827472] rounded-2xl p-4 flex items-center justify-center gap-2 text-[#271310] hover:bg-[#efeeea] transition-colors cursor-pointer text-sm font-semibold font-jakarta"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>Add new payment method</span>
            </button>
          </div>
        </section>
      </main>

      {/* Fixed Bottom Checkout Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#efeeea] border-t border-[#d3c3c0] shadow-[0_-4px_16px_rgba(62,39,35,0.08)] rounded-t-2xl p-4 z-40">
        <div className="max-w-[800px] mx-auto">
          <div className="flex justify-between items-end mb-3">
            <span className="text-xs sm:text-sm text-[#504442] font-jakarta">
              Total (incl. tax{orderType === 'Delivery' ? ' & delivery' : ''})
            </span>
            <span className="font-literata text-2xl sm:text-3xl font-bold text-[#271310]">
              ${total.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isProcessingOrder || cartItems.length === 0}
            className="w-full bg-[#271310] text-[#ffffff] py-4 rounded-full font-jakarta text-xs sm:text-sm font-bold uppercase tracking-wider relative overflow-hidden group hover:opacity-95 active:scale-[0.98] transition-all flex justify-center items-center gap-2 shadow-[0_4px_16px_rgba(39,19,16,0.2)] cursor-pointer disabled:opacity-50"
          >
            {isProcessingOrder ? (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                Brewing your order...
              </span>
            ) : (
              <>
                <span>Place Order</span>
                <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Location Picker Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#fbf9f5] rounded-3xl p-6 w-full max-w-md border border-[#efeeea] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-literata text-xl font-bold text-[#271310]">
                Choose Store Location
              </h3>
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="p-1 rounded-full text-[#827472] hover:text-[#271310]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {PICKUP_LOCATIONS.map((loc) => {
                const isSelected = selectedLocation.id === loc.id;
                return (
                  <div
                    key={loc.id}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setIsLocationModalOpen(false);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#271310] bg-[#ece0dc]/60'
                        : 'border-[#d3c3c0] bg-white hover:bg-[#f5f3ef]'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-[#271310] text-sm font-jakarta">
                        {loc.name}
                      </h4>
                      <span className="text-xs font-semibold text-[#655d5a]">{loc.distance}</span>
                    </div>
                    <p className="text-xs text-[#504442] mt-0.5">{loc.address}</p>
                    <p className="text-xs text-[#827472] mt-1">Ready in ~{loc.estimatedMinutes} mins</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Method Modal */}
      {isAddPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#fbf9f5] rounded-3xl p-6 w-full max-w-md border border-[#efeeea] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-literata text-xl font-bold text-[#271310]">
                Add Payment Card
              </h3>
              <button
                onClick={() => setIsAddPaymentModalOpen(false)}
                className="p-1 rounded-full text-[#827472] hover:text-[#271310]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddNewPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#655d5a] mb-1 font-jakarta">
                  Card Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="4242 •••• •••• 4242"
                  value={newCardNumber}
                  onChange={(e) => setNewCardNumber(e.target.value)}
                  maxLength={19}
                  className="w-full bg-white border border-[#d3c3c0] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#271310] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#655d5a] mb-1 font-jakarta">
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="12/28"
                    value={newCardExpiry}
                    onChange={(e) => setNewCardExpiry(e.target.value)}
                    maxLength={5}
                    className="w-full bg-white border border-[#d3c3c0] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#271310] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#655d5a] mb-1 font-jakarta">
                    CVC
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="888"
                    maxLength={4}
                    className="w-full bg-white border border-[#d3c3c0] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#271310] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-[#271310] text-white py-3.5 rounded-full font-jakarta text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
              >
                Save Payment Card
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
