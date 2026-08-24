/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ProductItem, CartItem, PlacedOrder, FestivalPromotion } from './types';
import { PRODUCTS, INITIAL_CART_ITEMS, PICKUP_LOCATIONS, PAYMENT_METHODS, FESTIVAL_PROMOTIONS } from './data/mockData';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar, NavigationTab } from './components/BottomNavBar';
import { HomeScreen } from './components/HomeScreen';
import { ProductDetailScreen } from './components/ProductDetailScreen';
import { CartScreen } from './components/CartScreen';
import { CheckoutScreen } from './components/CheckoutScreen';
import { RewardsScreen } from './components/RewardsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { BrandStoryModal } from './components/BrandStoryModal';
import {
  initAuth,
  saveOrderToFirestore,
  subscribeToOrders,
  syncUserProfile,
  AppUser,
} from './lib/databaseService';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isCheckoutView, setIsCheckoutView] = useState<boolean>(false);
  const [isBrandStoryOpen, setIsBrandStoryOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);

  // Festival Promotions State
  const [promotions] = useState<FestivalPromotion[]>(FESTIVAL_PROMOTIONS);
  const [activePromo, setActivePromo] = useState<FestivalPromotion>(FESTIVAL_PROMOTIONS[0]);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>('EIDMUBARAK');

  // Cart & Order State with Local Storage fallback
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('brew_bloom_cart');
      return saved ? JSON.parse(saved) : INITIAL_CART_ITEMS;
    } catch {
      return INITIAL_CART_ITEMS;
    }
  });

  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('brew_bloom_favs');
      return saved ? JSON.parse(saved) : ['honey-latte', 'lavender-cold-brew'];
    } catch {
      return ['honey-latte', 'lavender-cold-brew'];
    }
  });

  const [orderHistory, setOrderHistory] = useState<PlacedOrder[]>(() => {
    const defaultHistory: PlacedOrder[] = [
      {
        id: 'ord-hist-1',
        orderNumber: '#BB-4921',
        items: [
          {
            id: 'ci-1',
            productId: 'honey-latte',
            name: 'Signature Honey Latte',
            basePrice: 5.50,
            price: 6.25,
            size: 'Medium',
            milk: 'Oat milk',
            notes: 'Oat milk, Warm',
            quantity: 1,
            image: PRODUCTS[0].image,
          },
          {
            id: 'ci-2',
            productId: 'almond-croissant',
            name: 'Almond Croissant',
            basePrice: 4.25,
            price: 4.25,
            size: 'Regular',
            notes: 'Warmed up',
            quantity: 1,
            image: PRODUCTS[2].image,
          }
        ],
        subtotal: 10.50,
        tax: 0.84,
        total: 11.34,
        orderType: 'Pickup',
        location: PICKUP_LOCATIONS[0],
        paymentMethod: PAYMENT_METHODS[0],
        status: 'Completed',
        createdAt: 'Yesterday, 8:45 AM',
        estimatedPickupTime: '8:55 AM',
      }
    ];
    try {
      const saved = localStorage.getItem('brew_bloom_orders');
      return saved ? JSON.parse(saved) : defaultHistory;
    } catch {
      return defaultHistory;
    }
  });

  const [lastPlacedOrder, setLastPlacedOrder] = useState<PlacedOrder | null>(null);

  // Initialize Firebase Auth and Realtime sync
  useEffect(() => {
    const unsubscribeAuth = initAuth((user) => {
      setCurrentUser(user);
      setIsCloudConnected(true);

      // Listen for real-time orders in Cloud Firestore
      const unsubscribeOrders = subscribeToOrders((cloudOrders) => {
        if (cloudOrders.length > 0) {
          setOrderHistory(cloudOrders);
        }
      });

      return () => {
        unsubscribeOrders();
      };
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('brew_bloom_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('brew_bloom_favs', JSON.stringify(favoriteIds));
      if (currentUser) {
        syncUserProfile(currentUser.uid, { favoriteProductIds: favoriteIds });
      }
    } catch (e) {
      console.error(e);
    }
  }, [favoriteIds, currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('brew_bloom_orders', JSON.stringify(orderHistory));
    } catch (e) {
      console.error(e);
    }
  }, [orderHistory]);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Cart operations
  const handleAddToCart = (newItem: Omit<CartItem, 'id'>) => {
    const existingIndex = cartItems.findIndex(
      (it) =>
        it.productId === newItem.productId &&
        it.size === newItem.size &&
        it.milk === newItem.milk &&
        it.notes === newItem.notes
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += newItem.quantity;
      setCartItems(updated);
    } else {
      setCartItems([
        ...cartItems,
        {
          ...newItem,
          id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        },
      ]);
    }
  };

  const handleQuickAdd = (product: ProductItem) => {
    handleAddToCart({
      productId: product.id,
      name: product.name,
      basePrice: product.price,
      price: product.price,
      size: product.sizes?.[0]?.name || 'Medium',
      milk: product.milks?.[0]?.name || undefined,
      notes: product.milks?.[0]?.name ? `${product.milks[0].name}` : 'Regular order',
      quantity: 1,
      image: product.image,
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleFavorite = (productId: string) => {
    setFavoriteIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleOrderCompleted = async (order: PlacedOrder) => {
    // Update local state immediately for snappy UI
    setOrderHistory([order, ...orderHistory]);
    setCartItems([]);
    setIsCheckoutView(false);
    setLastPlacedOrder(order);

    // Save directly to Firebase Firestore Cloud Database
    try {
      await saveOrderToFirestore(order, currentUser?.uid);
    } catch (err) {
      console.error('Failed to sync order to cloud:', err);
    }
  };

  const handleReorder = (order: PlacedOrder) => {
    setCartItems(order.items);
    setActiveTab('order');
    setIsCheckoutView(false);
    setSelectedProduct(null);
  };

  // Render view
  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a] font-sans antialiased flex flex-col selection:bg-[#3e2723] selection:text-[#ae8d87]">
      {/* Top Header - Shown on regular views (hidden during Checkout because Checkout has its own specialized header) */}
      {!isCheckoutView && !selectedProduct && (
        <TopAppBar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setSelectedProduct(null);
            setIsCheckoutView(false);
          }}
          cartCount={totalCartCount}
          isCloudConnected={isCloudConnected}
          onOpenCart={() => {
            setActiveTab('order');
            setSelectedProduct(null);
            setIsCheckoutView(false);
          }}
          onOpenBrandStory={() => setIsBrandStoryOpen(true)}
        />
      )}

      {/* Main View Router */}
      <div className={`flex-1 ${!isCheckoutView && !selectedProduct ? 'pt-16' : ''}`}>
        {selectedProduct ? (
          /* Product Customization Screen (Image 1) */
          <ProductDetailScreen
            product={selectedProduct}
            onAddToCart={(item) => {
              handleAddToCart(item);
            }}
            onBack={() => setSelectedProduct(null)}
            onOpenCart={() => {
              setSelectedProduct(null);
              setActiveTab('order');
            }}
            cartCount={totalCartCount}
          />
        ) : isCheckoutView ? (
          /* Checkout Screen (Image 7) */
          <CheckoutScreen
            cartItems={cartItems}
            initialPromoCode={appliedPromoCode}
            onBack={() => setIsCheckoutView(false)}
            onOrderCompleted={handleOrderCompleted}
          />
        ) : activeTab === 'home' ? (
          /* Home Screen (Image 5) */
          <HomeScreen
            products={PRODUCTS}
            promotions={promotions}
            activePromo={activePromo}
            onSelectPromo={(promo) => {
              setActivePromo(promo);
              setAppliedPromoCode(promo.promoCode);
            }}
            onApplyPromoCode={(code) => setAppliedPromoCode(code)}
            appliedPromoCode={appliedPromoCode}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onQuickAdd={handleQuickAdd}
            onToggleFavorite={handleToggleFavorite}
            favoriteIds={favoriteIds}
          />
        ) : activeTab === 'order' ? (
          /* Cart & Order Summary Screen (Image 3) */
          <CartScreen
            cartItems={cartItems}
            activePromo={activePromo}
            appliedPromoCode={appliedPromoCode}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveCartItem}
            onProceedToCheckout={() => setIsCheckoutView(true)}
            onBrowseMenu={() => {
              setActiveTab('home');
              setSelectedProduct(null);
            }}
          />
        ) : activeTab === 'rewards' ? (
          /* Rewards Screen */
          <RewardsScreen />
        ) : (
          /* Profile Screen */
          <ProfileScreen
            orderHistory={orderHistory}
            onReorder={handleReorder}
            onNavigateToHome={() => {
              setActiveTab('home');
              setSelectedProduct(null);
            }}
          />
        )}
      </div>

      {/* Bottom Navigation Bar (Hidden during Checkout for focused transactional experience) */}
      {!isCheckoutView && (
        <BottomNavBar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setSelectedProduct(null);
            setIsCheckoutView(false);
          }}
          cartCount={totalCartCount}
        />
      )}

      {/* Order Confirmed Celebratory Modal */}
      {lastPlacedOrder && (
        <OrderSuccessModal
          order={lastPlacedOrder}
          onClose={() => {
            setLastPlacedOrder(null);
            setActiveTab('home');
          }}
          onViewOrderHistory={() => {
            setLastPlacedOrder(null);
            setActiveTab('profile');
          }}
        />
      )}

      {/* Brand Story Modal */}
      {isBrandStoryOpen && (
        <BrandStoryModal onClose={() => setIsBrandStoryOpen(false)} />
      )}
    </div>
  );
}
