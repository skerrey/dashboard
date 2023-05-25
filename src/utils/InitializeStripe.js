import {loadStripe} from '@stripe/stripe-js';

const initializeStripe = async () => {
  const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY); 
  return stripe;
};

export default initializeStripe;