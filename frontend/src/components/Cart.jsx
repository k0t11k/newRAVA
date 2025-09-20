import React from 'react';
import { PlugController } from '@psychedelic/plug-connect';

const Cart = ({ cart, setCart, user, setTickets }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!user) return;
    const connected = await PlugController.connect();
    if (connected) {
      // Пример оплаты в ICP
      const result = await PlugController.requestTransfer({
        to: 'backend_principal',
        amount: total * 1e8, // В e8s
        memo: 'Ticket purchase'
      });
      if (result) {
        // Заглушка: добавить билеты
        setTickets([...tickets, /* from cart */]);
        setCart([]);
        alert('Payment successful with Plug Wallet!');
      }
    } else {
      alert('Plug Wallet not connected. Using stub.');
      // Заглушка
      setTickets([...tickets, /* from cart */]);
      setCart([]);
    }
  };

  // Остальной код корзины из твоего оригинала
  return (
    // ... 
  );
};

export default Cart;