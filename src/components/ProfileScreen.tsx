import React from 'react';
import { PlacedOrder } from '../types';
import { BotanicalDivider } from './BotanicalDivider';

interface ProfileScreenProps {
  orderHistory: PlacedOrder[];
  onReorder?: (order: PlacedOrder) => void;
  onNavigateToHome?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  orderHistory,
  onReorder,
  onNavigateToHome,
}) => {
  return (
    <main className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-6 pb-28">
      {/* Member Card */}
      <section className="bg-[#f5f3ef] rounded-3xl p-6 sm:p-8 border border-[#efeeea] shadow-[0_4px_20px_rgba(62,39,35,0.04)] mb-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-[#ece0dc] border-2 border-[#271310] flex items-center justify-center text-[#271310] shadow-sm">
          <span className="material-symbols-outlined text-4xl material-symbols-filled">
            local_florist
          </span>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <h2 className="font-literata text-2xl font-bold text-[#271310]">
              Elena Vance
            </h2>
            <span className="inline-block bg-[#271310] text-[#ffffff] text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full font-jakarta self-center sm:self-auto">
              Artisan Connoisseur
            </span>
          </div>
          <p className="font-jakarta text-xs sm:text-sm text-[#504442]">
            elena.vance@botanicalcoffee.com • Member since 2024
          </p>
          <div className="flex flex-wrap gap-4 mt-3 justify-center sm:justify-start text-xs text-[#655d5a] font-jakarta">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-[#271310]">coffee</span>
              28 Brews Ordered
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-[#271310]">eco</span>
              140 Bloom Seeds
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-[#271310]">location_on</span>
              Downtown Sanctuary
            </span>
          </div>
        </div>
      </section>

      <BotanicalDivider className="my-6" />

      {/* Order History */}
      <section className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-literata text-2xl font-bold text-[#271310]">
            Recent Orders
          </h3>
          <span className="text-xs text-[#655d5a] font-jakarta">
            {orderHistory.length} orders total
          </span>
        </div>

        {orderHistory.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#efeeea]">
            <p className="font-literata text-lg text-[#271310] font-semibold mb-1">
              No recent orders yet
            </p>
            <p className="text-sm text-[#504442] mb-4 font-jakarta">
              Place your first order to start earning Bloom Seeds!
            </p>
            <button
              onClick={onNavigateToHome}
              className="bg-[#271310] text-white text-xs font-bold px-5 py-2.5 rounded-full font-jakarta uppercase tracking-wider cursor-pointer"
            >
              Order Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orderHistory.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-5 border border-[#efeeea] shadow-[0_2px_8px_rgba(62,39,35,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-literata text-base font-bold text-[#271310]">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs bg-[#efeeea] text-[#655d5a] font-semibold px-2.5 py-0.5 rounded-full font-jakarta">
                      {order.orderType} • {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#504442] font-jakarta">
                    {order.items.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
                  </p>
                  <p className="text-[11px] text-[#827472] font-jakarta">
                    {order.createdAt} at {order.location.name}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#efeeea]">
                  <span className="font-literata text-lg font-bold text-[#271310]">
                    ${order.total.toFixed(2)}
                  </span>
                  {onReorder && (
                    <button
                      onClick={() => onReorder(order)}
                      className="bg-[#ece0dc] text-[#271310] hover:bg-[#d3c3c0] text-xs font-bold px-4 py-2 rounded-full font-jakarta uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Account Settings / Preferences */}
      <section className="mt-10 space-y-3">
        <h3 className="font-literata text-xl font-bold text-[#271310] mb-3">
          Preferences &amp; Rituals
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-[#efeeea] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#655d5a]">notifications</span>
              <div>
                <p className="text-sm font-semibold text-[#1b1c1a] font-jakarta">Order Status Alerts</p>
                <p className="text-xs text-[#827472]">SMS &amp; Push when brew is ready</p>
              </div>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4 text-[#271310] rounded" />
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#efeeea] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#655d5a]">spa</span>
              <div>
                <p className="text-sm font-semibold text-[#1b1c1a] font-jakarta">Botanical Specials</p>
                <p className="text-xs text-[#827472]">Seasonal wildflower syrup drops</p>
              </div>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4 text-[#271310] rounded" />
          </div>
        </div>
      </section>
    </main>
  );
};
