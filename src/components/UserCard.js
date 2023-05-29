import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import { useFirestore } from '../contexts/FirestoreContext';

function UserCard({ card }) {
  const { userData, deleteCard } = useFirestore();

  // Icon card types
  const getCardIcon = (brand) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return "fa-brands fa-cc-visa";
      case 'mastercard':
        return "fa-brands fa-cc-mastercard";
      case 'discover':
        return "fa-brands fa-cc-discover";
      case 'applepay':
        return "fa-brands fa-cc-apple-pay";
      case 'amazonpay':
        return "fa-brands fa-cc-amazon-pay";
      case 'paypal':
        return "fa-brands fa-cc-paypal";
      default:
        return "fa-solid fa-credit-card";  // default icon for unknown types
    }
  };

  const deletePaymentCard = async (cardId) => {
    if (cardId) {
      await deleteCard(userData._id, card._id);
      console.log(cardId + ' deleted');
    } else {
      console.error('Invalid card ID');
    }
  };
  

  return (
    <div className="d-inline-flex justify-content-between align-items-center bg-light rounded w-100 mt-1">
      <FontAwesomeIcon icon={getCardIcon(card.brand)} size="2xl" />
      <span>ending in {card.last4}</span>
      <Button variant="light" onClick={() => deletePaymentCard(card._id)}>
        <FontAwesomeIcon icon="fa-solid fa-trash" size="xs" className="text-danger" />
      </Button>
    </div>
  );
}

export default UserCard