import React from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import './ProFeature.css';

/**
 * Component to wrap pro-only features
 * @param {Object} props
 * @param {string} props.featureName - The name of the feature to check
 * @param {React.ReactNode} props.children - The pro feature content
 * @param {React.ReactNode} props.fallback - Optional content to show if user doesn't have access
 */
const ProFeature = ({ featureName, children, fallback }) => {
  const { hasFeature, isPro } = useSubscription();
  
  // Check if the user has access to this feature
  const hasAccess = hasFeature(featureName) || isPro();
  
  if (hasAccess) {
    return children;
  }
  
  // If no fallback is provided, show the default upgrade message
  if (!fallback) {
    return (
      <div className="pro-feature-lock">
        <div className="pro-feature-content">
          <div className="pro-icon">⭐</div>
          <h3>Pro Feature</h3>
          <p>Upgrade to Pro to unlock this feature</p>
          <Link to="/pricing" className="upgrade-link">View Plans</Link>
        </div>
      </div>
    );
  }
  
  // Return the provided fallback
  return fallback;
};

export default ProFeature; 