import {
  db,
  auth,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  limit,
  updateDoc,
  signInAnonymously,
  onAuthStateChanged,
  User,
} from './firebase';
import { PlacedOrder, CartItem } from '../types';

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  seedPoints: number;
  cupsPurchased: number;
  favoriteProductIds: string[];
}

export interface AppUser {
  uid: string;
  isAnonymous?: boolean;
  displayName?: string | null;
  email?: string | null;
}

// Generate or retrieve persistent guest ID
const getGuestUserId = (): string => {
  try {
    const stored = localStorage.getItem('brew_bloom_guest_uid');
    if (stored) return stored;
    const newUid = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('brew_bloom_guest_uid', newUid);
    return newUid;
  } catch {
    return `guest_${Date.now()}`;
  }
};

// 1. Ensure user is authenticated or has a persistent guest identity
export const initAuth = (onUserReady: (user: AppUser) => void) => {
  const guestUid = getGuestUserId();
  const fallbackUser: AppUser = {
    uid: guestUid,
    isAnonymous: true,
    displayName: 'Boutique Guest',
  };

  // Set initial guest identity immediately so app works seamlessly
  onUserReady(fallbackUser);

  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      onUserReady({
        uid: user.uid,
        isAnonymous: user.isAnonymous,
        displayName: user.displayName || 'Boutique Guest',
        email: user.email,
      });
    } else {
      try {
        const cred = await signInAnonymously(auth);
        if (cred?.user) {
          onUserReady({
            uid: cred.user.uid,
            isAnonymous: true,
            displayName: 'Boutique Guest',
          });
        }
      } catch (err: unknown) {
        // When Anonymous Auth is disabled in Firebase console (auth/admin-restricted-operation),
        // we smoothly fall back to our persistent guest session without breaking any feature
        const error = err as { code?: string; message?: string };
        if (error.code !== 'auth/admin-restricted-operation') {
          console.warn('Firebase Auth notice:', error.message || error);
        }
        onUserReady(fallbackUser);
      }
    }
  });
};

// 2. Save Order to Firestore
export const saveOrderToFirestore = async (order: PlacedOrder, userId?: string): Promise<string> => {
  try {
    const ordersCol = collection(db, 'orders');
    const orderDocRef = doc(ordersCol, order.id || `order-${Date.now()}`);
    
    const orderData = {
      ...order,
      userId: userId || auth.currentUser?.uid || 'guest-user',
      timestamp: Date.now(),
      createdAtIso: new Date().toISOString(),
    };

    await setDoc(orderDocRef, orderData);
    console.log('Order successfully saved to Firestore:', order.orderNumber);
    return orderDocRef.id;
  } catch (error) {
    console.error('Error saving order to Firestore:', error);
    throw error;
  }
};

// 3. Listen to Realtime Orders
export const subscribeToOrders = (
  onOrdersUpdated: (orders: PlacedOrder[]) => void,
  userId?: string
) => {
  try {
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol, orderBy('timestamp', 'desc'), limit(30));

    return onSnapshot(
      q,
      (snapshot) => {
        const orders: PlacedOrder[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as PlacedOrder & { userId?: string };
          // If a specific userId is passed, filter, or include all for store view
          if (!userId || data.userId === userId || !data.userId) {
            orders.push({
              ...data,
              id: docSnap.id,
            });
          }
        });
        onOrdersUpdated(orders);
      },
      (error) => {
        console.error('Realtime orders snapshot error:', error);
      }
    );
  } catch (error) {
    console.error('Failed to setup orders listener:', error);
    return () => {};
  }
};

// 4. Update Order Status in Firestore (e.g. Received -> Brewing -> Ready for Pickup -> Completed)
export const updateOrderStatusInFirestore = async (
  orderId: string,
  newStatus: PlacedOrder['status']
) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to update order status:', error);
  }
};

// 5. User Profile & Loyalty Sync
export const syncUserProfile = async (
  userId: string,
  profileUpdates: Partial<UserProfile>
) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, profileUpdates, { merge: true });
  } catch (err) {
    console.error('Failed to sync user profile:', err);
  }
};

// 6. Listen to User Profile
export const subscribeToUserProfile = (
  userId: string,
  onProfileUpdated: (profile: UserProfile) => void
) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    return onSnapshot(userDocRef, (snap) => {
      if (snap.exists()) {
        onProfileUpdated(snap.data() as UserProfile);
      }
    });
  } catch (err) {
    console.error('Failed to listen to user profile:', err);
    return () => {};
  }
};
