import { toast } from "sonner";

// Payment data interface
export interface PaymentData {
  account_id?: string;
  email?: string;
  payment_item: string;
  order?: string;
  amount: number;
  provider: string;
  callback_url?: string;  // Success redirect URL
  cancel_url?: string;    // Cancel redirect URL
  metadata?: Record<string, any>;
}

export async function triggerPayment(paymentData: PaymentData): Promise<{ success: boolean; payment_url?: string; error?: string }> {
  try {
    // Debug: Log the payment data being sent
    console.log('Initiating payment with data:', paymentData);
    
    // Get auth token from localStorage or session
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    
    // Prepare headers with authentication
    const headers: Record<string, string> = { 
      "Content-Type": "application/json" 
    };
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      console.log('Using auth token:', token.substring(0, 20) + '...');
    } else {
      console.warn('No auth token found');
    }
    
    // Backend now handles frontend redirects, so no need to send callback URLs
    const response = await fetch('/api/payments/initiate', {
      method: "POST",
      headers,
      body: JSON.stringify(paymentData),
    });

    // Debug: Log response status and headers
    console.log('Payment response status:', response.status);
    console.log('Payment response ok:', response.ok);

    const result = await response.json();

    // Debug: Log what backend returns
    console.log('Backend response:', result);

    if (response.ok && result.payment_url) {
      // For web, redirect in same window instead of _blank to maintain UX
      console.log('Redirecting to payment URL:', result.payment_url);
      window.location.href = result.payment_url;
      return { 
        success: true, 
        payment_url: result.payment_url 
      };
    } else if (response.ok) {
      toast.success('Payment initiated successfully!');
      return { 
        success: true 
      };
    } else {
      const errorMessage = result.details || result.message || result.error || 'Failed to initiate payment';
      console.error('Payment initiation failed:', errorMessage);
      toast.error(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  } catch (error) {
    const errorMessage = 'Error initiating payment: ' + JSON.stringify(error);
    console.error('Payment initiation error:', error);
    toast.error(errorMessage);
    return { 
      success: false, 
      error: errorMessage 
    };
  }
}

/**
 * Creates payment data for retrying a collection payment
 * Simplified to match mobile pattern - backend handles the rest
 */
export function createCollectionPaymentData(
  session: any,
  collectionIdentifier: string,
  collectionData: any
): PaymentData {
  return {
    account_id: session?.identifier,
    email: session?.email,
    payment_item: 'collection',
    order: collectionIdentifier,
    amount: collectionData.total_amount || 10,
    metadata: { retry: true }, // Simple metadata like mobile
    provider: 'paystack' // Add provider like mobile
  };
}

/**
 * Creates payment data for retrying an order payment
 * Simplified to match mobile pattern - backend handles the rest
 */
export function createOrderPaymentData(
  session: any,
  orderIdentifier: string,
  amount?: number
): PaymentData {
  return {
    account_id: session?.identifier,
    email: session?.email,
    payment_item: 'order',
    order: orderIdentifier,
    amount: amount || 10, // Default amount if not specified
    metadata: { retry: true }, // Simple metadata like mobile
    provider: 'paystack' // Add provider like mobile
  };
}
