import { addDoc, collection, doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

class SubscriptionService {
  /**
   * Get the current user's subscription
   * @param {string} userId - The user's ID
   * @returns {Promise<Object>} - The subscription data
   */
  async getSubscription(userId) {
    try {
      const docRef = doc(db, 'subscriptions', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        // Create a free tier subscription document if none exists
        const freeTier = {
          plan: 'free',
          status: 'active',
          features: ['basic_ai_access', 'limited_storage'],
          limits: {
            messages_per_day: 20,
            storage_mb: 100,
            max_file_size_mb: 5
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        await this.createSubscription(userId, freeTier);
        return freeTier;
      }
    } catch (error) {
      console.error('Error getting subscription:', error);
      throw error;
    }
  }
  
  /**
   * Create a subscription document for a user
   * @param {string} userId - The user's ID
   * @param {Object} subscriptionData - The subscription data
   * @returns {Promise<void>}
   */
  async createSubscription(userId, subscriptionData) {
    try {
      const docRef = doc(db, 'subscriptions', userId);
      await updateDoc(docRef, {
        ...subscriptionData,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      // If document doesn't exist, create it
      if (error.code === 'not-found') {
        const docRef = doc(db, 'subscriptions', userId);
        await setDoc(docRef, {
          ...subscriptionData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } else {
        console.error('Error creating subscription:', error);
        throw error;
      }
    }
  }
  
  /**
   * Update a user's subscription
   * @param {string} userId - The user's ID
   * @param {Object} subscriptionData - The updated subscription data
   * @returns {Promise<void>}
   */
  async updateSubscription(userId, subscriptionData) {
    try {
      const docRef = doc(db, 'subscriptions', userId);
      await updateDoc(docRef, {
        ...subscriptionData,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }
  
  /**
   * Listen to subscription changes
   * @param {string} userId - The user's ID
   * @param {Function} callback - Callback function when subscription changes
   * @returns {Function} - Unsubscribe function
   */
  onSubscriptionChange(userId, callback) {
    const docRef = doc(db, 'subscriptions', userId);
    
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Subscription listener error:', error);
    });
  }
  
  /**
   * Create a checkout session for subscription upgrade
   * @param {string} userId - The user's ID
   * @param {string} planId - The plan ID to subscribe to
   * @returns {Promise<string>} - The checkout URL
   */
  async createCheckoutSession(userId, planId) {
    // This would typically call a serverless function that creates a Stripe checkout session
    // For demo purposes, we'll simulate this process
    try {
      // In a real app, this would be a call to your backend
      // const response = await fetch('/api/create-checkout-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId, planId })
      // });
      // const data = await response.json();
      // return data.url;
      
      // For demo, we'll simulate completion after 3 seconds
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(`https://example.com/checkout-demo?plan=${planId}&user=${userId}`);
        }, 2000);
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }
  
  /**
   * Handle the result of a successful checkout
   * @param {string} userId - The user's ID
   * @param {string} planId - The plan ID subscribed to
   * @returns {Promise<void>}
   */
  async handleCheckoutSuccess(userId, planId) {
    try {
      // Get the plan details from the plans collection
      const planRef = doc(db, 'plans', planId);
      const planSnap = await getDoc(planRef);
      
      if (!planSnap.exists()) {
        throw new Error('Plan not found');
      }
      
      const planData = planSnap.data();
      
      // Update the user's subscription
      await this.updateSubscription(userId, {
        plan: planId,
        status: 'active',
        features: planData.features,
        limits: planData.limits,
        startDate: new Date().toISOString(),
        // In a real app, the end date would come from the payment processor
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      });
      
      // Update the user profile to reflect Pro status
      const userProfileRef = doc(db, 'user_profiles', userId);
      await updateDoc(userProfileRef, {
        isPro: true,
        updatedAt: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error handling checkout success:', error);
      throw error;
    }
  }
  
  /**
   * Cancel a subscription
   * @param {string} userId - The user's ID
   * @returns {Promise<void>}
   */
  async cancelSubscription(userId) {
    try {
      // In a real app, this would call your backend to cancel the subscription with Stripe
      // await fetch('/api/cancel-subscription', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId })
      // });
      
      // Update the subscription status in Firestore
      await this.updateSubscription(userId, {
        status: 'canceled',
        cancellationDate: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }
}

export default new SubscriptionService(); 