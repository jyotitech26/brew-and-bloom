import React, { useState } from 'react';
import { ProductItem, CartItem } from '../types';
import { BotanicalDivider } from './BotanicalDivider';

interface ProductDetailScreenProps {
  product: ProductItem;
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  onBack: () => void;
  onOpenCart: () => void;
  cartCount: number;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  onAddToCart,
  onBack,
  onOpenCart,
  cartCount,
}) => {
  const defaultSize = product.sizes?.find((s) => s.name === 'Medium')?.name || product.sizes?.[0]?.name || 'Medium';
  const [selectedSize, setSelectedSize] = useState<string>(defaultSize);
  const [selectedMilkId, setSelectedMilkId] = useState<string>(product.milks?.[0]?.id || 'whole');
  const [selectedTemp, setSelectedTemp] = useState<string>(product.temperatures?.[0] || 'Hot');
  const [selectedSweetness, setSelectedSweetness] = useState<string>(product.sweetnessLevels?.[0] || 'Regular Honey');
  const [isAddedToast, setIsAddedToast] = useState(false);

  // Compute live price
  const sizeOption = product.sizes?.find((s) => s.name === selectedSize);
  const sizeDelta = sizeOption ? sizeOption.priceDelta : 0;
  const milkOption = product.milks?.find((m) => m.id === selectedMilkId);
  const milkDelta = milkOption ? milkOption.priceDelta : 0;
  const calculatedPrice = Number((product.price + sizeDelta + milkDelta).toFixed(2));

  const handleAdd = () => {
    const milkName = milkOption ? milkOption.name : undefined;
    const notesList: string[] = [];
    if (milkName) notesList.push(milkName);
    if (selectedTemp && selectedTemp !== 'Hot' && selectedTemp !== 'Cold with Regular Ice') {
      notesList.push(selectedTemp);
    }
    if (selectedSweetness && selectedSweetness !== 'Regular Honey') {
      notesList.push(selectedSweetness);
    }

    onAddToCart({
      productId: product.id,
      name: product.name,
      basePrice: product.price,
      price: calculatedPrice,
      size: selectedSize,
      milk: milkName,
      temperature: selectedTemp,
      sweetness: selectedSweetness,
      notes: notesList.length > 0 ? notesList.join(', ') : `${selectedSize} size`,
      quantity: 1,
      image: product.image,
    });

    setIsAddedToast(true);
    setTimeout(() => {
      setIsAddedToast(false);
    }, 2200);
  };

  return (
    <div className="w-full min-h-screen bg-[#fbf9f5] pb-28 pt-16">
      {/* Top Header */}
      <header className="bg-[#fbf9f5]/95 backdrop-blur-md border-b border-[#efeeea] text-[#271310] fixed top-0 left-0 right-0 z-40 shadow-xs">
        <div className="max-w-[1240px] mx-auto w-full px-4 sm:px-8 h-16 flex justify-between items-center">
          <button
            onClick={onBack}
            className="hover:opacity-80 transition-opacity active:scale-95 duration-150 p-2 -ml-2 rounded-full text-[#504442] hover:bg-[#eae8e4] flex items-center justify-center cursor-pointer"
            aria-label="Go back to menu"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>

          <span className="font-literata text-xl sm:text-2xl font-bold tracking-tight text-[#271310] select-none">
            Brew &amp; Bloom
          </span>

          <button
            onClick={onOpenCart}
            className="hover:opacity-80 transition-opacity active:scale-95 duration-150 p-2 -mr-2 rounded-full text-[#271310] hover:bg-[#eae8e4] flex items-center justify-center relative cursor-pointer"
            aria-label="Shopping Cart"
          >
            <span className="material-symbols-outlined text-2xl">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-[#271310] text-[#ffffff] text-[11px] font-bold h-4.5 min-w-4.5 px-1 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Added Toast Notification */}
      {isAddedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#271310] text-white px-5 py-2.5 rounded-full shadow-lg text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="material-symbols-outlined text-base text-[#dbe6cf]">check_circle</span>
          Added to your order!
        </div>
      )}

      {/* Main Content */}
      <main className="w-full max-w-[600px] lg:max-w-[760px] mx-auto px-4 sm:px-6 pt-4">
        {/* Product Hero Image */}
        <div className="w-full h-[320px] sm:h-[380px] relative rounded-3xl overflow-hidden shadow-sm bg-[#e4e2de]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#271310]/25 via-transparent to-transparent"></div>
        </div>

        {/* Product Details */}
        <div className="py-6">
          {/* Title & Price */}
          <div className="flex justify-between items-start mb-2 gap-4">
            <h1 className="font-literata text-2xl sm:text-3xl lg:text-4xl font-bold text-[#271310]">
              {product.name}
            </h1>
            <span className="font-literata text-2xl sm:text-3xl text-[#655d5a] font-semibold whitespace-nowrap">
              ${calculatedPrice.toFixed(2)}
            </span>
          </div>

          {/* Botanical Divider */}
          <BotanicalDivider className="my-2" />

          {/* Description */}
          <p className="font-jakarta text-[#504442] text-[15px] sm:text-base leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Customization: Size */}
          {product.sizes && product.sizes.length > 0 && (
            <section className="mb-8">
              <h3 className="text-xs font-bold text-[#655d5a] uppercase tracking-widest mb-3 font-jakarta">
                Select Size
              </h3>
              <div className="flex gap-3">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size.name;
                  return (
                    <button
                      key={size.name}
                      onClick={() => setSelectedSize(size.name)}
                      className={`flex-1 py-3 px-2 rounded-xl text-sm sm:text-base text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-2 border-[#271310] bg-[#ece0dc] text-[#271310] font-semibold shadow-[0_4px_8px_rgba(62,39,35,0.06)]'
                          : 'border border-[#d3c3c0] bg-[#fbf9f5] text-[#504442] hover:bg-[#efeeea]'
                      }`}
                    >
                      {size.name}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Customization: Milk Preference */}
          {product.milks && product.milks.length > 0 && (
            <section className="mb-8">
              <h3 className="text-xs font-bold text-[#655d5a] uppercase tracking-widest mb-3 font-jakarta">
                Milk Preference
              </h3>
              <div className="flex flex-col gap-3">
                {product.milks.map((milk) => {
                  const isSelected = selectedMilkId === milk.id;
                  return (
                    <label
                      key={milk.id}
                      onClick={() => setSelectedMilkId(milk.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer shadow-[0_2px_4px_rgba(62,39,35,0.02)] ${
                        isSelected
                          ? 'border-[#271310] bg-[#ece0dc]/40'
                          : 'border-[#d3c3c0] bg-[#fbf9f5] hover:bg-[#efeeea]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#655d5a] font-light text-xl">
                          {milk.icon || 'water_drop'}
                        </span>
                        <div>
                          <span className="text-[#1b1c1a] font-medium text-[15px] block font-jakarta">
                            {milk.name}
                          </span>
                          {milk.description && (
                            <span className="text-xs text-[#655d5a] block font-jakarta">
                              {milk.description}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {milk.priceDelta > 0 && (
                          <span className="text-sm font-medium text-[#655d5a] font-jakarta">
                            +${milk.priceDelta.toFixed(2)}
                          </span>
                        )}
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'border-[#271310] bg-[#271310]'
                              : 'border-[#827472] bg-transparent'
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-[#ffffff]"></div>
                          )}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </section>
          )}

          {/* Temperature / Preparation Optional Selectors */}
          {product.temperatures && product.temperatures.length > 0 && (
            <section className="mb-6">
              <h3 className="text-xs font-bold text-[#655d5a] uppercase tracking-widest mb-3 font-jakarta">
                {product.category === 'Bakery' ? 'Preparation' : 'Temperature & Ice'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.temperatures.map((temp) => (
                  <button
                    key={temp}
                    onClick={() => setSelectedTemp(temp)}
                    className={`py-2 px-4 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      selectedTemp === temp
                        ? 'bg-[#271310] text-white shadow-xs'
                        : 'bg-[#efeeea] text-[#504442] hover:bg-[#eae8e4]'
                    }`}
                  >
                    {temp}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Sweetness Selector */}
          {product.sweetnessLevels && product.sweetnessLevels.length > 0 && (
            <section className="mb-8">
              <h3 className="text-xs font-bold text-[#655d5a] uppercase tracking-widest mb-3 font-jakarta">
                Sweetness Level
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sweetnessLevels.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedSweetness(lvl)}
                    className={`py-2 px-4 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      selectedSweetness === lvl
                        ? 'bg-[#271310] text-white shadow-xs'
                        : 'bg-[#efeeea] text-[#504442] hover:bg-[#eae8e4]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Add to Order Sticky Action Button */}
          <div className="w-full pt-4">
            <button
              onClick={handleAdd}
              className="w-full bg-[#271310] text-[#ffffff] font-semibold text-base py-4 rounded-full shadow-[0_4px_16px_rgba(39,19,16,0.2)] hover:opacity-95 active:scale-[0.98] transition-all flex justify-center items-center gap-2 border-t border-white/20 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl material-symbols-filled">
                shopping_bag
              </span>
              <span>Add to Order • ${calculatedPrice.toFixed(2)}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
