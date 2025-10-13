/**
 * Stripe Payment Service
 * Handles credit purchases via Stripe Checkout
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';

// Initialize Stripe (will be null until key is set)
let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (key) {
      stripePromise = loadStripe(key);
    }
  }
  return stripePromise;
};

/**
 * Create Stripe checkout session for credit purchase
 */
export const createCreditCheckoutSession = async (
  packageId: string,
  userId: string,
  userEmail: string,
  credits: number,
  priceCents: number
): Promise<string | null> => {
  try {
    // In production, you'd call your backend to create a Stripe session
    // For now, this is a placeholder

    const API_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5173';
    
    // This would be your backend endpoint
    const response = await fetch(`${API_URL}/api/stripe/create-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        packageId,
        userId,
        userEmail,
        credits,
        priceCents,
        successUrl: `${API_URL}/credits/success`,
        cancelUrl: `${API_URL}/credits`
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();
    return sessionId;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return null;
  }
};

/**
 * Redirect to Stripe Checkout
 */
export const redirectToCheckout = async (sessionId: string): Promise<void> => {
  const stripe = await getStripe();
  if (!stripe) {
    throw new Error('Stripe not initialized');
  }

  const { error } = await stripe.redirectToCheckout({ sessionId });
  if (error) {
    throw error;
  }
};

/**
 * Check if Stripe is configured
 */
export const isStripeConfigured = (): boolean => {
  return !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
};

