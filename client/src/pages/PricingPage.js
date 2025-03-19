import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import './PricingPage.css';

const PricingPage = () => {
  const { currentUser } = useAuth();
  const { subscription, isPro, upgradeToPro } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Pricing plans data
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Basic features for personal use',
      features: [
        'Chat with AI assistants (20/day)',
        'Basic note taking',
        'Task management',
        'Limited storage (100MB)',
        'Standard response times'
      ],
      isPopular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$9.99',
      period: 'per month',
      description: 'Advanced features for power users',
      features: [
        'Unlimited AI messaging',
        'Access to all AI models',
        'Advanced note organization',
        'Priority task management',
        'Expanded storage (5GB)',
        'Faster response times',
        'Priority support'
      ],
      isPopular: true
    }
  ];
  
  const handleUpgrade = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/pricing' } });
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    try {
      await upgradeToPro();
      navigate('/profile');
    } catch (err) {
      setError('Failed to process upgrade. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="pricing-container">
      <div className="pricing-header">
        <h1>Choose Your Plan</h1>
        <p>Select the perfect plan for your productivity needs</p>
      </div>
      
      {error && <div className="pricing-error">{error}</div>}
      
      <div className="pricing-plans">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`plan-card ${plan.isPopular ? 'popular-plan' : ''}`}
          >
            {plan.isPopular && <div className="popular-badge">MOST POPULAR</div>}
            
            <div className="plan-header">
              <h2 className="plan-name">{plan.name}</h2>
              <div className="plan-price">
                <span className="price">{plan.price}</span>
                <span className="period">{plan.period}</span>
              </div>
              <p className="plan-description">{plan.description}</p>
            </div>
            
            <ul className="plan-features">
              {plan.features.map((feature, index) => (
                <li key={index} className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="plan-footer">
              {plan.id === 'free' ? (
                <Link to="/register" className="plan-button secondary">
                  Get Started
                </Link>
              ) : (
                <button 
                  className="plan-button primary"
                  onClick={handleUpgrade}
                  disabled={isPro() || isProcessing}
                >
                  {isPro() ? 'Current Plan' : isProcessing ? 'Processing...' : 'Upgrade Now'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="pricing-faq">
        <h2>Frequently Asked Questions</h2>
        
        <div className="faq-item">
          <h3>Can I cancel my subscription anytime?</h3>
          <p>Yes, you can cancel your subscription at any time from your profile page. Your Pro benefits will continue until the end of your billing period.</p>
        </div>
        
        <div className="faq-item">
          <h3>What happens to my data if I downgrade?</h3>
          <p>Your data remains intact when you downgrade, but you may lose access to Pro-only features. If your storage exceeds the Free plan limits, you won't be able to add new content until you reduce usage.</p>
        </div>
        
        <div className="faq-item">
          <h3>Is there a student discount?</h3>
          <p>Yes! Students and educators can get 50% off the Pro plan. Contact our support team with your academic credentials to apply for the discount.</p>
        </div>
      </div>
      
      <div className="pricing-cta">
        <Link to={currentUser ? '/' : '/register'} className="back-link">
          {currentUser ? 'Back to Dashboard' : 'Try it first'}
        </Link>
      </div>
    </div>
  );
};

export default PricingPage; 