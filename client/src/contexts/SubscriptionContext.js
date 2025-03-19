import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import SubscriptionService from '../services/SubscriptionService';

const SubscriptionContext = createContext();

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch the user's subscription when they log in
  useEffect(() => {
    let unsubscribe = () => {};
    
    const fetchSubscription = async () => {
      if (!currentUser) {
        setSubscription(null);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // Listen for subscription changes
        unsubscribe = SubscriptionService.onSubscriptionChange(
          currentUser.uid,
          (subscriptionData) => {
            setSubscription(subscriptionData);
            setLoading(false);
          }
        );
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setError('Failed to load subscription information.');
        setLoading(false);
      }
    };
    
    fetchSubscription();
    
    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [currentUser]);
  
  // Check if the user has access to a specific feature
  const hasFeature = (featureName) => {
    if (!subscription) return false;
    return subscription.features.includes(featureName);
  };
  
  // Check if the user is on the Pro plan
  const isPro = () => {
    if (!subscription) return false;
    return subscription.plan === 'pro' && subscription.status === 'active';
  };
  
  // Upgrade to Pro
  const upgradeToPro = async () => {
    if (!currentUser) return;
    
    try {
      setError(null);
      const checkoutUrl = await SubscriptionService.createCheckoutSession(currentUser.uid, 'pro');
      
      // In a real app, you would redirect to the checkout URL
      // window.location.href = checkoutUrl;
      
      // For demo purposes, we'll simulate a successful checkout
      await SubscriptionService.handleCheckoutSuccess(currentUser.uid, 'pro');
      
      return checkoutUrl;
    } catch (err) {
      console.error('Error upgrading to Pro:', err);
      setError('Failed to initiate upgrade. Please try again.');
      throw err;
    }
  };
  
  // Cancel subscription
  const cancelSubscription = async () => {
    if (!currentUser) return;
    
    try {
      setError(null);
      await SubscriptionService.cancelSubscription(currentUser.uid);
    } catch (err) {
      console.error('Error canceling subscription:', err);
      setError('Failed to cancel subscription. Please try again.');
      throw err;
    }
  };
  
  const value = {
    subscription,
    loading,
    error,
    hasFeature,
    isPro,
    upgradeToPro,
    cancelSubscription
  };
  
  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}; 