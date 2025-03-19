// Update the ProfilePage to include subscription information

// Add this after the account info section
<div className="subscription-info">
  <h2>Subscription</h2>
  
  {subscription ? (
    <>
      <div className="info-item">
        <span className="info-label">Current Plan:</span>
        <span className="info-value plan-badge">
          {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
        </span>
      </div>
      
      <div className="info-item">
        <span className="info-label">Status:</span>
        <span className="info-value">
          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
        </span>
      </div>
      
      {subscription.plan === 'pro' && (
        <>
          <div className="info-item">
            <span className="info-label">Renewal Date:</span>
            <span className="info-value">
              {new Date(subscription.endDate).toLocaleDateString()}
            </span>
          </div>
          
          {subscription.status === 'active' && (
            <button 
              className="cancel-button"
              onClick={handleCancelSubscription}
              disabled={cancelingSubscription}
            >
              {cancelingSubscription ? 'Processing...' : 'Cancel Subscription'}
            </button>
          )}
        </>
      )}
      
      {subscription.plan === 'free' && (
        <div className="upgrade-section">
          <p>Upgrade to Pro to unlock all features!</p>
          <Link to="/pricing" className="upgrade-link-button">
            View Plans
          </Link>
        </div>
      )}
    </>
  ) : (
    <p>Loading subscription information...</p>
  )}
</div>

// Add imports
import { useEffect, useState } from 'react';
import FileStorageService from '../services/FileStorageService';

// Inside the ProfilePage component, add state for storage
const [storageUsage, setStorageUsage] = useState({
  used: 0,
  total: 0,
  percentage: 0
});

// Fetch storage usage on component mount
useEffect(() => {
  const fetchStorageUsage = async () => {
    if (!currentUser) return;
    
    try {
      const usedBytes = await FileStorageService.calculateUserStorageUsage(currentUser.uid);
      const usedMB = usedBytes / (1024 * 1024);
      const totalMB = subscription?.limits?.storage_mb || 100;
      const percentage = Math.min(100, (usedMB / totalMB) * 100);
      
      setStorageUsage({
        used: usedMB.toFixed(2),
        total: totalMB,
        percentage
      });
    } catch (error) {
      console.error('Error fetching storage usage:', error);
    }
  };
  
  fetchStorageUsage();
}, [currentUser, subscription]);

// Add storage section to the profile page
<div className="storage-section">
  <h2>Storage</h2>
  
  <div className="storage-info">
    <div className="storage-usage">
      <div className="storage-progress-bar">
        <div 
          className="storage-progress-fill" 
          style={{ width: `${storageUsage.percentage}%` }}
        />
      </div>
      <div className="storage-text">
        {storageUsage.used} MB of {storageUsage.total} MB used
        ({Math.round(storageUsage.percentage)}%)
      </div>
    </div>
    
    {subscription?.plan === 'free' && storageUsage.percentage > 80 && (
      <div className="storage-upgrade">
        <p>Almost out of space! Upgrade to Pro for more storage.</p>
        <Link to="/pricing" className="upgrade-button-small">
          Upgrade
        </Link>
      </div>
    )}
  </div>
</div> 