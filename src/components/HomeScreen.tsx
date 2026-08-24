import React, { useState, useMemo } from 'react';
import { ProductItem, FestivalPromotion } from '../types';
import { BotanicalDivider } from './BotanicalDivider';
import { FestivalPromoBanner } from './FestivalPromoBanner';

interface HomeScreenProps {
  products: ProductItem[];
  promotions: FestivalPromotion[];
  activePromo: FestivalPromotion;
  onSelectPromo: (promo: FestivalPromotion) => void;
  onApplyPromoCode: (code: string) => void;
  appliedPromoCode?: string;
  onSelectProduct: (product: ProductItem) => void;
  onQuickAdd: (product: ProductItem) => void;
  onOpenCart?: () => void;
  onToggleFavorite: (productId: string) => void;
  favoriteIds: string[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  products,
  promotions,
  activePromo,
  onSelectPromo,
  onApplyPromoCode,
  appliedPromoCode,
  onSelectProduct,
  onQuickAdd,
  onOpenCart,
  onToggleFavorite,
  favoriteIds,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [recentlyAddedProduct, setRecentlyAddedProduct] = useState<ProductItem | null>(null);
  const [addedButtonId, setAddedButtonId] = useState<string | null>(null);

  const categories = ['All', 'Hot Coffee', 'Cold Brew', 'Tea', 'Bakery'];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <main className="max-w-[1240px] mx-auto px-4 sm:px-8 pt-6 pb-28">
      {/* Interactive Festival Promo Showcase */}
      <FestivalPromoBanner
        promotions={promotions}
        activePromo={activePromo}
        onSelectPromo={onSelectPromo}
        onApplyPromoCode={onApplyPromoCode}
        appliedPromoCode={appliedPromoCode}
      />

      {/* Hero Greeting & Search Section */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="font-literata text-2xl sm:text-3xl lg:text-4xl font-bold text-[#271310] tracking-tight mb-1">
              Good Morning, Coffee Lover
            </h2>
            <p className="font-jakarta text-sm sm:text-base text-[#504442]">
              What botanical brew can we craft for you today?
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#827472] font-jakarta bg-[#efeeea] px-3.5 py-1.5 rounded-full self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>{filteredProducts.length} Artisanal Brews Available</span>
          </div>
        </div>

        {/* Search Bar & Category Filter Row */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-xl">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#827472] text-xl">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ingredients, or festival specials..."
              className="w-full bg-[#efeeea] rounded-full py-3.5 pl-12 pr-10 text-[#1b1c1a] placeholder:text-[#827472] border border-transparent focus:border-[#827472] focus:bg-[#ffffff] outline-none transition-all text-sm font-jakarta shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#827472] hover:text-[#271310] p-1 cursor-pointer"
                aria-label="Clear search"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          {/* Categories Carousel */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x shrink-0">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`snap-start px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#271310] text-[#ffffff] shadow-xs scale-[1.02]'
                      : 'bg-[#efeeea] text-[#504442] hover:bg-[#e4e2de] hover:text-[#271310]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Botanical Divider */}
      <BotanicalDivider variant="wave" className="my-6" />

      {/* Featured Brews Header */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="font-literata text-2xl font-bold text-[#271310]">
              {selectedCategory === 'All' ? 'Featured Brews & Festival Specials' : selectedCategory}
            </h3>
            <p className="text-xs text-[#655d5a] font-jakarta">Handcrafted with organic botanical ingredients & local roasted beans</p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="text-xs font-semibold text-[#655d5a] hover:text-[#271310] transition-colors font-jakarta cursor-pointer uppercase tracking-wider"
          >
            View All
          </button>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-[#efeeea]/50 rounded-2xl p-6">
            <span className="material-symbols-outlined text-4xl text-[#827472] mb-2">
              local_cafe
            </span>
            <p className="font-literata text-lg text-[#271310] font-semibold mb-1">
              No matching brews found
            </p>
            <p className="text-sm text-[#655d5a] font-jakarta mb-4">
              Try searching with another keyword or browse all categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="bg-[#271310] text-white text-xs font-semibold px-4 py-2 rounded-full cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const isFav = favoriteIds.includes(product.id);
              const isFestivalFeatured = activePromo.featuredDrinkIds?.includes(product.id);

              return (
                <div
                  key={product.id}
                  className={`group relative rounded-2xl overflow-hidden bg-[#ffffff] border shadow-[0_4px_18px_rgba(62,39,35,0.04)] hover:shadow-[0_12px_28px_rgba(62,39,35,0.09)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col cursor-pointer ${
                    isFestivalFeatured ? 'border-[#ba1a1a]/40 ring-1 ring-[#ba1a1a]/20' : 'border-[#efeeea]'
                  }`}
                  onClick={() => onSelectProduct(product)}
                >
                  {/* Card Thumbnail Image */}
                  <div className="w-full h-52 relative overflow-hidden bg-[#eae8e4]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Top Badges & Favorite Button */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <div className="flex items-center gap-1.5 pointer-events-auto">
                        <span className="bg-[#271310]/85 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full font-jakarta tracking-wide">
                          {product.category}
                        </span>
                        {isFestivalFeatured && (
                          <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-jakarta shadow-xs flex items-center gap-1 border border-emerald-500/40">
                            <span className="material-symbols-outlined text-[12px]">celebration</span>
                            Festive
                          </span>
                        )}
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(product.id);
                        }}
                        className="bg-[#ffffff]/90 hover:bg-[#ffffff] backdrop-blur-md rounded-full p-2 text-[#271310] transition-transform active:scale-90 shadow-sm pointer-events-auto cursor-pointer"
                        aria-label="Toggle favorite"
                      >
                        <span
                          className={`material-symbols-outlined text-base ${
                            isFav
                              ? 'text-[#ba1a1a] material-symbols-filled'
                              : 'text-[#504442]'
                          }`}
                        >
                          favorite
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Card Content Details */}
                  <div className="p-5 flex flex-col flex-1 justify-between gap-3 bg-[#fdfcfa]">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h4 className="font-literata text-lg font-bold text-[#271310] group-hover:text-[#655d5a] transition-colors leading-snug">
                          {product.name}
                        </h4>
                        <div className="text-right shrink-0">
                          <span className="font-literata text-lg font-bold text-[#271310]">
                            ${product.price.toFixed(2)}
                          </span>
                          {isFestivalFeatured && (
                            <p className="text-[10px] text-emerald-700 font-bold font-jakarta">
                              -${(product.price * (activePromo.discountPercent / 100)).toFixed(2)} off
                            </p>
                          )}
                        </div>
                      </div>

                      <p className="font-jakarta text-xs text-[#655d5a] line-clamp-2 leading-relaxed">
                        {product.subtitle || product.description}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-[#f2f0ec]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickAdd(product);
                          setAddedButtonId(product.id);
                          setRecentlyAddedProduct(product);
                          setTimeout(() => {
                            setAddedButtonId((prev) => (prev === product.id ? null : prev));
                          }, 2000);
                          setTimeout(() => {
                            setRecentlyAddedProduct((prev) => (prev?.id === product.id ? null : prev));
                          }, 4000);
                        }}
                        className={`flex-1 font-jakarta text-xs font-semibold py-2.5 px-4 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                          addedButtonId === product.id
                            ? 'bg-emerald-700 text-white'
                            : 'bg-[#271310] text-[#ffffff] hover:bg-[#3e2723]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {addedButtonId === product.id ? 'check' : 'add'}
                        </span>
                        <span>{addedButtonId === product.id ? 'Added!' : 'Quick Order'}</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(product);
                        }}
                        className="py-2.5 px-3.5 rounded-xl border border-[#d3c3c0] text-[#504442] hover:bg-[#f5f3ef] hover:text-[#271310] text-xs font-semibold font-jakarta transition-colors cursor-pointer"
                        title="Customize size, milk, sweetness"
                      >
                        Customize
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Instant Quick Order Floating Notification Toast */}
      {recentlyAddedProduct && (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#271310] text-[#fbf9f5] px-5 py-3.5 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)] flex items-center justify-between gap-4 border border-white/15 animate-in fade-in slide-in-from-bottom-5 duration-300 w-[92%] max-w-md">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="material-symbols-outlined text-emerald-400 text-2xl shrink-0">check_circle</span>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold font-jakarta text-white truncate">
                {recentlyAddedProduct.name}
              </p>
              <p className="text-[11px] text-[#ae8d87] font-jakarta">Added to your order bag</p>
            </div>
          </div>
          {onOpenCart && (
            <button
              onClick={onOpenCart}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-jakarta px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer shrink-0 flex items-center gap-1.5 active:scale-95"
            >
              <span>View Cart</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          )}
        </div>
      )}
    </main>
  );
};

