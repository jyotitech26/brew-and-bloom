import React, { useState, useMemo } from 'react';
import { ProductItem } from '../types';
import { BotanicalDivider } from './BotanicalDivider';

interface HomeScreenProps {
  products: ProductItem[];
  onSelectProduct: (product: ProductItem) => void;
  onQuickAdd: (product: ProductItem) => void;
  onToggleFavorite: (productId: string) => void;
  favoriteIds: string[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  products,
  onSelectProduct,
  onQuickAdd,
  onToggleFavorite,
  favoriteIds,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

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
    <main className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-6 pb-28">
      {/* Hero Greeting Section */}
      <section className="mb-8">
        <h2 className="font-literata text-2xl sm:text-3xl lg:text-4xl font-bold text-[#271310] mb-1">
          Good Morning, Coffee Lover
        </h2>
        <p className="font-jakarta text-base sm:text-lg text-[#504442] mb-6">
          What are we brewing for you today?
        </p>

        {/* Search Bar */}
        <div className="relative w-full mb-6 max-w-2xl">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#504442] text-xl">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for your favorite brew..."
            className="w-full bg-[#efeeea] rounded-full py-3.5 pl-12 pr-10 text-[#1b1c1a] placeholder:text-[#827472] border border-transparent focus:border-[#827472] focus:bg-[#ffffff] outline-none transition-all text-sm sm:text-base font-jakarta"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#827472] hover:text-[#271310] p-1"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        {/* Categories Carousel */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`snap-start shrink-0 px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-[#655d5a] text-[#ffffff] shadow-[0_2px_8px_rgba(62,39,35,0.12)] -translate-y-0.5'
                    : 'bg-[#efeeea] text-[#1b1c1a] hover:bg-[#e4e2de]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Botanical Divider */}
      <BotanicalDivider variant="wave" className="my-6" />

      {/* Featured Brews Header */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="font-literata text-2xl font-bold text-[#271310]">
              {selectedCategory === 'All' ? 'Featured Brews' : selectedCategory}
            </h3>
            <p className="text-xs text-[#655d5a] font-jakarta">Handcrafted with organic botanical ingredients</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProducts.map((product) => {
              const isFav = favoriteIds.includes(product.id);
              return (
                <div
                  key={product.id}
                  className="group relative rounded-2xl overflow-hidden bg-[#f5f3ef] border border-[#efeeea] shadow-[0_4px_16px_rgba(62,39,35,0.04)] hover:shadow-[0_8px_24px_rgba(62,39,35,0.08)] hover:-translate-y-1 transition-all duration-300 p-4 sm:p-5 flex flex-col sm:flex-row gap-5 cursor-pointer"
                  onClick={() => onSelectProduct(product)}
                >
                  {/* Card Thumbnail Image */}
                  <div className="w-full sm:w-44 h-48 sm:h-44 rounded-xl overflow-hidden shrink-0 relative bg-[#eae8e4]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(product.id);
                      }}
                      className="absolute top-2 right-2 bg-[#fbf9f5]/85 backdrop-blur-sm rounded-full p-2 hover:bg-[#ffffff] transition-colors shadow-xs z-10 cursor-pointer"
                      aria-label="Toggle favorite"
                    >
                      <span
                        className={`material-symbols-outlined text-base ${
                          isFav
                            ? 'text-[#ba1a1a] material-symbols-filled'
                            : 'text-[#271310]'
                        }`}
                      >
                        favorite
                      </span>
                    </button>

                    {/* Category Pill */}
                    <span className="absolute bottom-2 left-2 bg-[#271310]/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full font-jakarta tracking-wide">
                      {product.category}
                    </span>
                  </div>

                  {/* Card Content Details */}
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex justify-between items-start mb-1.5 gap-2">
                        <h4 className="font-literata text-lg sm:text-xl font-bold text-[#271310] leading-tight">
                          {product.headlineTitle ? (
                            product.headlineTitle.split('\n').map((line, i) => (
                              <React.Fragment key={i}>
                                {line}
                                {i < product.headlineTitle!.split('\n').length - 1 && <br />}
                              </React.Fragment>
                            ))
                          ) : (
                            product.name
                          )}
                        </h4>
                        <span className="font-literata text-lg font-semibold text-[#655d5a] whitespace-nowrap">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="font-jakarta text-xs sm:text-sm text-[#504442] line-clamp-2 leading-relaxed mb-4">
                        {product.subtitle || product.description}
                      </p>
                    </div>

                    {/* Add to Order Action Button */}
                    <div className="flex items-center gap-2 mt-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickAdd(product);
                        }}
                        className="w-full sm:w-auto self-start bg-[#271310] text-[#ffffff] font-jakarta text-xs font-semibold py-2.5 px-5 rounded-xl hover:bg-[#3e2723] transition-colors shadow-[0_4px_12px_rgba(62,39,35,0.12)] flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                        <span>Add to Order</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(product);
                        }}
                        className="py-2.5 px-3 rounded-xl border border-[#d3c3c0] text-[#504442] hover:bg-[#eae8e4] text-xs font-medium font-jakarta"
                        title="Customize details"
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
    </main>
  );
};
