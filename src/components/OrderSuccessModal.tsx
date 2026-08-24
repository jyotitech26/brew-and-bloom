import React from 'react';
import { PlacedOrder } from '../types';

interface OrderSuccessModalProps {
  order: PlacedOrder;
  onClose: () => void;
  onViewOrderHistory: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onViewOrderHistory,
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#fbf9f5] rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-[#efeeea] shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        {/* Top Success Badge */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#dbe6cf] text-[#121b0d] rounded-full flex items-center justify-center mx-auto mb-3 shadow-xs">
            <span className="material-symbols-outlined text-3xl material-symbols-filled">
              check_circle
            </span>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#655d5a] font-jakarta">
            Order Confirmed
          </span>
          <h2 className="font-literata text-2xl sm:text-3xl font-bold text-[#271310] mt-1">
            We're Brewing Your Cup!
          </h2>
          <p className="text-xs sm:text-sm text-[#504442] font-jakarta mt-1">
            Order <span className="font-bold text-[#271310]">{order.orderNumber}</span> • Est. {order.orderType === 'Pickup' ? 'pickup' : 'delivery'} at{' '}
            <span className="font-bold text-[#271310]">{order.estimatedPickupTime}</span>
          </p>
        </div>

        {/* Live Brewing Progress Card */}
        <div className="bg-[#ece0dc]/60 rounded-2xl p-4 sm:p-5 mb-6 border border-[#d3c3c0]/60">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#271310] font-jakarta">
              Brew Status
            </span>
            <span className="text-xs font-semibold text-[#8d9884] bg-[#ffffff] px-2.5 py-0.5 rounded-full font-jakarta">
              Step 2 of 3: Extracting Espresso
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-jakarta">
            <div className="bg-[#271310] text-white p-2.5 rounded-xl">
              <span className="material-symbols-outlined text-base block mb-0.5">receipt_long</span>
              Received
            </div>
            <div className="bg-[#271310] text-white p-2.5 rounded-xl shadow-xs ring-2 ring-[#8d9884]">
              <span className="material-symbols-outlined text-base block mb-0.5 animate-pulse">local_cafe</span>
              Brewing
            </div>
            <div className="bg-[#fbf9f5] text-[#827472] p-2.5 rounded-xl border border-[#d3c3c0]">
              <span className="material-symbols-outlined text-base block mb-0.5">check</span>
              Ready
            </div>
          </div>
        </div>

        {/* Destination Location Info */}
        <div className="bg-white rounded-2xl p-4 mb-6 border border-[#efeeea] space-y-2">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#271310]">
              {order.orderType === 'Pickup' ? 'storefront' : 'local_shipping'}
            </span>
            <div>
              <p className="text-sm font-bold text-[#271310] font-jakarta">
                {order.location.name}
              </p>
              <p className="text-xs text-[#504442] font-jakarta">{order.location.address}</p>
            </div>
          </div>
        </div>

        {/* Receipt Items Breakdown */}
        <div className="border-t border-b border-[#e4e2de] py-4 mb-6 space-y-2 text-xs font-jakarta">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <span className="text-[#1b1c1a]">
                {item.quantity}x {item.name} {item.milk ? `(${item.milk})` : ''}
              </span>
              <span className="font-bold text-[#271310]">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
          <div className="pt-2 border-t border-[#efeeea] flex justify-between text-sm font-bold font-literata text-[#271310]">
            <span>Paid with {order.paymentMethod.label}</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onClose}
            className="w-full bg-[#271310] text-[#ffffff] font-jakarta text-xs sm:text-sm font-bold py-3.5 rounded-full uppercase tracking-wider hover:bg-[#3e2723] transition-colors cursor-pointer"
          >
            Back to Menu
          </button>
          <button
            onClick={onViewOrderHistory}
            className="w-full bg-transparent border border-[#827472] text-[#271310] font-jakarta text-xs font-bold py-3 rounded-full uppercase tracking-wider hover:bg-[#eae8e4] transition-colors cursor-pointer"
          >
            View in Order History
          </button>
        </div>
      </div>
    </div>
  );
};
